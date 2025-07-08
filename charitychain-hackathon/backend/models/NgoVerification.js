import mongoose from 'mongoose';

const ngoVerificationSchema = new mongoose.Schema({
  ngoId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  organizationDetails: {
    legalName: {
      type: String,
      required: true,
      trim: true
    },
    registrationNumber: {
      type: String,
      required: true,
      trim: true
    },
    taxId: {
      type: String,
      trim: true
    },
    establishedDate: Date,
    registrationCountry: {
      type: String,
      required: true
    },
    organizationType: {
      type: String,
      enum: ['charity', 'foundation', 'non-profit', 'social-enterprise', 'other'],
      required: true
    },
    focusAreas: [{
      type: String,
      enum: [
        'education', 'healthcare', 'environment', 'poverty-alleviation',
        'disaster-relief', 'human-rights', 'animal-welfare', 'community-development',
        'technology-access', 'gender-equality', 'other'
      ]
    }],
    description: {
      type: String,
      required: true,
      maxlength: 1000
    },
    mission: {
      type: String,
      required: true,
      maxlength: 500
    },
    vision: {
      type: String,
      maxlength: 500
    }
  },
  contactInformation: {
    primaryContact: {
      name: {
        type: String,
        required: true
      },
      title: String,
      email: {
        type: String,
        required: true
      },
      phone: String
    },
    address: {
      street: String,
      city: String,
      state: String,
      country: {
        type: String,
        required: true
      },
      postalCode: String
    },
    website: {
      type: String,
      validate: {
        validator: function(v) {
          return /^https?:\/\/.+/.test(v)
        },
        message: 'Website must be a valid URL'
      }
    },
    socialMedia: {
      twitter: String,
      facebook: String,
      instagram: String,
      linkedin: String
    }
  },
  documents: {
    // KYC/AML compliance documents
    registrationCertificate: {
      filename: String,
      fileUrl: String,
      ipfsHash: String,
      uploadDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    taxExemptionCertificate: {
      filename: String,
      fileUrl: String,
      ipfsHash: String,
      uploadDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    auditReports: [{
      year: Number,
      filename: String,
      fileUrl: String,
      ipfsHash: String,
      uploadDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    }],
    boardOfDirectors: {
      filename: String,
      fileUrl: String,
      ipfsHash: String,
      uploadDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    },
    financialStatements: [{
      year: Number,
      filename: String,
      fileUrl: String,
      ipfsHash: String,
      uploadDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    }],
    additionalDocuments: [{
      documentType: String,
      filename: String,
      fileUrl: String,
      ipfsHash: String,
      uploadDate: Date,
      verified: {
        type: Boolean,
        default: false
      }
    }]
  },
  verificationStatus: {
    type: String,
    enum: ['pending', 'under-review', 'verified', 'rejected', 'suspended'],
    default: 'pending'
  },
  verificationHistory: [{
    status: String,
    date: {
      type: Date,
      default: Date.now
    },
    adminId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    notes: String,
    documentsReviewed: [String]
  }],
  complianceChecks: {
    kycCompleted: {
      type: Boolean,
      default: false
    },
    amlCompleted: {
      type: Boolean,
      default: false
    },
    sanctionsListChecked: {
      type: Boolean,
      default: false
    },
    lastComplianceCheck: Date
  },
  blockchainVerification: {
    onChainVerificationTx: String,
    verificationTokenId: String,
    verificationDate: Date,
    smartContractAddress: String
  },
  adminNotes: {
    type: String,
    maxlength: 1000
  },
  applicationDate: {
    type: Date,
    default: Date.now
  },
  verificationDate: Date,
  expiryDate: Date // For verification renewal
}, {
  timestamps: true
})

// Indexes for efficient queries
ngoVerificationSchema.index({ ngoId: 1 })
ngoVerificationSchema.index({ verificationStatus: 1 })
ngoVerificationSchema.index({ 'organizationDetails.registrationNumber': 1 })
ngoVerificationSchema.index({ applicationDate: -1 })

export default mongoose.model('NgoVerification', ngoVerificationSchema);
