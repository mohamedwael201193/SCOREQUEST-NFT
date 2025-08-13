"use client"

import { useState, useEffect, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { GameContainer } from "@/components/game/game-container"
import { WalletConnectButton } from "@/components/web3/wallet-connect-button"
import LeaderboardModal from "@/components/leaderboard/leaderboard-modal"
import { Hero3DScene } from "@/components/3d/hero-3d-scene"
import { Text3D } from "@/components/3d/text-3d"
import { Zap, Trophy, Gamepad2, Users } from "lucide-react"
import { GameAnimations } from "@/lib/animations"

export default function HomePage() {
  const [mounted, setMounted] = useState(false)
  const [currentView, setCurrentView] = useState<"home" | "game">("home")
  const [showLeaderboard, setShowLeaderboard] = useState(false)

  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    setMounted(true)

    if (heroRef.current) {
      setTimeout(() => {
        GameAnimations.animateHeroEntrance()
      }, 100)
    }
  }, [])

  if (!mounted) return null

  if (currentView === "game") {
    return <GameContainer onBackToHome={() => setCurrentView("home")} />
  }

  return (
    <>
      <div className="min-h-screen bg-background cyber-grid">
        {/* Hero Section with 3D Elements */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex items-center justify-center overflow-hidden scene-3d"
        >
          {/* 3D Background Scene */}
          <Hero3DScene />

          {/* Animated Background Elements */}
          <div className="absolute inset-0 opacity-20">
            <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/20 rounded-full blur-3xl animate-pulse-glow"></div>
            <div
              className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-secondary/20 rounded-full blur-3xl animate-pulse-glow"
              style={{ animationDelay: "1s" }}
            ></div>
            <div
              className="absolute top-1/2 left-1/2 w-48 h-48 bg-accent/20 rounded-full blur-3xl animate-pulse-glow"
              style={{ animationDelay: "2s" }}
            ></div>
          </div>

          <div className="relative z-10 text-center max-w-4xl mx-auto px-6 preserve-3d">
            <div className="animate-float">
              <Text3D className="hero-title font-display text-6xl md:text-8xl font-bold mb-6 gradient-text" glitch>
                SCOREQUEST
              </Text3D>
              <Text3D className="hero-subtitle font-display text-4xl md:text-6xl font-bold mb-8 text-glow">NFT</Text3D>
            </div>

            <p className="hero-description text-xl md:text-2xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed">
              Enter the cyberpunk arena. Test your reflexes. Compete on leaderboards.
              <span className="text-primary font-semibold"> Reach 20 points to mint your victory NFT.</span>
            </p>

            <div className="hero-buttons flex flex-col sm:flex-row gap-6 justify-center items-center mb-16">
              <Button
                onClick={() => setCurrentView("game")}
                size="lg"
                className="font-display text-lg px-8 py-6 neon-border bg-primary/20 hover:bg-primary/30 text-primary hover:text-primary-foreground transition-all duration-300 glow-sm transform hover:scale-105"
              >
                <Gamepad2 className="mr-2 h-6 w-6" />
                START MISSION
              </Button>

              <Button
                onClick={() => setShowLeaderboard(true)}
                size="lg"
                variant="outline"
                className="font-display text-lg px-8 py-6 neon-border border-accent text-accent hover:bg-accent/20 transition-all duration-300 bg-transparent transform hover:scale-105"
              >
                <Users className="mr-2 h-6 w-6" />
                LEADERBOARD
              </Button>

              <WalletConnectButton />
            </div>

            {/* Feature Cards with 3D Effects */}
            <div className="grid md:grid-cols-3 gap-6 max-w-4xl mx-auto preserve-3d">
              <Card className="feature-card p-6 bg-card/50 backdrop-blur-sm neon-border border-primary/50 hover:border-primary transition-all duration-300 transform hover:rotateY(5deg) hover:scale-105">
                <div className="text-center">
                  <Zap className="h-12 w-12 text-primary mx-auto mb-4 glow-sm" />
                  <h3 className="font-display text-xl font-semibold mb-2 text-primary">Lightning Fast</h3>
                  <p className="text-muted-foreground">Test your reflexes in high-speed challenges</p>
                </div>
              </Card>

              <Card className="feature-card p-6 bg-card/50 backdrop-blur-sm neon-border border-secondary/50 hover:border-secondary transition-all duration-300 transform hover:rotateY(-5deg) hover:scale-105">
                <div className="text-center">
                  <Trophy className="h-12 w-12 text-secondary mx-auto mb-4 glow-sm" />
                  <h3 className="font-display text-xl font-semibold mb-2 text-secondary">NFT Rewards</h3>
                  <p className="text-muted-foreground">Mint exclusive NFTs when you reach 20 points</p>
                </div>
              </Card>

              <Card className="feature-card p-6 bg-card/50 backdrop-blur-sm neon-border border-accent/50 hover:border-accent transition-all duration-300 transform hover:rotateY(5deg) hover:scale-105">
                <div className="text-center">
                  <Gamepad2 className="h-12 w-12 text-accent mx-auto mb-4 glow-sm" />
                  <h3 className="font-display text-xl font-semibold mb-2 text-accent">Skill Based</h3>
                  <p className="text-muted-foreground">Pure skill determines your success</p>
                </div>
              </Card>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-6">
          <div className="max-w-6xl mx-auto">
            <h2 className="font-display text-4xl font-bold text-center mb-16 gradient-text">GAME STATS</h2>

            <div className="grid md:grid-cols-4 gap-8">
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-primary mb-2">0</div>
                <div className="text-muted-foreground">Active Players</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-secondary mb-2">0</div>
                <div className="text-muted-foreground">NFTs Minted</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-accent mb-2">20</div>
                <div className="text-muted-foreground">Points to Win</div>
              </div>
              <div className="text-center">
                <div className="font-display text-4xl font-bold text-primary mb-2">∞</div>
                <div className="text-muted-foreground">Possibilities</div>
              </div>
            </div>
          </div>
        </section>
      </div>

      <LeaderboardModal isOpen={showLeaderboard} onClose={() => setShowLeaderboard(false)} />
    </>
  )
}
