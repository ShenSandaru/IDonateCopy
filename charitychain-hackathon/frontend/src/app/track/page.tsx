'use client'
import { useState } from 'react'

const mockDonations = [
  {
    id: 'DON-2024-001',
    ngo: 'Iranian Healthcare Foundation',
    amount: '50 ADA',
    date: '2024-01-15',
    status: 'Active',
    allocation: {
      aid: 75,
      logistics: 20,
      admin: 5
    },
    spending: [
      { date: '2024-01-16', amount: '30 ADA', purpose: 'Medical supplies for Tehran clinic', category: 'aid' },
      { date: '2024-01-18', amount: '8 ADA', purpose: 'Transportation to rural Fars province', category: 'logistics' },
      { date: '2024-01-20', amount: '5 ADA', purpose: 'Local coordinator salary', category: 'logistics' }
    ],
    remaining: '7 ADA',
    txHash: 'a1b2c3d4e5f6789012345678901234567890123456789012345678901234567890',
    impact: '15 patients treated in Tehran',
    province: 'Tehran'
  },
  {
    id: 'DON-2024-002',
    ngo: 'Education Support Iran',
    amount: '100 ADA',
    date: '2024-01-10',
    status: 'Completed',
    allocation: {
      aid: 80,
      logistics: 15,
      admin: 5
    },
    spending: [
      { date: '2024-01-11', amount: '70 ADA', purpose: 'School construction materials in Isfahan', category: 'aid' },
      { date: '2024-01-12', amount: '10 ADA', purpose: 'Teacher training program', category: 'aid' },
      { date: '2024-01-13', amount: '10 ADA', purpose: 'Material transportation to schools', category: 'logistics' },
      { date: '2024-01-14', amount: '5 ADA', purpose: 'Project management costs', category: 'logistics' },
      { date: '2024-01-15', amount: '5 ADA', purpose: 'Administrative expenses', category: 'admin' }
    ],
    remaining: '0 ADA',
    txHash: 'b2c3d4e5f6789012345678901234567890123456789012345678901234567890a1',
    impact: '35 students received educational materials',
    province: 'Isfahan'
  },
  {
    id: 'DON-2024-003',
    ngo: 'Iran Food Security Network',
    amount: '75 ADA',
    date: '2024-01-12',
    status: 'Active',
    allocation: {
      aid: 82,
      logistics: 13,
      admin: 5
    },
    spending: [
      { date: '2024-01-13', amount: '45 ADA', purpose: 'Emergency food packages for families', category: 'aid' },
      { date: '2024-01-15', amount: '12 ADA', purpose: 'Distribution to remote villages', category: 'logistics' },
      { date: '2024-01-17', amount: '8 ADA', purpose: 'Warehouse and storage costs', category: 'logistics' }
    ],
    remaining: '10 ADA',
    txHash: 'c3d4e5f6789012345678901234567890123456789012345678901234567890a1b2',
    impact: '25 families fed in rural Kurdistan',
    province: 'Kurdistan'
  }
]

export default function TrackPage() {
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedDonation, setSelectedDonation] = useState<any>(null)

  const filteredDonations = mockDonations.filter(donation =>
    donation.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
    donation.ngo.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'aid': return 'bg-green-100 text-green-800'
      case 'logistics': return 'bg-blue-100 text-blue-800'
      case 'admin': return 'bg-orange-100 text-orange-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🇮🇷 Track Your Iran Donations
          </h1>
          <p className="text-xl text-gray-600">
            Monitor how your contributions are helping Iranian families and communities in real-time
          </p>
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md mx-auto">
            <input
              type="text"
              placeholder="Search by donation ID or NGO name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-3 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Donations List */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Donations</h2>
            
            <div className="space-y-4">
              {filteredDonations.map((donation) => (
                <div
                  key={donation.id}
                  className={`border rounded-lg p-4 cursor-pointer transition-all ${
                    selectedDonation?.id === donation.id 
                      ? 'border-blue-500 bg-blue-50' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedDonation(donation)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{donation.id}</h3>
                        <span className={`px-2 py-1 text-xs rounded ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                      <p className="text-sm text-gray-600 mb-1">{donation.ngo}</p>
                      <p className="text-xs text-blue-600 mb-1">📍 {donation.province} Province</p>
                      <p className="text-xs text-green-600 mb-2">✅ {donation.impact}</p>
                      <div className="flex items-center justify-between">
                        <span className="text-lg font-bold text-blue-600">{donation.amount}</span>
                        <span className="text-sm text-gray-500">{donation.date}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredDonations.length === 0 && (
              <div className="text-center py-8">
                <p className="text-gray-500">No donations found matching your search.</p>
              </div>
            )}
          </div>

          {/* Donation Details */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {selectedDonation ? (
              <div>
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Donation Details</h2>
                
                {/* Basic Info */}
                <div className="mb-6">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Donation ID</label>
                      <p className="text-sm text-gray-900">{selectedDonation.id}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Status</label>
                      <span className={`inline-block px-2 py-1 text-xs rounded ${getStatusColor(selectedDonation.status)}`}>
                        {selectedDonation.status}
                      </span>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">NGO</label>
                      <p className="text-sm text-gray-900">{selectedDonation.ngo}</p>
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700">Amount</label>
                      <p className="text-sm text-gray-900 font-semibold">{selectedDonation.amount}</p>
                    </div>
                  </div>
                </div>

                {/* Allocation Breakdown */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Fund Allocation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Aid Delivery</span>
                      <span className="text-sm font-medium">{selectedDonation.allocation.aid}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${selectedDonation.allocation.aid}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Logistics</span>
                      <span className="text-sm font-medium">{selectedDonation.allocation.logistics}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${selectedDonation.allocation.logistics}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <span className="text-sm text-gray-600">Administration</span>
                      <span className="text-sm font-medium">{selectedDonation.allocation.admin}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${selectedDonation.allocation.admin}%` }}
                      ></div>
                    </div>
                  </div>
                </div>

                {/* Spending History */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Spending History</h3>
                  <div className="space-y-3">
                    {selectedDonation.spending.map((spend: any, index: number) => (
                      <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                        <div className="flex-1">
                          <div className="flex items-center space-x-2">
                            <span className={`px-2 py-1 text-xs rounded ${getCategoryColor(spend.category)}`}>
                              {spend.category}
                            </span>
                            <span className="text-sm text-gray-500">{spend.date}</span>
                          </div>
                          <p className="text-sm text-gray-900 mt-1">{spend.purpose}</p>
                        </div>
                        <span className="text-sm font-semibold text-gray-900">{spend.amount}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Remaining Funds */}
                <div className="mb-6 p-4 bg-blue-50 rounded-lg">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-blue-900">Remaining Funds</span>
                    <span className="text-lg font-bold text-blue-900">{selectedDonation.remaining}</span>
                  </div>
                </div>

                {/* Blockchain Info */}
                <div className="border-t pt-4">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Blockchain Verification</h3>
                  <div className="bg-gray-50 p-3 rounded-lg">
                    <label className="block text-sm font-medium text-gray-700 mb-1">Transaction Hash</label>
                    <p className="text-xs text-gray-600 font-mono break-all">{selectedDonation.txHash}</p>
                    <button className="mt-2 text-sm text-blue-600 hover:text-blue-800">
                      View on Cardano Explorer →
                    </button>
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                <p className="text-gray-500">Select a donation to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
