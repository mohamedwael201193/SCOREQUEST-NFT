"use client"

import { useState, useCallback, useEffect, useRef } from "react"
import { EnhancedGameArea } from "./enhanced-game-area"
import { GameOverModal } from "./game-over-modal"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Play, ArrowLeft } from "lucide-react"
import { GameAnimations } from "@/lib/animations"

interface GameContainerProps {
  onBackToHome: () => void
}

export function GameContainer({ onBackToHome }: GameContainerProps) {
  const [gameState, setGameState] = useState<"waiting" | "playing" | "ended">("waiting")
  const [finalScore, setFinalScore] = useState(0)
  const [gameWon, setGameWon] = useState(false)
  const [currentScore, setCurrentScore] = useState(0)
  const [timeTaken, setTimeTaken] = useState(0)

  const containerRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    if (containerRef.current) {
      GameAnimations.animateHeroEntrance()
    }
  }, [])

  const startGame = useCallback(() => {
    setGameState("playing")
    setCurrentScore(0)
    setFinalScore(0)
    setGameWon(false)
    setTimeTaken(0)
  }, [])

  const handleGameEnd = useCallback((score: number, won: boolean, gameTime: number) => {
    setFinalScore(score)
    setGameWon(won)
    setTimeTaken(gameTime)
    setGameState("ended")
  }, [])

  const handleRestart = useCallback(() => {
    setGameState("waiting")
  }, [])

  const handleScoreChange = useCallback((score: number) => {
    setCurrentScore(score)
  }, [])

  if (gameState === "waiting") {
    return (
      <div ref={containerRef} className="min-h-screen bg-background cyber-grid flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-6 text-center">
          <Button
            onClick={onBackToHome}
            variant="ghost"
            className="absolute top-6 left-6 font-display text-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>

          <div className="hero-title animate-float mb-8">
            <h1 className="font-display text-5xl md:text-7xl font-bold gradient-text mb-4">READY?</h1>
            <p className="hero-description text-xl text-muted-foreground mb-8">
              Click targets as fast as you can. Reach 20 points to win and mint your NFT reward!
            </p>
          </div>

          <Card className="feature-card p-8 bg-card/50 backdrop-blur-sm neon-border border-primary/50 mb-8">
            <h3 className="font-display text-2xl font-bold text-primary mb-4">Mission Briefing</h3>
            <div className="space-y-3 text-left">
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-primary rounded-full"></div>
                <span>Click targets before they disappear</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-secondary rounded-full"></div>
                <span>Blue targets give bonus points</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-destructive rounded-full"></div>
                <span>Red targets subtract points - avoid them!</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="w-2 h-2 bg-accent rounded-full"></div>
                <span>Build combos for extra points</span>
              </div>
            </div>
          </Card>

          <Button
            onClick={startGame}
            size="lg"
            className="hero-buttons font-display text-2xl px-12 py-8 neon-border bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary-foreground transition-all duration-300 glow animate-pulse-glow"
          >
            <Play className="mr-3 h-8 w-8" />
            START MISSION
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background cyber-grid">
      <div className="container mx-auto px-6 py-8">
        <div className="flex items-center justify-between mb-8">
          <Button
            onClick={onBackToHome}
            variant="ghost"
            className="font-display text-primary hover:text-primary-foreground"
          >
            <ArrowLeft className="mr-2 h-5 w-5" />
            Back to Home
          </Button>
          <h1 className="font-display text-3xl font-bold gradient-text">MISSION 7 - ACTIVE</h1>
          <div className="w-24"></div> {/* Spacer for centering */}
        </div>

        {gameState === "playing" && <EnhancedGameArea onGameEnd={handleGameEnd} onScoreChange={handleScoreChange} />}

        <GameOverModal
          isOpen={gameState === "ended"}
          score={finalScore}
          won={gameWon}
          timeTaken={timeTaken}
          onRestart={handleRestart}
        />
      </div>
    </div>
  )
}
