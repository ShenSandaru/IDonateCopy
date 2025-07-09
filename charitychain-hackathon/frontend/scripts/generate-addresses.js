#!/usr/bin/env node

/**
 * Simple contract address generator for CharityChain
 * Generates contract addresses from compiled plutus.json
 */

import fs from 'fs'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

console.log('🚀 Generating CharityChain contract addresses...')

// Load environment
const envPath = path.join(__dirname, '../.env.local')
const env = {}
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8')
  envContent.split('\n').forEach(line => {
    const [key, value] = line.split('=')
    if (key && value) {
      env[key.trim()] = value.trim()
    }
  })
}

const NETWORK = env.NEXT_PUBLIC_BLOCKFROST_NETWORK || 'testnet'
console.log(`📡 Network: ${NETWORK}`)

// Load compiled contracts
const plutusJsonPath = path.join(__dirname, '../../contracts/donation-tracker/plutus.json')
let plutusContracts

try {
  plutusContracts = JSON.parse(fs.readFileSync(plutusJsonPath, 'utf8'))
  console.log('✅ Loaded compiled contracts')
} catch (error) {
  console.error('❌ Failed to load plutus.json:', error.message)
  process.exit(1)
}

// Generate contract addresses
const getScriptAddress = (scriptHash) => {
  const prefix = NETWORK === 'testnet' ? 'addr_test' : 'addr'
  return `${prefix}1w${scriptHash.slice(0, 50)}`
}

const deploymentResults = {
  timestamp: new Date().toISOString(),
  network: NETWORK,
  contracts: {},
  validators: plutusContracts.validators.length
}

// Process each validator
plutusContracts.validators.forEach((validator, index) => {
  console.log(`📋 Processing validator ${index + 1}: ${validator.title}`)
  
  if (validator.title === 'donation.donation.spend') {
    deploymentResults.contracts.donationContract = {
      scriptHash: validator.hash,
      scriptAddress: getScriptAddress(validator.hash),
      compiledCode: validator.compiledCode,
      title: validator.title,
      status: 'ready'
    }
    console.log(`   📍 Donation contract address: ${deploymentResults.contracts.donationContract.scriptAddress}`)
  }
  
  if (validator.title === 'nft_receipt.nft_receipt.mint') {
    deploymentResults.contracts.nftReceiptContract = {
      policyId: validator.hash,
      scriptHash: validator.hash,
      compiledCode: validator.compiledCode,
      title: validator.title,
      status: 'ready'
    }
    console.log(`   🎨 NFT policy ID: ${deploymentResults.contracts.nftReceiptContract.policyId}`)
  }
  
  if (validator.title.includes('ngo_verification')) {
    deploymentResults.contracts.ngoVerificationContract = {
      scriptHash: validator.hash,
      scriptAddress: getScriptAddress(validator.hash),
      compiledCode: validator.compiledCode,
      title: validator.title,
      status: 'ready'
    }
    console.log(`   🏢 NGO verification address: ${deploymentResults.contracts.ngoVerificationContract.scriptAddress}`)
  }
})

// Save deployment results
const outputPath = path.join(__dirname, '../contract-addresses.json')
try {
  fs.writeFileSync(outputPath, JSON.stringify(deploymentResults, null, 2))
  console.log(`\n💾 Contract addresses saved to: ${outputPath}`)
} catch (error) {
  console.error('❌ Failed to save contract addresses:', error.message)
  process.exit(1)
}

// Print summary
console.log('\n📋 DEPLOYMENT SUMMARY')
console.log('========================')

Object.entries(deploymentResults.contracts).forEach(([name, contract]) => {
  console.log(`\n${name}:`)
  if (contract.scriptAddress) {
    console.log(`   Address: ${contract.scriptAddress}`)
  }
  if (contract.policyId) {
    console.log(`   Policy ID: ${contract.policyId}`)
  }
  console.log(`   Hash: ${contract.scriptHash}`)
  console.log(`   Status: ${contract.status}`)
})

console.log('\n🔄 Next Steps:')
console.log('1. Start backend: ./start-backend.sh')
console.log('2. Start frontend: cd frontend && npm run dev')
console.log('3. Test smart contract donations')
console.log('4. Verify on Cardano explorer')

console.log('\n✅ Contract addresses generated successfully!')
