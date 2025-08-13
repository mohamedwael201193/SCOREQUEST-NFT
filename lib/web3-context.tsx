"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect, useCallback } from "react"
import { ethers } from "ethers"
import { CONTRACT_CONFIG, CONTRACT_ABI } from "./constants"

interface Web3ContextType {
  account: string | null
  isConnected: boolean
  isCorrectChain: boolean
  isConnecting: boolean
  provider: ethers.BrowserProvider | null
  contract: ethers.Contract | null
  connectWallet: () => Promise<void>
  disconnectWallet: () => void
  switchToMonadTestnet: () => Promise<void>
  mintNFT: (tokenURI: string) => Promise<string>
  error: string | null
}

const Web3Context = createContext<Web3ContextType | undefined>(undefined)

export function useWeb3() {
  const context = useContext(Web3Context)
  if (context === undefined) {
    throw new Error("useWeb3 must be used within a Web3Provider")
  }
  return context
}

interface Web3ProviderProps {
  children: React.ReactNode
}

export function Web3Provider({ children }: Web3ProviderProps) {
  const [account, setAccount] = useState<string | null>(null)
  const [isConnected, setIsConnected] = useState(false)
  const [isCorrectChain, setIsCorrectChain] = useState(false)
  const [isConnecting, setIsConnecting] = useState(false)
  const [provider, setProvider] = useState<ethers.BrowserProvider | null>(null)
  const [contract, setContract] = useState<ethers.Contract | null>(null)
  const [error, setError] = useState<string | null>(null)

  const checkChain = useCallback(async (provider: ethers.BrowserProvider) => {
    try {
      const network = await provider.getNetwork()
      const isCorrect = Number(network.chainId) === CONTRACT_CONFIG.CHAIN_ID
      setIsCorrectChain(isCorrect)
      return isCorrect
    } catch (err) {
      console.error("Error checking chain:", err)
      setIsCorrectChain(false)
      return false
    }
  }, [])

  const setupContract = useCallback((provider: ethers.BrowserProvider, signer: ethers.Signer) => {
    try {
      const contractInstance = new ethers.Contract(CONTRACT_CONFIG.ADDRESS, CONTRACT_ABI, signer)
      setContract(contractInstance)
      return contractInstance
    } catch (err) {
      console.error("Error setting up contract:", err)
      setError("Failed to setup contract")
      return null
    }
  }, [])

  const switchToMonadTestnet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed")
      return
    }

    try {
      setError(null)
      console.log("Attempting to switch to chain ID:", CONTRACT_CONFIG.CHAIN_ID)
      console.log("Chain ID in hex:", `0x${CONTRACT_CONFIG.CHAIN_ID.toString(16)}`)

      // Try to switch to Monad Testnet
      await window.ethereum.request({
        method: "wallet_switchEthereumChain",
        params: [{ chainId: `0x${CONTRACT_CONFIG.CHAIN_ID.toString(16)}` }],
      })
    } catch (switchError: any) {
      console.log("Switch error:", switchError)
      // If the chain doesn't exist, add it
      if (switchError.code === 4902) {
        try {
          console.log("Adding Monad Testnet with config:", {
            chainId: `0x${CONTRACT_CONFIG.CHAIN_ID.toString(16)}`,
            chainName: CONTRACT_CONFIG.CHAIN_NAME,
            rpcUrls: [CONTRACT_CONFIG.RPC_URL],
            blockExplorerUrls: [CONTRACT_CONFIG.BLOCK_EXPLORER],
          })

          await window.ethereum.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: `0x${CONTRACT_CONFIG.CHAIN_ID.toString(16)}`,
                chainName: CONTRACT_CONFIG.CHAIN_NAME,
                nativeCurrency: {
                  name: CONTRACT_CONFIG.NATIVE_TOKEN.name,
                  symbol: CONTRACT_CONFIG.NATIVE_TOKEN.symbol,
                  decimals: CONTRACT_CONFIG.NATIVE_TOKEN.decimals,
                },
                rpcUrls: [CONTRACT_CONFIG.RPC_URL],
                blockExplorerUrls: [CONTRACT_CONFIG.BLOCK_EXPLORER],
              },
            ],
          })
        } catch (addError) {
          console.error("Error adding chain:", addError)
          setError("Failed to add Monad Testnet to MetaMask")
        }
      } else {
        console.error("Error switching chain:", switchError)
        setError("Failed to switch to Monad Testnet")
      }
    }
  }, [])

  const connectWallet = useCallback(async () => {
    if (!window.ethereum) {
      setError("MetaMask is not installed. Please install MetaMask to continue.")
      return
    }

    setIsConnecting(true)
    setError(null)

    try {
      // Request account access
      const accounts = await window.ethereum.request({
        method: "eth_requestAccounts",
      })

      if (accounts.length === 0) {
        setError("No accounts found. Please connect your MetaMask wallet.")
        return
      }

      const provider = new ethers.BrowserProvider(window.ethereum)
      const signer = await provider.getSigner()
      const address = await signer.getAddress()

      setProvider(provider)
      setAccount(address)
      setIsConnected(true)

      // Check if we're on the correct chain
      const isCorrect = await checkChain(provider)
      if (isCorrect) {
        setupContract(provider, signer)
      }
    } catch (err: any) {
      console.error("Error connecting wallet:", err)
      if (err.code === 4001) {
        setError("Connection rejected by user")
      } else {
        setError("Failed to connect wallet")
      }
    } finally {
      setIsConnecting(false)
    }
  }, [checkChain, setupContract])

  const disconnectWallet = useCallback(() => {
    setAccount(null)
    setIsConnected(false)
    setIsCorrectChain(false)
    setProvider(null)
    setContract(null)
    setError(null)
  }, [])

  const mintNFT = useCallback(
    async (tokenURI: string): Promise<string> => {
      if (!contract || !account) {
        throw new Error("Wallet not connected or contract not available")
      }

      if (!isCorrectChain) {
        throw new Error("Please switch to Monad Testnet")
      }

      try {
        setError(null)
        const tx = await contract.mintNFT(account, tokenURI)
        const receipt = await tx.wait()
        return receipt.hash
      } catch (err: any) {
        console.error("Error minting NFT:", err)
        if (err.code === 4001) {
          throw new Error("Transaction rejected by user")
        } else if (err.code === -32603) {
          throw new Error("Insufficient funds for gas")
        } else {
          throw new Error("Failed to mint NFT: " + (err.message || "Unknown error"))
        }
      }
    },
    [contract, account, isCorrectChain],
  )

  // Handle account changes
  useEffect(() => {
    if (!window.ethereum) return

    const handleAccountsChanged = (accounts: string[]) => {
      if (accounts.length === 0) {
        disconnectWallet()
      } else if (accounts[0] !== account) {
        setAccount(accounts[0])
      }
    }

    const handleChainChanged = () => {
      window.location.reload()
    }

    window.ethereum.on("accountsChanged", handleAccountsChanged)
    window.ethereum.on("chainChanged", handleChainChanged)

    return () => {
      window.ethereum?.removeListener("accountsChanged", handleAccountsChanged)
      window.ethereum?.removeListener("chainChanged", handleChainChanged)
    }
  }, [account, disconnectWallet])

  // Check if already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      if (!window.ethereum) return

      try {
        const accounts = await window.ethereum.request({
          method: "eth_accounts",
        })

        if (accounts.length > 0) {
          const provider = new ethers.BrowserProvider(window.ethereum)
          const signer = await provider.getSigner()
          const address = await signer.getAddress()

          setProvider(provider)
          setAccount(address)
          setIsConnected(true)

          const isCorrect = await checkChain(provider)
          if (isCorrect) {
            setupContract(provider, signer)
          }
        }
      } catch (err) {
        console.error("Error checking connection:", err)
      }
    }

    checkConnection()
  }, [checkChain, setupContract])

  const value: Web3ContextType = {
    account,
    isConnected,
    isCorrectChain,
    isConnecting,
    provider,
    contract,
    connectWallet,
    disconnectWallet,
    switchToMonadTestnet,
    mintNFT,
    error,
  }

  return <Web3Context.Provider value={value}>{children}</Web3Context.Provider>
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    ethereum?: any
  }
}
