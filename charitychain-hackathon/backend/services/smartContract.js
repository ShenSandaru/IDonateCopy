import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

class SmartContractService {
  constructor() {
    // Check if BLOCKFROST_API_KEY is available
    if (!process.env.BLOCKFROST_API_KEY) {
      console.error('❌ BLOCKFROST_API_KEY environment variable is missing!');
      console.log('Please ensure .env file exists with BLOCKFROST_API_KEY=your_api_key');
      throw new Error('Missing BLOCKFROST_API_KEY environment variable');
    }

    try {
      this.blockfrost = new BlockFrostAPI({
        projectId: process.env.BLOCKFROST_API_KEY,
        isTestnet: true
      });
      console.log('✅ Blockfrost API initialized successfully');
    } catch (error) {
      console.error('❌ Failed to initialize Blockfrost API:', error.message);
      throw error;
    }

    // Load contract addresses from deployment
    this.loadContractAddresses();
  }

  loadContractAddresses() {
    try {
      const contractsPath = path.join(__dirname, '../../frontend/contract-addresses.json');
      if (fs.existsSync(contractsPath)) {
        const contracts = JSON.parse(fs.readFileSync(contractsPath, 'utf8'));
        this.contracts = contracts;
        console.log('✅ Loaded smart contract addresses');
      } else {
        console.log('⚠️  Contract addresses not found, using defaults');
        this.contracts = {
          donationContract: null,
          nftReceiptContract: null
        };
      }
    } catch (error) {
      console.error('Error loading contract addresses:', error);
      this.contracts = {};
    }
  }

  /**
   * Verify if a transaction is a smart contract donation
   */
  async verifySmartContractDonation(txHash) {
    try {
      const tx = await this.blockfrost.txs(txHash);
      const utxos = await this.blockfrost.txsUtxos(txHash);
      const metadata = await this.blockfrost.txsMetadata(txHash);

      // Check if transaction interacts with donation contract
      const isDonationTx = utxos.outputs.some(output => 
        output.address === this.contracts.donationContract?.scriptAddress
      );

      // Check metadata for CharityChain identifier
      const hasCharityChainMetadata = metadata.some(m => 
        m.label === '674' && 
        JSON.stringify(m.json_metadata).includes('CharityChain')
      );

      return {
        isSmartContract: isDonationTx,
        hasValidMetadata: hasCharityChainMetadata,
        transaction: tx,
        outputs: utxos.outputs,
        metadata: metadata
      };

    } catch (error) {
      console.error('Error verifying smart contract donation:', error);
      return {
        isSmartContract: false,
        hasValidMetadata: false,
        error: error.message
      };
    }
  }

  /**
   * Query donation status from smart contract
   */
  async queryDonationFromContract(trackingId) {
    try {
      if (!this.contracts.donationContract?.scriptAddress) {
        throw new Error('Donation contract not deployed');
      }

      // Get UTxOs at donation contract address
      const utxos = await this.blockfrost.addressesUtxos(
        this.contracts.donationContract.scriptAddress
      );

      // Find UTxO with matching tracking ID in datum
      for (const utxo of utxos) {
        try {
          if (utxo.inline_datum) {
            // Decode datum to check tracking ID
            const datum = await this.decodePlutusData(utxo.inline_datum);
            if (datum.tracking_id === trackingId) {
              return {
                found: true,
                donation: this.parseDonationDatum(datum),
                utxo: utxo
              };
            }
          }
        } catch (datumError) {
          // Skip UTxO if datum can't be decoded
          continue;
        }
      }

      return {
        found: false,
        message: 'Donation not found in smart contract'
      };

    } catch (error) {
      console.error('Error querying donation from contract:', error);
      return {
        found: false,
        error: error.message
      };
    }
  }

  /**
   * Get NFT receipts for a donation
   */
  async queryNFTReceipts(donationId, walletAddress) {
    try {
      if (!this.contracts.nftReceiptContract?.policyId) {
        throw new Error('NFT receipt contract not deployed');
      }

      // Get assets for wallet address
      const assets = await this.blockfrost.addressesAssets(walletAddress);
      
      // Filter for CharityChain NFT receipts
      const nftReceipts = assets.filter(asset => 
        asset.unit.startsWith(this.contracts.nftReceiptContract.policyId)
      );

      const receipts = [];
      for (const nft of nftReceipts) {
        try {
          // Get NFT metadata
          const assetInfo = await this.blockfrost.assetsById(nft.unit);
          const metadata = assetInfo.onchain_metadata;

          // Check if this NFT is for the requested donation
          if (metadata && metadata.donation_id === donationId) {
            receipts.push({
              tokenId: nft.unit,
              quantity: nft.quantity,
              metadata: metadata,
              mintTx: assetInfo.initial_mint_tx_hash
            });
          }
        } catch (metadataError) {
          // Skip if metadata can't be retrieved
          continue;
        }
      }

      return {
        found: receipts.length > 0,
        receipts: receipts
      };

    } catch (error) {
      console.error('Error querying NFT receipts:', error);
      return {
        found: false,
        error: error.message
      };
    }
  }

  /**
   * Get fund allocation history from contract
   */
  async getFundAllocationHistory(trackingId) {
    try {
      const donationQuery = await this.queryDonationFromContract(trackingId);
      
      if (!donationQuery.found) {
        return {
          found: false,
          message: 'Donation not found'
        };
      }

      // Get transaction history for the UTxO
      const txHistory = await this.getUTxOHistory(donationQuery.utxo);
      
      return {
        found: true,
        allocation: donationQuery.donation.allocation,
        history: txHistory
      };

    } catch (error) {
      console.error('Error getting fund allocation history:', error);
      return {
        found: false,
        error: error.message
      };
    }
  }

  /**
   * Parse donation datum from contract
   */
  parseDonationDatum(datum) {
    return {
      donor: datum.donor,
      ngo: datum.ngo,
      amount: datum.amount / 1000000, // Convert from lovelace to ADA
      timestamp: new Date(datum.timestamp),
      allocation: datum.allocation,
      purpose: datum.purpose,
      tracking_id: datum.tracking_id,
      status: datum.status
    };
  }

  /**
   * Decode Plutus data (simplified implementation)
   */
  async decodePlutusData(plutusData) {
    // This would use a proper CBOR decoder in production
    // For now, we'll return a mock structure
    return {
      donor: 'addr_test1...',
      ngo: 'addr_test1...',
      amount: 0,
      timestamp: Date.now(),
      allocation: { administration: 5, aid_delivery: 75, logistics: 20 },
      purpose: 'Donation',
      tracking_id: '',
      status: 'Pending'
    };
  }

  /**
   * Get UTxO transaction history
   */
  async getUTxOHistory(utxo) {
    try {
      // Get all transactions that reference this UTxO
      const history = [];
      
      // This would track the UTxO through multiple transactions
      // For now, we'll return basic info
      history.push({
        txHash: utxo.tx_hash,
        outputIndex: utxo.output_index,
        action: 'created',
        timestamp: new Date()
      });

      return history;

    } catch (error) {
      console.error('Error getting UTxO history:', error);
      return [];
    }
  }

  /**
   * Validate smart contract transaction
   */
  async validateContractTransaction(txHash, expectedAmount, expectedRecipient) {
    try {
      const verification = await this.verifySmartContractDonation(txHash);
      
      if (!verification.isSmartContract) {
        return {
          valid: false,
          reason: 'Not a smart contract transaction'
        };
      }

      // Check amount
      const outputToRecipient = verification.outputs.find(output => 
        output.address === expectedRecipient
      );

      if (!outputToRecipient) {
        return {
          valid: false,
          reason: 'Recipient address not found in outputs'
        };
      }

      const actualAmount = parseInt(outputToRecipient.amount[0].quantity) / 1000000;
      if (Math.abs(actualAmount - expectedAmount) > 0.001) {
        return {
          valid: false,
          reason: `Amount mismatch: expected ${expectedAmount}, got ${actualAmount}`
        };
      }

      return {
        valid: true,
        verification: verification
      };

    } catch (error) {
      console.error('Error validating contract transaction:', error);
      return {
        valid: false,
        reason: error.message
      };
    }
  }

  /**
   * Get contract statistics
   */
  async getContractStatistics() {
    try {
      const stats = {
        totalDonations: 0,
        totalAmount: 0,
        totalNFTsMinted: 0,
        activeContracts: 0
      };

      if (this.contracts.donationContract?.scriptAddress) {
        const utxos = await this.blockfrost.addressesUtxos(
          this.contracts.donationContract.scriptAddress
        );
        
        stats.totalDonations = utxos.length;
        stats.totalAmount = utxos.reduce((sum, utxo) => {
          const lovelace = parseInt(utxo.amount[0].quantity);
          return sum + (lovelace / 1000000);
        }, 0);
        stats.activeContracts++;
      }

      if (this.contracts.nftReceiptContract?.policyId) {
        // Get total supply of NFT receipts
        const policyAssets = await this.blockfrost.assetsPolicyById(
          this.contracts.nftReceiptContract.policyId
        );
        stats.totalNFTsMinted = policyAssets.length;
        stats.activeContracts++;
      }

      return {
        success: true,
        stats: stats
      };

    } catch (error) {
      console.error('Error getting contract statistics:', error);
      return {
        success: false,
        error: error.message
      };
    }
  }
}

// Lazy initialization to ensure environment variables are loaded
let _smartContractService = null;

export const smartContractService = {
  get instance() {
    if (!_smartContractService) {
      _smartContractService = new SmartContractService();
    }
    return _smartContractService;
  },
  
  // Proxy all methods to the instance
  getContractStatistics: function() {
    return this.instance.getContractStatistics();
  },
  
  validateContractTransaction: function(txHash, expectedData) {
    return this.instance.validateContractTransaction(txHash, expectedData);
  },
  
  queryDonationFromContract: function(trackingId) {
    return this.instance.queryDonationFromContract(trackingId);
  },
  
  queryNFTReceipts: function(donationId, walletAddress) {
    return this.instance.queryNFTReceipts(donationId, walletAddress);
  },
  
  getFundAllocationHistory: function(trackingId) {
    return this.instance.getFundAllocationHistory(trackingId);
  },
  
  verifySmartContractDonation: function(txHash) {
    return this.instance.verifySmartContractDonation(txHash);
  },
  
  // Access to contracts property
  get contracts() {
    return this.instance.contracts;
  }
};
