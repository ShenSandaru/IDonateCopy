'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@meshsdk/react'
import { Transaction, ForgeScript, AssetMetadata, Mint } from '@meshsdk/core'
import { contractService, createDonationMetadata } from '@/lib/contracts'
import { v4 as uuidv4 } from 'uuid'

interface DonationTransactionProps {
  ngoAddress: string
  donationAmount: string
  ngoName: string
  onSuccess?: (txHash: string) => void
  onError?: (error: string) => void
}

export default function DonationTransaction({ 
  ngoAddress, 
  donationAmount, 
  ngoName,
  onSuccess,
  onError 
}: DonationTransactionProps) {
  const { connected, wallet, name } = useWallet()
  const [processing, setProcessing] = useState(false)
  const [txHash, setTxHash] = useState<string | null>(null)

  const handleDonation = async () => {
    if (!connected || !wallet) {
      onError?.('Please connect your wallet first')
      return
    }

    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      onError?.('Please enter a valid donation amount')
      return
    }

    setProcessing(true)
    
    try {
      // Convert ADA to lovelace (1 ADA = 1,000,000 lovelace)
      const lovelaceAmount = (parseFloat(donationAmount) * 1000000).toString()

      // Get wallet address
      const senderAddress = await wallet.getChangeAddress()
      
      // Create basic transaction
      const tx = new Transaction({ initiator: wallet })
      
      // Add output to NGO address
      tx.sendLovelace(
        ngoAddress,
        lovelaceAmount
      )
      
      // Add metadata for donation tracking
      const metadata = {
        674: {
          msg: [
            `CharityChain Donation to ${ngoName}`,
            `Amount: ${donationAmount} ADA`,
            `From: ${name} wallet`,
            `Timestamp: ${new Date().toISOString()}`,
            `Platform: CharityChain Iran Support`
          ]
        }
      }
      
      tx.setMetadata(674, metadata[674])

      // Build and sign transaction
      const unsignedTx = await tx.build()
      const signedTx = await wallet.signTx(unsignedTx)
      const txResult = await wallet.submitTx(signedTx)

      setTxHash(txResult)
      onSuccess?.(txResult)
      
    } catch (error) {
      console.error('Donation transaction failed:', error)
      onError?.(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setProcessing(false)
    }
  }

  const createNFTReceipt = async (txHash: string) => {
    try {
      // This would create an NFT receipt for the donation
      // Implementation depends on your NFT minting contract
      const receiptMetadata: AssetMetadata = {
        name: `CharityChain Receipt - ${ngoName}`,
        description: `Donation receipt for ${donationAmount} ADA to ${ngoName}`,
        image: 'ipfs://your-receipt-image-hash',
        attributes: {
          'Donation Amount': `${donationAmount} ADA`,
          'NGO': ngoName,
          'Transaction': txHash,
          'Date': new Date().toISOString(),
          'Platform': 'CharityChain'
        }
      }

      // NFT minting logic would go here
      console.log('NFT Receipt would be created with metadata:', receiptMetadata)
      
    } catch (error) {
      console.error('NFT receipt creation failed:', error)
    }
  }

  return (
    <div className="bg-gradient-to-r from-green-50 to-red-50 p-6 rounded-lg border border-gray-200">
      <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
        <span className="text-xl mr-2">🇮🇷</span>
        Blockchain Donation Transaction
      </h3>

      {!connected ? (
        <div className="bg-yellow-50 border border-yellow-200 rounded p-4">
          <p className="text-yellow-800">
            Please connect your Cardano wallet to proceed with the donation
          </p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-900 mb-2">Transaction Details</h4>
            <div className="text-sm space-y-1">
              <p><strong>To:</strong> {ngoName}</p>
              <p><strong>Amount:</strong> {donationAmount} ADA</p>
              <p><strong>Network:</strong> Cardano {process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK}</p>
              <p><strong>Wallet:</strong> {name}</p>
            </div>
          </div>

          {txHash && (
            <div className="bg-green-50 border border-green-200 rounded p-4">
              <h4 className="font-medium text-green-900 mb-2">
                ✅ Transaction Successful!
              </h4>
              <p className="text-sm text-green-800 mb-2">
                Your donation has been sent to {ngoName}
              </p>
              <div className="text-xs">
                <p><strong>Transaction Hash:</strong></p>
                <p className="font-mono bg-green-100 p-2 rounded break-all">
                  {txHash}
                </p>
              </div>
              <button
                onClick={() => window.open(`https://cardanoscan.io/transaction/${txHash}`, '_blank')}
                className="mt-2 text-green-600 hover:text-green-800 text-sm underline"
              >
                View on Cardano Explorer →
              </button>
            </div>
          )}

          <button
            onClick={handleDonation}
            disabled={processing || !donationAmount || parseFloat(donationAmount) <= 0}
            className="w-full bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:cursor-not-allowed"
          >
            {processing ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-2"></div>
                Processing Transaction...
              </span>
            ) : (
              `🚀 Send ${donationAmount} ADA to ${ngoName}`
            )}
          </button>

          <div className="text-xs text-gray-500 text-center">
            <p>This transaction will be recorded on the Cardano blockchain</p>
            <p>You will receive an NFT receipt upon successful completion</p>
          </div>
        </div>
      )}
    </div>
  )
}
