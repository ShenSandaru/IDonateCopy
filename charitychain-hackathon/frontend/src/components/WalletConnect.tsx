'use client'
import { useState } from 'react'

export default function WalletConnect() {
  const [connected, setConnected] = useState(false)
  const [walletInfo, setWalletInfo] = useState<any>(null)

  const connectWallet = async () => {
    try {
      // Placeholder for wallet connection logic
      // This will be replaced with actual Cardano wallet integration
      setConnected(true)
      setWalletInfo({
        address: "addr_test1qz...",
        balance: "100.000000 ADA",
        network: "testnet"
      })
    } catch (error) {
      console.error('Error connecting wallet:', error)
    }
  }

  const disconnectWallet = () => {
    setConnected(false)
    setWalletInfo(null)
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6 text-blue-600">
        CharityChain
      </h1>
      
      <div className="mb-4">
        {!connected ? (
          <button 
            onClick={connectWallet}
            className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            Connect Wallet
          </button>
        ) : (
          <button 
            onClick={disconnectWallet}
            className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 px-4 rounded transition duration-200"
          >
            Disconnect Wallet
          </button>
        )}
      </div>
      
      {connected && walletInfo && (
        <div className="space-y-4">
          <div className="p-4 bg-green-50 rounded border border-green-200">
            <h3 className="font-semibold mb-2 text-green-800">Wallet Connected!</h3>
            <div className="text-sm text-green-700">
              <p><strong>Address:</strong> {walletInfo.address}</p>
              <p><strong>Balance:</strong> {walletInfo.balance}</p>
              <p><strong>Network:</strong> {walletInfo.network}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
