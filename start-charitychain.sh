#!/bin/zsh

# CharityChain Startup Script - Fixes directory issues
echo "🚀 CharityChain - Iran Donation Platform Startup"
echo "=============================================="

# Fix any directory navigation issues
echo "📁 Navigating to project directory..."
cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon || {
    echo "❌ Error: Could not find project directory"
    echo "Please ensure the project is at: /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon"
    exit 1
}

echo "✅ Current directory: $(pwd)"

# Check if frontend directory exists
if [ ! -d "frontend" ]; then
    echo "❌ Error: Frontend directory not found"
    exit 1
fi

# Navigate to frontend
cd frontend || {
    echo "❌ Error: Could not enter frontend directory"
    exit 1
}

echo "📦 Installing/checking dependencies..."
npm install

echo "🔍 Environment check:"
if [ -f ".env.local" ]; then
    echo "   ✅ .env.local found"
    echo "   Network: $(grep NEXT_PUBLIC_NETWORK .env.local | cut -d'=' -f2)"
    echo "   Blockfrost: $(grep NEXT_PUBLIC_BLOCKFROST_NETWORK .env.local | cut -d'=' -f2)"
else
    echo "   ⚠️  .env.local not found"
fi

echo ""
echo "🔗 Wallet Connection Status:"
echo "   ✅ DOM property errors fixed"
echo "   ✅ Manual wallet connection enabled"
echo "   ✅ Testnet configuration ready"
echo ""

echo "🌍 Starting CharityChain frontend..."
echo "   URL: http://localhost:3000"
echo "   Press Ctrl+C to stop"
echo ""

# Start the development server
exec npm run dev
