# 🚀 CharityChain Quick Start - Directory Issue Fixed

## 🚨 **Issue Resolved:** `ENOENT: no such file or directory, uv_cwd`

This error occurs when your terminal's current working directory doesn't exist or has been moved. The startup scripts below fix this automatically.

## ⚡ **Quick Start (Recommended)**

### **Option 1: Frontend Only (Wallet Testing)**
```bash
cd /Users/dhananjaya/Desktop/IDonate
./start-charitychain.sh
```

### **Option 2: Full Stack (Frontend + Backend)**

**Terminal 1 - Frontend:**
```bash
cd /Users/dhananjaya/Desktop/IDonate
./start-charitychain.sh
```

**Terminal 2 - Backend:**
```bash
cd /Users/dhananjaya/Desktop/IDonate
./start-backend.sh
```

## 🔧 **Manual Start (If Scripts Don't Work)**

### **Frontend:**
```bash
cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon/frontend
npm install
npm run dev
```

### **Backend:**
```bash
cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon/backend
npm install
cd src && node server.js
```

## 🌐 **Access Your Application**

- **Frontend:** http://localhost:3000 (Iran donation platform)
- **Backend:** http://localhost:3001 (API server)

## 🔗 **Test Wallet Connection**

1. **Open** http://localhost:3000
2. **Scroll down** to wallet section
3. **Check "Wallet Detection Status"** - should show available wallets
4. **Try "Manual Wallet Connect"** section
5. **Connect Lace wallet** (ensure it's on Testnet network)

## ✅ **Expected Results**

### **Console Should Show:**
- ✅ No DOM property errors
- ✅ Wallet detection working
- ✅ Clean application startup

### **Wallet Connection Should Work:**
- ✅ Lace wallet appears in detected list
- ✅ Manual connection button works
- ✅ Shows testnet address and balance
- ✅ Ready for Iran donations

## 🛠️ **If Still Having Issues**

### **1. Directory Problems:**
```bash
# Reset your terminal location
cd ~
cd /Users/dhananjaya/Desktop/IDonate
pwd  # Should show the IDonate directory
```

### **2. Node.js Issues:**
```bash
# Check Node.js version
node --version  # Should be v18+ 
npm --version   # Should be v8+
```

### **3. Permission Issues:**
```bash
# Fix script permissions
chmod +x /Users/dhananjaya/Desktop/IDonate/*.sh
```

### **4. Dependencies Issues:**
```bash
# Clean install
cd /Users/dhananjaya/Desktop/IDonate/charitychain-hackathon/frontend
rm -rf node_modules package-lock.json
npm install
```

## 🎉 **Success Checklist**

```
□ Scripts are executable
□ Terminal is in correct directory  
□ Frontend starts on :3000
□ Backend starts on :3001 (optional)
□ No console errors about DOM properties
□ Wallet detection shows available wallets
□ Lace wallet connection works
□ Ready to test Iran donations
```

## 🇮🇷 **Ready for Iran Donations!**

Your CharityChain platform is now configured for:
- ✅ **Transparent donations** to Iranian NGOs
- ✅ **Blockchain tracking** on Cardano testnet
- ✅ **Wallet integration** with Lace/Eternl/Nami
- ✅ **Real-time monitoring** of donation impact

**Start helping Iranian families today with blockchain transparency!** 🌟
