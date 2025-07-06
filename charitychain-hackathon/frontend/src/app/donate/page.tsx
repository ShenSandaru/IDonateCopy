'use client'
import { useState } from 'react'

const mockNGOs = [
  {
    id: 1,
    name: "Global Health Initiative",
    description: "Providing healthcare access to underserved communities worldwide",
    category: "Healthcare",
    transparencyScore: 95,
    totalDonations: "2,450,000 ADA",
    image: "/api/placeholder/300/200"
  },
  {
    id: 2,
    name: "Education for All",
    description: "Building schools and providing educational resources in developing countries",
    category: "Education",
    transparencyScore: 92,
    totalDonations: "1,830,000 ADA",
    image: "/api/placeholder/300/200"
  },
  {
    id: 3,
    name: "Clean Water Project",
    description: "Ensuring access to clean water and sanitation facilities",
    category: "Water & Sanitation",
    transparencyScore: 88,
    totalDonations: "1,200,000 ADA",
    image: "/api/placeholder/300/200"
  },
  {
    id: 4,
    name: "Food Security Network",
    description: "Fighting hunger and malnutrition through sustainable food programs",
    category: "Food Security",
    transparencyScore: 91,
    totalDonations: "980,000 ADA",
    image: "/api/placeholder/300/200"
  }
]

export default function DonatePage() {
  const [selectedNGO, setSelectedNGO] = useState(mockNGOs[0])
  const [donationAmount, setDonationAmount] = useState('')
  const [message, setMessage] = useState('')
  const [isAnonymous, setIsAnonymous] = useState(false)

  const handleDonate = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!donationAmount || parseFloat(donationAmount) <= 0) {
      alert('Please enter a valid donation amount')
      return
    }

    // Simulate donation process
    alert(`Donation of ${donationAmount} ADA to ${selectedNGO.name} initiated! This would connect to your Cardano wallet.`)
    
    // Reset form
    setDonationAmount('')
    setMessage('')
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Make a Donation</h1>
          <p className="text-xl text-gray-600">Support verified NGOs and track your impact on the blockchain</p>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* NGO Selection */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Choose an NGO</h2>
            
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
                    <div className="w-16 h-16 bg-gray-200 rounded-lg flex items-center justify-center">
                      <span className="text-2xl">🏥</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{ngo.name}</h3>
                      <p className="text-sm text-gray-600 mt-1">{ngo.description}</p>
                      <div className="flex items-center justify-between mt-2">
                        <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                          {ngo.category}
                        </span>
                        <div className="flex items-center space-x-2">
                          <span className="text-sm font-medium text-green-600">
                            {ngo.transparencyScore}% Transparency
                          </span>
                          <span className="text-sm text-gray-500">
                            {ngo.totalDonations} raised
                          </span>
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
            
            <form onSubmit={handleDonate} className="space-y-6">
              {/* Selected NGO Info */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-semibold text-gray-900 mb-2">Donating to:</h3>
                <p className="text-blue-600 font-medium">{selectedNGO.name}</p>
                <p className="text-sm text-gray-600">{selectedNGO.description}</p>
              </div>

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
                    className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
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

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-6 rounded-lg font-medium hover:bg-blue-700 focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
              >
                Connect Wallet & Donate
              </button>
            </form>

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
