// Simple smart contract integration for CharityChain
import { MeshTxBuilder } from '@meshsdk/core'
import { 
  DonationDatum, 
  DonationRedeemer, 
  DonationReceiptMetadata, 
  NFTRedeemer,
  AllocationBreakdown,
  DonationStatus 
} from '@/types/contracts'

// Load contract addresses from deployment
let CONTRACTS: any = {}

try {
  CONTRACTS = require('../../contract-addresses.json')?.contracts || {}
} catch (error) {
  console.warn('Contract addresses not found, using defaults')
  CONTRACTS = {
    donationContract: {
      scriptAddress: 'addr_test1w47ce62f8277461823ff24dd59da9640e91601e61506062175d',
      scriptHash: '47ce62f8277461823ff24dd59da9640e91601e61506062175d7984f6'
    },
    nftReceiptContract: {
      policyId: '1dd2d0a40e424aea098c014a9af1d2ccc8aec147041cf34324f2a8b7'
    },
    ngoVerificationContract: {
      scriptAddress: 'addr_test1w2f6783cf460f5cc48a6423c28e311a3363ad1cf9ef56a9d45c'
    }
  }
}

// Simple smart contract service for donation tracking
export class CharityChainContracts {
  private isEnabled: boolean = true

  constructor() {
    // Check if contracts are deployed
    this.isEnabled = CONTRACTS?.donationContract?.scriptAddress ? true : false
  }

  /**
   * Check if smart contracts are available
   */
  isContractEnabled(): boolean {
    return this.isEnabled
  }

  /**
   * Get contract addresses
   */
  getContractAddresses() {
    return CONTRACTS
  }

  /**
   * Create a simple donation transaction (fallback when contracts not available)
   */
  async createSimpleDonation(
    donorAddress: string,
    ngoAddress: string,
    amount: number,
    purpose: string,
    trackingId: string
  ): Promise<any> {
    const lovelaceAmount = amount * 1000000 // Convert ADA to lovelace

    const donationData = {
      donor: donorAddress,
      ngo: ngoAddress,
      amount: lovelaceAmount,
      timestamp: Date.now(),
      purpose,
      tracking_id: trackingId,
      status: DonationStatus.Pending
    }

    // Create simple transaction metadata
    const metadata = this.createDonationMetadata(trackingId, amount, 'NGO', purpose)

    return {
      donationData,
      metadata,
      contractAddress: this.isEnabled ? CONTRACTS.donationContract.scriptAddress : ngoAddress,
      amount: lovelaceAmount
    }
  }

  /**
   * Generate unique donation tracking ID
   */
  generateTrackingId(): string {
    const timestamp = Date.now().toString()
    const random = Math.random().toString(36).substring(2, 8)
    return `CC_${timestamp.slice(-8)}_${random.toUpperCase()}`
  }

  /**
   * Generate unique NFT token name
   */
  generateNFTTokenName(donationId: string): string {
    const timestamp = Date.now().toString().slice(-6)
    const donationHash = donationId.slice(0, 8)
    return `CharityReceipt_${donationHash}_${timestamp}`
  }

  /**
   * Create donation metadata for transaction
   */
  createDonationMetadata(
    donationId: string,
    amount: number,
    ngoName: string,
    purpose: string
  ) {
    return {
      674: {
        msg: [
          `CharityChain Donation #${donationId}`,
          `Amount: ${amount} ADA`,
          `Recipient: ${ngoName}`,
          `Purpose: ${purpose}`,
          `Platform: CharityChain Iran Support`,
          `Timestamp: ${new Date().toISOString()}`,
          `Contract: ${this.isEnabled ? 'Smart Contract' : 'Simple Transaction'}`
        ]
      }
    }
  }

  /**
   * Get NFT receipt metadata
   */
  createNFTReceiptMetadata(
    donationId: string,
    donorAddress: string,
    ngoAddress: string,
    amount: number,
    purpose: string,
    ngoName: string,
    txHash: string
  ): DonationReceiptMetadata {
    return {
      donation_id: donationId,
      donor: donorAddress,
      ngo: ngoAddress,
      amount,
      timestamp: Date.now(),
      purpose,
      ngo_name: ngoName,
      tx_hash: txHash
    }
  }

  /**
   * Validate contract deployment
   */
  async validateContractDeployment(): Promise<boolean> {
    try {
      if (!this.isEnabled) {
        console.log('Smart contracts not deployed, using simple transactions')
        return false
      }

      // Basic validation of contract addresses
      const hasValidAddresses = 
        CONTRACTS.donationContract?.scriptAddress &&
        CONTRACTS.nftReceiptContract?.policyId &&
        CONTRACTS.ngoVerificationContract?.scriptAddress

      if (!hasValidAddresses) {
        console.warn('Invalid contract addresses detected')
        this.isEnabled = false
        return false
      }

      console.log('Smart contracts validated and ready')
      return true
    } catch (error) {
      console.error('Contract validation failed:', error)
      this.isEnabled = false
      return false
    }
  }

  /**
   * Get contract status information
   */
  getContractStatus() {
    return {
      enabled: this.isEnabled,
      contracts: CONTRACTS,
      donation_address: CONTRACTS.donationContract?.scriptAddress || null,
      nft_policy_id: CONTRACTS.nftReceiptContract?.policyId || null,
      ngo_verification_address: CONTRACTS.ngoVerificationContract?.scriptAddress || null,
      deployment_timestamp: CONTRACTS.timestamp || null,
      network: CONTRACTS.network || 'testnet'
    }
  }

  /**
   * Create allocation breakdown for funds
   */
  createAllocationBreakdown(
    administrationPercent: number = 5,
    aidDeliveryPercent: number = 75,
    logisticsPercent: number = 20
  ): AllocationBreakdown {
    // Ensure percentages add up to 100
    const total = administrationPercent + aidDeliveryPercent + logisticsPercent
    if (total !== 100) {
      console.warn(`Allocation percentages don't add up to 100% (${total}%)`)
    }

    return {
      administration: administrationPercent,
      aid_delivery: aidDeliveryPercent,
      logistics: logisticsPercent
    }
  }
}

// Export singleton instance
export const contractService = new CharityChainContracts()

// Export utility functions
export const getContractAddress = (scriptHash: string): string => {
  return `addr_test1w${scriptHash}` // Testnet prefix
}

export const isValidCardanoAddress = (address: string): boolean => {
  return address.startsWith('addr_test1') || address.startsWith('addr1')
}

export const convertADAToLovelace = (ada: number): number => {
  return Math.floor(ada * 1000000)
}

export const convertLovelaceToADA = (lovelace: number): number => {
  return lovelace / 1000000
}

export default CharityChainContracts
