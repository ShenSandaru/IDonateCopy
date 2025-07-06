'use client'
import { useState } from 'react'
import Link from 'next/link'

const mockNGOs = [
  {
    id: 1,
    name: "Iranian Healthcare Foundation",
    description: "Providing essential medical care and supplies to Iranian hospitals and clinics across all provinces, focusing on underserved rural communities.",
    category: "Healthcare",
    transparencyScore: 96,
    totalDonations: "2,450,000 ADA",
    activeProjects: 24,
    beneficiaries: "150,000+",
    founded: "2015",
    location: "Tehran, Fars, Kurdistan, Khuzestan",
    website: "https://iranhealth.org",
    verified: true,
    urgency: "High",
    allocation: {
      aid: 78,
      logistics: 18,
      admin: 4
    },
    recentActivity: [
      { date: '2024-01-20', activity: 'Opened new clinic in rural Kerman', amount: '45,000 ADA' },
      { date: '2024-01-18', activity: 'Purchased medical equipment for Tehran hospital', amount: '30,000 ADA' },
      { date: '2024-01-15', activity: 'Medical staff training in Fars province', amount: '15,000 ADA' }
    ]
  },
  {
    id: 2,
    name: "Education Support Iran",
    description: "Building schools and providing educational resources across Iran to ensure every Iranian child has access to quality education and learning materials.",
    category: "Education",
    transparencyScore: 94,
    totalDonations: "1,830,000 ADA",
    activeProjects: 18,
    beneficiaries: "85,000+",
    founded: "2012",
    location: "Isfahan, Shiraz, Mashhad, Tabriz",
    website: "https://iraneducation.org",
    verified: true,
    urgency: "Medium",
    allocation: {
      aid: 82,
      logistics: 13,
      admin: 5
    },
    recentActivity: [
      { date: '2024-01-22', activity: 'Completed school construction in Isfahan', amount: '75,000 ADA' },
      { date: '2024-01-19', activity: 'Distributed textbooks to 500 Iranian students', amount: '12,000 ADA' },
      { date: '2024-01-16', activity: 'Teacher training workshop in Shiraz', amount: '8,000 ADA' }
    ]
  },
  {
    id: 3,
    name: "Iran Food Security Network",
    description: "Fighting hunger and malnutrition in Iran through sustainable food programs and emergency assistance to vulnerable Iranian families.",
    category: "Food Security",
    transparencyScore: 92,
    totalDonations: "1,200,000 ADA",
    activeProjects: 15,
    beneficiaries: "75,000+",
    founded: "2018",
    location: "Rural areas nationwide",
    website: "https://iranfood.org",
    verified: true,
    urgency: "Critical",
    allocation: {
      aid: 80,
      logistics: 15,
      admin: 5
    },
    recentActivity: [
      { date: '2024-01-21', activity: 'Emergency food distribution in Kurdistan', amount: '35,000 ADA' },
      { date: '2024-01-17', activity: 'Nutrition program for children in Sistan', amount: '25,000 ADA' },
      { date: '2024-01-14', activity: 'Agricultural training in rural areas', amount: '18,000 ADA' }
    ]
  },
  {
    id: 4,
    name: "Iranian Women & Children Support",
    description: "Supporting Iranian mothers and children with healthcare, education, and emergency assistance programs throughout Iran.",
    category: "Women & Children",
    transparencyScore: 95,
    totalDonations: "980,000 ADA",
    activeProjects: 12,
    beneficiaries: "60,000+",
    founded: "2020",
    location: "Major cities and rural areas",
    website: "https://iranwomen.org",
    verified: true,
    urgency: "High",
    allocation: {
      aid: 85,
      logistics: 10,
      admin: 5
    },
    recentActivity: [
      { date: '2024-01-23', activity: 'Maternal health program in Tehran', amount: '25,000 ADA' },
      { date: '2024-01-20', activity: 'Childcare support for working mothers', amount: '15,000 ADA' },
      { date: '2024-01-18', activity: 'Educational scholarships for girls', amount: '20,000 ADA' }
    ]
  },
  {
    id: 5,
    name: "Iran Earthquake Relief",
    description: "Emergency response and reconstruction efforts for earthquake-affected Iranian communities, providing immediate aid and long-term rebuilding support.",
    category: "Disaster Relief",
    transparencyScore: 91,
    totalDonations: "1,500,000 ADA",
    activeProjects: 8,
    beneficiaries: "45,000+",
    founded: "2019",
    location: "Kerman, Hormozgan, Fars",
    website: "https://iranrelief.org",
    verified: true,
    urgency: "Critical",
    allocation: {
      aid: 75,
      logistics: 20,
      admin: 5
    },
    recentActivity: [
      { date: '2024-01-24', activity: 'Emergency shelters in Kerman province', amount: '85,000 ADA' },
      { date: '2024-01-21', activity: 'Debris clearance and reconstruction', amount: '45,000 ADA' },
      { date: '2024-01-19', activity: 'Medical aid for earthquake victims', amount: '35,000 ADA' }
    ]
  }
]

const categories = ['All', 'Healthcare', 'Education', 'Food Security', 'Women & Children', 'Disaster Relief']

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

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'Critical': return 'bg-red-100 text-red-800 border-red-200'
      case 'High': return 'bg-orange-100 text-orange-800 border-orange-200'
      case 'Medium': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  return (
    <div className="bg-gradient-to-br from-green-50 via-white to-red-50 min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            🇮🇷 Iranian NGOs & Organizations
          </h1>
          <p className="text-xl text-gray-600">
            Discover and support verified Iranian organizations making a difference
          </p>
        </div>

        {/* Search and Filter */}
        <div className="mb-8 flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative flex-1 max-w-md">
            <input
              type="text"
              placeholder="Search Iranian NGOs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
            />
            <svg className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          
          <div className="flex flex-wrap space-x-2">
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => setSelectedCategory(category)}
                className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors mb-2 ${
                  selectedCategory === category
                    ? 'bg-green-600 text-white'
                    : 'bg-white text-gray-700 hover:bg-gray-50 border border-gray-200'
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
                    selectedNGO?.id === ngo.id ? 'ring-2 ring-green-500' : ''
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
                    <div className="flex flex-col space-y-1">
                      <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                        {ngo.category}
                      </span>
                      <span className={`text-xs px-2 py-1 rounded border ${getUrgencyColor(ngo.urgency)}`}>
                        {ngo.urgency}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-600 text-sm mb-3">{ngo.description}</p>
                  <p className="text-xs text-blue-600 mb-4">📍 {ngo.location}</p>
                  
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
                      <span className="text-gray-500">People Helped</span>
                      <span className="font-semibold text-purple-600">{ngo.beneficiaries}</span>
                    </div>
                  </div>
                  
                  <div className="flex space-x-2">
                    <Link 
                      href={`/donate?ngo=${ngo.id}`}
                      className="flex-1 bg-green-600 text-white py-2 px-4 rounded-lg text-sm font-medium hover:bg-green-700 transition-colors text-center"
                    >
                      🇮🇷 Donate Now
                    </Link>
                    <button className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 transition-colors">
                      Details
                    </button>
                  </div>
                </div>
              ))}
            </div>
            
            {filteredNGOs.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500">No Iranian NGOs found matching your criteria.</p>
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
                
                <div className="flex items-center space-x-2 mb-4">
                  <span className="text-xs px-2 py-1 bg-blue-100 text-blue-800 rounded">
                    {selectedNGO.category}
                  </span>
                  <span className={`text-xs px-2 py-1 rounded border ${getUrgencyColor(selectedNGO.urgency)}`}>
                    {selectedNGO.urgency} Priority
                  </span>
                </div>
                
                <p className="text-gray-600 mb-4">{selectedNGO.description}</p>
                <p className="text-sm text-blue-600 mb-6">📍 Operating in: {selectedNGO.location}</p>
                
                {/* Key Metrics */}
                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <div className="text-2xl font-bold text-green-600">{selectedNGO.activeProjects}</div>
                    <div className="text-sm text-gray-600">Active Projects</div>
                  </div>
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <div className="text-2xl font-bold text-blue-600">{selectedNGO.beneficiaries}</div>
                    <div className="text-sm text-gray-600">People Helped</div>
                  </div>
                </div>
                
                {/* Organization Info */}
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Founded</span>
                    <span className="text-sm font-medium">{selectedNGO.founded}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Transparency</span>
                    <span className={`text-sm font-medium ${getTransparencyColor(selectedNGO.transparencyScore)}`}>
                      {selectedNGO.transparencyScore}%
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-sm text-gray-500">Total Raised</span>
                    <span className="text-sm font-medium text-green-600">{selectedNGO.totalDonations}</span>
                  </div>
                </div>
                
                {/* Fund Allocation */}
                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">Fund Allocation</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Direct Aid</span>
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
                          <span className="font-medium text-green-600">{activity.amount}</span>
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
                    className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 transition-colors text-center block"
                  >
                    🇮🇷 Support This Organization
                  </Link>
                  <button className="w-full bg-white border border-gray-300 text-gray-700 py-2 px-4 rounded-lg font-medium hover:bg-gray-50 transition-colors">
                    Share with Friends
                  </button>
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                  <span className="text-2xl">🇮🇷</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 mb-2">Select an Organization</h3>
                <p className="text-gray-500">Click on any NGO card to view detailed information about their work in Iran</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
