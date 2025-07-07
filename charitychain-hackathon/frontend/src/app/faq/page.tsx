import Link from 'next/link'

export default function FAQPage() {
  const faqs = [
    {
      category: "Getting Started",
      questions: [
        {
          q: "What is CharityChain?",
          a: "CharityChain is a blockchain-based donation platform focused on supporting Iranian communities. We use the Cardano blockchain to ensure complete transparency in how donations are used, allowing donors to track their contributions in real-time."
        },
        {
          q: "Why focus on Iran?",
          a: "Iran faces unique challenges including economic sanctions, natural disasters, and healthcare needs. Traditional banking systems face restrictions, making blockchain technology ideal for direct, transparent aid delivery to Iranian families and communities."
        },
        {
          q: "How does blockchain transparency work?",
          a: "Every donation is recorded on the Cardano blockchain as an immutable transaction. This means you can see exactly where your money goes, how it's spent, and what impact it creates - all verified by the blockchain network."
        }
      ]
    },
    {
      category: "Wallet Setup",
      questions: [
        {
          q: "Which wallets are supported?",
          a: "CharityChain supports all major Cardano wallets including Lace, Eternl (formerly CCVault), Nami, Flint, and Typhon. We recommend Lace for new users due to its user-friendly interface."
        },
        {
          q: "How do I install a Cardano wallet?",
          a: "1. Visit the official website of your chosen wallet (e.g., lace.io for Lace) 2. Download the browser extension 3. Create a new wallet and securely store your seed phrase 4. Set your wallet to 'Preprod' testnet for testing or 'Mainnet' for real donations."
        },
        {
          q: "What's the difference between testnet and mainnet?",
          a: "Testnet uses fake ADA for testing purposes - perfect for learning how the platform works. Mainnet uses real ADA for actual donations. We recommend testing on Preprod testnet first."
        },
        {
          q: "Where can I get test ADA?",
          a: "You can get free test ADA from the Cardano testnet faucet at testnets.cardano.org/en/testnets/cardano/tools/faucet/ - just enter your testnet wallet address."
        },
        {
          q: "My wallet isn't connecting. What should I do?",
          a: "1. Ensure your wallet extension is installed and unlocked 2. Refresh the CharityChain page 3. Check that your wallet is on the correct network (Preprod for testing) 4. Disable popup blockers 5. Try a different browser or incognito mode."
        }
      ]
    },
    {
      category: "Making Donations",
      questions: [
        {
          q: "How do I make a donation?",
          a: "1. Connect your Cardano wallet 2. Choose a verified Iranian NGO 3. Enter your donation amount in ADA 4. Review the transaction details 5. Confirm the transaction in your wallet 6. Receive your NFT receipt for tracking."
        },
        {
          q: "What is the minimum donation amount?",
          a: "The minimum donation is 1 ADA to cover network transaction fees. However, we recommend at least 10 ADA to ensure a meaningful impact for Iranian communities."
        },
        {
          q: "How are transaction fees calculated?",
          a: "Cardano network fees are typically 0.17-0.2 ADA per transaction. These fees go to the Cardano network validators, not to CharityChain. The fees are automatically calculated and shown before you confirm."
        },
        {
          q: "Can I donate anonymously?",
          a: "Yes! While all transactions are recorded on the blockchain, you can choose to make anonymous donations. Your wallet address will still be visible on the blockchain, but your personal identity won't be linked to the donation on our platform."
        },
        {
          q: "What happens after I donate?",
          a: "1. Your transaction is recorded on the Cardano blockchain 2. You receive an NFT receipt with donation details 3. The NGO receives your funds directly 4. You can track fund allocation in real-time 5. You'll receive impact updates as the NGO uses the funds."
        }
      ]
    },
    {
      category: "Transparency & Tracking",
      questions: [
        {
          q: "How can I track my donations?",
          a: "Visit the 'Track Donations' page and connect your wallet. You'll see all your donations, their current status, how funds are being allocated, and real-time spending updates from the NGOs."
        },
        {
          q: "What is an NFT receipt?",
          a: "Each donation generates a unique NFT (Non-Fungible Token) that serves as your permanent receipt. It contains donation details, impact metrics, and updates. You own this NFT in your wallet as proof of your contribution."
        },
        {
          q: "How do I know NGOs are legitimate?",
          a: "All NGOs undergo our verification process including: 1. Legal registration verification 2. On-ground presence confirmation 3. Financial audit reviews 4. Community impact assessment 5. Ongoing performance monitoring."
        },
        {
          q: "What percentage goes to administration?",
          a: "Our smart contracts ensure 75% goes directly to aid delivery, 20% to logistics and distribution, and only 5% to administration. This allocation is enforced by blockchain code and cannot be changed."
        },
        {
          q: "Can I see exactly how my money was spent?",
          a: "Yes! NGOs must report all expenditures through our platform. You can see itemized spending including receipts, photos, and impact reports for every expense made with your donation."
        }
      ]
    },
    {
      category: "Technical Support",
      questions: [
        {
          q: "What if my transaction fails?",
          a: "Transaction failures usually occur due to: 1. Insufficient ADA balance 2. Network congestion 3. Wallet connectivity issues. Your funds are never lost - if a transaction fails, nothing is deducted from your wallet."
        },
        {
          q: "How long do transactions take?",
          a: "Cardano transactions typically confirm within 1-2 minutes. During network congestion, it may take up to 10 minutes. You can track your transaction status on Cardano blockchain explorers."
        },
        {
          q: "Is my wallet information secure?",
          a: "Yes! CharityChain never stores your private keys or seed phrases. We only interact with your wallet through secure, standard protocols. Your wallet remains fully under your control."
        },
        {
          q: "What browsers are supported?",
          a: "CharityChain works best on Chrome, Firefox, Safari, and Edge. Make sure your browser is updated to the latest version for optimal performance."
        },
        {
          q: "Can I use mobile wallets?",
          a: "Currently, CharityChain is optimized for desktop browser wallets. Mobile wallet support is coming soon. For now, we recommend using desktop browsers with wallet extensions."
        }
      ]
    },
    {
      category: "Iran-Specific Questions",
      questions: [
        {
          q: "How do funds reach Iran despite sanctions?",
          a: "Blockchain technology operates independently of traditional banking systems. Our verified Iranian NGOs receive ADA directly to their Cardano wallets, bypassing traditional financial restrictions."
        },
        {
          q: "Which Iranian provinces do you support?",
          a: "We support NGOs operating across all 31 Iranian provinces, with particular focus on underserved rural areas in Kurdistan, Fars, Kerman, Khuzestan, and earthquake-affected regions."
        },
        {
          q: "What types of aid are most needed?",
          a: "Current priority areas include: 1. Medical supplies and equipment 2. Emergency food assistance 3. Educational materials and school reconstruction 4. Clean water systems 5. Disaster relief and reconstruction."
        },
        {
          q: "How do you verify impact in Iran?",
          a: "Our Iranian partner NGOs provide regular reports including photos, videos, beneficiary testimonials, and financial documentation. We also work with local community leaders to verify impact claims."
        },
        {
          q: "Can Iranian NGOs withdraw ADA to local currency?",
          a: "Yes, our partner NGOs work with compliant exchanges and local merchants who accept cryptocurrency, allowing them to convert ADA to Iranian Rial for local purchases and aid distribution."
        }
      ]
    }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-white to-red-50">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-green-600 to-red-600 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Frequently Asked Questions
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-3xl mx-auto">
              Everything you need to know about supporting Iran through CharityChain
            </p>
            <div className="flex justify-center">
              <span className="text-5xl">🇮🇷 ❓</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white py-8 border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap justify-center gap-4">
            <Link 
              href="/donate"
              className="bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              🇮🇷 Start Donating
            </Link>
            <Link 
              href="/about"
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              📖 Learn More
            </Link>
            <Link 
              href="/track"
              className="bg-purple-600 hover:bg-purple-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              📊 Track Donations
            </Link>
            <a 
              href="mailto:support@charitychain.org"
              className="bg-gray-600 hover:bg-gray-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
            >
              📧 Contact Support
            </a>
          </div>
        </div>
      </div>

      {/* FAQ Content */}
      <div className="py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {faqs.map((category, categoryIndex) => (
            <div key={categoryIndex} className="mb-12">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-3xl mr-3">
                  {categoryIndex === 0 ? '🚀' : 
                   categoryIndex === 1 ? '💳' : 
                   categoryIndex === 2 ? '❤️' : 
                   categoryIndex === 3 ? '🔍' : 
                   categoryIndex === 4 ? '🛠️' : '🇮🇷'}
                </span>
                {category.category}
              </h2>
              
              <div className="space-y-6">
                {category.questions.map((faq, faqIndex) => (
                  <div key={faqIndex} className="bg-white rounded-lg shadow-md p-6 border border-gray-200">
                    <h3 className="text-lg font-semibold text-gray-900 mb-3">
                      Q: {faq.q}
                    </h3>
                    <div className="text-gray-700 whitespace-pre-line">
                      {faq.a}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Wallet Setup Guide */}
      <div className="bg-blue-50 py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-8">
            🔧 Quick Wallet Setup Guide
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🔰 For Beginners
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">1</span>
                  <p>Install Lace Wallet from <a href="https://lace.io" className="text-blue-600 underline" target="_blank" rel="noopener noreferrer">lace.io</a></p>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">2</span>
                  <p>Create wallet and save your seed phrase securely</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">3</span>
                  <p>Switch to "Preprod" network for testing</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">4</span>
                  <p>Get test ADA from Cardano faucet</p>
                </div>
                <div className="flex items-start">
                  <span className="bg-blue-100 text-blue-800 rounded-full w-6 h-6 flex items-center justify-center text-xs font-bold mr-3 mt-0.5">5</span>
                  <p>Return to CharityChain and connect wallet</p>
                </div>
              </div>
            </div>

            <div className="bg-white rounded-lg p-6 shadow-md">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                🔧 Troubleshooting
              </h3>
              <div className="space-y-3 text-sm">
                <div className="flex items-start">
                  <span className="text-red-500 mr-3 mt-1">❌</span>
                  <div>
                    <p className="font-medium">Wallet not detected?</p>
                    <p className="text-gray-600">Refresh page, check extension is enabled</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-yellow-500 mr-3 mt-1">⚠️</span>
                  <div>
                    <p className="font-medium">Connection fails?</p>
                    <p className="text-gray-600">Disable popup blockers, try incognito mode</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-blue-500 mr-3 mt-1">ℹ️</span>
                  <div>
                    <p className="font-medium">Zero balance?</p>
                    <p className="text-gray-600">Ensure correct network, use testnet faucet</p>
                  </div>
                </div>
                <div className="flex items-start">
                  <span className="text-green-500 mr-3 mt-1">✅</span>
                  <div>
                    <p className="font-medium">Still need help?</p>
                    <p className="text-gray-600">Contact our support team for assistance</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Section */}
      <div className="bg-gray-900 text-white py-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold mb-6">
            Still Have Questions?
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            Our team is here to help you support Iranian communities
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a 
              href="mailto:support@charitychain.org"
              className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              📧 Email Support
            </a>
            <a 
              href="https://discord.gg/charitychain"
              className="bg-purple-600 hover:bg-purple-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              💬 Join Discord
            </a>
            <Link 
              href="/about"
              className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-medium transition-colors"
            >
              📖 Read Documentation
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
