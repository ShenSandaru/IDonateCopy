# 🔧 Wallet Connection Troubleshooting Guide

## 🚨 Why Wallet Connect Button Doesn't Work

### **Common Issues & Solutions:**

### **1. Wallet Extension Not Detected**
**Problem:** CardanoWallet component shows no wallets
**Solutions:**
- ✅ **Install Lace wallet extension** from Chrome Web Store
- ✅ **Refresh browser** after installing
- ✅ **Enable extension** in browser settings
- ✅ **Try different browser** (Chrome, Firefox, Edge)

### **2. Network Mismatch**
**Problem:** Wallet connects but shows wrong network
**Solutions:**
- ✅ **Switch Lace to "Testnet"** (Settings → Network → Testnet)
- ✅ **Match your .env.local** network settings:
  ```bash
  NEXT_PUBLIC_BLOCKFROST_NETWORK=testnet
  NEXT_PUBLIC_NETWORK=testnet
  ```
- ✅ **Restart development server** after changes

### **3. Mesh SDK Issues**
**Problem:** useWallet hook not working
**Solutions:**
- ✅ **Check console for errors** (F12 → Console)
- ✅ **Use Manual Wallet Connect** (backup method)
- ✅ **Verify MeshProvider** wraps the app correctly
- ✅ **Update Mesh SDK** to latest version

### **4. API Key Problems**
**Problem:** Blockfrost connection fails
**Solutions:**
- ✅ **Verify API key** starts with `testnet`
- ✅ **Check key hasn't expired** at blockfrost.io
- ✅ **No spaces** in .env.local file
- ✅ **Restart dev server** after env changes

## 🛠️ **Debug Steps:**

### **Step 1: Open Browser Console**
```
F12 → Console Tab
```
Look for error messages about:
- Mesh SDK initialization
- Cardano wallet detection
- API connection issues

### **Step 2: Check Wallet Detection**
The app now includes a **Wallet Debugger** showing:
- Available wallets in `window.cardano`
- Mesh SDK connection status
- Environment configuration

### **Step 3: Try Manual Connection**
Use the **Manual Wallet Connect** component:
- Bypasses Mesh SDK
- Direct wallet API access
- Shows detailed error messages

### **Step 4: Verify Network Setup**
Ensure all components use same network:
- **Lace wallet:** Testnet
- **Blockfrost:** testnet API key
- **App config:** testnet in .env.local

## 🔍 **Testing Checklist:**

```
□ Lace wallet extension installed
□ Lace switched to "Testnet" network
□ Got test ADA from faucet
□ .env.local has testnet configuration
□ Development server running
□ Browser console shows no errors
□ Manual wallet connection works
□ Mesh SDK wallet detection works
```

## 🚀 **Quick Start Command:**

```bash
cd /Users/dhananjaya/Desktop/IDonate
./start-debug.sh
```

This script will:
- Install dependencies
- Check environment
- Start dev server with debug info
- Show wallet troubleshooting tips

## 📞 **Still Not Working?**

1. **Check browser compatibility:** Use Chrome/Firefox
2. **Disable ad blockers:** May block wallet extensions
3. **Clear browser cache:** Hard refresh (Ctrl+Shift+R)
4. **Try incognito mode:** Test without extensions
5. **Check wallet extension updates:** Update to latest version

## ✅ **Working Connection Should Show:**

- ✅ Green "Connected to Lace" message
- ✅ Wallet address displayed
- ✅ ADA balance shown
- ✅ Network info: "Testnet"
- ✅ Ready to make donations

Your CharityChain wallet connection debugging is complete! 🎉
