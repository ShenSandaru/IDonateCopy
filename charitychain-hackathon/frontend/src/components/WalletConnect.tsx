'use client'
import { useState, useEffect } from 'react'
import { useWallet } from '@meshsdk/react'
import { CardanoWallet } from '@meshsdk/react'

export default function WalletConnect() {
  const { connected, wallet, connecting, connect, disconnect, name } = useWallet()
  const [walletInfo, setWalletInfo] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Get wallet information when connected
  useEffect(() => {
    if (connected && wallet) {
      getWalletInfo()
    } else {
      setWalletInfo(null)
    }
  }, [connected, wallet])

  async function getWalletInfo() {
    if (!wallet) return
    
    setLoading(true)
    setError(null)
    try {
      const address = await wallet.getChangeAddress()
      const balance = await wallet.getBalance()
      const assets = await wallet.getAssets()
      const utxos = await wallet.getUtxos()
      
      // Convert balance from lovelace to ADA
      const adaBalance = balance.find(b => b.unit === 'lovelace')
      const adaAmount = adaBalance ? (parseInt(adaBalance.quantity) / 1000000).toFixed(6) : '0'
      
      setWalletInfo({
        address,
        balance: adaAmount,
        rawBalance: balance,
        assets,
        utxos: utxos.length,
        walletName: name
      })
    } catch (error) {
      console.error('Error getting wallet info:', error)
      setError('Failed to load wallet information')
    } finally {
      setLoading(false)
    }
  }

  async function signTransaction(txHex: string) {
    if (!wallet) return null
    
    try {
      const signedTx = await wallet.signTx(txHex)
      return signedTx
    } catch (error) {
      console.error('Transaction signing failed:', error)
      return null
    }
  }

  const truncateAddress = (address: string) => {
    if (!address) return ''
    return `${address.slice(0, 8)}...${address.slice(-8)}`
  }

  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-lg border border-gray-200">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900 mb-2">
          🇮🇷 CharityChain Wallet
        </h2>
        <p className="text-gray-600">
          Connect your Cardano wallet to start donating transparently
        </p>
      </div>
      
      {/* Wallet Connection Component */}
      <div className="mb-6">
        <CardanoWallet />
      </div>

      {/* Connection Status */}
      <div className="mb-6">
        {connecting && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="flex items-center">
              <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600 mr-3"></div>
              <p className="text-blue-800 font-medium">Connecting to wallet...</p>
            </div>
          </div>
        )}
        
        {connected ? (
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-green-600 text-xl mr-3">✅</span>
              <div>
                <p className="text-green-800 font-semibold">
                  Connected to {name}
                </p>
                <p className="text-green-600 text-sm">
                  Ready to make transparent donations to Iran
                </p>
              </div>
            </div>
          </div>
        ) : (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
            <div className="flex items-center">
              <span className="text-gray-400 text-xl mr-3">🔌</span>
              <div>
                <p className="text-gray-700 font-medium">
                  Wallet Not Connected
                </p>
                <p className="text-gray-500 text-sm">
                  Please connect your Cardano wallet to continue
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Error Display */}
      {error && (
        <div className="mb-6 bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center">
            <span className="text-red-600 text-xl mr-3">⚠️</span>
            <p className="text-red-800">{error}</p>
          </div>
        </div>
      )}

      {/* Wallet Information Display */}
      {connected && walletInfo && !loading && (
        <div className="space-y-4">
          {/* Basic Wallet Info */}
          <div className="bg-gradient-to-r from-green-50 to-red-50 border border-gray-200 rounded-lg p-4">
            <h3 className="font-semibold text-gray-900 mb-3 flex items-center">
              <span className="text-xl mr-2">💳</span>
              Wallet Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Address:</span>
                <span className="text-gray-900 font-mono bg-gray-100 px-2 py-1 rounded">
                  {truncateAddress(walletInfo.address)}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">Balance:</span>
                <span className="text-green-600 font-bold">
                  ₳ {walletInfo.balance}
                </span>
              </div>
              <div className="flex justify-between items-center">
                <span className="font-medium text-gray-700">UTXOs:</span>
                <span className="text-blue-600 font-medium">
                  {walletInfo.utxos}
                </span>
              </div>
            </div>
          </div>

          {/* Assets Display */}
          {walletInfo.assets.length > 0 && (
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-900 mb-3 flex items-center">
                <span className="text-xl mr-2">🏆</span>
                Assets ({walletInfo.assets.length})
              </h3>
              <div className="max-h-32 overflow-y-auto space-y-1">
                {walletInfo.assets.slice(0, 5).map((asset: any, index: number) => (
                  <div key={index} className="flex justify-between text-sm">
                    <span className="text-purple-700 truncate">
                      {asset.assetName || 'Unknown Token'}
                    </span>
                    <span className="text-purple-900 font-medium">
                      {asset.quantity}
                    </span>
                  </div>
                ))}
                {walletInfo.assets.length > 5 && (
                  <p className="text-purple-600 text-xs text-center">
                    +{walletInfo.assets.length - 5} more assets
                  </p>
                )}
              </div>
            </div>
          )}

          {/* Iran Donation Info */}
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <h3 className="font-semibold text-yellow-900 mb-2 flex items-center">
              <span className="text-xl mr-2">🇮🇷</span>
              Ready for Iran Donations
            </h3>
            <p className="text-yellow-800 text-sm">
              Your wallet is connected and ready to make transparent donations to verified Iranian NGOs. 
              All transactions will be recorded on the Cardano blockchain.
            </p>
          </div>
        </div>
      )}

      {/* Loading State */}
      {connected && loading && (
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-8">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-blue-800 font-medium">Loading wallet information...</p>
          </div>
        </div>
      )}

      {/* Action Buttons */}
      {connected && (
        <div className="mt-6 flex gap-3">
          <button
            onClick={getWalletInfo}
            disabled={loading}
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg font-medium transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <span className="flex items-center justify-center">
                <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                Loading...
              </span>
            ) : (
              '🔄 Refresh Info'
            )}
          </button>
          
          <button
            onClick={disconnect}
            className="flex-1 bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg font-medium transition-colors"
          >
            🔌 Disconnect
          </button>
        </div>
      )}

      {/* Instructions for Non-Connected State */}
      {!connected && !connecting && (
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h3 className="font-semibold text-blue-900 mb-2">
            💡 Getting Started
          </h3>
          <div className="text-blue-800 text-sm space-y-1">
            <p>• Install a Cardano wallet (Lace, Eternl, or Nami)</p>
            <p>• Ensure your wallet is set to Testnet</p>
            <p>• Get test ADA from the Cardano testnet faucet</p>
            <p>• Click the wallet button above to connect</p>
          </div>
        </div>
      )}
    </div>
  )
}
