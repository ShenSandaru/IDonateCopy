# 🔑 Blockfrost API Setup Guide

## Get Your FREE Blockfrost API Key

### Step 1: Create Blockfrost Account
1. Visit [blockfrost.io](https://blockfrost.io)
2. Click "Sign Up" and create a free account
3. Verify your email address

### Step 2: Create New Project
1. Click "Add new project"
2. Enter project name: `CharityChain Iran Donations`
3. **IMPORTANT: Select "Cardano Preprod"** (not Mainnet)
4. Click "Create project"

### Step 3: Get Your API Key
1. Click on your new project
2. Copy the **Project ID** (this is your API key)
3. It should start with `preprod...`

### Step 4: Update Environment File
1. Open `/frontend/.env.local`
2. Replace `preprodYOUR_BLOCKFROST_PROJECT_ID_HERE` with your actual Project ID
3. Save the file

Example:
```bash
# Before
NEXT_PUBLIC_BLOCKFROST_API_KEY=preprodYOUR_BLOCKFROST_PROJECT_ID_HERE

# After (with your real key)
NEXT_PUBLIC_BLOCKFROST_API_KEY=preprod1a2b3c4d5e6f7g8h9i0j1k2l3m4n5o6p
```

### Step 5: Verify Setup
1. Restart your development server
2. Connect your Lace wallet
3. Check that wallet balance loads correctly

## 🚨 Important Notes

- **Use Preprod network only** for testing
- **Never commit real API keys** to version control
- **Free tier includes** 50,000 requests per day
- **Rate limit:** 10 requests per second

## 🔒 Security Best Practices

- Keep your API key secret
- Add `.env.local` to `.gitignore`
- Use different keys for development/production
- Monitor usage in Blockfrost dashboard

## ✅ Testing Your Setup

Once configured, you should be able to:
- Connect Lace wallet to CharityChain
- See your testnet ADA balance
- View wallet address and UTXOs
- Make test donations to Iranian NGOs

Need help? Check the FAQ page in the CharityChain app!
