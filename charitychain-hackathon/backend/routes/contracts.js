import express from 'express';
import { smartContractService } from '../services/smartContract.js';
import { validateWalletAddress } from '../utils/validation.js';

const router = express.Router();

// GET /api/contracts/status - Get smart contract deployment status
router.get('/status', async (req, res) => {
  try {
    const stats = await smartContractService.getContractStatistics();
    
    res.json({
      deployed: stats.success,
      contracts: smartContractService.contracts,
      statistics: stats.stats || null,
      timestamp: new Date().toISOString()
    });
  } catch (error) {
    console.error('Error getting contract status:', error);
    res.status(500).json({ error: 'Failed to get contract status' });
  }
});

// POST /api/contracts/verify-donation - Verify smart contract donation
router.post('/verify-donation', async (req, res) => {
  try {
    const { txHash, expectedAmount, expectedRecipient } = req.body;

    if (!txHash) {
      return res.status(400).json({ error: 'Transaction hash is required' });
    }

    if (!validateWalletAddress(expectedRecipient)) {
      return res.status(400).json({ error: 'Invalid recipient address' });
    }

    const verification = await smartContractService.validateContractTransaction(
      txHash,
      expectedAmount,
      expectedRecipient
    );

    res.json(verification);

  } catch (error) {
    console.error('Error verifying donation:', error);
    res.status(500).json({ error: 'Failed to verify donation' });
  }
});

// GET /api/contracts/donation/:trackingId - Query donation from smart contract
router.get('/donation/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;

    if (!trackingId) {
      return res.status(400).json({ error: 'Tracking ID is required' });
    }

    const donation = await smartContractService.queryDonationFromContract(trackingId);

    if (!donation.found) {
      return res.status(404).json({ 
        error: 'Donation not found in smart contract',
        message: donation.message 
      });
    }

    res.json({
      success: true,
      donation: donation.donation,
      utxo: donation.utxo
    });

  } catch (error) {
    console.error('Error querying donation:', error);
    res.status(500).json({ error: 'Failed to query donation from contract' });
  }
});

// GET /api/contracts/nft-receipts/:donationId - Get NFT receipts for donation
router.get('/nft-receipts/:donationId', async (req, res) => {
  try {
    const { donationId } = req.params;
    const { walletAddress } = req.query;

    if (!donationId) {
      return res.status(400).json({ error: 'Donation ID is required' });
    }

    if (!walletAddress || !validateWalletAddress(walletAddress)) {
      return res.status(400).json({ error: 'Valid wallet address is required' });
    }

    const receipts = await smartContractService.queryNFTReceipts(donationId, walletAddress);

    if (!receipts.found) {
      return res.status(404).json({ 
        error: 'No NFT receipts found',
        message: receipts.error 
      });
    }

    res.json({
      success: true,
      receipts: receipts.receipts
    });

  } catch (error) {
    console.error('Error querying NFT receipts:', error);
    res.status(500).json({ error: 'Failed to query NFT receipts' });
  }
});

// GET /api/contracts/allocation/:trackingId - Get fund allocation history
router.get('/allocation/:trackingId', async (req, res) => {
  try {
    const { trackingId } = req.params;

    if (!trackingId) {
      return res.status(400).json({ error: 'Tracking ID is required' });
    }

    const allocation = await smartContractService.getFundAllocationHistory(trackingId);

    if (!allocation.found) {
      return res.status(404).json({ 
        error: 'Allocation history not found',
        message: allocation.message 
      });
    }

    res.json({
      success: true,
      allocation: allocation.allocation,
      history: allocation.history
    });

  } catch (error) {
    console.error('Error getting allocation history:', error);
    res.status(500).json({ error: 'Failed to get allocation history' });
  }
});

// POST /api/contracts/transaction/:txHash/analyze - Analyze transaction for smart contract interaction
router.post('/transaction/:txHash/analyze', async (req, res) => {
  try {
    const { txHash } = req.params;

    if (!txHash) {
      return res.status(400).json({ error: 'Transaction hash is required' });
    }

    const analysis = await smartContractService.verifySmartContractDonation(txHash);

    res.json({
      success: true,
      isSmartContract: analysis.isSmartContract,
      hasValidMetadata: analysis.hasValidMetadata,
      transaction: analysis.transaction,
      outputs: analysis.outputs,
      metadata: analysis.metadata,
      error: analysis.error || null
    });

  } catch (error) {
    console.error('Error analyzing transaction:', error);
    res.status(500).json({ error: 'Failed to analyze transaction' });
  }
});

// GET /api/contracts/statistics - Get overall contract statistics
router.get('/statistics', async (req, res) => {
  try {
    const stats = await smartContractService.getContractStatistics();

    res.json(stats);

  } catch (error) {
    console.error('Error getting contract statistics:', error);
    res.status(500).json({ error: 'Failed to get contract statistics' });
  }
});

export default router;
