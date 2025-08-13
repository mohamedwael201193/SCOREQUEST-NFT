"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { NFTMintButton } from "@/components/web3/nft-mint-button"
import { Trophy, RotateCcw, Coins, Users } from "lucide-react"
import { GAME_CONFIG } from "@/lib/constants"
import SubmitScoreModal from "@/components/leaderboard/submit-score-modal"
import LeaderboardModal from "@/components/leaderboard/leaderboard-modal"
import { RankBadge } from "@/components/game/rank-badge" // Added rank badge import
import { TwitterShareButton } from "@/components/social/twitter-share-button" // Added Twitter share import

interface GameOverModalProps {
  isOpen: boolean
  score: number
  won: boolean
  timeTaken: number
  onRestart: () => void
}

export function GameOverModal({ isOpen, score, won, timeTaken, onRestart }: GameOverModalProps) {
  const [showSubmitScore, setShowSubmitScore] = useState(false)
  const [showLeaderboard, setShowLeaderboard] = useState(false)
  const [nftMinted, setNftMinted] = useState(false) // Added NFT minted state

  const handleScoreSubmitted = () => {
    setShowLeaderboard(true)
  }

  const handleNftMintSuccess = (txHash: string) => {
    setNftMinted(true)
    console.log("NFT minted:", txHash)
  }

  return (
    <>
      <Dialog open={isOpen}>
        <DialogContent className="max-w-md bg-card/95 backdrop-blur-sm neon-border border-primary/50">
          <div className="text-center space-y-6 p-6">
            {won ? (
              <>
                <div className="animate-float">
                  <Trophy className="w-20 h-20 text-secondary mx-auto glow" />
                </div>
                <div>
                  <h2 className="font-display text-3xl font-bold gradient-text mb-2">VICTORY ACHIEVED!</h2>
                  <p className="text-lg text-muted-foreground">Outstanding performance!</p>
                  <div className="flex justify-center mt-3">
                    <RankBadge score={score} />
                  </div>
                </div>

                <Card className="p-4 bg-secondary/10 neon-border border-secondary/50">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Coins className="w-6 h-6 text-secondary" />
                    <span className="font-display text-2xl font-bold text-secondary">{score} Points</span>
                  </div>
                  <p className="text-sm text-muted-foreground">Target achieved: {GAME_CONFIG.TARGET_SCORE} points</p>
                  <p className="text-sm text-muted-foreground">
                    Time: {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, "0")}
                  </p>
                  {nftMinted && <p className="text-sm text-green-400 font-semibold mt-2">Reward Claimed ✅</p>}
                </Card>

                <div className="space-y-3">
                  <NFTMintButton
                    score={score}
                    onMintSuccess={handleNftMintSuccess}
                    onMintError={(error) => console.error("Mint error:", error)}
                  />

                  <TwitterShareButton score={score} nftMinted={nftMinted} className="w-full" />

                  <Button
                    onClick={() => setShowSubmitScore(true)}
                    className="w-full font-display text-lg py-6 neon-border bg-accent/20 hover:bg-accent/30 text-accent hover:text-accent-foreground transition-all duration-300"
                  >
                    <Users className="mr-2 h-5 w-5" />
                    SUBMIT TO LEADERBOARD
                  </Button>

                  <Button
                    onClick={onRestart}
                    variant="outline"
                    className="w-full font-display text-lg py-6 neon-border border-primary text-primary hover:bg-primary/20 transition-all duration-300 bg-transparent"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    PLAY AGAIN
                  </Button>
                </div>
              </>
            ) : (
              <>
                <div className="animate-float">
                  <div className="w-20 h-20 mx-auto rounded-full bg-destructive/20 border-2 border-destructive flex items-center justify-center glow">
                    <Coins className="w-10 h-10 text-destructive" />
                  </div>
                </div>

                <div>
                  <h2 className="font-display text-3xl font-bold text-destructive mb-2">MISSION FAILED</h2>
                  <p className="text-lg text-muted-foreground">Better luck next time!</p>
                  {score > 0 && (
                    <div className="flex justify-center mt-3">
                      <RankBadge score={score} />
                    </div>
                  )}
                </div>

                <Card className="p-4 bg-destructive/10 neon-border border-destructive/50">
                  <div className="flex items-center justify-center gap-2 mb-2">
                    <Coins className="w-6 h-6 text-destructive" />
                    <span className="font-display text-2xl font-bold text-destructive">
                      {score} / {GAME_CONFIG.TARGET_SCORE}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground">
                    You needed {GAME_CONFIG.TARGET_SCORE - score} more points to win
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Time: {Math.floor(timeTaken / 60)}:{(timeTaken % 60).toString().padStart(2, "0")}
                  </p>
                </Card>

                <div className="space-y-3">
                  {score >= 10 && <TwitterShareButton score={score} nftMinted={false} className="w-full" />}

                  {score > 0 && (
                    <Button
                      onClick={() => setShowSubmitScore(true)}
                      variant="outline"
                      className="w-full font-display text-lg py-6 neon-border border-accent text-accent hover:bg-accent/20 transition-all duration-300 bg-transparent"
                    >
                      <Users className="mr-2 h-5 w-5" />
                      SUBMIT SCORE
                    </Button>
                  )}

                  <Button
                    onClick={onRestart}
                    className="w-full font-display text-lg py-6 neon-border bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary-foreground transition-all duration-300 glow-sm"
                  >
                    <RotateCcw className="mr-2 h-5 w-5" />
                    TRY AGAIN
                  </Button>
                </div>
              </>
            )}

            <Button
              onClick={() => setShowLeaderboard(true)}
              variant="ghost"
              className="w-full text-muted-foreground hover:text-foreground"
            >
              <Trophy className="mr-2 h-4 w-4" />
              View Leaderboard
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      <SubmitScoreModal
        isOpen={showSubmitScore}
        onClose={() => setShowSubmitScore(false)}
        score={score}
        timeTaken={timeTaken}
        onScoreSubmitted={handleScoreSubmitted}
      />

      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </>
  )
}
