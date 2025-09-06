# OnboardIQ Blockchain Features Demo Guide

## 🎯 Quick Start Demo

This guide will walk you through testing the new blockchain features in OnboardIQ.

## 🚀 Demo Steps

### 1. Start the Application
```bash
npm run dev
```

### 2. Navigate to Blockchain Features

#### Option A: Use the Navigation Menu
1. Open the application in your browser
2. Click on the navigation menu (hamburger icon)
3. Scroll down to "Blockchain Features" section
4. Click on "Blockchain Dashboard"

#### Option B: Direct URL Access
- **Blockchain Dashboard**: `http://localhost:5173/blockchain`
- **ZK Identity Verification**: `http://localhost:5173/zk-identity`
- **NFT Gallery**: `http://localhost:5173/nft-gallery`
- **Wallet Connection**: `http://localhost:5173/wallet`

### 3. Connect Your Wallet

1. **Install MetaMask** (if not already installed)
   - Visit [metamask.io](https://metamask.io)
   - Install the browser extension
   - Create a new wallet or import existing

2. **Switch to Test Network**
   - Open MetaMask
   - Switch to "Sepolia Test Network"
   - Get test ETH from [Sepolia Faucet](https://sepoliafaucet.com/)

3. **Connect Wallet in App**
   - Click "Connect Wallet" button
   - Approve the connection in MetaMask
   - Verify your address is displayed

### 4. Test Zero-Knowledge Identity Verification

1. **Navigate to ZK Identity** (`/zk-identity`)
2. **Generate Age Proof**
   - Enter your age (e.g., 25)
   - Set minimum age (e.g., 18)
   - Click "Generate Age Proof"
   - Verify the proof appears in the "ZK Proofs" tab

3. **Generate Citizenship Proof**
   - Select your country from dropdown
   - Click "Generate Citizenship Proof"
   - Check the "My Claims" tab for the new claim

4. **Generate Employment Proof**
   - Enter company name (e.g., "Tech Corp")
   - Enter position (e.g., "Software Engineer")
   - Click "Generate Employment Proof"

### 5. Test NFT Features

1. **Navigate to NFT Gallery** (`/nft-gallery`)
2. **View Marketplace**
   - Browse available NFTs
   - Use search and filter options
   - View NFT details

3. **Mint Custom NFT**
   - Click "Mint NFT" button
   - Fill in NFT details:
     - Name: "My First NFT"
     - Description: "A custom achievement NFT"
     - Achievement Type: "Custom Achievement"
   - Click "Mint NFT"
   - Verify NFT appears in "My NFTs" tab

4. **Create Achievement NFTs**
   - Go to "Achievements" tab
   - Click "Earn NFT" on any achievement
   - Verify NFT is minted and appears in your collection

5. **List NFT for Sale** (Optional)
   - In "My NFTs" tab, click the trending icon on an NFT
   - Set a price (e.g., 0.001 ETH)
   - Click "List for Sale"
   - Verify NFT appears in marketplace

### 6. Explore Blockchain Dashboard

1. **Navigate to Dashboard** (`/blockchain`)
2. **View Overview**
   - Check wallet balance
   - Review identity claims count
   - See NFT collection size
   - Monitor verification score

3. **Explore Tabs**
   - **Identity Tab**: View all verified claims
   - **NFTs Tab**: Browse your NFT collection
   - **Achievements Tab**: Track progress on various milestones

## 🎮 Interactive Features

### Wallet Management
- **Balance Display**: Real-time ETH balance
- **Network Switching**: Change between supported networks
- **Transaction History**: View recent transactions
- **Address Copy**: Copy wallet address to clipboard

### Identity Verification
- **Multiple Proof Types**: Age, citizenship, employment, education
- **Privacy Protection**: Personal data never exposed
- **Claim Management**: Organize and track verified credentials
- **Proof Verification**: Cryptographic proof validation

### NFT Marketplace
- **Custom Minting**: Create personalized NFTs
- **Achievement System**: Earn NFTs for milestones
- **Trading Platform**: Buy, sell, and trade NFTs
- **Collection Management**: Organize NFT portfolio

## 🔧 Demo Data

The application includes mock data for demonstration:

### Sample Identity Claims
- Age: 25 (Verified)
- Citizenship: United States (Verified)
- Employment: Software Engineer at Tech Corp (Verified)

### Sample NFTs
- Welcome Badge (Common)
- Profile Completion Master (Rare)
- Document Expert (Uncommon)
- Verification Pro (Epic)

### Sample Collections
- OnboardIQ Achievements (1000 total supply)
- OnboardIQ Badges (500 total supply)

## 🐛 Troubleshooting

### Common Issues

#### "MetaMask not detected"
- Ensure MetaMask extension is installed
- Refresh the page
- Check if MetaMask is unlocked

#### "Transaction failed"
- Check if you have sufficient ETH for gas
- Ensure you're on the correct network
- Try increasing gas limit

#### "Proof generation failed"
- Verify all required fields are filled
- Check browser console for errors
- Ensure wallet is connected

#### "NFT minting failed"
- Confirm wallet connection
- Check ETH balance for gas fees
- Verify contract is deployed (for production)

### Debug Mode

Enable debug logging by opening browser console:
```javascript
// Enable debug mode
localStorage.setItem('debug', 'true');

// View service states
console.log('Web3 Service:', web3Service);
console.log('ZK Identity Service:', zkIdentityService);
console.log('NFT Service:', nftService);
```

## 📊 Demo Metrics

Track these metrics during your demo:

### User Engagement
- Wallet connection success rate
- Proof generation completion
- NFT minting frequency
- Feature usage patterns

### Technical Performance
- Page load times
- Transaction confirmation speed
- Proof generation duration
- API response times

### User Experience
- Navigation ease
- Feature discoverability
- Error handling
- Overall satisfaction

## 🎯 Demo Scenarios

### Scenario 1: New User Onboarding
1. Connect wallet for first time
2. Complete identity verification
3. Earn first achievement NFT
4. Explore marketplace features

### Scenario 2: Power User Experience
1. Generate multiple ZK proofs
2. Mint custom NFTs
3. Trade NFTs on marketplace
4. Complete achievement milestones

### Scenario 3: Enterprise Demo
1. Showcase privacy features
2. Demonstrate compliance capabilities
3. Highlight security benefits
4. Present scalability options

## 📈 Next Steps

After completing the demo:

1. **Provide Feedback**: Share your experience and suggestions
2. **Report Issues**: Document any bugs or problems encountered
3. **Feature Requests**: Suggest new features or improvements
4. **Integration Ideas**: Propose integration opportunities

## 🆘 Support

If you encounter issues during the demo:

- **Documentation**: Check the main README files
- **Community**: Join our Discord server
- **Issues**: Report on GitHub
- **Contact**: Email support@onboardiq.com

---

**Happy Demo-ing! 🚀**

The blockchain features are designed to enhance the OnboardIQ experience with cutting-edge Web3 technology while maintaining ease of use and security.
