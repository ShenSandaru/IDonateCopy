'use client'
import { useState } from 'react'
import { useWallet } from '@meshsdk/react'
import DonationTransaction from '@/components/DonationTransaction'
import SmartContractDonation from '@/components/SmartContractDonation'

const mockNGOs = [
  {
    id: 1,
    name: "Iranian Healthcare Foundation",
    description: "Providing essential medical care and supplies to Iranian hospitals and clinics across all provinces",
    category: "Healthcare",
    transparencyScore: 96,
    totalDonations: "485,000 ADA",
    image: "/api/placeholder/300/200",
    location: "Tehran, Fars, Kurdistan, Khuzestan",
    urgency: "High",
    impact: "12,000+ patients treated this month",
    walletAddress: "addr_test1qpw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqqjz6aa7"
  },
  {
    id: 2,
    name: "Education Support Iran",
    description: "Supporting Iranian students with educational materials, scholarships, and school infrastructure",
    category: "Education", 
    transparencyScore: 94,
    totalDonations: "325,000 ADA",
    image: "/api/placeholder/300/200",
    location: "Isfahan, Shiraz, Mashhad, Tabriz",
    urgency: "Medium",
    impact: "8,500+ students supported",
    walletAddress: "addr_test1qzx9hu8j4ah3auytk0mwcaasvskugtaeer265rk9kwvutl3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqs5s6c6"
  },
  {
    id: 3,
    name: "Iran Food Security Network",
    description: "Emergency food assistance and nutrition programs for vulnerable Iranian families",
    category: "Food Security",
    transparencyScore: 92,
    totalDonations: "275,000 ADA",
    image: "/api/placeholder/300/200",
    location: "Rural areas nationwide",
    urgency: "Critical",
    impact: "5,200+ families fed monthly",
    walletAddress: "addr_test1qr0p2z7xzqn6p3t7a5kvw2j5udt3m9qk5x8n4e7r3d3m7s3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqkh7t5g"
  },
  {
    id: 4,
    name: "Iranian Women & Children Support",
    description: "Supporting Iranian mothers and children with healthcare, education, and emergency assistance",
    category: "Women & Children",
    transparencyScore: 95,
    totalDonations: "390,000 ADA",
    image: "/api/placeholder/300/200",
    location: "Major cities and rural areas",
    urgency: "High",
    impact: "3,800+ women and children helped",
    walletAddress: "addr_test1qq8x9hu8j4ah3auytk0mwcaasvskugtaeer265rk9kwvutl3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqj9fks7"
  },
  {
    id: 5,
    name: "Iran Earthquake Relief",
    description: "Emergency response and reconstruction efforts for earthquake-affected Iranian communities",
    category: "Disaster Relief",
    transparencyScore: 91,
    totalDonations: "520,000 ADA",
    image: "/api/placeholder/300/200",
    location: "Kerman, Hormozgan, Fars",
    urgency: "Critical",
    impact: "15,000+ people relocated safely",
    walletAddress: "addr_test1qxw0djgj0x59ngrjvqthn7enhvruxnsavsw5th63la3mjel3tkc974sr23jmlzgq5zda4gtv8k9cy38756r9y3qgmkqmk2ql3"
  }
]

export default function DonatePage() {
  const { connected } = useWallet()
  const [selectedNGO, setSelectedNGO] = useState(mockNGOs[0])
  const [donationAmount, setDonationAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)
  const [txSuccess, setTxSuccess] = useState<string | null>(null)
  const [txError, setTxError] = useState<string | null>(null)

  const handleDonationSuccess = (txHash: string) => {
    setTxSuccess(txHash)
    setTxError(null)
    // Reset form
    setDonationAmount('')
    setMessage('')
  }

  const handleDonationError = (error: string) => {
    setTxError(error)
    setTxSuccess(null)
  }

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🇮🇷 Support Iran Through Verified NGOs
          </h1>
          <p className="text-xl text-gray-600">
            Make a transparent donation to help Iranian families and communities. 
            Every contribution is tracked on the blockchain.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* NGO Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">
              🇮🇷 Choose an Iranian NGO to Support
            </h2>
            <p className="text-gray-600 mb-6">
              All organizations are verified and working directly in Iran to support local communities.
            </p>
            
            <div className="space-y-4">
              {mockNGOs.map((ngo) => (
                <div
                  key={ngo.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedNGO.id === ngo.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedNGO(ngo)}
                >
                  <div className="flex items-start space-x-4">
                    <div className="w-16 h-16 bg-gradient-to-br from-green-100 to-red-100 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">
                        {ngo.category === 'Healthcare' ? '🏥' : 
                         ngo.category === 'Education' ? '📚' : 
                         ngo.category === 'Food Security' ? '🍽️' : 
                         ngo.category === 'Women & Children' ? '👶' : 
                         ngo.category === 'Disaster Relief' ? '🆘' : '🤝'}
                      </span>
                    </div>
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                        <span className={`text-xs px-2 py-1 rounded-full border ${getUrgencyColor(ngo.urgency)}`}>
                          {ngo.urgency} Priority
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{ngo.description}</p>
                      <p className="text-xs text-blue-600 mb-2">📍 {ngo.location}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                            {ngo.category}
                          </span>
                          <span className="text-xs text-green-600 font-medium">
                            ✅ {ngo.transparencyScore}% Transparent
                          </span>
                        </div>
                        <div className="text-right">
                          <div className="text-xs text-gray-500">{ngo.totalDonations} raised</div>
                          <div className="text-xs text-purple-600 font-medium">{ngo.impact}</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Donation Form */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Details</h2>
            
            <div className="space-y-6">
              {/* Selected NGO Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Donating to:</h3>
                <p className="text-blue-600 font-medium">{selectedNGO.name}</p>
                <p className="text-sm text-gray-600">{selectedNGO.description}</p>
                <p className="text-xs text-gray-500 mt-2">📍 {selectedNGO.location}</p>
              </div>

              {/* Transaction Success/Error Messages */}
              {txSuccess && (
                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                  <h4 className="font-semibold text-green-900 mb-2">🎉 Donation Successful!</h4>
                  <p className="text-green-800 text-sm mb-2">
                    Thank you for supporting {selectedNGO.name}! Your donation will help Iranian families.
                  </p>
                  <p className="text-xs text-green-700">Transaction Hash: {txSuccess}</p>
                </div>
              )}

              {txError && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <h4 className="font-semibold text-red-900 mb-2">❌ Transaction Failed</h4>
                  <p className="text-red-800 text-sm">{txError}</p>
                </div>
              )}

              {/* Donation Amount */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Donation Amount (ADA)
                </label>
                <div className="relative">
                  <input
                    type="number"
                    step="0.000001"
                    value={donationAmount}
                    onChange={(e) => setDonationAmount(e.target.value)}
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                    placeholder="Enter amount in ADA"
                    min="1"
                  />
                  <div className="absolute right-3 top-3 text-gray-400">ADA</div>
                </div>
                {donationAmount && (
                  <p className="mt-2 text-sm text-gray-500">
                    ≈ ${(parseFloat(donationAmount) * 0.50).toFixed(2)} USD
                  </p>
                )}
              </div>

              {/* Quick Amount Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[10, 25, 50, 100].map((amount) => (
                    <button
                      key={amount}
                      type="button"
                      onClick={() => setDonationAmount(amount.toString())}
                      className="py-2 px-4 border border-gray-300 rounded-lg text-sm hover:bg-gray-50 focus:ring-2 focus:ring-blue-500"
                    >
                      {amount} ADA
                    </button>
                  ))}
                </div>
              </div>

              {/* Message */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Message (Optional)
                </label>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  rows={3}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-black"
                  placeholder="Leave a message for the NGO..."
                />
              </div>

              {/* Anonymous Donation */}
              <div className="flex items-center">
                <input
                  id="anonymous"
                  type="checkbox"
                  checked={isAnonymous}
                  onChange={(e) => setIsAnonymous(e.target.checked)}
                  className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                />
                <label htmlFor="anonymous" className="ml-2 block text-sm text-gray-700">
                  Make this donation anonymous
                </label>
              </div>

              {/* Fund Allocation Preview */}
              <div className="bg-blue-50 rounded-lg p-4">
                <h4 className="font-semibold text-gray-900 mb-2">Fund Allocation Preview</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Aid Delivery (75%)</span>
                    <span className="font-medium">
                      {donationAmount ? (parseFloat(donationAmount) * 0.75).toFixed(2) : '0'} ADA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Logistics (20%)</span>
                    <span className="font-medium">
                      {donationAmount ? (parseFloat(donationAmount) * 0.20).toFixed(2) : '0'} ADA
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Administration (5%)</span>
                    <span className="font-medium">
                      {donationAmount ? (parseFloat(donationAmount) * 0.05).toFixed(2) : '0'} ADA
                    </span>
                  </div>
                </div>
              </div>

              {/* Smart Contract Donation Component */}
              <div className="mb-6">
                <SmartContractDonation
                  ngoAddress={selectedNGO.walletAddress}
                  donationAmount={donationAmount}
                  ngoName={selectedNGO.name}
                  onSuccess={handleDonationSuccess}
                  onError={handleDonationError}
                />
              </div>
            </div>

            {/* Security Notice */}
            <div className="mt-6 p-4 bg-green-50 rounded-lg">
              <div className="flex items-center">
                <svg className="w-5 h-5 text-green-600 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm text-green-800">
                  <strong>Secure & Transparent:</strong> All donations are recorded on the Cardano blockchain
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
