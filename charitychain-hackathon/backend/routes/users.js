const express = require('express');
const { User } = require('../models/index.js');
const { validateWalletAddress } = require('../utils/validation.js');
const { authenticateToken } = require('../middleware/auth.js');

const router = express.Router();

// GET /api/users/profile/:walletAddress - Get user profile
router.get('/profile/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    
    if (!validateWalletAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    const user = await User.findOne({ walletAddress })
      .select('-__v')
      .populate('donationHistory.donationId', 'amount createdAt blockchain.transactionHash')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    res.json(user)
  } catch (error) {
    console.error('Error fetching user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/users/register - Register or update user
router.post('/register', async (req, res) => {
  try {
    const {
      walletAddress,
      userType,
      profile,
      campaignDetails
    } = req.body

    if (!validateWalletAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    // Check if user already exists
    let user = await User.findOne({ walletAddress })
    
    if (user) {
      // Update existing user
      user.userType = userType || user.userType
      user.profile = { ...user.profile, ...profile }
      if (userType === 'ngo' && campaignDetails) {
        user.campaignDetails = { ...user.campaignDetails, ...campaignDetails }
      }
    } else {
      // Create new user
      user = new User({
        walletAddress,
        userType: userType || 'donor',
        profile: profile || {},
        campaignDetails: userType === 'ngo' ? campaignDetails : undefined
      })
    }

    await user.save()

    res.status(201).json({
      message: user.isNew ? 'User registered successfully' : 'User updated successfully',
      user
    })
  } catch (error) {
    console.error('Error registering user:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/users/ngos - Get all verified NGOs
router.get('/ngos', async (req, res) => {
  try {
    const { page = 1, limit = 10, focusArea, search } = req.query
    
    const query = {
      userType: 'ngo',
      verificationStatus: 'verified',
      isActive: true
    }

    if (search) {
      query.$or = [
        { 'profile.name': { $regex: search, $options: 'i' } },
        { 'campaignDetails.description': { $regex: search, $options: 'i' } }
      ]
    }

    const ngos = await User.find(query)
      .select('walletAddress profile campaignDetails verificationStatus createdAt')
      .sort({ 'campaignDetails.totalReceived': -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await User.countDocuments(query)

    res.json({
      ngos,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })
  } catch (error) {
    console.error('Error fetching NGOs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/users/ngos/featured - Get featured NGOs for homepage
router.get('/ngos/featured', async (req, res) => {
  try {
    const { limit = 5 } = req.query

    const featuredNGOs = await User.find({
      userType: 'ngo',
      verificationStatus: 'verified',
      isActive: true,
      'campaignDetails.verified': true
    })
      .select('walletAddress profile campaignDetails verificationStatus createdAt')
      .sort({ 'campaignDetails.totalReceived': -1 })
      .limit(parseInt(limit))

    // Format for frontend
    const formattedNGOs = featuredNGOs.map(ngo => ({
      id: ngo._id,
      name: ngo.profile.name || ngo.campaignDetails.description?.substring(0, 50) || 'NGO',
      description: ngo.campaignDetails.description || 'Supporting communities in need',
      category: ngo.campaignDetails.category || 'Community Support',
      transparencyScore: ngo.campaignDetails.transparencyScore || 95,
      totalDonations: `${ngo.campaignDetails.totalReceived || 0} ADA`,
      image: "/api/placeholder/300/200",
      location: ngo.campaignDetails.location || 'Various locations',
      urgency: ngo.campaignDetails.urgency || 'Medium',
      impact: `${ngo.campaignDetails.beneficiaries || '1,000+'} people helped`,
      walletAddress: ngo.walletAddress,
      website: ngo.campaignDetails.website,
      founded: ngo.campaignDetails.founded || '2020',
      activeProjects: ngo.campaignDetails.activeProjects || 5,
      beneficiaries: ngo.campaignDetails.beneficiaries || '1,000+'
    }))

    res.json({
      ngos: formattedNGOs
    })

  } catch (error) {
    console.error('Error fetching featured NGOs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/users/ngos/categories - Get NGO categories
router.get('/ngos/categories', async (req, res) => {
  try {
    const categories = await User.distinct('campaignDetails.category', {
      userType: 'ngo',
      verificationStatus: 'verified',
      isActive: true
    })

    res.json({
      categories: categories.filter(cat => cat && cat.length > 0)
    })

  } catch (error) {
    console.error('Error fetching NGO categories:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/users/profile/:walletAddress - Update user profile
router.put('/profile/:walletAddress', authenticateToken, async (req, res) => {
  try {
    const { walletAddress } = req.params
    const updates = req.body

    if (!validateWalletAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    const user = await User.findOne({ walletAddress })
    
    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    // Update allowed fields
    if (updates.profile) {
      user.profile = { ...user.profile, ...updates.profile }
    }

    if (updates.campaignDetails && user.userType === 'ngo') {
      user.campaignDetails = { ...user.campaignDetails, ...updates.campaignDetails }
    }

    await user.save()

    res.json({
      message: 'Profile updated successfully',
      user
    })
  } catch (error) {
    console.error('Error updating user profile:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/users/:walletAddress/donations - Get user's donation history
router.get('/:walletAddress/donations', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!validateWalletAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    const user = await User.findOne({ walletAddress })
      .populate({
        path: 'donationHistory.donationId',
        populate: {
          path: 'recipient.ngoId',
          select: 'profile.name'
        }
      })
      .select('donationHistory')

    if (!user) {
      return res.status(404).json({ error: 'User not found' })
    }

    const donations = user.donationHistory
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .slice((page - 1) * limit, page * limit)

    res.json({
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: user.donationHistory.length
      }
    })
  } catch (error) {
    console.error('Error fetching donation history:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router;
