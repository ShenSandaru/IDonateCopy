const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  blockNumber: Number,
  blockHash: String,
  transactionIndex: Number,
  from: {
    type: String,
    required: true
  },
  to: {
    type: String,
    required: true
  },
  value: {
    type: String, // Store as string to handle large numbers
    required: true
  },
  fee: {
    type: String
  },
  gasUsed: String,
  gasPrice: String,
  timestamp: {
    type: Date,
    required: true
  },
  confirmations: {
    type: Number,
    default: 0
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  transactionType: {
    type: String,
    enum: ['donation', 'nft-mint', 'verification', 'withdrawal', 'other'],
    required: true
  },
  relatedDonation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Donation'
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed // Flexible metadata storage
  }
}, {
  timestamps: true
})

// Indexes for efficient queries
transactionSchema.index({ transactionHash: 1 })
transactionSchema.index({ from: 1 })
transactionSchema.index({ to: 1 })
transactionSchema.index({ timestamp: -1 })
transactionSchema.index({ status: 1 })
transactionSchema.index({ transactionType: 1 })

module.exports = mongoose.model('Transaction', transactionSchema);
