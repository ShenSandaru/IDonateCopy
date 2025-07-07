const express = require('express');
const { Donation, User, Transaction } = require('../models/index.js');
const { validateWalletAddress, validateDonationData } = require('../utils/validation.js');
const { blockfrostService } = require('../services/blockfrost.js');
const { nftService } = require('../services/nft.js');

const router = express.Router();

// POST /api/donations/create - Create a new donation
router.post('/create', async (req, res) => {
  try {
    const {
      donorWalletAddress,
      recipientWalletAddress,
      amount,
      transactionHash,
      donationPurpose,
      isAnonymous = false
    } = req.body

    // Validate input data
    const validation = validateDonationData(req.body)
    if (!validation.isValid) {
      return res.status(400).json({ error: validation.errors })
    }

    // Verify transaction on blockchain
    const txVerification = await blockfrostService.verifyTransaction(transactionHash)
    if (!txVerification.isValid) {
      return res.status(400).json({ error: 'Invalid transaction or transaction not found' })
    }

    // Get donor and recipient information
    const [donor, recipient] = await Promise.all([
      User.findOne({ walletAddress: donorWalletAddress }),
      User.findOne({ walletAddress: recipientWalletAddress, userType: 'ngo' })
    ])

    if (!recipient) {
      return res.status(404).json({ error: 'Recipient NGO not found or not verified' })
    }

    // Create donation record
    const donation = new Donation({
      donor: {
        walletAddress: donorWalletAddress,
        userId: donor?._id
      },
      recipient: {
        walletAddress: recipientWalletAddress,
        ngoId: recipient._id,
        organizationName: recipient.profile?.name
      },
      amount,
      blockchain: {
        transactionHash,
        blockNumber: txVerification.blockNumber,
        blockHash: txVerification.blockHash,
        timestamp: txVerification.timestamp,
        confirmations: txVerification.confirmations
      },
      status: 'confirmed',
      donationPurpose,
      isAnonymous,
      fundAllocation: {
        directToNgo: amount * 0.95, // 95% to NGO
        platformFee: amount * 0.03, // 3% platform fee
        operationalCosts: amount * 0.02 // 2% operational costs
      }
    })

    await donation.save()

    // Generate NFT receipt
    try {
      const nftReceipt = await nftService.generateReceipt(donation)
      donation.nftReceipt = nftReceipt
      await donation.save()
    } catch (nftError) {
      console.error('Error generating NFT receipt:', nftError)
      // Continue without NFT if generation fails
    }

    // Update donor's donation history
    if (donor) {
      donor.donationHistory.push({
        donationId: donation._id,
        amount,
        date: new Date(),
        transactionHash,
        nftReceiptId: donation.nftReceipt?.tokenId
      })
      await donor.save()
    }

    // Update recipient's total received
    recipient.campaignDetails.totalReceived = 
      (recipient.campaignDetails.totalReceived || 0) + amount
    await recipient.save()

    // Create transaction record
    const transaction = new Transaction({
      transactionHash,
      blockNumber: txVerification.blockNumber,
      blockHash: txVerification.blockHash,
      from: donorWalletAddress,
      to: recipientWalletAddress,
      value: amount.toString(),
      fee: txVerification.fee,
      timestamp: txVerification.timestamp,
      confirmations: txVerification.confirmations,
      status: 'confirmed',
      transactionType: 'donation',
      relatedDonation: donation._id
    })

    await transaction.save()

    res.status(201).json({
      message: 'Donation recorded successfully',
      donation,
      nftReceipt: donation.nftReceipt
    })

  } catch (error) {
    console.error('Error creating donation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/donations/:id - Get specific donation
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params

    const donation = await Donation.findById(id)
      .populate('donor.userId', 'profile.name')
      .populate('recipient.ngoId', 'profile.name campaignDetails.description')

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' })
    }

    // Hide donor information if anonymous
    if (donation.isAnonymous) {
      donation.donor.walletAddress = 'Anonymous'
      if (donation.donor.userId) {
        donation.donor.userId.profile.name = 'Anonymous Donor'
      }
    }

    res.json(donation)

  } catch (error) {
    console.error('Error fetching donation:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/donations - Get all donations with filtering and pagination
router.get('/', async (req, res) => {
  try {
    const {
      page = 1,
      limit = 20,
      donor,
      recipient,
      status,
      minAmount,
      maxAmount,
      startDate,
      endDate,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query

    const query = {}

    // Apply filters
    if (donor && validateWalletAddress(donor)) {
      query['donor.walletAddress'] = donor
    }

    if (recipient && validateWalletAddress(recipient)) {
      query['recipient.walletAddress'] = recipient
    }

    if (status) {
      query.status = status
    }

    if (minAmount || maxAmount) {
      query.amount = {}
      if (minAmount) query.amount.$gte = parseFloat(minAmount)
      if (maxAmount) query.amount.$lte = parseFloat(maxAmount)
    }

    if (startDate || endDate) {
      query.createdAt = {}
      if (startDate) query.createdAt.$gte = new Date(startDate)
      if (endDate) query.createdAt.$lte = new Date(endDate)
    }

    const sort = {}
    sort[sortBy] = sortOrder === 'desc' ? -1 : 1

    const donations = await Donation.find(query)
      .populate('donor.userId', 'profile.name')
      .populate('recipient.ngoId', 'profile.name')
      .sort(sort)
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .select('-__v')

    // Hide anonymous donor information
    donations.forEach(donation => {
      if (donation.isAnonymous) {
        donation.donor.walletAddress = 'Anonymous'
        if (donation.donor.userId) {
          donation.donor.userId.profile.name = 'Anonymous Donor'
        }
      }
    })

    const total = await Donation.countDocuments(query)

    res.json({
      donations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching donations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/donations/stats/overview - Get donation statistics
router.get('/stats/overview', async (req, res) => {
  try {
    const { period = '30d' } = req.query
    
    let dateFilter = {}
    const now = new Date()
    
    switch (period) {
      case '7d':
        dateFilter = { $gte: new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000) }
        break
      case '30d':
        dateFilter = { $gte: new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000) }
        break
      case '90d':
        dateFilter = { $gte: new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000) }
        break
      case '1y':
        dateFilter = { $gte: new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000) }
        break
    }

    const [totalStats, periodStats] = await Promise.all([
      Donation.aggregate([
        { $match: { status: 'confirmed' } },
        {
          $group: {
            _id: null,
            totalDonations: { $sum: 1 },
            totalAmount: { $sum: '$amount' },
            averageAmount: { $avg: '$amount' }
          }
        }
      ]),
      Donation.aggregate([
        { 
          $match: { 
            status: 'confirmed',
            createdAt: dateFilter
          }
        },
        {
          $group: {
            _id: null,
            periodDonations: { $sum: 1 },
            periodAmount: { $sum: '$amount' },
            uniqueDonors: { $addToSet: '$donor.walletAddress' },
            uniqueRecipients: { $addToSet: '$recipient.walletAddress' }
          }
        }
      ])
    ])

    const stats = {
      total: totalStats[0] || { totalDonations: 0, totalAmount: 0, averageAmount: 0 },
      period: {
        donations: periodStats[0]?.periodDonations || 0,
        amount: periodStats[0]?.periodAmount || 0,
        uniqueDonors: periodStats[0]?.uniqueDonors?.length || 0,
        uniqueRecipients: periodStats[0]?.uniqueRecipients?.length || 0
      }
    }

    res.json(stats)

  } catch (error) {
    console.error('Error fetching donation statistics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// PUT /api/donations/:id/status - Update donation status
router.put('/:id/status', async (req, res) => {
  try {
    const { id } = req.params
    const { status, notes } = req.body

    if (!['pending', 'confirmed', 'failed', 'completed'].includes(status)) {
      return res.status(400).json({ error: 'Invalid status' })
    }

    const donation = await Donation.findById(id)
    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' })
    }

    donation.status = status
    if (notes) {
      donation.notes = notes
    }

    await donation.save()

    res.json({
      message: 'Donation status updated successfully',
      donation
    })

  } catch (error) {
    console.error('Error updating donation status:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/donations/trending - Get trending donations and NGOs
router.get('/trending', async (req, res) => {
  try {
    const { limit = 10 } = req.query

    // Get recent donations
    const recentDonations = await Donation.find({ status: 'confirmed' })
      .populate('recipient.ngoId', 'profile.name campaignDetails.category')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .select('amount donationPurpose createdAt recipient.organizationName')

    // Get trending NGOs (most donations in last 30 days)
    const thirtyDaysAgo = new Date()
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30)

    const trendingNGOs = await Donation.aggregate([
      {
        $match: {
          createdAt: { $gte: thirtyDaysAgo },
          status: 'confirmed'
        }
      },
      {
        $group: {
          _id: '$recipient.ngoId',
          totalDonations: { $sum: '$amount' },
          donationCount: { $sum: 1 },
          organizationName: { $first: '$recipient.organizationName' }
        }
      },
      {
        $sort: { totalDonations: -1 }
      },
      {
        $limit: parseInt(limit)
      }
    ])

    res.json({
      recentDonations,
      trendingNGOs
    })

  } catch (error) {
    console.error('Error fetching trending data:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/donations/impact - Get impact statistics
router.get('/impact', async (req, res) => {
  try {
    const totalStats = await Donation.aggregate([
      {
        $match: { status: 'confirmed' }
      },
      {
        $group: {
          _id: null,
          totalAmount: { $sum: '$amount' },
          totalDonations: { $sum: 1 },
          uniqueDonors: { $addToSet: '$donor.walletAddress' },
          uniqueNGOs: { $addToSet: '$recipient.ngoId' }
        }
      }
    ])

    const stats = totalStats[0] || {
      totalAmount: 0,
      totalDonations: 0,
      uniqueDonors: [],
      uniqueNGOs: []
    }

    // Get project count (this would need to be tracked separately)
    const projectCount = await Donation.distinct('donationPurpose').length

    res.json({
      totalDonated: stats.totalAmount,
      totalDonations: stats.totalDonations,
      familiesHelped: Math.floor(stats.totalAmount / 50), // Estimate based on average impact
      activeProjects: projectCount,
      transparencyScore: 98,
      uniqueDonors: stats.uniqueDonors.length,
      uniqueNGOs: stats.uniqueNGOs.length
    })

  } catch (error) {
    console.error('Error fetching impact statistics:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/donations/track/:id - Get detailed donation tracking
router.get('/track/:id', async (req, res) => {
  try {
    const { id } = req.params

    // Support both donation ID and transaction hash
    let donation
    if (id.startsWith('DON-')) {
      // Custom donation ID format
      donation = await Donation.findOne({ _id: id })
    } else if (id.length === 64) {
      // Transaction hash
      donation = await Donation.findOne({ 'blockchain.transactionHash': id })
    } else {
      // MongoDB ObjectId
      donation = await Donation.findById(id)
    }

    if (!donation) {
      return res.status(404).json({ error: 'Donation not found' })
    }

    await donation.populate('recipient.ngoId', 'profile.name campaignDetails')

    // Calculate remaining amount
    const totalSpent = donation.spending?.reduce((sum, spend) => sum + spend.amount, 0) || 0
    const remaining = donation.amount - totalSpent

    const trackingData = {
      id: donation._id,
      ngo: donation.recipient.organizationName,
      amount: donation.amount,
      date: donation.createdAt,
      status: donation.status,
      allocation: {
        aid: 75,
        logistics: 20,
        admin: 5
      },
      spending: donation.spending || [],
      remaining: remaining,
      txHash: donation.blockchain.transactionHash,
      impact: donation.impact || 'Impact data being tracked',
      province: donation.province || 'Various locations'
    }

    res.json(trackingData)

  } catch (error) {
    console.error('Error fetching donation tracking:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/donations/user/:walletAddress - Get user's donations for tracking
router.get('/user/:walletAddress', async (req, res) => {
  try {
    const { walletAddress } = req.params
    const { page = 1, limit = 10 } = req.query

    if (!validateWalletAddress(walletAddress)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    const donations = await Donation.find({ 
      'donor.walletAddress': walletAddress,
      status: { $in: ['confirmed', 'completed'] }
    })
      .populate('recipient.ngoId', 'profile.name')
      .sort({ createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit))

    const total = await Donation.countDocuments({ 
      'donor.walletAddress': walletAddress,
      status: { $in: ['confirmed', 'completed'] }
    })

    // Format for frontend tracking page
    const formattedDonations = donations.map(donation => {
      const totalSpent = donation.spending?.reduce((sum, spend) => sum + spend.amount, 0) || 0
      const remaining = donation.amount - totalSpent

      return {
        id: donation._id,
        ngo: donation.recipient.organizationName,
        amount: `${donation.amount} ADA`,
        date: donation.createdAt.toISOString().split('T')[0],
        status: donation.status === 'confirmed' ? 'Active' : 'Completed',
        allocation: {
          aid: 75,
          logistics: 20,
          admin: 5
        },
        spending: donation.spending || [],
        remaining: `${remaining} ADA`,
        txHash: donation.blockchain.transactionHash,
        impact: donation.impact || 'Impact data being tracked',
        province: donation.province || 'Various locations'
      }
    })

    res.json({
      donations: formattedDonations,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching user donations:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router;
