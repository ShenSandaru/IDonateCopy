#!/bin/zsh

# CharityChain Launch Script
echo "🚀 Launching CharityChain - Iran Donation Platform"

# Function to kill processes on exit
cleanup() {
    echo "\n🛑 Shutting down CharityChain..."
    kill $FRONTEND_PID 2>/dev/null
    kill $BACKEND_PID 2>/dev/null
    exit
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Navigate to project directory
cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon

echo "📱 Starting Frontend (Next.js)..."
cd frontend
npm run dev > /tmp/charitychain-frontend.log 2>&1 &
FRONTEND_PID=$!
cd ..

echo "🔧 Starting Backend (Express.js)..."
cd backend
npm start > /tmp/charitychain-backend.log 2>&1 &
BACKEND_PID=$!
cd ..

echo ""
echo "✅ CharityChain is launching..."
echo "📍 Frontend: http://localhost:3000"
echo "🔌 Backend:  http://localhost:3001"
echo ""
echo "🔗 Wallet Setup:"
echo "   1. Ensure Lace wallet is on 'Testnet' network"
echo "   2. Get test ADA from Cardano faucet"
echo "   3. Connect wallet on homepage"
echo "   4. Start donating to Iranian NGOs!"
echo ""
echo "📝 Logs:"
echo "   Frontend: tail -f /tmp/charitychain-frontend.log"
echo "   Backend:  tail -f /tmp/charitychain-backend.log"
echo ""
echo "Press Ctrl+C to stop all services"

# Wait for processes
wait
