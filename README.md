# 🎮 MONAD MISSION 7

A futuristic blockchain-powered skill game built with Next.js, featuring NFT rewards, real-time leaderboards, and stunning 3D cyberpunk visuals.

![Monad Mission 7](https://img.shields.io/badge/Game-Blockchain%20Powered-purple?style=for-the-badge)
![Next.js](https://img.shields.io/badge/Next.js-15.1.3-black?style=for-the-badge&logo=next.js)
![TypeScript](https://img.shields.io/badge/TypeScript-5.7.2-blue?style=for-the-badge&logo=typescript)

## 🚀 Features

### 🎯 Core Gameplay
- **Skill-Based Clicking Game**: Fast-paced target clicking with increasing difficulty
- **Multiple Target Types**: Normal (+1), Bonus (+3), and Penalty (-1) targets
- **Combo System**: Build streaks for bonus points
- **60-Second Challenges**: Race against time to reach 20 points
- **Real-Time Scoring**: Live score tracking and progress indicators

### 🔗 Blockchain Integration
- **MetaMask Connection**: Seamless wallet integration
- **Monad Testnet Support**: Automatic network switching
- **NFT Minting**: Mint exclusive NFTs when reaching 20 points
- **Transaction Tracking**: Real-time transaction status and block explorer links

### 🏆 Leaderboard System
- **Real-Time Rankings**: Live leaderboard with top players
- **Score Submission**: Submit scores with wallet addresses
- **Performance Tracking**: Track completion times and scores
- **Persistent Storage**: Supabase-powered database

### 🎨 Visual Excellence
- **3D Cyberpunk Design**: Immersive 3D hero section with floating elements
- **GSAP Animations**: Premium animations and particle effects
- **Neon Aesthetics**: Glowing borders, text effects, and holographic panels
- **Responsive Design**: Optimized for all devices

## 🛠️ Tech Stack

- **Frontend**: Next.js 15.1.3, React 19, TypeScript
- **Styling**: Tailwind CSS v4, Custom 3D CSS
- **Animations**: GSAP 3.12.5, Framer Motion
- **Blockchain**: Ethers.js 6.13.4, MetaMask integration
- **Database**: Supabase (PostgreSQL)
- **UI Components**: Radix UI, shadcn/ui
- **Deployment**: Vercel

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ 
- npm or yarn
- MetaMask browser extension
- Supabase account (for leaderboard)

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd monad-mission-7
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Set up environment variables**
   \`\`\`bash
   cp .env.example .env.local
   \`\`\`

4. **Configure environment variables** (see [Environment Variables](#environment-variables))

5. **Set up database**
   \`\`\`bash
   # Run the SQL script in your Supabase dashboard or use the v0 script runner
   # File: scripts/create-leaderboard-table.sql
   \`\`\`

6. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

7. **Open your browser**
   \`\`\`
   http://localhost:3000
   \`\`\`

## 🔧 Environment Variables

Create a `.env.local` file with the following variables:

### Supabase (Required for Leaderboard)
\`\`\`env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key
\`\`\`

### Blockchain Configuration (Built-in)
The following are pre-configured for Monad Testnet:
- Contract Address: `0x1234567890123456789012345678901234567890`
- Chain ID: `41454` (Monad Testnet)
- RPC URL: `https://testnet-rpc.monad.xyz`

## 🎮 How to Play

1. **Connect Wallet**: Click "Connect Wallet" and approve MetaMask connection
2. **Start Mission**: Click "START MISSION" to begin the game
3. **Click Targets**: 
   - Purple targets: +1 point
   - Blue targets: +3 points (bonus)
   - Red targets: -1 point (avoid!)
4. **Build Combos**: Hit consecutive targets for bonus points
5. **Reach 20 Points**: Win the game and unlock NFT minting
6. **Mint NFT**: Winners can mint exclusive NFTs as proof of victory
7. **Submit Score**: Add your score to the global leaderboard

## 🏗️ Project Structure

\`\`\`
monad-mission-7/
├── app/                    # Next.js app directory
│   ├── api/               # API routes
│   │   └── leaderboard/   # Leaderboard endpoints
│   ├── globals.css        # Global styles and 3D effects
│   ├── layout.tsx         # Root layout
│   └── page.tsx           # Home page
├── components/            # React components
│   ├── 3d/               # 3D visual components
│   ├── game/             # Game logic components
│   ├── leaderboard/      # Leaderboard components
│   ├── ui/               # UI components (shadcn)
│   └── web3/             # Blockchain components
├── lib/                  # Utilities and configurations
│   ├── animations.ts     # GSAP animation utilities
│   ├── constants.ts      # Game and blockchain constants
│   ├── supabase/         # Database client setup
│   ├── utils.ts          # General utilities
│   └── web3-context.tsx  # Web3 provider
└── scripts/              # Database scripts
    └── create-leaderboard-table.sql
\`\`\`

## 🎨 3D Visual Features

### Hero Section
- **Floating 3D Cubes**: Wireframe cubes with rotation animations
- **Particle Field**: Dynamic particle system with color variations
- **Holographic Panels**: Semi-transparent panels with scan effects
- **Matrix Rain**: Digital rain effect for cyberpunk atmosphere
- **3D Text**: Depth-enhanced typography with shadows

### Game Effects
- **Particle Bursts**: Explosion effects on target hits
- **Screen Shake**: Penalty feedback with camera shake
- **Score Popups**: Animated score indicators
- **Combo Animations**: Visual feedback for streak building
- **Neon Glows**: Dynamic lighting effects

## 🔗 Blockchain Integration

### Supported Networks
- **Monad Testnet**: Primary network for NFT minting
- **Automatic Switching**: Prompts users to switch networks

### Smart Contract
- **Address**: `0x1234567890123456789012345678901234567890`
- **Function**: `mintNFT(address to, uint256 score)`
- **Requirements**: Score ≥ 20 points

### MetaMask Integration
- **Connection**: One-click wallet connection
- **Network Detection**: Automatic network validation
- **Transaction Handling**: Real-time transaction status

## 📊 Database Schema

### Leaderboard Table
\`\`\`sql
CREATE TABLE leaderboard (
  id SERIAL PRIMARY KEY,
  player_name VARCHAR(50) NOT NULL,
  wallet_address VARCHAR(42),
  score INTEGER NOT NULL,
  time_taken INTEGER NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
\`\`\`

## 🚀 Deployment

### Vercel Deployment (Recommended)

1. **Push to GitHub**
   \`\`\`bash
   git add .
   git commit -m "Initial commit"
   git push origin main
   \`\`\`

2. **Deploy to Vercel**
   - Connect your GitHub repository to Vercel
   - Add environment variables in Vercel dashboard
   - Deploy automatically on push

3. **Configure Integrations**
   - Add Supabase integration in Vercel
   - Environment variables are automatically configured

### Manual Deployment

1. **Build the project**
   \`\`\`bash
   npm run build
   \`\`\`

2. **Start production server**
   \`\`\`bash
   npm start
   \`\`\`

## 🐛 Troubleshooting

### Common Issues

**MetaMask Connection Issues**
- Ensure MetaMask is installed and unlocked
- Check if you're on the correct network (Monad Testnet)
- Clear browser cache and try again

**Leaderboard Not Loading**
- Verify Supabase environment variables
- Check if the leaderboard table exists
- Ensure database permissions are correct

**Game Performance Issues**
- Disable browser extensions that might interfere
- Ensure hardware acceleration is enabled
- Try a different browser (Chrome recommended)

**NFT Minting Fails**
- Ensure you have sufficient testnet tokens
- Check if you've reached the 20-point requirement
- Verify contract address and network

### Debug Mode
Add `?debug=true` to the URL for additional console logging.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Monad**: For the innovative blockchain platform
- **Vercel**: For seamless deployment and hosting
- **Supabase**: For the powerful database solution
- **GSAP**: For premium animation capabilities
- **shadcn/ui**: For beautiful UI components

## 📞 Support

For support and questions:
- Open an issue on GitHub
- Contact the development team
- Check the troubleshooting guide above

---

**Built with ❤️ for the Monad ecosystem**
