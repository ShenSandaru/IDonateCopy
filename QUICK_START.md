# 🇮🇷 CharityChain - Quick Start Guide

## 🎯 **Your Setup Status**

✅ **Blockfrost API Key:** Configured with testnet key  
✅ **Frontend:** Next.js app with Mesh SDK wallet integration  
✅ **Backend:** Express.js API with ES modules  
✅ **Smart Contracts:** Aiken donation tracking contracts  

## 🚀 **Start the Application**

### **Option 1: Run Setup Script**
```bash
cd /Users/dhananjaya/Desktop/IDonate
./setup-charitychain.sh
```

### **Option 2: Manual Start**

**Terminal 1 - Frontend:**
```bash
cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon/frontend
npm run dev
```

**Terminal 2 - Backend (Optional):**
```bash
cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon/backend
npm start
```

**Open Browser:**
```
http://localhost:3000
```

## 🔌 **Wallet Connection Steps**

### **1. Configure Lace Wallet**
- Open Lace wallet extension
- Go to Settings → Network
- Select **"Testnet"** (matches your API key)
- Get test ADA from [Cardano Faucet](https://testnets.cardano.org/en/testnets/cardano/tools/faucet/)

### **2. Connect to CharityChain**
- Visit http://localhost:3000
- Scroll to "Wallet Connection" section
- Click wallet selection buttons
- Choose "Lace" from the list
- Approve connection in popup

### **3. Test Donations**
- Navigate to `/donate` page
- Select Iranian NGO
- Enter test ADA amount
- Sign transaction in wallet
- View impact on dashboard

## 🧪 **Testnet Configuration**

Your current setup uses **Cardano Testnet**:
- **Network:** testnet
- **API Key:** testnet...6u (configured)
- **Wallet:** Must be on "Testnet" network
- **ADA:** Test ADA only (no real money)

## 📱 **Application Features**

### **🏠 Homepage**
- Iran-focused design with flag colors
- Impact statistics and urgent needs
- Wallet connection interface

### **💰 Donation Page**
- List of verified Iranian NGOs
- Blockchain transaction integration
- Real-time donation tracking

### **📊 Dashboard**
- Personal donation history
- Impact metrics for Iran
- NFT receipt collection

### **🏢 NGOs Page**
- Verified Iranian organizations
- Transparency reports
- Contact information

## 🚨 **Troubleshooting**

### **Wallet Connection Issues:**
- Ensure Lace is on "Testnet" network
- Refresh browser if connection fails
- Check popup blockers

### **No Test ADA:**
- Verify testnet address format
- Wait 5-10 minutes after faucet request
- Try faucet again if needed

### **API Errors:**
- Check Blockfrost API key is correct
- Verify network settings match
- Restart development server

## 🎉 **Ready for Iran Donations!**

Once connected, you can:
1. **Browse** verified Iranian NGOs
2. **Donate** test ADA transparently
3. **Track** donations on blockchain
4. **Collect** NFT donation receipts
5. **View** impact on Iranian communities

Your CharityChain platform is configured for **safe, transparent donations to Iranian families and communities** through verified organizations! 🌟
