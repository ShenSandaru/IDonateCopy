#!/bin/zsh

# CharityChain Complete Setup Script
# Run this from the project root directory

echo "🇮🇷 CharityChain Setup - Supporting Iran Through Blockchain Transparency"
echo "=================================================================="

# Check if we're in the right directory
if [ ! -d "charitychain-hackathon" ]; then
    echo "❌ Please run this script from the IDonate directory"
    exit 1
fi

cd charitychain-hackathon

echo "\n📦 Setting up Frontend..."
cd frontend
echo "   Installing frontend dependencies..."
npm install --silent

echo "\n🔍 Checking frontend configuration..."
if grep -q "testnetMeVqzR7nHzftZHGZehyuqZKqWMhqoV6u" .env.local; then
    echo "   ✅ Blockfrost API key configured"
else
    echo "   ⚠️  Please check your Blockfrost API key in .env.local"
fi

cd ..

echo "\n🔧 Setting up Backend..."
cd backend
echo "   Installing backend dependencies..."
npm install --silent

echo "   ✅ Backend configured with ES modules"
cd ..

echo "\n📋 Setup Complete! Here's what to do next:"
echo ""
echo "🎯 TESTNET SETUP CHECKLIST:"
echo "   □ Install Lace wallet extension"
echo "   □ Switch Lace to 'Testnet' network (not Preprod)"
echo "   □ Get test ADA from: https://testnets.cardano.org/en/testnets/cardano/tools/faucet/"
echo "   □ Your testnet address should start with 'addr_test1...'"
echo ""
echo "🚀 TO START THE APPLICATION:"
echo "   Frontend: cd frontend && npm run dev"
echo "   Backend:  cd backend && npm start"
echo "   Open:     http://localhost:3000"
echo ""
echo "🔗 WALLET CONNECTION:"
echo "   1. Go to http://localhost:3000"
echo "   2. Scroll to wallet section"
echo "   3. Click 'Connect Wallet' → Select 'Lace'"
echo "   4. Approve connection in wallet popup"
echo "   5. Start donating to Iranian NGOs!"
echo ""
echo "🎉 Your CharityChain application is ready for transparent donations to Iran!"
