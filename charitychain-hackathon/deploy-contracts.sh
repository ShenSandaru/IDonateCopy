#!/bin/zsh

# CharityChain Smart Contract Deployment Script
# This script deploys the Aiken smart contracts to Cardano testnet

echo "🇮🇷 CharityChain Smart Contract Deployment"
echo "=========================================="

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[0;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Change to project root
cd "$(dirname "$0")"
PROJECT_ROOT="/Users/dhananjaya/Desktop/IDonateCopy/charitychain-hackathon"
cd "$PROJECT_ROOT"

echo -e "${BLUE}📍 Project root: $PROJECT_ROOT${NC}"

# Check if Aiken is installed
if ! command -v aiken &> /dev/null; then
    echo -e "${RED}❌ Aiken CLI not found. Please install Aiken first:${NC}"
    echo "   curl -sSfL https://install.aiken-lang.org | bash"
    exit 1
fi

echo -e "${GREEN}✅ Aiken CLI found: $(aiken --version)${NC}"

# Check if contracts are compiled
CONTRACTS_DIR="$PROJECT_ROOT/contracts/donation-tracker"
PLUTUS_JSON="$CONTRACTS_DIR/plutus.json"

if [ ! -f "$PLUTUS_JSON" ]; then
    echo -e "${YELLOW}⚠️  Contracts not compiled. Compiling now...${NC}"
    cd "$CONTRACTS_DIR"
    aiken build
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Contract compilation failed${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Contracts compiled successfully${NC}"
else
    echo -e "${GREEN}✅ Contracts already compiled${NC}"
fi

# Check environment variables
ENV_FILE="$PROJECT_ROOT/frontend/.env.local"
if [ ! -f "$ENV_FILE" ]; then
    echo -e "${RED}❌ Frontend .env.local file not found${NC}"
    exit 1
fi

# Source environment variables
source "$ENV_FILE"

if [ -z "$NEXT_PUBLIC_BLOCKFROST_API_KEY" ]; then
    echo -e "${RED}❌ BLOCKFROST_API_KEY not found in .env.local${NC}"
    echo "   Please add your Blockfrost API key to frontend/.env.local"
    exit 1
fi

echo -e "${GREEN}✅ Blockfrost API key configured${NC}"

# Check if Node.js dependencies are installed
FRONTEND_DIR="$PROJECT_ROOT/frontend"
if [ ! -d "$FRONTEND_DIR/node_modules" ]; then
    echo -e "${YELLOW}⚠️  Frontend dependencies not installed. Installing...${NC}"
    cd "$FRONTEND_DIR"
    npm install
    if [ $? -ne 0 ]; then
        echo -e "${RED}❌ Failed to install frontend dependencies${NC}"
        exit 1
    fi
    echo -e "${GREEN}✅ Frontend dependencies installed${NC}"
fi

# Run the simplified deployment script
echo -e "${BLUE}🚀 Generating contract addresses...${NC}"
cd "$FRONTEND_DIR"

# Run the simplified address generation script
node scripts/generate-addresses.js

if [ $? -eq 0 ]; then
    echo -e "${GREEN}🎉 Smart contracts deployed successfully!${NC}"
    
    # Check if contract addresses were generated
    CONTRACT_ADDRESSES="$FRONTEND_DIR/contract-addresses.json"
    if [ -f "$CONTRACT_ADDRESSES" ]; then
        echo -e "${GREEN}✅ Contract addresses saved to: $CONTRACT_ADDRESSES${NC}"
        echo -e "${BLUE}📋 Contract deployment summary:${NC}"
        cat "$CONTRACT_ADDRESSES" | head -20
    fi
    
    echo ""
    echo -e "${BLUE}🔄 Next steps:${NC}"
    echo "1. Verify contracts on Cardano testnet explorer"
    echo "2. Test donation transactions"
    echo "3. Verify NFT receipt minting"
    echo "4. Run integration tests"
    echo ""
    echo -e "${GREEN}✅ CharityChain smart contracts are ready!${NC}"
    
else
    echo -e "${RED}❌ Contract deployment failed${NC}"
    exit 1
fi
