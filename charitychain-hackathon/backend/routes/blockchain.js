const express = require('express');
const { Transaction } = require('../models/index.js');
const { blockfrostService } = require('../services/blockfrost.js');
const { validateWalletAddress } = require('../utils/validation.js');

const router = express.Router();

// GET /api/blockchain/transaction/:hash - Get transaction details
router.get('/transaction/:hash', async (req, res) => {
  try {
    const { hash } = req.params

    // First check our database
    let transaction = await Transaction.findOne({ transactionHash: hash })
      .populate('relatedDonation', 'amount donor.walletAddress recipient.walletAddress')

    if (!transaction) {
      // If not in our database, fetch from Blockfrost
      const blockfrostTx = await blockfrostService.getTransaction(hash)
      
      if (!blockfrostTx) {
        return res.status(404).json({ error: 'Transaction not found' })
      }

      // Create a transaction record for tracking
      transaction = new Transaction({
        transactionHash: hash,
        blockNumber: blockfrostTx.block_height,
        blockHash: blockfrostTx.block_hash,
        from: blockfrostTx.inputs[0]?.address || 'Unknown',
        to: blockfrostTx.outputs[0]?.address || 'Unknown',
        value: blockfrostTx.output_amount[0]?.quantity || '0',
        fee: blockfrostTx.fees,
        timestamp: new Date(blockfrostTx.block_time * 1000),
        confirmations: await blockfrostService.getConfirmations(blockfrostTx.block_height),
        status: blockfrostTx.valid_contract ? 'confirmed' : 'failed',
        transactionType: 'other'
      })

      await transaction.save()
    }

    res.json(transaction)

  } catch (error) {
    console.error('Error fetching transaction:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/blockchain/address/:address/transactions - Get transactions for an address
router.get('/address/:address/transactions', async (req, res) => {
  try {
    const { address } = req.params
    const { page = 1, limit = 20, type } = req.query

    if (!validateWalletAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    const query = {
      $or: [
        { from: address },
        { to: address }
      ]
    }

    if (type) {
      query.transactionType = type
    }

    const transactions = await Transaction.find(query)
      .populate('relatedDonation', 'amount donationPurpose')
      .sort({ timestamp: -1 })
      .limit(limit * 1)
      .skip((page - 1) * limit)

    const total = await Transaction.countDocuments(query)

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    })

  } catch (error) {
    console.error('Error fetching address transactions:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/blockchain/address/:address/balance - Get address balance
router.get('/address/:address/balance', async (req, res) => {
  try {
    const { address } = req.params

    if (!validateWalletAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    const balance = await blockfrostService.getAddressBalance(address)
    
    res.json({
      address,
      balance: balance.amount,
      assets: balance.assets || []
    })

  } catch (error) {
    console.error('Error fetching address balance:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/blockchain/verify-transaction - Verify a transaction
router.post('/verify-transaction', async (req, res) => {
  try {
    const { transactionHash } = req.body

    if (!transactionHash) {
      return res.status(400).json({ error: 'Transaction hash is required' })
    }

    const verification = await blockfrostService.verifyTransaction(transactionHash)

    res.json({
      transactionHash,
      isValid: verification.isValid,
      details: verification.details,
      confirmations: verification.confirmations
    })

  } catch (error) {
    console.error('Error verifying transaction:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/blockchain/network/info - Get network information
router.get('/network/info', async (req, res) => {
  try {
    const networkInfo = await blockfrostService.getNetworkInfo()
    
    res.json({
      network: 'cardano-testnet',
      currentEpoch: networkInfo.epoch,
      blockHeight: networkInfo.block_count,
      networkId: networkInfo.network,
      protocolVersion: networkInfo.protocol_params
    })

  } catch (error) {
    console.error('Error fetching network info:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/blockchain/assets/:address - Get assets for an address
router.get('/assets/:address', async (req, res) => {
  try {
    const { address } = req.params

    if (!validateWalletAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    const assets = await blockfrostService.getAddressAssets(address)
    
    res.json({
      address,
      assets: assets || []
    })

  } catch (error) {
    console.error('Error fetching address assets:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// GET /api/blockchain/utxos/:address - Get UTXOs for an address
router.get('/utxos/:address', async (req, res) => {
  try {
    const { address } = req.params

    if (!validateWalletAddress(address)) {
      return res.status(400).json({ error: 'Invalid wallet address' })
    }

    const utxos = await blockfrostService.getAddressUtxos(address)
    
    res.json({
      address,
      utxos: utxos || []
    })

  } catch (error) {
    console.error('Error fetching address UTXOs:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

// POST /api/blockchain/transaction/submit - Submit a transaction to the network
router.post('/transaction/submit', async (req, res) => {
  try {
    const { signedTransaction } = req.body

    if (!signedTransaction) {
      return res.status(400).json({ error: 'Signed transaction is required' })
    }

    const result = await blockfrostService.submitTransaction(signedTransaction)
    
    res.json({
      transactionHash: result.transactionHash,
      success: result.success,
      message: result.message
    })

  } catch (error) {
    console.error('Error submitting transaction:', error)
    res.status(500).json({ error: 'Internal server error' })
  }
})

module.exports = router;
