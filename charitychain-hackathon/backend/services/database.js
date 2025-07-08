import mongoose from 'mongoose';

class DatabaseService {
  constructor() {
    this.connection = null
  }

  async connect() {
    try {
      const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/charitychain'
      
      this.connection = await mongoose.connect(mongoUri, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        maxPoolSize: 10,
        serverSelectionTimeoutMS: 5000,
        socketTimeoutMS: 45000,
      })

      console.log('MongoDB connected successfully')
      
      // Set up connection event listeners
      mongoose.connection.on('error', (error) => {
        console.error('MongoDB connection error:', error)
      })

      mongoose.connection.on('disconnected', () => {
        console.log('MongoDB disconnected')
      })

      return this.connection

    } catch (error) {
      console.error('MongoDB connection failed:', error)
      throw error
    }
  }

  async disconnect() {
    try {
      await mongoose.disconnect()
      console.log('MongoDB disconnected successfully')
    } catch (error) {
      console.error('Error disconnecting from MongoDB:', error)
      throw error
    }
  }

  async healthCheck() {
    try {
      const state = mongoose.connection.readyState
      const states = {
        0: 'disconnected',
        1: 'connected',
        2: 'connecting',
        3: 'disconnecting'
      }

      return {
        status: states[state],
        readyState: state,
        host: mongoose.connection.host,
        port: mongoose.connection.port,
        name: mongoose.connection.name
      }
    } catch (error) {
      return {
        status: 'error',
        error: error.message
      }
    }
  }

  async getStats() {
    try {
      const { User, Donation, NgoVerification, Transaction } = await import('../models/index.js')
      
      const stats = await Promise.all([
        User.countDocuments(),
        User.countDocuments({ userType: 'ngo' }),
        User.countDocuments({ verificationStatus: 'verified' }),
        Donation.countDocuments(),
        Donation.aggregate([
          { $match: { status: 'confirmed' } },
          { $group: { _id: null, total: { $sum: '$amount' } } }
        ]),
        NgoVerification.countDocuments(),
        Transaction.countDocuments()
      ])

      return {
        totalUsers: stats[0],
        totalNGOs: stats[1],
        verifiedNGOs: stats[2],
        totalDonations: stats[3],
        totalDonationAmount: stats[4][0]?.total || 0,
        totalVerificationApplications: stats[5],
        totalTransactions: stats[6]
      }
    } catch (error) {
      console.error('Error getting database stats:', error)
      return null
    }
  }

  async cleanup() {
    try {
      // Clean up old pending transactions (older than 1 hour)
      const { Transaction } = await import('../models/index.js')
      const oneHourAgo = new Date(Date.now() - 60 * 60 * 1000)
      
      const result = await Transaction.deleteMany({
        status: 'pending',
        createdAt: { $lt: oneHourAgo }
      })

      console.log(`Cleaned up ${result.deletedCount} old pending transactions`)
      return result.deletedCount

    } catch (error) {
      console.error('Error during database cleanup:', error)
      throw error
    }
  }

  async createIndexes() {
    try {
      const { User, Donation, NgoVerification, Transaction } = await import('../models/index.js')
      
      // Create additional indexes for performance
      await Promise.all([
        User.createIndexes(),
        Donation.createIndexes(),
        NgoVerification.createIndexes(),
        Transaction.createIndexes()
      ])

      console.log('Database indexes created successfully')
    } catch (error) {
      console.error('Error creating database indexes:', error)
      throw error
    }
  }
}

const databaseService = new DatabaseService();

export { databaseService };
