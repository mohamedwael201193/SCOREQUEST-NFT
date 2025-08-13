export const GAME_CONFIG = {
  TARGET_SCORE: 20,
  GAME_DURATION: 60, // seconds
  CLICK_POINTS: 1,
  BONUS_MULTIPLIER: 2,
  TARGET_LIFETIME: 3000, // Added target lifetime for enhanced game area
} as const

export const CONTRACT_CONFIG = {
  ADDRESS: "0x16FAb074954D2eE5A5Dbc4Be8781638612C57250",
  CHAIN_ID: 10143, // Monad Testnet - corrected from 41454
  CHAIN_NAME: "Monad Testnet",
  RPC_URL: "https://testnet-rpc.monad.xyz",
  BLOCK_EXPLORER: "https://testnet.monadexplorer.com",
  NATIVE_TOKEN: {
    name: "MON",
    symbol: "MON",
    decimals: 18,
  },
} as const

export const SOCIAL_CONFIG = {
  twitterShareUrl: "https://twitter.com/intent/tweet?text=",
  gameUrl: "https://scorequest-nft.vercel.app",
  hashtags: "#MonadGameJam #ScoreQuest #Web3Gaming #NFT",
} as const

export const NFT_CONFIG = {
  baseTokenURI: "https://gateway.pinata.cloud/ipfs/QmYourHashHere/",
  defaultMetadata: {
    name: "ScoreQuest Victory NFT",
    description: "A victory NFT earned by reaching 20+ points in ScoreQuest on Monad Testnet",
    image: "https://gateway.pinata.cloud/ipfs/QmYourImageHashHere",
    attributes: [
      {
        trait_type: "Game",
        value: "ScoreQuest NFT",
      },
      {
        trait_type: "Network",
        value: "Monad Testnet",
      },
    ],
  },
} as const

export const CONTRACT_ABI = [
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "string", name: "tokenURI", type: "string" },
    ],
    name: "mintNFT",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
] as const
