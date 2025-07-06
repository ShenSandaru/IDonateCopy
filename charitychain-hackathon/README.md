# CharityChain - Transparent Donation Tracking Platform

## 🎯 Project Overview

CharityChain is a decentralized application built on the Cardano blockchain that provides complete transparency in charitable donations. Donors can track their contributions in real-time, seeing exactly how NGOs allocate funds between administration, aid delivery, and logistics.

## 🌟 Key Features

- **Complete Transparency**: Every donation tracked on-chain
- **Real-time Monitoring**: Live fund allocation updates
- **NFT Receipts**: Permanent donation proof as NFTs
- **NGO Verification**: Trusted charity registration system
- **Multi-wallet Support**: Compatible with Lace, Eternl, and Nami wallets

## 🏗️ Architecture

### Smart Contracts (Aiken)
- **NGO Verification Contract**: Validates and registers charitable organizations
- **Donation Tracking Contract**: Records and tracks all donations
- **Fund Allocation Contract**: Manages transparent fund distribution

### Frontend (Next.js + Mesh SDK)
- **Donor Dashboard**: Track donations and view impact reports
- **NGO Portal**: Organization registration and fund management
- **Admin Interface**: System oversight and verification

### Backend (Express.js + MongoDB)
- **API Gateway**: RESTful endpoints for data access
- **Off-chain Storage**: Metadata and user preferences
- **Analytics Engine**: Donation insights and reporting

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- Aiken CLI
- Cardano wallet (Lace, Eternl, or Nami)
- Test ADA from Cardano testnet faucet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/yourusername/charitychain-hackathon.git
   cd charitychain-hackathon
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd frontend
   npm install
   
   # Backend
   cd ../backend
   npm install
   
   # Smart contracts
   cd ../contracts
   aiken check
   ```

3. **Configure environment variables**
   ```bash
   # Frontend (.env.local)
   NEXT_PUBLIC_BLOCKFROST_API_KEY=your_blockfrost_project_id
   NEXT_PUBLIC_BLOCKFROST_NETWORK=testnet
   
   # Backend (.env)
   BLOCKFROST_API_KEY=your_blockfrost_project_id
   MONGODB_URI=mongodb://localhost:27017/charitychain
   ```

4. **Start development servers**
   ```bash
   # Frontend (terminal 1)
   cd frontend
   npm run dev
   
   # Backend (terminal 2)
   cd backend
   npm run dev
   ```

## 📁 Project Structure

```
charitychain-hackathon/
├── contracts/                  # Aiken smart contracts
│   └── charity-tracker/
│       ├── validators/
│       │   ├── donation.ak
│       │   └── ngo-verification.ak
│       └── lib/
├── frontend/                   # Next.js application
│   ├── src/
│   │   ├── app/
│   │   ├── components/
│   │   └── lib/
│   └── public/
├── backend/                    # Express.js API
│   ├── src/
│   │   ├── routes/
│   │   ├── models/
│   │   └── middleware/
│   └── tests/
├── docs/                       # Documentation
└── assets/                     # Design assets
```

## 🔧 Development Workflow

### Smart Contract Development
1. Write validators in Aiken
2. Test with Aiken's built-in testing framework
3. Deploy to Cardano testnet
4. Verify contract functionality

### Frontend Development
1. Build components with React/Next.js
2. Integrate with Mesh SDK for wallet connectivity
3. Connect to smart contracts
4. Implement responsive design

### Backend Development
1. Create RESTful API endpoints
2. Integrate with Blockfrost API
3. Implement database operations
4. Add authentication middleware

## 🧪 Testing

### Smart Contracts
```bash
cd contracts/charity-tracker
aiken test
```

### Frontend
```bash
cd frontend
npm test
```

### Backend
```bash
cd backend
npm test
```

## 📊 Key Metrics to Track

- **Total Donations**: Sum of all contributions
- **Active NGOs**: Number of registered organizations
- **Transparency Score**: Percentage of funds tracked
- **User Engagement**: Active donors and recipients

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

- **Discord**: Join our community server
- **GitHub Issues**: Report bugs and request features
- **Documentation**: Comprehensive guides in `/docs`

## 🎯 Roadmap

### Phase 1: Foundation (Current)
- ✅ Project setup and architecture
- ✅ Basic smart contract structure
- ✅ Wallet integration
- ✅ Core UI components

### Phase 2: Core Features
- 🔄 NGO verification system
- 🔄 Donation tracking implementation
- 🔄 Real-time fund allocation
- 🔄 NFT receipt generation

### Phase 3: Advanced Features
- 📅 Advanced analytics dashboard
- 📅 Multi-language support
- 📅 Mobile application
- 📅 Integration with other blockchains

### Phase 4: Ecosystem Growth
- 📅 Partnership with major NGOs
- 📅 Government integration
- 📅 Enterprise solutions
- 📅 Global expansion

## 🌍 Impact Goals

- **$1M+ in tracked donations** by end of 2025
- **100+ verified NGOs** on the platform
- **99%+ transparency rate** in fund allocation
- **Global reach** across 20+ countries

---

**Built with ❤️ for transparent charitable giving on Cardano**
