import express from 'express';
import cors from 'cors';
import { BlockFrostAPI } from '@blockfrost/blockfrost-js';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Import services and middleware
import { databaseService } from '../services/database.js';
import { 
  securityHeaders, 
  apiRateLimit, 
  sanitizeRequest, 
  requestLogger, 
  errorHandler,
  corsOptions 
} from '../middleware/security.js';
import { handleUploadError, serveUploads } from '../middleware/upload.js';

// Import routes
import { 
  usersRouter, 
  donationsRouter, 
  ngoVerificationRouter, 
  blockchainRouter 
} from '../routes/index.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables from the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') });

const app = express();
const PORT = process.env.PORT || 3001;

// Initialize server function
async function initializeServer() {
  try {
    // Connect to MongoDB
    await databaseService.connect();

    // Security middleware
    app.use(securityHeaders);
    app.use(cors(corsOptions));
    app.use(sanitizeRequest);
    app.use(requestLogger);

    // Body parsing middleware
    app.use(express.json({ limit: '10mb' }));
    app.use(express.urlencoded({ extended: true, limit: '10mb' }));

    // Rate limiting
    app.use('/api/', apiRateLimit);

// Check if API key exists
if (!process.env.BLOCKFROST_API_KEY) {
  console.error('Error: BLOCKFROST_API_KEY environment variable is required')
  console.error('Please create a .env file with your BlockFrost API key')
  process.exit(1)
}

// Initialize BlockFrost API with error handling
let blockfrost
try {
  // Initialize with testnet network explicitly
  blockfrost = new BlockFrostAPI({
    projectId: process.env.BLOCKFROST_API_KEY,
    customBackend: 'https://cardano-testnet.blockfrost.io/api/v0'
  })
  console.log('BlockFrost API initialized successfully with testnet')
} catch (error) {
  console.error('Failed to initialize BlockFrost API:', error)
  
  // Fallback to basic initialization if custom backend fails
  try {
    blockfrost = new BlockFrostAPI({
      projectId: process.env.BLOCKFROST_API_KEY
    })
    console.log('BlockFrost API initialized with basic method (check network)')
  } catch (altError) {
    console.error('All initialization methods failed:', altError)
    process.exit(1)
  }
}

// Make blockfrost available globally for services
global.blockfrost = blockfrost;

// Serve uploaded files
app.use('/uploads', serveUploads);

// Handle upload errors
app.use(handleUploadError);

// API Routes
app.use('/api/users', usersRouter);
app.use('/api/donations', donationsRouter);
app.use('/api/ngo-verification', ngoVerificationRouter);
app.use('/api/blockchain', blockchainRouter);

// Serve uploaded files
app.get('/uploads/:filename', serveUploads)

// Health check endpoint
app.get('/api/health', async (req, res) => {
  try {
    const dbHealth = await databaseService.healthCheck()
    const dbStats = await databaseService.getStats()
    
    res.json({ 
      status: 'CharityChain API running',
      timestamp: new Date().toISOString(),
      version: '1.0.0',
      database: dbHealth,
      statistics: dbStats,
      blockfrost: {
        status: 'connected',
        network: 'testnet'
      }
    })
  } catch (error) {
    res.status(500).json({
      status: 'error',
      error: error.message
    })
  }
})

// API documentation endpoint
app.get('/api/docs', (req, res) => {
  res.json({
    name: 'CharityChain API',
    version: '1.0.0',
    description: 'Backend API for CharityChain - A blockchain-based donation platform',
    endpoints: {
      users: {
        'GET /api/users/profile/:walletAddress': 'Get user profile',
        'POST /api/users/register': 'Register or update user',
        'GET /api/users/ngos': 'Get all verified NGOs',
        'PUT /api/users/profile/:walletAddress': 'Update user profile',
        'GET /api/users/:walletAddress/donations': 'Get user donation history'
      },
      donations: {
        'POST /api/donations/create': 'Create a new donation',
        'GET /api/donations/:id': 'Get specific donation',
        'GET /api/donations': 'Get all donations with filtering',
        'GET /api/donations/stats/overview': 'Get donation statistics',
        'PUT /api/donations/:id/status': 'Update donation status'
      },
      ngoVerification: {
        'POST /api/ngo-verification/apply': 'Submit NGO verification application',
        'GET /api/ngo-verification/status/:walletAddress': 'Get verification status',
        'GET /api/ngo-verification/applications': 'Get all applications (Admin)',
        'GET /api/ngo-verification/application/:id': 'Get specific application (Admin)',
        'PUT /api/ngo-verification/review/:id': 'Review application (Admin)'
      },
      blockchain: {
        'GET /api/blockchain/transaction/:hash': 'Get transaction details',
        'GET /api/blockchain/address/:address/transactions': 'Get address transactions',
        'GET /api/blockchain/address/:address/balance': 'Get address balance',
        'POST /api/blockchain/verify-transaction': 'Verify a transaction',
        'GET /api/blockchain/network/info': 'Get network information'
      }
    },
    features: [
      'User registration and management',
      'NGO verification system',
      'Donation tracking and receipt generation',
      'Blockchain integration with Cardano',
      'NFT receipt generation',
      'Real-time transaction monitoring',
      'Admin panel for NGO verification',
      'File upload for verification documents',
      'RESTful API with comprehensive error handling'
    ]
  })
})

// File upload error handling
app.use(handleUploadError)

// Global error handler
app.use(errorHandler)

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    message: `The endpoint ${req.method} ${req.originalUrl} does not exist`,
    availableEndpoints: '/api/docs'
  })
})

// Graceful shutdown handling
const gracefulShutdown = async () => {
  console.log('Received shutdown signal, closing server...')
  
  try {
    await databaseService.disconnect()
    console.log('Database disconnected')
    
    process.exit(0)
  } catch (error) {
    console.error('Error during shutdown:', error)
    process.exit(1)
  }
}

process.on('SIGTERM', gracefulShutdown)
process.on('SIGINT', gracefulShutdown)

// Start server
    app.listen(PORT, () => {
      console.log(`🚀 CharityChain Server running on port ${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/api/health`);
      console.log(`📖 API docs: http://localhost:${PORT}/api/docs`);
      console.log(`🔗 Blockchain: Cardano Testnet via BlockFrost`);
      console.log(`💾 Database: MongoDB connected`);
    });

  } catch (error) {
    console.error('Failed to initialize server:', error);
    process.exit(1);
  }
}

// Initialize the server
initializeServer();