'use client'
import { useState } from 'react'
import Link from 'next/link'

const mockUserData = {
  totalDonated: '850 ADA',
  totalDonatedUSD: '$425',
  donationCount: 12,
  ngoSupported: 5,
  peopleHelped: 1247,
  carbonFootprint: '2.3 tons CO2 saved',
  recentDonations: [
    {
      id: 'DON-2024-012',
      ngo: 'Iranian Healthcare Foundation',
      amount: '100 ADA',
      date: '2024-01-20',
      status: 'Active',
      impact: 'Medical supplies for 50 families'
    },
    {
      id: 'DON-2024-011',
      ngo: 'Education Support Iran',
      amount: '75 ADA',
      date: '2024-01-18',
      status: 'Active',
      impact: 'School supplies for 30 students'
    },
    {
      id: 'DON-2024-010',
      ngo: 'Iran Food Security Network',
      amount: '125 ADA',
      date: '2024-01-15',
      status: 'Completed',
      impact: 'Emergency food for 25 families'
    }
  ],
  impactMetrics: {
    healthcare: { value: 450, unit: 'patients treated', percentage: 40 },
    education: { value: 320, unit: 'students helped', percentage: 30 },
    food: { value: 280, unit: 'families fed', percentage: 25 },
    other: { value: 197, unit: 'people helped', percentage: 5 }
  },
  achievements: [
    { title: 'First Donation', description: 'Made your first donation to Iran', date: '2023-12-01', icon: '🎉' },
    { title: 'Healthcare Hero', description: 'Donated over 200 ADA to healthcare', date: '2024-01-10', icon: '🏥' },
    { title: 'Education Champion', description: 'Supported 5 different schools', date: '2024-01-15', icon: '📚' },
    { title: 'Transparency Advocate', description: 'Only donated to 95%+ transparent NGOs', date: '2024-01-20', icon: '🔍' }
  ]
}

export default function DashboardPage() {
  const [activeTab, setActiveTab] = useState('overview')

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Active': return 'bg-green-100 text-green-800'
      case 'Completed': return 'bg-blue-100 text-blue-800'
      case 'Pending': return 'bg-yellow-100 text-yellow-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-red-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">
                🇮🇷 Your Iran Support Dashboard
              </h1>
              <p className="text-xl text-gray-600">
                Track your impact and contributions to Iranian communities
              </p>
            </div>
            <div className="flex space-x-4">
              <Link 
                href="/donate"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg transition duration-200"
              >
                Make New Donation
              </Link>
              <Link 
                href="/track"
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-3 px-6 rounded-lg border border-gray-300 transition duration-200"
              >
                Track Donations
              </Link>
            </div>
          </div>
        </div>

        {/* Overview Stats */}
        <div className="grid md:grid-cols-4 gap-6 mb-8">
          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Total Donated</h3>
                <p className="text-3xl font-bold text-green-600">{mockUserData.totalDonated}</p>
                <p className="text-sm text-gray-500">≈ {mockUserData.totalDonatedUSD} USD</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">💰</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-blue-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">People Helped</h3>
                <p className="text-3xl font-bold text-blue-600">{mockUserData.peopleHelped.toLocaleString()}</p>
                <p className="text-sm text-gray-500">Across Iran</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🤝</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-purple-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">NGOs Supported</h3>
                <p className="text-3xl font-bold text-purple-600">{mockUserData.ngoSupported}</p>
                <p className="text-sm text-gray-500">{mockUserData.donationCount} donations</p>
              </div>
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🏢</span>
              </div>
            </div>
          </div>

          <div className="bg-white p-6 rounded-lg shadow-lg border-l-4 border-orange-500">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-gray-900">Environmental Impact</h3>
                <p className="text-2xl font-bold text-orange-600">{mockUserData.carbonFootprint}</p>
                <p className="text-sm text-gray-500">Carbon saved</p>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center">
                <span className="text-2xl">🌱</span>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="mb-8">
          <div className="border-b border-gray-200">
            <nav className="-mb-px flex space-x-8">
              {[
                { id: 'overview', label: 'Overview', icon: '📊' },
                { id: 'donations', label: 'Recent Donations', icon: '💝' },
                { id: 'impact', label: 'Impact Breakdown', icon: '📈' },
                { id: 'achievements', label: 'Achievements', icon: '🏆' }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`py-2 px-1 border-b-2 font-medium text-sm whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-500 text-green-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  {tab.icon} {tab.label}
                </button>
              ))}
            </nav>
          </div>
        </div>

        {/* Tab Content */}
        {activeTab === 'overview' && (
          <div className="grid lg:grid-cols-2 gap-8">
            {/* Recent Activity */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Activity</h2>
              <div className="space-y-4">
                {mockUserData.recentDonations.slice(0, 3).map((donation) => (
                  <div key={donation.id} className="flex items-center space-x-4 p-4 bg-gray-50 rounded-lg">
                    <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                      <span className="text-lg">💝</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{donation.ngo}</h3>
                      <p className="text-sm text-gray-600">{donation.impact}</p>
                      <div className="flex items-center space-x-2 mt-1">
                        <span className="text-sm font-medium text-green-600">{donation.amount}</span>
                        <span className={`text-xs px-2 py-1 rounded ${getStatusColor(donation.status)}`}>
                          {donation.status}
                        </span>
                      </div>
                    </div>
                    <div className="text-sm text-gray-500">
                      {donation.date}
                    </div>
                  </div>
                ))}
              </div>
              <div className="mt-6 text-center">
                <Link href="/track" className="text-green-600 hover:text-green-700 font-medium">
                  View All Donations →
                </Link>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6">Quick Actions</h2>
              <div className="grid grid-cols-2 gap-4">
                <Link href="/donate" className="p-4 bg-green-50 rounded-lg hover:bg-green-100 transition-colors">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">💰</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Donate Now</h3>
                  <p className="text-sm text-gray-600">Make a new donation to Iran</p>
                </Link>

                <Link href="/track" className="p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">📊</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Track Impact</h3>
                  <p className="text-sm text-gray-600">See how your donations are used</p>
                </Link>

                <Link href="/ngos" className="p-4 bg-purple-50 rounded-lg hover:bg-purple-100 transition-colors">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🏢</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Browse NGOs</h3>
                  <p className="text-sm text-gray-600">Find organizations to support</p>
                </Link>

                <div className="p-4 bg-orange-50 rounded-lg">
                  <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-3">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <h3 className="font-semibold text-gray-900">Share Impact</h3>
                  <p className="text-sm text-gray-600">Tell others about your support</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'donations' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Recent Donations</h2>
            <div className="space-y-4">
              {mockUserData.recentDonations.map((donation) => (
                <div key={donation.id} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                        <span className="text-xl">💝</span>
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{donation.ngo}</h3>
                        <p className="text-sm text-gray-600">{donation.impact}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <span className="text-sm text-gray-500">ID: {donation.id}</span>
                          <span className={`text-xs px-2 py-1 rounded ${getStatusColor(donation.status)}`}>
                            {donation.status}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-lg font-bold text-green-600">{donation.amount}</p>
                      <p className="text-sm text-gray-500">{donation.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'impact' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Impact Breakdown</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Your Impact by Category</h3>
                <div className="space-y-4">
                  {Object.entries(mockUserData.impactMetrics).map(([key, metric]) => (
                    <div key={key} className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                          <span className="text-sm">
                            {key === 'healthcare' ? '🏥' : 
                             key === 'education' ? '📚' : 
                             key === 'food' ? '🍽️' : '🤝'}
                          </span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 capitalize">{key}</p>
                          <p className="text-sm text-gray-600">{metric.value} {metric.unit}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-gray-900">{metric.percentage}%</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-gray-900 mb-4">Iran Impact Map</h3>
                <div className="bg-gray-100 rounded-lg p-6 text-center">
                  <span className="text-6xl mb-4 block">🗺️</span>
                  <p className="text-gray-600">Your donations have reached:</p>
                  <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium">Tehran Province</p>
                      <p className="text-gray-600">450 people helped</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium">Fars Province</p>
                      <p className="text-gray-600">320 people helped</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium">Kurdistan</p>
                      <p className="text-gray-600">280 people helped</p>
                    </div>
                    <div className="bg-white p-3 rounded">
                      <p className="font-medium">Khuzestan</p>
                      <p className="text-gray-600">197 people helped</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'achievements' && (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Your Achievements</h2>
            <div className="grid md:grid-cols-2 gap-6">
              {mockUserData.achievements.map((achievement, index) => (
                <div key={index} className="border rounded-lg p-4 hover:bg-gray-50 transition-colors">
                  <div className="flex items-center space-x-4">
                    <div className="w-12 h-12 bg-yellow-100 rounded-full flex items-center justify-center">
                      <span className="text-2xl">{achievement.icon}</span>
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">{achievement.title}</h3>
                      <p className="text-sm text-gray-600 mt-1">{achievement.description}</p>
                      <p className="text-xs text-gray-500 mt-2">Earned on {achievement.date}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
