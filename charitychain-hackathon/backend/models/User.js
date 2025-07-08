import mongoose from 'mongoose';

const userSchema = new mongoose.Schema({
  walletAddress: {
    type: String,
    required: true,
    trim: true
  },
  userType: {
    type: String,
    enum: ['donor', 'ngo', 'admin'],
    default: 'donor'
  },
  profile: {
    name: {
      type: String,
      trim: true
    },
    email: {
      type: String,
      trim: true,
      lowercase: true
    },
    bio: {
      type: String,
      maxlength: 500
    },
    avatar: {
      type: String // URL to avatar image
    }
  },
  donationHistory: [{
    donationId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Donation'
    },
    amount: Number,
    date: {
      type: Date,
      default: Date.now
    },
    transactionHash: String,
    nftReceiptId: String
  }],
  campaignDetails: {
    // Only for NGO users
    description: String,
    goals: [String],
    website: String,
    socialMedia: {
      twitter: String,
      facebook: String,
      instagram: String
    },
    fundingGoal: Number,
    totalReceived: {
      type: Number,
      default: 0
    },
    category: {
      type: String,
      enum: ['Healthcare', 'Education', 'Food Security', 'Women & Children', 'Disaster Relief', 'Environment', 'Other']
    },
    location: String,
    urgency: {
      type: String,
      enum: ['Low', 'Medium', 'High', 'Critical'],
      default: 'Medium'
    },
    transparencyScore: {
      type: Number,
      default: 0,
      min: 0,
      max: 100
    },
    activeProjects: {
      type: Number,
      default: 0
    },
    beneficiaries: String,
    founded: String,
    verified: {
      type: Boolean,
      default: false
    }
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'verified', 'rejected'],
    default: 'pending'
  },
  isActive: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

// Index for efficient queries
userSchema.index({ walletAddress: 1, userType: 1 });
userSchema.index({ verificationStatus: 1 });

export default mongoose.model('User', userSchema);
