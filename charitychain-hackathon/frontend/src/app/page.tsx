import WalletConnect from '@/components/WalletConnect'
import Link from 'next/link'

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="relative overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <div className="text-center">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="text-green-600">Charity</span>
              <span className="text-red-600">Chain</span>
            </h1>
            <p className="text-2xl md:text-3xl text-gray-700 mb-4 font-medium">
              Supporting Iran Through Transparency
            </p>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
              Help Iranian families and communities through verified organizations. 
              Every donation is tracked on the blockchain for complete transparency.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-12">
              <Link 
                href="/donate"
                className="bg-green-600 hover:bg-green-700 text-white font-bold py-4 px-8 rounded-lg text-lg transition duration-200 shadow-lg"
              >
                🇮🇷 Donate to Iran Now
              </Link>
              <Link 
                href="/track"
                className="bg-white hover:bg-gray-50 text-gray-800 font-bold py-4 px-8 rounded-lg text-lg transition duration-200 shadow-lg border border-gray-300"
              >
                Track My Donations
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Iran-specific Impact Stats */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Our Impact in Iran 🇮🇷
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center p-6 bg-green-50 rounded-lg">
              <div className="text-4xl font-bold text-green-600 mb-2">850,000</div>
              <div className="text-gray-700">ADA Donated</div>
              <div className="text-sm text-gray-500 mt-1">≈ $425,000 USD</div>
            </div>
            <div className="text-center p-6 bg-blue-50 rounded-lg">
              <div className="text-4xl font-bold text-blue-600 mb-2">12,000+</div>
              <div className="text-gray-700">Families Helped</div>
              <div className="text-sm text-gray-500 mt-1">Across 15 provinces</div>
            </div>
            <div className="text-center p-6 bg-purple-50 rounded-lg">
              <div className="text-4xl font-bold text-purple-600 mb-2">45</div>
              <div className="text-gray-700">Active Projects</div>
              <div className="text-sm text-gray-500 mt-1">Healthcare, Education, Food</div>
            </div>
            <div className="text-center p-6 bg-orange-50 rounded-lg">
              <div className="text-4xl font-bold text-orange-600 mb-2">98%</div>
              <div className="text-gray-700">Transparency</div>
              <div className="text-sm text-gray-500 mt-1">Blockchain verified</div>
            </div>
          </div>
        </div>
      </div>

      {/* Iran-focused Features */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why CharityChain for Iran?
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Complete Transparency</h3>
              <p className="text-gray-600">
                Track every Toman of your donation on the Cardano blockchain. 
                See exactly how funds reach Iranian families.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Direct Impact</h3>
              <p className="text-gray-600">
                Bypass intermediaries and send help directly to verified Iranian NGOs 
                working on the ground.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏆</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">NFT Receipts</h3>
              <p className="text-gray-600">
                Receive permanent blockchain proof of your donation with detailed 
                impact reports from Iran.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🏥</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Healthcare Focus</h3>
              <p className="text-gray-600">
                Support medical facilities, equipment, and healthcare workers 
                serving Iranian communities.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">📚</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Education Support</h3>
              <p className="text-gray-600">
                Fund schools, educational materials, and scholarship programs 
                for Iranian students.
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md hover:shadow-lg transition-shadow">
              <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mb-4">
                <span className="text-2xl">🍽️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Food Security</h3>
              <p className="text-gray-600">
                Provide essential food supplies and nutrition programs for 
                vulnerable Iranian families.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Urgent Needs Section */}
      <div className="bg-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              🚨 Urgent Needs in Iran
            </h2>
            <p className="text-xl text-gray-600">
              These areas need immediate support
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-red-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🏥 Medical Supplies
              </h3>
              <p className="text-gray-600 mb-4">
                Critical shortage of medical equipment and medicines in rural areas
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Goal: 100,000 ADA</span>
                <span className="text-sm font-medium text-red-600">78% funded</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-red-500 h-2 rounded-full" style={{ width: '78%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-yellow-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                🍽️ Winter Food Program
              </h3>
              <p className="text-gray-600 mb-4">
                Emergency food packages for families affected by recent economic challenges
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Goal: 75,000 ADA</span>
                <span className="text-sm font-medium text-yellow-600">45% funded</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-yellow-500 h-2 rounded-full" style={{ width: '45%' }}></div>
              </div>
            </div>

            <div className="bg-white p-6 rounded-lg shadow-md border-l-4 border-blue-500">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                📚 School Reconstruction
              </h3>
              <p className="text-gray-600 mb-4">
                Rebuilding schools damaged by recent natural disasters
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500">Goal: 150,000 ADA</span>
                <span className="text-sm font-medium text-blue-600">32% funded</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2 mt-2">
                <div className="bg-blue-500 h-2 rounded-full" style={{ width: '32%' }}></div>
              </div>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link 
              href="/donate"
              className="bg-red-600 hover:bg-red-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition duration-200 shadow-lg"
            >
              Help Now - Every ADA Counts
            </Link>
          </div>
        </div>
      </div>

      {/* Wallet Connection */}
      <div className="bg-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <WalletConnect />
        </div>
      </div>

      {/* Recent Updates */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center mb-12">
            Latest Updates from Iran 📰
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">January 24, 2024</div>
              <h3 className="text-lg font-semibold mb-3">
                New Medical Clinic Opens in Kurdistan Province
              </h3>
              <p className="text-gray-300 text-sm">
                Thanks to community donations, a new healthcare facility now serves 
                5,000+ residents in remote areas.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">January 22, 2024</div>
              <h3 className="text-lg font-semibold mb-3">
                1,200 Students Receive Winter Supplies
              </h3>
              <p className="text-gray-300 text-sm">
                Educational materials and warm clothing distributed to schools 
                across three provinces.
              </p>
            </div>
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-sm text-gray-400 mb-2">January 20, 2024</div>
              <h3 className="text-lg font-semibold mb-3">
                Clean Water Project Completed
              </h3>
              <p className="text-gray-300 text-sm">
                New water purification system now provides safe drinking water 
                to 800 families in rural Fars.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
