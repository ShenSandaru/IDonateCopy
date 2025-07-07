import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-red-600 text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6">
              About CharityChain
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Revolutionizing humanitarian aid for Iran through blockchain transparency 
              and direct impact measurement
            </p>
            <div className="flex justify-center">
              <span className="text-6xl">🇮🇷</span>
            </div>
          </div>
        </div>
      </div>

      {/* Mission Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Mission</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              To provide a transparent, secure, and efficient platform for supporting 
              Iranian communities through verified humanitarian organizations
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Why Iran Needs CharityChain
              </h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-red-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-red-600 font-bold">1</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Transparency Crisis</h4>
                    <p className="text-gray-600">Many donors are unsure if their contributions reach those in need</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-yellow-600 font-bold">2</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">High Administrative Costs</h4>
                    <p className="text-gray-600">Traditional systems often consume 20-30% of donations in overhead</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-blue-600 font-bold">3</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Slow Distribution</h4>
                    <p className="text-gray-600">Bureaucratic processes delay aid delivery during critical times</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center mr-4 mt-1">
                    <span className="text-green-600 font-bold">4</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Limited Accountability</h4>
                    <p className="text-gray-600">Donors rarely see detailed reports on how their money was used</p>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-8 rounded-lg">
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">
                Our Solution
              </h3>
              <div className="space-y-6">
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🔗</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Blockchain Transparency</h4>
                    <p className="text-gray-600">Every transaction recorded on Cardano blockchain</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">⚡</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Direct Impact</h4>
                    <p className="text-gray-600">Funds go directly to verified Iranian NGOs</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">🏆</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">NFT Receipts</h4>
                    <p className="text-gray-600">Permanent proof of donation and impact</p>
                  </div>
                </div>
                <div className="flex items-center">
                  <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mr-4">
                    <span className="text-2xl">📊</span>
                  </div>
                  <div>
                    <h4 className="font-semibold text-gray-900">Real-time Tracking</h4>
                    <p className="text-gray-600">Monitor your donation's journey and impact</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Technology Section */}
      <div className="bg-gray-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Built on Cardano Blockchain
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              We chose Cardano for its sustainability, security, and low transaction costs
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🌱</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Sustainable</h3>
              <p className="text-gray-600">
                Cardano's Proof-of-Stake consensus uses 99% less energy than Bitcoin, 
                making it environmentally responsible for humanitarian work
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔒</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Secure</h3>
              <p className="text-gray-600">
                Peer-reviewed academic research ensures the highest security standards 
                for protecting donor funds and beneficiary data
              </p>
            </div>

            <div className="bg-white p-8 rounded-lg shadow-md text-center">
              <div className="w-16 h-16 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">💎</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Low Cost</h3>
              <p className="text-gray-600">
                Minimal transaction fees mean more of your donation goes to helping 
                Iranian families instead of network costs
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Smart Contracts Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Smart Contract Architecture
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Our smart contracts are built with Aiken, ensuring security and efficiency
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎯 Donation Tracker
              </h3>
              <p className="text-gray-600 mb-4">
                Manages donation flow, allocation tracking, and ensures funds reach 
                intended recipients with full transparency
              </p>
              <div className="text-sm text-gray-500">
                <strong>Features:</strong> Multi-sig security, automatic allocation, 
                spending verification
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🏆 NFT Receipt System
              </h3>
              <p className="text-gray-600 mb-4">
                Mints unique NFT receipts for each donation, providing permanent 
                proof and impact reporting
              </p>
              <div className="text-sm text-gray-500">
                <strong>Features:</strong> Unique metadata, impact updates, 
                transferable ownership
              </div>
            </div>

            <div className="bg-gray-50 p-6 rounded-lg">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                ✅ NGO Verification
              </h3>
              <p className="text-gray-600 mb-4">
                Verifies and manages NGO credentials, ensuring only legitimate 
                organizations receive donations
              </p>
              <div className="text-sm text-gray-500">
                <strong>Features:</strong> Multi-party verification, reputation scoring, 
                performance tracking
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Iran Focus Section */}
      <div className="bg-red-50 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Why We Focus on Iran 🇮🇷
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Iran faces unique challenges that blockchain technology can help address
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Current Challenges</h3>
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-600">
                    <strong>Economic Sanctions:</strong> Traditional banking systems face restrictions, 
                    making international aid difficult
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-600">
                    <strong>Natural Disasters:</strong> Earthquakes, floods, and droughts regularly 
                    affect Iranian communities
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-600">
                    <strong>Healthcare Needs:</strong> Rural areas lack access to modern medical 
                    equipment and medicines
                  </p>
                </div>
                <div className="flex items-start">
                  <div className="w-2 h-2 bg-red-500 rounded-full mt-2 mr-3"></div>
                  <p className="text-gray-600">
                    <strong>Educational Gaps:</strong> Many schools need reconstruction and 
                    educational materials
                  </p>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-6">Our Impact Areas</h3>
              <div className="space-y-6">
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">🏥 Healthcare</h4>
                  <p className="text-gray-600 text-sm">
                    Supporting 15+ medical facilities across Iran with equipment, 
                    medicines, and training programs
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">📚 Education</h4>
                  <p className="text-gray-600 text-sm">
                    Rebuilding schools, providing educational materials, and 
                    funding scholarship programs
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">🍽️ Food Security</h4>
                  <p className="text-gray-600 text-sm">
                    Emergency food programs and agricultural support for 
                    vulnerable families
                  </p>
                </div>
                <div className="bg-white p-4 rounded-lg shadow-sm">
                  <h4 className="font-semibold text-gray-900 mb-2">🏠 Disaster Relief</h4>
                  <p className="text-gray-600 text-sm">
                    Rapid response and reconstruction efforts for earthquake 
                    and flood-affected areas
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Team Section */}
      <div className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Our Values</h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The principles that guide our work in supporting Iranian communities
            </p>
          </div>

          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🔍</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Transparency</h3>
              <p className="text-gray-600">
                Every transaction is publicly verifiable on the blockchain
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">🤝</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Trust</h3>
              <p className="text-gray-600">
                Building trust through verified NGOs and proven impact
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">⚡</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Efficiency</h3>
              <p className="text-gray-600">
                Maximum funds reach beneficiaries with minimal overhead
              </p>
            </div>

            <div className="text-center">
              <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <span className="text-3xl">❤️</span>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Compassion</h3>
              <p className="text-gray-600">
                Driven by genuine care for Iranian communities in need
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Our Impact So Far</h2>
            <p className="text-xl text-gray-300">
              Real numbers from our work in Iran
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="text-4xl font-bold text-green-400 mb-2">850K+</div>
              <div className="text-gray-300">ADA Donated</div>
              <div className="text-sm text-gray-400 mt-1">≈ $425,000 USD</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-blue-400 mb-2">12K+</div>
              <div className="text-gray-300">Families Helped</div>
              <div className="text-sm text-gray-400 mt-1">Across 15 provinces</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-purple-400 mb-2">45</div>
              <div className="text-gray-300">Active Projects</div>
              <div className="text-sm text-gray-400 mt-1">Healthcare, Education, Food</div>
            </div>
            <div className="text-center">
              <div className="text-4xl font-bold text-red-400 mb-2">98%</div>
              <div className="text-gray-300">Fund Efficiency</div>
              <div className="text-sm text-gray-400 mt-1">Direct to beneficiaries</div>
            </div>
          </div>
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gradient-to-r from-green-600 to-red-600 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-4">
            Join Us in Supporting Iran
          </h2>
          <p className="text-xl mb-8">
            Every donation makes a difference. Start your transparent giving journey today.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/donate"
              className="bg-white text-gray-900 hover:bg-gray-100 font-bold py-3 px-8 rounded-lg text-lg transition duration-200 shadow-lg"
            >
              🇮🇷 Start Donating
            </Link>
            <Link 
              href="/ngos"
              className="bg-transparent border-2 border-white text-white hover:bg-white hover:text-gray-900 font-bold py-3 px-8 rounded-lg text-lg transition duration-200"
            >
              View NGOs
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
