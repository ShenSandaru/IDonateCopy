'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@meshsdk/react'

export default function WalletConnector() {
  const { connected, connect, disconnect, name, connecting, wallet } = useWallet()
  const [error, setError] = useState<string | null>(null)
  const [availableWallets, setAvailableWallets] = useState<string[]>([])

  useEffect(() => {
    // Check for available wallets in the browser
    const checkWallets = () => {
      const wallets = []
      if (typeof window !== 'undefined') {
        if (window.cardano?.eternl) wallets.push('eternl')
        if (window.cardano?.nami) wallets.push('nami')
        if (window.cardano?.flint) wallets.push('flint')
        if (window.cardano?.typhon) wallets.push('typhon')
        if (window.cardano?.lace) wallets.push('lace')
      }
      setAvailableWallets(wallets)
    }

    checkWallets()
  }, [])

  const handleConnect = async () => {
    setError(null)
    
    if (availableWallets.length === 0) {
      setError('No Cardano wallets detected. Please install Eternl, Nami, or another Cardano wallet.')
      return
    }

    try {
      // Try to connect to the first available wallet
      const walletToTry = availableWallets[0]
      console.log(`Attempting to connect to ${walletToTry}...`)
      
      await connect(walletToTry)
      console.log(`✅ Successfully connected to ${walletToTry}`)
      
    } catch (err) {
      console.error('Wallet connection failed:', err)
      setError(`Failed to connect to wallet. Please make sure your wallet is unlocked and try again.`)
    }
  }

  const handleDisconnect = () => {
    try {
      disconnect()
      setError(null)
      console.log('Wallet disconnected')
    } catch (err) {
      console.error('Disconnect failed:', err)
    }
  }

  if (connected) {
    return (
      <div className="flex items-center space-x-2">
        <div className="flex items-center px-3 py-2 bg-green-100 text-green-800 rounded-lg">
          <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
          <span className="text-sm font-medium">{name || 'Connected'}</span>
        </div>
        <button
          onClick={handleDisconnect}
          className="px-3 py-2 text-sm text-gray-600 hover:text-gray-800 underline"
        >
          Disconnect
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <button
        onClick={handleConnect}
        disabled={connecting || availableWallets.length === 0}
        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
          connecting || availableWallets.length === 0
            ? 'bg-gray-400 text-white cursor-not-allowed' 
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        {connecting ? (
          <span className="flex items-center">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
            Connecting...
          </span>
        ) : availableWallets.length === 0 ? (
          '❌ No Wallets Found'
        ) : (
          `🔗 Connect ${availableWallets[0].charAt(0).toUpperCase() + availableWallets[0].slice(1)}`
        )}
      </button>
      
      {availableWallets.length > 0 && (
        <div className="text-xs text-gray-500">
          Detected: {availableWallets.join(', ')}
        </div>
      )}
      
      {error && (
        <div className="text-xs text-red-600 max-w-xs">
          {error}
        </div>
      )}
      
      {availableWallets.length === 0 && (
        <div className="text-xs text-gray-600 max-w-xs">
          Install a Cardano wallet:
          <br />• <a href="https://eternl.io" target="_blank" className="text-blue-600 underline">Eternl</a>
          <br />• <a href="https://namiwallet.io" target="_blank" className="text-blue-600 underline">Nami</a>
        </div>
      )}
    </div>
  )
}
