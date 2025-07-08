#!/bin/zsh

# CharityChain Backend Startup Script
echo "🔧 CharityChain Backend - API Server"
echo "==================================="

# Navigate to backend directory
cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon/backend || {
    echo "❌ Error: Could not find backend directory"
    exit 1
}

echo "✅ Current directory: $(pwd)"

echo "📦 Installing/checking dependencies..."
npm install

echo "🔍 Environment check:"
if [ -f ".env" ]; then
    echo "   ✅ .env found"
    echo "   Port: $(grep PORT .env | cut -d'=' -f2)"
    echo "   MongoDB: $(grep MONGODB_URI .env | cut -d'=' -f2 | head -c 30)..."
    echo "   Blockfrost: $(grep BLOCKFROST_NETWORK .env | cut -d'=' -f2)"
else
    echo "   ⚠️  .env not found"
fi

echo ""
echo "🌍 Starting CharityChain backend..."
echo "   API URL: http://localhost:3001"
echo "   MongoDB: Connected to cloud database"
echo "   Press Ctrl+C to stop"
echo ""

# Start the backend server
cd src && exec node server.js
