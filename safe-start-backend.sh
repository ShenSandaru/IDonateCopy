#!/bin/zsh

# CharityChain Backend Safe Startup Script
echo "🔧 CharityChain Backend - Safe Startup"
echo "======================================"

# Function to safely change directory
safe_cd() {
    if [ -d "$1" ]; then
        cd "$1" || {
            echo "❌ Error: Could not enter directory: $1"
            exit 1
        }
        echo "✅ Successfully entered: $(pwd)"
    else
        echo "❌ Error: Directory does not exist: $1"
        exit 1
    fi
}

# Start from a known good directory
echo "📁 Starting from home directory..."
cd ~ || exit 1

# Navigate step by step to avoid directory issues
echo "📁 Navigating to project..."
safe_cd "/Users/dhananjaya/Desktop"
safe_cd "IDonate"
safe_cd "charitychain-hackathon"
safe_cd "backend"

echo "🔍 Current directory: $(pwd)"
echo "📋 Directory contents:"
ls -la

# Check if required files exist
if [ ! -f "package.json" ]; then
    echo "❌ Error: package.json not found in backend directory"
    exit 1
fi

if [ ! -f ".env" ]; then
    echo "❌ Error: .env file not found in backend directory"
    exit 1
fi

if [ ! -d "src" ]; then
    echo "❌ Error: src directory not found"
    exit 1
fi

if [ ! -f "src/server.js" ]; then
    echo "❌ Error: server.js not found in src directory"
    exit 1
fi

echo "✅ All required files found"

# Install dependencies
echo "📦 Installing/checking dependencies..."
npm install || {
    echo "❌ Error: npm install failed"
    exit 1
}

# Check environment
echo "🔍 Environment check:"
if [ -f ".env" ]; then
    echo "   ✅ .env file found"
    echo "   Port: $(grep PORT .env | cut -d'=' -f2)"
    echo "   Network: $(grep BLOCKFROST_NETWORK .env | cut -d'=' -f2)"
else
    echo "   ⚠️  .env file missing"
fi

# Start server from backend directory (not src)
echo ""
echo "🚀 Starting CharityChain backend server..."
echo "   API will be available at: http://localhost:3001"
echo "   MongoDB: Cloud database configured"
echo "   Press Ctrl+C to stop"
echo ""

# Use absolute path to avoid any cwd issues
exec node "$(pwd)/src/server.js"
