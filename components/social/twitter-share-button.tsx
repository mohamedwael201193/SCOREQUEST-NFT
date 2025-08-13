"use client"

import { Twitter } from "lucide-react"
import { Button } from "@/components/ui/button"
import { SOCIAL_CONFIG } from "@/lib/constants"

interface TwitterShareButtonProps {
  score: number
  nftMinted?: boolean
  className?: string
}

export function TwitterShareButton({ score, nftMinted = false, className = "" }: TwitterShareButtonProps) {
  const handleShare = () => {
    const customText = nftMinted
      ? `I just scored ${score} points and minted an NFT on ScoreQuest! 🎮🏆 Join the cyberpunk arena and test your skills on Monad Testnet! #MonadGameJam #ScoreQuest #Web3Gaming #NFT`
      : `I just scored ${score} points on ScoreQuest! 🎮 Can you beat my score? Join the cyberpunk arena on Monad Testnet! #MonadGameJam #ScoreQuest #Web3Gaming`

    const tweetUrl = `${SOCIAL_CONFIG.twitterShareUrl}${encodeURIComponent(customText)}&url=${encodeURIComponent(window.location.href)}`
    window.open(tweetUrl, "_blank", "width=550,height=420")
  }

  return (
    <Button
      onClick={handleShare}
      variant="outline"
      className={`neon-border border-blue-400 text-blue-400 hover:bg-blue-400/20 transition-all duration-300 ${className}`}
    >
      <Twitter className="h-4 w-4 mr-2" />
      Share Victory
    </Button>
  )
}
