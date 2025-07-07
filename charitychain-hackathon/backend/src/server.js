import express from 'express'
import cors from 'cors'
import { BlockFrostAPI } from '@blockfrost/blockfrost-js'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

// Get the directory name in ES modules
const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// Load environment variables from the parent directory
dotenv.config({ path: path.join(__dirname, '..', '.env') })

// ...existing code...
const app = express()
const PORT = process.env.PORT || 3001

app.use(cors())
app.use(express.json())

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
app.get('/api/health', (req, res) => {
  res.json({ status: 'CharityChain API running' })
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})