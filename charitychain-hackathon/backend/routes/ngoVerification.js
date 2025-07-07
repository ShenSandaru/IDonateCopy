const express = require('express');
const { NgoVerification, User } = require('../models/index.js');
const { authenticateToken, requireAdmin } = require('../middleware/auth.js');
const { validateNgoVerificationData } = require('../utils/validation.js');
const { uploadMiddleware, uploadFields } = require('../middleware/upload.js');

const router = express.Router();

// POST /api/ngo-verification/apply - Submit NGO verification application
router.post('/apply', uploadFields([
  { name: 'registrationCertificate', maxCount: 1 },
  { name: 'taxExemptionCertificate', maxCount: 1 },
  { name: 'auditReports', maxCount: 5 },
  { name: 'boardOfDirectors', maxCount: 1 },
  { name: 'financialStatements', maxCount: 5 },
  { name: 'additionalDocuments', maxCount: 10 }
]), async (req, res) => {
  try {
    const { walletAddress } = req.body

    // Validate input data
    const validation = validateNgoVerificationData(req.body)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors })
    }

    // Check if NGO user exists
    const ngo = await User.findOne({ 
      walletAddress, 
      userType: 'ngo' 
    })

    if (!ngo) {
      return res.status(404).json({ 
        error: 'NGO user not found. Please register as an NGO first.' 
      })
    }

    // Check if verification application already exists
    const existingApplication = await NgoVerification.findOne({ ngoId: ngo._id })
    
    if (existingApplication && existingApplication.verificationStatus === 'verified') {
      return res.status(400).json({ 
        error: 'NGO is already verified' 
      })
    }

    // Process uploaded files
    const documents = {}
    
    if (req.files) {
      for (const [fieldName, files] of Object.entries(req.files)) {
        if (fieldName === 'auditReports' || fieldName === 'financialStatements' || fieldName === 'additionalDocuments') {
          documents[fieldName] = files.map(file => ({
            filename: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            uploadDate: new Date(),
            verified: false
          }))
        } else {
          const file = files[0]
          documents[fieldName] = {
            filename: file.originalname,
            fileUrl: `/uploads/${file.filename}`,
            uploadDate: new Date(),
            verified: false
          }
        }
      }
    }

    const verificationData = {
      ngoId: ngo._id,
      organizationDetails: {
        legalName: req.body.legalName,
        registrationNumber: req.body.registrationNumber,
        taxId: req.body.taxId,
        establishedDate: req.body.establishedDate ? new Date(req.body.establishedDate) : undefined,
        registrationCountry: req.body.registrationCountry,
        organizationType: req.body.organizationType,
        focusAreas: Array.isArray(req.body.focusAreas) ? req.body.focusAreas : [req.body.focusAreas],
        description: req.body.description,
        mission: req.body.mission,
        vision: req.body.vision
      },
      contactInformation: {
        primaryContact: {
          name: req.body.contactName,
          title: req.body.contactTitle,
          email: req.body.contactEmail,
          phone: req.body.contactPhone
        },
        address: {
          street: req.body.addressStreet,
          city: req.body.addressCity,
          state: req.body.addressState,
          country: req.body.addressCountry,
          postalCode: req.body.addressPostalCode
        },
        website: req.body.website,
        socialMedia: {
          twitter: req.body.twitter,
          facebook: req.body.facebook,
          instagram: req.body.instagram,
          linkedin: req.body.linkedin
        }
      },
      documents,
      verificationStatus: 'pending',
      verificationHistory: [{
        status: 'pending',
        date: new Date(),
        notes: 'Application submitted'
      }]
    }

    let verification
    if (existingApplication) {
      // Update existing application
      Object.assign(existingApplication, verificationData)
      verification = await existingApplication.save()
    } else {
      // Create new application
      verification = new NgoVerification(verificationData)
      await verification.save()
    }

    // Update NGO user status
    ngo.verificationStatus = 'pending'
    await ngo.save()

    res.status(201).json({
      message: 'NGO verification application submitted successfully',
      applicationId: verification._id,
      status: verification.verificationStatus
    })

  } catch (error) {
    console.error('Error submitting NGO verification:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/ngo-verification/status/:walletAddress - Get verification status
router.get('/status/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params

    const ngo = await User.findOne({ walletAddress, userType: 'ngo' })
    if (!ngo) {
      return res.status(404).json({ error: 'NGO not found' })
    }

    const verification = await NgoVerification.findOne({ ngoId: ngo._id })
      .select('verificationStatus verificationHistory applicationDate verificationDate expiryDate adminNotes')

    if (!verification) {
      return res.status(404).json({ error: 'No verification application found' })
    }

    res.json({
      status: verification.verificationStatus,
      applicationDate: verification.applicationDate,
      verificationDate: verification.verificationDate,
      expiryDate: verification.expiryDate,
      history: verification.verificationHistory,
      adminNotes: verification.adminNotes
    })

  } catch (error) {
    console.error('Error fetching verification status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/ngo-verification/applications - Get all verification applications (Admin only)
router.get('/applications', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      status, 
      country, 
      organizationType,
      sortBy = 'applicationDate',
      sortOrder = 'desc'
    } = req.query

    const query = {}

    if (status) {
      query.verificationStatus = status
    }

    if (country) {
      query['organizationDetails.registrationCountry'] = country
    }

    if (organizationType) {
      query['organizationDetails.organizationType'] = organizationType
    }

    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    const applications = await NgoVerification.find(query)
      .populate('ngoId', 'walletAddress profile.name profile.email')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-documents') // Exclude documents for overview

    const total = await NgoVerification.countDocuments(query)

    res.json({
      applications,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching verification applications:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/ngo-verification/application/:id - Get specific verification application (Admin only)
router.get('/application/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params

    const application = await NgoVerification.findById(id)
      .populate('ngoId', 'walletAddress profile campaignDetails')

    if (!application) {
      return res.status(404).json({ error: 'Verification application not found' })
    }

    res.json(application)

  } catch (error) {
    console.error('Error fetching verification application:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/ngo-verification/review/:id - Review verification application (Admin only)
router.put('/review/:id', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { 
      status, 
      adminNotes, 
      documentsReviewed,
      complianceChecks 
    } = req.body

    if (!['under-review', 'verified', 'rejected', 'suspended'].includes(status)) {
      return res.status(400).json({ error: 'Invalid verification status' })
    }

    const application = await NgoVerification.findById(id)
    if (!application) {
      return res.status(404).json({ error: 'Verification application not found' })
    }

    // Update verification status
    application.verificationStatus = status
    application.adminNotes = adminNotes

    // Add to verification history
    application.verificationHistory.push({
      status,
      date: new Date(),
      adminId: req.user.id, // From auth middleware
      notes: adminNotes,
      documentsReviewed: documentsReviewed || []
    })

    // Update compliance checks if provided
    if (complianceChecks) {
      application.complianceChecks = {
        ...application.complianceChecks,
        ...complianceChecks,
        lastComplianceCheck: new Date()
      }
    }

    // Set verification date if approved
    if (status === 'verified') {
      application.verificationDate = new Date()
      // Set expiry date to 1 year from now
      application.expiryDate = new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
    }

    await application.save()

    // Update NGO user status
    const ngo = await User.findById(application.ngoId)
    if (ngo) {
      ngo.verificationStatus = status
      await ngo.save()
    }

    res.json({
      message: 'Verification application reviewed successfully',
      status: application.verificationStatus,
      verificationDate: application.verificationDate
    })

  } catch (error) {
    console.error('Error reviewing verification application:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/ngo-verification/documents/:id/verify - Verify specific document (Admin only)
router.put('/documents/:id/verify', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const { id } = req.params
    const { documentType, documentIndex, verified, notes } = req.body

    const application = await NgoVerification.findById(id)
    if (!application) {
      return res.status(404).json({ error: 'Verification application not found' })
    }

    // Update document verification status
    if (documentType in application.documents) {
      if (Array.isArray(application.documents[documentType])) {
        if (documentIndex !== undefined && application.documents[documentType][documentIndex]) {
          application.documents[documentType][documentIndex].verified = verified
        }
      } else {
        application.documents[documentType].verified = verified
      }
    }

    await application.save()

    res.json({
      message: 'Document verification status updated successfully'
    })

  } catch (error) {
    console.error('Error updating document verification:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/ngo-verification/stats - Get verification statistics (Admin only)
router.get('/stats', authenticateToken, requireAdmin, async (req, res) => {
  try {
    const stats = await NgoVerification.aggregate([
      {
        $group: {
          _id: '$verificationStatus',
          count: { $sum: 1 }
        }
      }
    ])

    const totalApplications = await NgoVerification.countDocuments()
    const recentApplications = await NgoVerification.countDocuments({
      applicationDate: { 
        $gte: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000) // Last 30 days
      }
    })

    const statusStats = {}
    stats.forEach(stat => {
      statusStats[stat._id] = stat.count
    })

    res.json({
      total: totalApplications,
      recentApplications,
      byStatus: statusStats,
      verificationRate: totalApplications > 0 ? 
        ((statusStats.verified || 0) / totalApplications * 100).toFixed(2) : 0
    })

  } catch (error) {
    console.error('Error fetching verification statistics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router;
