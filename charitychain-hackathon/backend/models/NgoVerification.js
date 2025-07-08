import mongoose from 'mongoose';

const ngoVerificationSchema = new mongoose.Schema({
  ngoId: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  walletAddress: {
    type: String,
    required: true,
    trim: true
  },
  registrationNumber: {
    type: String,
    required: true,
    trim: true
  },
  country: {
    type: String,
    required: true,
    default: 'Iran'
  },
  province: {
    type: String,
    trim: true
  },
  category: {
    type: String,
    enum: ['healthcare', 'education', 'food', 'shelter', 'emergency', 'other'],
    required: true
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  },
  documents: [{
    filename: String,
    originalName: String,
    size: Number,
    uploadedAt: {
      type: Date,
      default: Date.now
    }
  }],
  verifiedBy: {
    type: String,
    trim: true
  },
  verifiedAt: {
    type: Date
  },
  rejectionReason: {
    type: String
  }
}, {
  timestamps: true
});

// Indexes
ngoVerificationSchema.index({ ngoId: 1 });
ngoVerificationSchema.index({ verificationStatus: 1 });
ngoVerificationSchema.index({ country: 1 });
ngoVerificationSchema.index({ category: 1 });

const NgoVerification = mongoose.model('NgoVerification', ngoVerificationSchema);
export default NgoVerification;
