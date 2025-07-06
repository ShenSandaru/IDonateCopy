import express from 'express'
import cors from 'cors'
import { BlockFrostAPI } from '@blockfrost/blockfrost-js'
const app = express()
const PORT = process.env.PORT || 3001
app.use(cors())
app.use(express.json())
const blockfrost = new BlockFrostAPI({
projectId: process.env.BLOCKFROST_API_KEY!,
network: 'testnet'
})
app.get('/api/health', (req, res) => {
res.json({ status: 'CharityChain API running' })
})
app.listen(PORT, () => {
console.log(`Server running on port ${PORT}`)
})
