import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donor: {
    walletAddress: {
      type: String,
      required: true
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    }
  },
  recipient: {
    walletAddress: {
      type: String,
      required: true
    },
    ngoId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    organizationName: String
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    default: 'ADA'
  },
  blockchain: {
    transactionHash: {
      type: String,
      required: true
    },
    blockNumber: Number,
    blockHash: String,
    timestamp: Date,
    confirmations: {
      type: Number,
      default: 0
    }
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed', 'completed'],
    default: 'pending'
  },
  nftReceipt: {
    tokenId: String,
    tokenAddress: String,
    metadata: {
      name: String,
      description: String,
      image: String,
      attributes: [{
        trait_type: String,
        value: String
      }]
    },
    ipfsHash: String
  },
  fundAllocation: {
    // How the donation is distributed
    directToNgo: {
      type: Number,
      default: 0
    },
    platformFee: {
      type: Number,
      default: 0
    },
    operationalCosts: {
      type: Number,
      default: 0
    }
  },
  donationPurpose: {
    type: String,
    maxlength: 200
  },
  notes: {
    type: String,
    maxlength: 500
  },
  isAnonymous: {
    type: Boolean,
    default: false
  },
  trackingEnabled: {
    type: Boolean,
    default: true
  },
  spending: [{
    date: {
      type: Date,
      default: Date.now
    },
    amount: Number,
    purpose: String,
    category: {
      type: String,
      enum: ['aid', 'logistics', 'admin']
    }
  }],
  impact: String,
  province: String
}, {
  timestamps: true
});

// Index for efficient queries  
donationSchema.index({ 'donor.walletAddress': 1 });
donationSchema.index({ 'recipient.walletAddress': 1 });
donationSchema.index({ 'blockchain.transactionHash': 1 });
donationSchema.index({ status: 1 });

export default mongoose.model('Donation', donationSchema);
