import mongoose from 'mongoose';

const donationSchema = new mongoose.Schema({
  donorAddress: {
    type: String,
    required: true,
    trim: true
  },
  ngoId: {
    type: String,
    required: true,
    trim: true
  },
  amount: {
    type: Number,
    required: true,
    min: 0
  },
  currency: {
    type: String,
    required: true,
    default: 'ADA'
  },
  transactionHash: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['pending', 'confirmed', 'failed'],
    default: 'pending'
  },
  blockNumber: {
    type: Number
  },
  metadata: {
    message: String,
    purpose: String,
    tags: [String]
  },
  nftReceiptId: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes for efficient queries
donationSchema.index({ donorAddress: 1 });
donationSchema.index({ ngoId: 1 });
donationSchema.index({ transactionHash: 1 });
donationSchema.index({ status: 1 });
donationSchema.index({ createdAt: -1 });

const Donation = mongoose.model('Donation', donationSchema);
export default Donation;
