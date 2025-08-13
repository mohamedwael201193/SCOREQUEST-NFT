"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { useWeb3 } from "@/lib/web3-context"
import { Zap, ExternalLink, CheckCircle, AlertCircle, Loader2 } from "lucide-react"
import { CONTRACT_CONFIG } from "@/lib/constants"

interface NFTMintButtonProps {
  score: number
  onMintSuccess?: (txHash: string) => void
  onMintError?: (error: string) => void
}

export function NFTMintButton({ score, onMintSuccess, onMintError }: NFTMintButtonProps) {
  const { isConnected, isCorrectChain, mintNFT, account } = useWeb3()
  const [isMinting, setIsMinting] = useState(false)
  const [mintStatus, setMintStatus] = useState<"idle" | "success" | "error">("idle")
  const [txHash, setTxHash] = useState<string>("")
  const [errorMessage, setErrorMessage] = useState<string>("")

  const handleMint = async () => {
    if (!isConnected || !isCorrectChain) {
      setErrorMessage("Please connect your wallet and switch to Monad Testnet")
      setMintStatus("error")
      return
    }

    setIsMinting(true)
    setMintStatus("idle")
    setErrorMessage("")

    try {
      // Create metadata for the NFT
      const metadata = {
        name: `Monad Mission 7 Victory #${Date.now()}`,
        description: `Congratulations! You've successfully completed Monad Mission 7 with a score of ${score} points. This NFT represents your skill and dedication in the cyberpunk arena.`,
        image: "/placeholder.svg?height=400&width=400",
        attributes: [
          {
            trait_type: "Score",
            value: score,
          },
          {
            trait_type: "Mission",
            value: "Mission 7",
          },
          {
            trait_type: "Completion Date",
            value: new Date().toISOString().split("T")[0],
          },
          {
            trait_type: "Rarity",
            value: score >= 25 ? "Legendary" : score >= 22 ? "Epic" : "Rare",
          },
        ],
      }

      // In a real implementation, you would upload this metadata to IPFS
      // For now, we'll use a placeholder URI
      const tokenURI = `data:application/json;base64,${btoa(JSON.stringify(metadata))}`

      const hash = await mintNFT(tokenURI)
      setTxHash(hash)
      setMintStatus("success")
      onMintSuccess?.(hash)
    } catch (error: any) {
      console.error("Minting error:", error)
      const errorMsg = error.message || "Failed to mint NFT"
      setErrorMessage(errorMsg)
      setMintStatus("error")
      onMintError?.(errorMsg)
    } finally {
      setIsMinting(false)
    }
  }

  if (mintStatus === "success") {
    return (
      <div className="space-y-4">
        <Card className="p-4 bg-secondary/10 neon-border border-secondary/50">
          <div className="flex items-center gap-3 mb-3">
            <CheckCircle className="w-6 h-6 text-secondary" />
            <h3 className="font-display text-lg font-bold text-secondary">NFT Minted Successfully!</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">
            Your victory NFT has been minted to your wallet. Transaction confirmed on Monad Testnet.
          </p>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="font-display text-xs neon-border border-secondary/50 text-secondary hover:bg-secondary/20 bg-transparent"
              onClick={() => window.open(`${CONTRACT_CONFIG.BLOCK_EXPLORER}/tx/${txHash}`, "_blank")}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              View Transaction
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="font-display text-xs neon-border border-secondary/50 text-secondary hover:bg-secondary/20 bg-transparent"
              onClick={() => window.open(`${CONTRACT_CONFIG.BLOCK_EXPLORER}/address/${account}`, "_blank")}
            >
              <ExternalLink className="mr-1 h-3 w-3" />
              View Wallet
            </Button>
          </div>
        </Card>
      </div>
    )
  }

  if (mintStatus === "error") {
    return (
      <div className="space-y-4">
        <Card className="p-4 bg-destructive/10 neon-border border-destructive/50">
          <div className="flex items-center gap-3 mb-3">
            <AlertCircle className="w-6 h-6 text-destructive" />
            <h3 className="font-display text-lg font-bold text-destructive">Minting Failed</h3>
          </div>
          <p className="text-sm text-muted-foreground mb-3">{errorMessage}</p>
        </Card>
        <Button
          onClick={handleMint}
          disabled={isMinting || !isConnected || !isCorrectChain}
          className="w-full font-display text-lg py-6 neon-border bg-secondary/20 hover:bg-secondary/30 text-secondary hover:text-secondary-foreground transition-all duration-300 glow-sm"
        >
          <Zap className="mr-2 h-5 w-5" />
          Try Again
        </Button>
      </div>
    )
  }

  return (
    <Button
      onClick={handleMint}
      disabled={isMinting || !isConnected || !isCorrectChain}
      className="w-full font-display text-lg py-6 neon-border bg-secondary/20 hover:bg-secondary/30 text-secondary hover:text-secondary-foreground transition-all duration-300 glow-sm"
    >
      {isMinting ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" />
          Minting NFT...
        </>
      ) : (
        <>
          <Zap className="mr-2 h-5 w-5" />
          Claim NFT Reward
        </>
      )}
    </Button>
  )
}
