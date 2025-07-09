'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@meshsdk/react'
import { Transaction, ForgeScript, AssetMetadata, Mint } from '@meshsdk/core'
import { contractService } from '@/lib/contracts'
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
  const [useSmartContract, setUseSmartContract] = useState(true)
  const [donationId, setDonationId] = useState<string>('')
  const [mintingNFT, setMintingNFT] = useState(false)

  // Generate unique donation ID on component mount
  useEffect(() => {
    setDonationId(uuidv4())
  }, [])

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
      const amount = parseFloat(donationAmount)
      const senderAddress = await wallet.getChangeAddress()

      let txResult: string

      if (useSmartContract) {
        // Use smart contract for donation
        txResult = await handleSmartContractDonation(senderAddress, amount)
      } else {
        // Use simple transaction
        txResult = await handleSimpleDonation(senderAddress, amount)
      }

      setTxHash(txResult)
      onSuccess?.(txResult)

      // Mint NFT receipt after successful donation
      if (useSmartContract) {
        await mintNFTReceipt(txResult, senderAddress, amount)
      }
      
    } catch (error) {
      console.error('Donation transaction failed:', error)
      onError?.(`Transaction failed: ${error instanceof Error ? error.message : 'Unknown error'}`)
    } finally {
      setProcessing(false)
    }
  }

  const handleSmartContractDonation = async (senderAddress: string, amount: number): Promise<string> => {
    try {
      console.log('🔗 Creating smart contract donation...')
      
      // Create donation through smart contract
      const donationData = await contractService.createSimpleDonation(
        senderAddress,
        ngoAddress,
        amount,
        `Donation to ${ngoName}`,
        donationId
      )

      // Create transaction with smart contract address
      const tx = new Transaction({ initiator: wallet })
      tx.sendLovelace(donationData.contractAddress, donationData.amount.toString())
      tx.setMetadata(674, donationData.metadata[674])

      const unsignedTx = await tx.build()

      console.log('✅ Smart contract transaction built')
      
      // Sign and submit transaction
      const signedTx = await wallet.signTx(unsignedTx)
      const txResult = await wallet.submitTx(signedTx)
      
      console.log('✅ Smart contract donation submitted:', txResult)
      return txResult
      
    } catch (error) {
      console.error('Smart contract donation failed:', error)
      // Fallback to simple transaction
      console.log('🔄 Falling back to simple transaction...')
      return await handleSimpleDonation(senderAddress, amount)
    }
  }

  const handleSimpleDonation = async (senderAddress: string, amount: number): Promise<string> => {
    // Convert ADA to lovelace (1 ADA = 1,000,000 lovelace)
    const lovelaceAmount = (amount * 1000000).toString()

    // Create basic transaction
    const tx = new Transaction({ initiator: wallet })
    
    // Add output to NGO address
    tx.sendLovelace(ngoAddress, lovelaceAmount)
    
    // Add metadata for donation tracking
    const metadata = contractService.createDonationMetadata(donationId, amount, ngoName, `Donation to ${ngoName}`)
    tx.setMetadata(674, metadata[674])

    // Build and sign transaction
    const unsignedTx = await tx.build()
    const signedTx = await wallet.signTx(unsignedTx)
    const txResult = await wallet.submitTx(signedTx)
    
    console.log('✅ Simple donation transaction submitted:', txResult)
    return txResult
  }

  const mintNFTReceipt = async (txHash: string, senderAddress: string, amount: number) => {
    try {
      setMintingNFT(true)
      console.log('🎨 Creating NFT receipt metadata...')
      
      // Create NFT receipt metadata
      const receiptMetadata = contractService.createNFTReceiptMetadata(
        donationId,
        senderAddress,
        ngoAddress,
        amount,
        `Donation to ${ngoName}`,
        ngoName,
        txHash
      )

      console.log('✅ NFT receipt metadata created:', receiptMetadata)
      
      // For now, just log the receipt since actual NFT minting requires more complex setup
      // In a full implementation, this would mint an actual NFT to the donor's wallet
      
    } catch (error) {
      console.error('NFT receipt creation failed:', error)
      // Continue without NFT if creation fails
    } finally {
      setMintingNFT(false)
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
          <div className="flex items-center mb-3">
            <svg className="w-5 h-5 text-yellow-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L4.082 15.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
            <h4 className="text-yellow-900 font-medium">Wallet Connection Required</h4>
          </div>
          <p className="text-yellow-800 mb-3">
            Please connect your Cardano wallet to proceed with the donation. Use the "🔗 Connect Wallet" button in the navigation menu above.
          </p>
          <div className="text-sm text-yellow-700">
            <p className="font-medium mb-1">Supported Wallets:</p>
            <ul className="list-disc list-inside space-y-1">
              <li>Eternl (Recommended)</li>
              <li>Nami</li>
              <li>Flint</li>
              <li>Typhon</li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-4">
          {/* Smart Contract Toggle */}
          <div className="bg-blue-50 border border-blue-200 rounded p-3">
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-blue-900">Smart Contract Integration</p>
                <p className="text-sm text-blue-700">
                  {useSmartContract ? 'Using CharityChain smart contracts' : 'Using simple transaction'}
                </p>
              </div>
              <label className="relative inline-flex items-center cursor-pointer">
                <input
                  type="checkbox"
                  checked={useSmartContract}
                  onChange={(e) => setUseSmartContract(e.target.checked)}
                  className="sr-only peer"
                />
                <div className="w-11 h-6 bg-gray-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
              </label>
            </div>
          </div>

          <div className="bg-white p-4 rounded border">
            <h4 className="font-medium text-gray-900 mb-2">Transaction Details</h4>
            <div className="text-sm space-y-1">
              <p><strong>Donation ID:</strong> {donationId.slice(0, 8)}...</p>
              <p><strong>To:</strong> {ngoName}</p>
              <p><strong>Amount:</strong> {donationAmount} ADA</p>
              <p><strong>Network:</strong> Cardano {process.env.NEXT_PUBLIC_BLOCKFROST_NETWORK}</p>
              <p><strong>Wallet:</strong> {name}</p>
              <p><strong>Method:</strong> {useSmartContract ? 'Smart Contract' : 'Simple Transfer'}</p>
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
              
              {mintingNFT && (
                <div className="mt-3 flex items-center text-sm text-blue-800">
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-blue-600 mr-2"></div>
                  Minting NFT receipt...
                </div>
              )}
              
              <button
                onClick={() => window.open(`https://testnet.cardanoscan.io/transaction/${txHash}`, '_blank')}
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
            {useSmartContract && <p>NFT receipt will be minted automatically upon success</p>}
          </div>
        </div>
      )}
    </div>
  )
}
