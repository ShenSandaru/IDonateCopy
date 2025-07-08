import jwt from 'jsonwebtoken';
import { User } from '../models/index.js';

export const authenticateToken = async (req, res, next) => {
  try {
    const authHeader = req.headers['authorization']
    const token = authHeader && authHeader.split(' ')[1] // Bearer TOKEN

    if (!token) {
      return res.status(401).json({ error: 'Access token required' })
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET)
    
    // Get user from database
    const user = await User.findById(decoded.userId)
    if (!user) {
      return res.status(401).json({ error: 'Invalid token - user not found' })
    }

    req.user = user
    next()
  } catch (error) {
    console.error('Authentication error:', error)
    return res.status(401).json({ error: 'Invalid or expired token' })
  }
}

export const requireAdmin = (req, res, next) => {
  if (!req.user || req.user.userType !== 'admin') {
    return res.status(403).json({ error: 'Admin access required' })
  }
  next()
}

export const requireNGO = (req, res, next) => {
  if (!req.user || req.user.userType !== 'ngo') {
    return res.status(403).json({ error: 'NGO access required' })
  }
  next()
}

export const requireVerifiedNGO = (req, res, next) => {
  if (!req.user || req.user.userType !== 'ngo' || req.user.verificationStatus !== 'verified') {
    return res.status(403).json({ error: 'Verified NGO access required' })
  }
  next()
}

export const generateToken = (userId, walletAddress, userType) => {
  return jwt.sign(
    { 
      userId, 
      walletAddress, 
      userType 
    },
    process.env.JWT_SECRET,
    { expiresIn: '24h' }
  )
}

export const verifyWalletSignature = async (req, res, next) => {
  try {
    const { walletAddress, signature, message } = req.body

    if (!walletAddress || !signature || !message) {
      return res.status(400).json({ 
        error: 'Wallet address, signature, and message are required' 
      })
    }

    // In a real implementation, you would verify the signature using Cardano libraries
    // For now, we'll simulate signature verification
    const isValidSignature = true // await verifyCardanoSignature(walletAddress, signature, message)

    if (!isValidSignature) {
      return res.status(401).json({ error: 'Invalid wallet signature' })
    }

    req.walletVerified = true
    next()
  } catch (error) {
    console.error('Wallet signature verification error:', error)
    return res.status(500).json({ error: 'Signature verification failed' })
  }
}

export const rateLimitByWallet = (req, res, next) => {
  // Simple rate limiting by wallet address
  // In production, use Redis or a proper rate limiting service
  const walletAddress = req.body.walletAddress || req.params.walletAddress
  
  if (!walletAddress) {
    return next()
  }

  // Allow up to 100 requests per hour per wallet
  const maxRequests = 100
  const timeWindow = 60 * 60 * 1000 // 1 hour in milliseconds

  // This is a simplified implementation
  // In production, implement proper rate limiting
  next()
}
