#!/bin/bash

# CharityChain Development Setup Script
echo "🇮🇷 Setting up CharityChain for Iran donation testing..."

# Check if we're in the frontend directory
if [ ! -f "package.json" ]; then
    echo "❌ Please run this script from the frontend directory"
    exit 1
fi

echo "📦 Installing dependencies..."
npm install

echo "🔍 Checking environment configuration..."
if [ ! -f ".env.local" ]; then
    echo "❌ .env.local file not found!"
    echo "Please create .env.local with your Blockfrost API key"
    exit 1
fi

# Check if Blockfrost API key is set
if grep -q "YOUR_BLOCKFROST_PROJECT_ID_HERE" .env.local; then
    echo "⚠️  WARNING: Please update your Blockfrost API key in .env.local"
    echo "   1. Visit https://blockfrost.io"
    echo "   2. Create account and project"
    echo "   3. Select 'Cardano Preprod' network"
    echo "   4. Copy Project ID to .env.local"
    echo ""
fi

echo "🚀 Starting development server..."
echo "📍 Your CharityChain app will be available at: http://localhost:3000"
echo ""
echo "🔧 Setup checklist:"
echo "   ✅ Install Lace wallet extension"
echo "   ✅ Switch Lace to Preprod network"
echo "   ✅ Get test ADA from faucet"
echo "   ✅ Connect wallet in the app"
echo "   ✅ Test donate to Iranian NGOs"
echo ""

npm run dev
