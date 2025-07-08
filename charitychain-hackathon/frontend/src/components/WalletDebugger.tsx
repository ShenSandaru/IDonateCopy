'use client'

import { useState, useEffect } from 'react'

export default function WalletDebugger() {
  const [walletList, setWalletList] = useState<any[]>([])
  const [windowCardano, setWindowCardano] = useState<any>(null)

  useEffect(() => {
    // Check available wallets
    const checkWallets = async () => {
      try {
        if (typeof window !== 'undefined' && window.cardano) {
          setWindowCardano(window.cardano)
          const availableWallets = Object.keys(window.cardano).map(key => ({
            key,
            name: key,
            hasEnable: typeof window.cardano[key]?.enable === 'function',
            hasIsEnabled: typeof window.cardano[key]?.isEnabled === 'function',
            apiVersion: window.cardano[key]?.apiVersion || 'unknown'
          }))
          setWalletList(availableWallets)
          console.log('Available Cardano wallets:', availableWallets)
        } else {
          console.log('No window.cardano detected')
          setWalletList([])
        }
      } catch (error) {
        console.error('Error checking wallets:', error)
      }
    }

    checkWallets()
    
    // Recheck every 2 seconds in case wallet is installed
    const interval = setInterval(checkWallets, 2000)
    return () => clearInterval(interval)
  }, [])

  return (
    <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
      <h4 className="font-medium text-blue-800 mb-3">🔍 Wallet Detection Status</h4>
      
      <div className="space-y-3 text-sm">
        <div>
          <span className="font-medium text-blue-700">window.cardano: </span>
          <span className={windowCardano ? 'text-green-600' : 'text-red-600'}>
            {windowCardano ? 'Available' : 'Not found'}
          </span>
        </div>

        <div>
          <span className="font-medium text-blue-700">Detected Wallets: </span>
          <span className="text-blue-600">{walletList.length}</span>
        </div>

        {walletList.length > 0 && (
          <div className="bg-white rounded p-2">
            {walletList.map((wallet) => (
              <div key={wallet.key} className="flex justify-between items-center py-1">
                <span className="font-medium">{wallet.name}</span>
                <span className={`text-xs px-2 py-1 rounded ${
                  wallet.hasEnable ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                }`}>
                  {wallet.hasEnable ? 'Ready' : 'No enable()'}
                </span>
              </div>
            ))}
          </div>
        )}

        {walletList.length === 0 && (
          <div className="text-red-600 text-center py-2">
            <p>⚠️ No Cardano wallets detected</p>
            <p className="text-xs mt-1">Install Lace wallet and refresh the page</p>
          </div>
        )}
      </div>
    </div>
  )
}
