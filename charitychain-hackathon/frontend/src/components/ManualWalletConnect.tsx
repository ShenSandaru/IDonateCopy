'use client'

import { useState, useEffect } from 'react'

interface WalletInfo {
  name: string
  icon: string
  key: string
  isInstalled: boolean
  isEnabled: boolean
}

export default function ManualWalletConnect() {
  const [wallets, setWallets] = useState<WalletInfo[]>([])
  const [selectedWallet, setSelectedWallet] = useState<any>(null)
  const [walletApi, setWalletApi] = useState<any>(null)
  const [address, setAddress] = useState<string>('')
  const [balance, setBalance] = useState<string>('')
  const [error, setError] = useState<string>('')
  const [loading, setLoading] = useState(false)

  // Known Cardano wallets
  const knownWallets: Omit<WalletInfo, 'isInstalled' | 'isEnabled'>[] = [
    { name: 'Lace', icon: '🏷️', key: 'lace' },
    { name: 'Eternl', icon: '♾️', key: 'eternl' },
    { name: 'Nami', icon: '🌊', key: 'nami' },
    { name: 'Flint', icon: '🔥', key: 'flint' },
    { name: 'Typhon', icon: '🌪️', key: 'typhoncip30' },
    { name: 'Gero', icon: '🦸', key: 'gerowallet' },
    { name: 'CCVault', icon: '🔐', key: 'ccvault' }
  ]

  useEffect(() => {
    checkInstalledWallets()
  }, [])

  const checkInstalledWallets = () => {
    if (typeof window === 'undefined') return

    const detectedWallets = knownWallets.map(wallet => {
      const isInstalled = !!(window as any)?.cardano?.[wallet.key]
      let isEnabled = false
      
      try {
        if (isInstalled) {
          const cardanoApi = (window as any)?.cardano?.[wallet.key]
          isEnabled = cardanoApi?.isEnabled?.() || false
        }
      } catch (error) {
        console.log(`Error checking ${wallet.name} status:`, error)
      }
      
      return {
        ...wallet,
        isInstalled,
        isEnabled
      }
    })

    setWallets(detectedWallets)
    console.log('Detected wallets:', detectedWallets)
  }

  const connectWallet = async (wallet: WalletInfo) => {
    if (!wallet.isInstalled) {
      setError(`${wallet.name} wallet is not installed`)
      return
    }

    setLoading(true)
    setError('')

    try {
      console.log(`Attempting to connect to ${wallet.name}...`)
      
      const cardanoApi = (window as any)?.cardano?.[wallet.key]
      if (!cardanoApi) {
        throw new Error(`${wallet.name} API not found`)
      }

      // Request wallet connection
      const api = await cardanoApi.enable()
      console.log(`Connected to ${wallet.name}:`, api)

      setWalletApi(api)
      setSelectedWallet(wallet)

      // Get wallet information
      await getWalletInfo(api)

    } catch (error: any) {
      console.error(`Error connecting to ${wallet.name}:`, error)
      setError(`Failed to connect to ${wallet.name}: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getWalletInfo = async (api: any) => {
    try {
      // Get wallet address - try different methods
      let walletAddress = ''
      try {
        const addresses = await api.getUsedAddresses()
        walletAddress = addresses[0] || ''
      } catch (e) {
        try {
          walletAddress = await api.getChangeAddress()
        } catch (e2) {
          try {
            const rewardAddresses = await api.getRewardAddresses()
            walletAddress = rewardAddresses[0] || ''
          } catch (e3) {
            console.log('Could not get wallet address')
          }
        }
      }
      
      setAddress(walletAddress)

      // Get wallet balance - handle different response formats
      try {
        const balanceValue = await api.getBalance()
        console.log('Raw balance:', balanceValue)
        
        if (typeof balanceValue === 'string') {
          // Handle hex or string format
          let lovelace = 0
          if (balanceValue.startsWith('0x')) {
            lovelace = parseInt(balanceValue, 16)
          } else {
            lovelace = parseInt(balanceValue, 10)
          }
          const ada = (lovelace / 1000000).toFixed(6)
          setBalance(`${ada} ADA`)
        } else if (Array.isArray(balanceValue)) {
          // Handle array format from some wallets
          const adaBalance = balanceValue.find(b => b.unit === 'lovelace' || !b.unit)
          if (adaBalance) {
            const ada = (parseInt(adaBalance.quantity) / 1000000).toFixed(6)
            setBalance(`${ada} ADA`)
          } else {
            setBalance('0 ADA')
          }
        } else if (typeof balanceValue === 'object' && balanceValue.lovelace) {
          // Handle object format
          const ada = (parseInt(balanceValue.lovelace) / 1000000).toFixed(6)
          setBalance(`${ada} ADA`)
        } else {
          setBalance('Unknown balance format')
        }
      } catch (balanceError) {
        console.log('Could not get balance:', balanceError)
        setBalance('Balance unavailable')
      }

    } catch (error) {
      console.error('Error getting wallet info:', error)
      setError('Failed to get wallet information')
    }
  }

  const disconnectWallet = () => {
    setWalletApi(null)
    setSelectedWallet(null)
    setAddress('')
    setBalance('')
    setError('')
  }

  const truncateAddress = (addr: string) => {
    if (!addr) return ''
    return `${addr.slice(0, 8)}...${addr.slice(-8)}`
  }

  return (
    <div className="bg-white border border-gray-200 rounded-lg p-6">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">
        🔗 Manual Wallet Connection
      </h3>

      {error && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-3 mb-4">
          <p className="text-red-800 text-sm">{error}</p>
        </div>
      )}

      {selectedWallet && walletApi ? (
        // Connected state
        <div className="space-y-4">
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <span className="text-2xl mr-3">{selectedWallet.icon}</span>
                <div>
                  <p className="font-semibold text-green-800">
                    Connected to {selectedWallet.name}
                  </p>
                  <p className="text-sm text-green-600">Ready for donations</p>
                </div>
              </div>
              <button
                onClick={disconnectWallet}
                className="text-red-600 hover:text-red-800 text-sm font-medium"
              >
                Disconnect
              </button>
            </div>
          </div>

          {address && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Wallet Address:</p>
              <p className="font-mono text-sm text-gray-800">
                {truncateAddress(address)}
              </p>
            </div>
          )}

          {balance && (
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="text-sm text-gray-600 mb-1">Balance:</p>
              <p className="font-semibold text-lg text-gray-800">{balance}</p>
            </div>
          )}
        </div>
      ) : (
        // Wallet selection state
        <div className="space-y-3">
          <p className="text-sm text-gray-600 mb-3">
            Select a wallet to connect:
          </p>
          
          {wallets.filter(w => w.isInstalled).length === 0 ? (
            <div className="text-center py-6">
              <p className="text-gray-500 mb-2">No Cardano wallets detected</p>
              <p className="text-sm text-gray-400">
                Please install a Cardano wallet extension like Lace, Eternl, or Nami
              </p>
            </div>
          ) : (
            wallets.map((wallet) => (
              <button
                key={wallet.key}
                onClick={() => connectWallet(wallet)}
                disabled={!wallet.isInstalled || loading}
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  wallet.isInstalled
                    ? 'border-gray-200 hover:border-blue-300 hover:bg-blue-50 cursor-pointer'
                    : 'border-gray-100 bg-gray-50 cursor-not-allowed opacity-60'
                }`}
              >
                <div className="flex items-center">
                  <span className="text-2xl mr-3">{wallet.icon}</span>
                  <div className="text-left">
                    <p className="font-medium text-gray-900">{wallet.name}</p>
                    <p className="text-sm text-gray-500">
                      {wallet.isInstalled ? 'Installed' : 'Not installed'}
                    </p>
                  </div>
                </div>
                {loading && (
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-blue-600"></div>
                )}
              </button>
            ))
          )}
        </div>
      )}
    </div>
  )
}
