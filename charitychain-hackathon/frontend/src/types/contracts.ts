// Smart contract type definitions for CharityChain

export interface DonationDatum {
  donor: string; // Address
  ngo: string; // Address
  amount: number;
  timestamp: number;
  allocation: AllocationBreakdown;
  purpose: string;
  tracking_id: string;
  status: DonationStatus;
}

export interface AllocationBreakdown {
  administration: number;
  aid_delivery: number;
  logistics: number;
}

export enum DonationStatus {
  Pending = "Pending",
  Allocated = "Allocated", 
  Completed = "Completed",
  Disputed = "Disputed"
}

export interface DonationRedeemer {
  action: "CreateDonation" | "AllocateFunds" | "WithdrawFunds" | "VerifySpending";
  data?: {
    new_allocation?: AllocationBreakdown;
    amount?: number;
    purpose?: string;
    recipient?: string;
  };
}

export interface NGODatum {
  ngo_id: string;
  name: string;
  description: string;
  wallet_address: string;
  categories: string[];
  contact_info: string;
  verification_documents: string[];
  status: VerificationStatus;
  verification_date?: number;
  transparency_score: number;
  admin_notes: string;
}

export enum VerificationStatus {
  Pending = "Pending",
  Verified = "Verified",
  Suspended = "Suspended"
}

export interface NGORedeemer {
  action: "RegisterNGO" | "UpdateNGOInfo" | "VerifyNGO" | "SuspendNGO" | "RejectNGO" | "UpdateTransparencyScore";
  data?: {
    new_name?: string;
    new_description?: string;
    new_categories?: string[];
    admin?: string;
    reason?: string;
    new_score?: number;
  };
}

export interface DonationReceiptMetadata {
  donation_id: string;
  donor: string;
  ngo: string;
  amount: number;
  timestamp: number;
  purpose: string;
  ngo_name: string;
  tx_hash: string;
}

export interface NFTRedeemer {
  action: "MintReceipt" | "BurnReceipt";
  data?: {
    metadata?: DonationReceiptMetadata;
    recipient?: string;
    token_name?: string;
  };
}

// Transaction builder types
export interface TransactionConfig {
  walletAddress: string;
  scriptAddress?: string;
  datum?: any;
  redeemer?: any;
  value?: {
    lovelace: number;
    assets?: Array<{
      policyId: string;
      assetName: string;
      quantity: number;
    }>;
  };
}

// API Response types
export interface ContractResponse {
  success: boolean;
  txHash?: string;
  error?: string;
  data?: any;
}

export interface BlockchainQueryResponse {
  success: boolean;
  data?: any;
  error?: string;
}
