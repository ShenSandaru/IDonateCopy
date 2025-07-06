'use client'
import { useState } from 'react'
import Link from 'next/link'

const mockNGOs = [
  {
    id: 1,
    name: "Global Health Initiative",
    description: "Providing healthcare access to underserved communities worldwide through mobile clinics and telemedicine programs.",
    category: "Healthcare",
    transparencyScore: 95,
    totalDonations: "2,450,000 ADA",
    activeProjects: 24,
    beneficiaries: "150,000+",
    founded: "2015",
    location: "Multiple Countries",
    website: "https://globalhealthinitiative.org",
    verified: true,
    allocation: {
      aid: 78,
      logistics: 18,
      admin: 4
    },
    recentActivity: [
      { date: '2024-01-20', activity: 'Opened new clinic in rural Kenya', amount: '45,000 ADA' },
      { date: '2024-01-18', activity: 'Purchased medical equipment', amount: '30,000 ADA' },
      { date: '2024-01-15', activity: 'Staff training program completed', amount: '15,000 ADA' }
    ]
  },
  {
    id: 2,
    name: "Education for All",
    description: "Building schools and providing educational resources in developing countries to ensure every child has access to quality education.",
    category: "Education",
    transparencyScore: 92,
    totalDonations: "1,830,000 ADA",
    activeProjects: 18,
    beneficiaries: "85,000+",
    founded: "2012",
    location: "Sub-Saharan Africa",
    website: "https://educationforall.org",
    verified: true,
    allocation: {
      aid: 82,
      logistics: 13,
      admin: 5
    },
    recentActivity: [
      { date: '2024-01-22', activity: 'Completed school construction in Ghana', amount: '75,000 ADA' },
      { date: '2024-01-19', activity: 'Distributed textbooks to 500 students', amount: '12,000 ADA' },
      { date: '2024-01-16', activity: 'Teacher training workshop', amount: '8,000 ADA' }
    ]
  },
  {
    id: 3,
    name: "Clean Water Project",
    description: "Ensuring access to clean water and sanitation facilities in remote communities through sustainable water systems.",
    category: "Water & Sanitation",
    transparencyScore: 88,
    totalDonations: "1,200,000 ADA",
    activeProjects: 15,
    beneficiaries: "75,000+",
    founded: "2018",
    location: "South Asia",
    website: "https://cleanwaterproject.org",
    verified: true,
    allocation: {
      aid: 75,
      logistics: 20,
      admin: 5
    },
    recentActivity: [
      { date: '2024-01-21', activity: 'Installed water purification system', amount: '35,000 ADA' },
      { date: '2024-01-17', activity: 'Community hygiene training', amount: '5,000 ADA' },
      { date: '2024-01-14', activity: 'Well maintenance in 3 villages', amount: '18,000 ADA' }
    ]
  },
  {
    id: 4,
    name: "Food Security Network",
    description: "Fighting hunger and malnutrition through sustainable food programs and agricultural training initiatives.",
    category: "Food Security",
    transparencyScore: 91,
    totalDonations: "980,000 ADA",
    activeProjects: 12,
    beneficiaries: "60,000+",
    founded: "2020",
    location: "Central America",
    website: "https://foodsecurity.org",
    verified: true,
    allocation: {
      aid: 80,
      logistics: 15,
      admin: 5
    },
    recentActivity: [
      { date: '2024-01-23', activity: 'Distributed food packages to 200 families', amount: '25,000 ADA' },
      { date: '2024-01-20', activity: 'Agricultural training program', amount: '15,000 ADA' },
      { date: '2024-01-18', activity: 'Seeds and tools distribution', amount: '20,000 ADA' }
    ]
  },
  {
    id: 5,
    name: "Disaster Relief Alliance",
    description: "Rapid response to natural disasters and humanitarian crises, providing emergency aid and recovery support.",
    category: "Disaster Relief",
    transparencyScore: 89,
    totalDonations: "1,750,000 ADA",
    activeProjects: 8,
    beneficiaries: "200,000+",
    founded: "2010",
    location: "Global",
    website: "https://disasterrelief.org",
    verified: true,
    allocation: {
      aid: 85,
      logistics: 12,
      admin: 3
    },
    recentActivity: [
      { date: '2024-01-24', activity: 'Emergency shelter setup after earthquake', amount: '120,000 ADA' },
      { date: '2024-01-22', activity: 'Medical supplies delivery', amount: '45,000 ADA' },
      { date: '2024-01-19', activity: 'Evacuation support operations', amount: '35,000 ADA' }
    ]
  }
]

const categories = ['All', 'Healthcare', 'Education', 'Water & Sanitation', 'Food Security', 'Disaster Relief']

export default function NGOsPage() {
  const [selectedCategory, setSelectedCategory] = useState('All')
  const [selectedNGO, setSelectedNGO] = useState<any>(null)
  const [searchTerm, setSearchTerm] = useState('')

  const filteredNGOs = mockNGOs.filter(ngo => {
    const matchesCategory = selectedCategory === 'All' || ngo.category === selectedCategory
    const matchesSearch = ngo.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         ngo.description.toLowerCase().includes(searchTerm.toLowerCase())
    return matchesCategory && matchesSearch
  })

  const getTransparencyColor = (score: number) => {
    if (score >= 90) return 'text-green-600'
    if (score >= 80) return 'text-yellow-600'
    return 'text-red-600'
  }

  return (
    <div className="bg-gray-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">Verified NGOs</h1>
          <p className="text-xl text-gray-600">Discover and support transparent charitable organizations</p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search NGOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                  selectedCategory === category
                    ? 'bg-blue-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50'
                }`}
              >
                {category}
              </button>
            ))}
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* NGO Cards */}
          <div className="lg:col-span-2">
            <div className="grid md:grid-cols-2 gap-6">
              {filteredNGOs.map((ngo) => (
                <div
                  key={ngo.id}
                  className={`bg-white rounded-lg shadow-lg p-6 cursor-pointer transition-all hover:shadow-xl ${
                    selectedNGO?.id === ngo.id ? 'ring-2 ring-blue-500' : ''
                  }`}
                  onClick={() => setSelectedNGO(ngo)}
                >
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex items-center space-x-2">
                      <h3 className="text-xl font-bold text-gray-900">{ngo.name}</h3>
                      {ngo.verified && (
                        <svg className="w-5 h-5 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      )}
                    </div>
                    <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                      {ngo.category}
                    </span>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-4 line-clamp-3">{ngo.description}</p>
                  
                  <div className="space-y-2 mb-4">
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Transparency Score</span>
                      <span className={`font-semibold ${getTransparencyColor(ngo.transparencyScore)}`}>
                        {ngo.transparencyScore}%
                      </span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Total Donations</span>
                      <span className="font-semibold text-gray-900">{ngo.totalDonations}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-gray-500">Active Projects</span>
                      <span className="font-semibold text-gray-900">{ngo.activeProjects}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/donate?ngo=${ngo.id}`}
                      className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-blue-700 transition-colors text-center"
                    >
                      Donate Now
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      View Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredNGOs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No NGOs found matching your criteria.</p>
              </div>
            )}
          </div>

          {/* NGO Details Sidebar */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            {selectedNGO ? (
              <div>
                <div className="flex items-center space-x-2 mb-4">
                  <h2 className="text-2xl font-bold text-gray-900">{selectedNGO.name}</h2>
                  {selectedNGO.verified && (
                    <svg className="w-6 h-6 text-green-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  )}
                </div>
                
                <p className="text-gray-600 mb-6">{selectedNGO.description}</p>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedNGO.activeProjects}</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedNGO.beneficiaries}</div>
                    <div className="text-sm text-gray-600">Beneficiaries</div>
                  </div>
                </div>
                
                {/* Organization Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Founded</span>
                    <span className="text-sm font-medium">{selectedNGO.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Location</span>
                    <span className="text-sm font-medium">{selectedNGO.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transparency</span>
                    <span className={`text-sm font-medium ${getTransparencyColor(selectedNGO.transparencyScore)}`}>
                      {selectedNGO.transparencyScore}%
                    </span>
                  </div>
                </div>
                
                {/* Fund Allocation */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Fund Allocation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Aid Delivery</span>
                      <span className="font-medium">{selectedNGO.allocation.aid}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-green-500 h-2 rounded-full" 
                        style={{ width: `${selectedNGO.allocation.aid}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Logistics</span>
                      <span className="font-medium">{selectedNGO.allocation.logistics}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-blue-500 h-2 rounded-full" 
                        style={{ width: `${selectedNGO.allocation.logistics}%` }}
                      ></div>
                    </div>
                    
                    <div className="flex justify-between text-sm">
                      <span>Administration</span>
                      <span className="font-medium">{selectedNGO.allocation.admin}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div 
                        className="bg-orange-500 h-2 rounded-full" 
                        style={{ width: `${selectedNGO.allocation.admin}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
                
                {/* Recent Activity */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Recent Activity</h3>
                  <div className="space-y-2">
                    {selectedNGO.recentActivity.map((activity: any, index: number) => (
                      <div key={index} className="text-sm p-2 bg-gray-50 rounded">
                        <div className="flex justify-between items-start">
                          <span className="text-gray-600">{activity.date}</span>
                          <span className="font-medium text-blue-600">{activity.amount}</span>
                        </div>
                        <p className="text-gray-900 mt-1">{activity.activity}</p>
                      </div>
                    ))}
                  </div>
                </div>
                
                {/* Action Buttons */}
                <div className="space-y-3">
                  <Link 
                    href={`/donate?ngo=${selectedNGO.id}`}
                    className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-blue-700 transition-colors text-center block"
                  >
                    Donate to {selectedNGO.name}
                  </Link>
                  <a 
                    href={selectedNGO.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-full border border-gray-300 py-3 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors text-center block"
                  >
                    Visit Website
                  </a>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <svg className="mx-auto h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
                </svg>
                <p className="text-gray-500">Select an NGO to view details</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
