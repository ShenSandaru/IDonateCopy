#!/bin/bash

echo "🚀 Testing CharityChain Wallet Donation Fix"
echo "============================================"

cd /Users/dhananjaya/Desktop/IDonateCopy/charitychain-hackathon/frontend

echo "📦 Installing dependencies if needed..."
if [ ! -d "node_modules" ]; then
    npm install
fi

echo "✅ Starting frontend development server..."
echo "   The NGO wallet addresses have been fixed!"
echo "   Valid testnet addresses are now being used instead of fake ones."
echo ""
echo "🇮🇷 Ready to test Iran donations:"
echo "   • Open http://localhost:3000/donate"
echo "   • Connect your Lace wallet"
echo "   • Select an Iranian NGO"  
echo "   • Enter donation amount"
echo "   • Complete transaction"
echo ""
echo "🔧 Fixed Issues:"
echo "   ❌ Old: addr_test_iranian_healthcare_foundation_wallet (invalid)"
echo "   ✅ New: addr_test1qz2fxv2umyhttkxyxp8x0dlpdt3k6cwng5pxj3jhsydzer3jcu5d8ps7zex2k2xt3uqxgjqnnj0vs2f0j4qd0zk0lqhj3jc0qs"
echo ""

npm run dev
