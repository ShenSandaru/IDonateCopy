#!/bin/zsh

echo "🚀 Starting CharityChain with Wallet Debug Mode"
echo "=============================================="

cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon/frontend

echo "📦 Installing/updating dependencies..."
npm install

echo "🔧 Environment check:"
echo "   Network: $(grep NEXT_PUBLIC_NETWORK .env.local | cut -d'=' -f2)"
echo "   Blockfrost: $(grep NEXT_PUBLIC_BLOCKFROST_NETWORK .env.local | cut -d'=' -f2)"

echo ""
echo "🔌 Wallet Connection Troubleshooting:"
echo "   1. Make sure Lace wallet is installed"
echo "   2. Switch Lace to 'Testnet' network"
echo "   3. The app will show debug info for wallet detection"
echo "   4. Try both Mesh SDK and Manual connection methods"
echo ""

echo "🌍 Starting development server..."
echo "   App will be available at: http://localhost:3000"
echo "   Look for wallet debugging info on the homepage"
echo ""

npm run dev
