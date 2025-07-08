'use client'

export default function TestnetGuide() {
  return (
    <div className="bg-gradient-to-br from-yellow-50 to-orange-50 border-2 border-yellow-200 rounded-lg p-6 mb-8">
      <div className="flex items-start">
        <span className="text-3xl mr-4">🧪</span>
        <div className="flex-1">
          <h3 className="text-xl font-bold text-yellow-800 mb-3">
            Testing with Preprod Testnet
          </h3>
          <p className="text-yellow-700 mb-4">
            CharityChain is configured for safe testing on Cardano's Preprod testnet. 
            Follow these steps to get started with test donations:
          </p>
          
          <div className="space-y-3">
            <div className="flex items-start">
              <span className="bg-yellow-200 text-yellow-800 text-sm font-medium px-2 py-1 rounded mr-3 mt-0.5">1</span>
              <div>
                <p className="font-medium text-yellow-800">Switch to Preprod Network</p>
                <p className="text-sm text-yellow-600">
                  In your Lace wallet, go to Settings → Network → Select "Preprod"
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="bg-yellow-200 text-yellow-800 text-sm font-medium px-2 py-1 rounded mr-3 mt-0.5">2</span>
              <div>
                <p className="font-medium text-yellow-800">Get Test ADA</p>
                <p className="text-sm text-yellow-600">
                  Visit{' '}
                  <a 
                    href="https://testnets.cardano.org/en/testnets/cardano/tools/faucet/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="underline hover:text-yellow-800"
                  >
                    Cardano Testnet Faucet
                  </a>
                  {' '}to get 1000 test ADA
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="bg-yellow-200 text-yellow-800 text-sm font-medium px-2 py-1 rounded mr-3 mt-0.5">3</span>
              <div>
                <p className="font-medium text-yellow-800">Connect Your Wallet</p>
                <p className="text-sm text-yellow-600">
                  Use the wallet connection buttons above to connect your Lace wallet
                </p>
              </div>
            </div>
            
            <div className="flex items-start">
              <span className="bg-yellow-200 text-yellow-800 text-sm font-medium px-2 py-1 rounded mr-3 mt-0.5">4</span>
              <div>
                <p className="font-medium text-yellow-800">Test Donations</p>
                <p className="text-sm text-yellow-600">
                  Make test donations to Iranian NGOs using test ADA - no real money involved!
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-4 p-3 bg-yellow-100 rounded-lg">
            <p className="text-sm text-yellow-800">
              <strong>💡 Tip:</strong> All transactions are on testnet - you're using fake ADA 
              to test the donation flow safely before using real funds.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
