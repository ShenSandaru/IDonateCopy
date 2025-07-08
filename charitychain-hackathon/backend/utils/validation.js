import Joi from 'joi';

// Cardano address validation regex (simplified)
const CARDANO_ADDRESS_REGEX = /^addr_test[0-9a-z]{54,}$|^addr[0-9a-z]{54,}$/

export const validateWalletAddress = (address) => {
  if (!address || typeof address !== 'string') {
    return false
  }
  
  return CARDANO_ADDRESS_REGEX.test(address)
}

export const validateDonationData = (data) => {
  const schema = Joi.object({
    donorWalletAddress: Joi.string().required().custom((value, helpers) => {
      if (!validateWalletAddress(value)) {
        return helpers.error('Invalid donor wallet address')
      }
      return value
    }),
    recipientWalletAddress: Joi.string().required().custom((value, helpers) => {
      if (!validateWalletAddress(value)) {
        return helpers.error('Invalid recipient wallet address')
      }
      return value
    }),
    amount: Joi.number().positive().required(),
    transactionHash: Joi.string().required().min(64).max(64),
    donationPurpose: Joi.string().max(200).optional(),
    isAnonymous: Joi.boolean().optional()
  })

  const { error } = schema.validate(data)
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : []
  }
}

export const validateNgoVerificationData = (data) => {
  const schema = Joi.object({
    walletAddress: Joi.string().required().custom((value, helpers) => {
      if (!validateWalletAddress(value)) {
        return helpers.error('Invalid wallet address')
      }
      return value
    }),
    legalName: Joi.string().required().max(200),
    registrationNumber: Joi.string().required().max(100),
    taxId: Joi.string().max(100).optional(),
    establishedDate: Joi.date().optional(),
    registrationCountry: Joi.string().required().max(100),
    organizationType: Joi.string().valid('charity', 'foundation', 'non-profit', 'social-enterprise', 'other').required(),
    focusAreas: Joi.array().items(
      Joi.string().valid(
        'education', 'healthcare', 'environment', 'poverty-alleviation',
        'disaster-relief', 'human-rights', 'animal-welfare', 'community-development',
        'technology-access', 'gender-equality', 'other'
      )
    ).min(1).required(),
    description: Joi.string().required().max(1000),
    mission: Joi.string().required().max(500),
    vision: Joi.string().max(500).optional(),
    contactName: Joi.string().required().max(100),
    contactTitle: Joi.string().max(100).optional(),
    contactEmail: Joi.string().email().required(),
    contactPhone: Joi.string().max(20).optional(),
    addressStreet: Joi.string().max(200).optional(),
    addressCity: Joi.string().max(100).optional(),
    addressState: Joi.string().max(100).optional(),
    addressCountry: Joi.string().required().max(100),
    addressPostalCode: Joi.string().max(20).optional(),
    website: Joi.string().uri().optional(),
    twitter: Joi.string().max(100).optional(),
    facebook: Joi.string().max(100).optional(),
    instagram: Joi.string().max(100).optional(),
    linkedin: Joi.string().max(100).optional()
  })

  const { error } = schema.validate(data)
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : []
  }
}

export const validateUserRegistration = (data) => {
  const schema = Joi.object({
    walletAddress: Joi.string().required().custom((value, helpers) => {
      if (!validateWalletAddress(value)) {
        return helpers.error('Invalid wallet address')
      }
      return value
    }),
    userType: Joi.string().valid('donor', 'ngo', 'admin').optional(),
    profile: Joi.object({
      name: Joi.string().max(100).optional(),
      email: Joi.string().email().optional(),
      bio: Joi.string().max(500).optional(),
      avatar: Joi.string().uri().optional()
    }).optional(),
    campaignDetails: Joi.object({
      description: Joi.string().max(1000).optional(),
      goals: Joi.array().items(Joi.string().max(200)).optional(),
      website: Joi.string().uri().optional(),
      socialMedia: Joi.object({
        twitter: Joi.string().max(100).optional(),
        facebook: Joi.string().max(100).optional(),
        instagram: Joi.string().max(100).optional()
      }).optional(),
      fundingGoal: Joi.number().positive().optional()
    }).optional()
  })

  const { error } = schema.validate(data)
  
  return {
    isValid: !error,
    errors: error ? error.details.map(detail => detail.message) : []
  }
}

export const sanitizeInput = (input) => {
  if (typeof input === 'string') {
    return input.trim().replace(/[<>]/g, '')
  }
  return input
}

export const validatePagination = (page, limit) => {
  const pageNum = parseInt(page) || 1
  const limitNum = parseInt(limit) || 20
  
  return {
    page: Math.max(1, pageNum),
    limit: Math.min(100, Math.max(1, limitNum))
  }
}
