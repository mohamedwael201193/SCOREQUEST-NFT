"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Trophy, Zap, Clock, Coins } from "lucide-react"
import { GAME_CONFIG } from "@/lib/constants"

interface GameTarget {
  id: string
  x: number
  y: number
  size: number
  points: number
  type: "normal" | "bonus" | "penalty"
  timeLeft: number
}

interface GameAreaProps {
  onGameEnd: (score: number, won: boolean) => void
  onScoreChange: (score: number) => void
}

export function GameArea({ onGameEnd, onScoreChange }: GameAreaProps) {
  const [gameState, setGameState] = useState<"playing" | "ended">("playing")
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.GAME_DURATION)
  const [targets, setTargets] = useState<GameTarget[]>([])
  const [combo, setCombo] = useState(0)
  const [lastHit, setLastHit] = useState<number>(0)
  const gameAreaRef = useRef<HTMLDivElement>(null)
  const targetIdRef = useRef(0)

  const generateTarget = useCallback((): GameTarget => {
    const gameArea = gameAreaRef.current
    if (!gameArea) {
      return {
        id: `target-${targetIdRef.current++}`,
        x: 50,
        y: 50,
        size: 60,
        points: 1,
        type: "normal",
        timeLeft: 3000,
      }
    }

    const rect = gameArea.getBoundingClientRect()
    const margin = 80
    const size = Math.random() > 0.7 ? 40 : Math.random() > 0.3 ? 60 : 80

    // Determine target type based on probability
    let type: "normal" | "bonus" | "penalty" = "normal"
    const rand = Math.random()
    if (rand > 0.85) type = "bonus"
    else if (rand < 0.1) type = "penalty"

    return {
      id: `target-${targetIdRef.current++}`,
      x: Math.random() * (rect.width - size - margin * 2) + margin,
      y: Math.random() * (rect.height - size - margin * 2) + margin,
      size,
      points: type === "bonus" ? 3 : type === "penalty" ? -1 : 1,
      type,
      timeLeft: type === "bonus" ? 2000 : type === "penalty" ? 5000 : 3000,
    }
  }, [])

  const spawnTarget = useCallback(() => {
    if (gameState !== "playing") return

    setTargets((prev) => {
      if (prev.length >= 4) return prev // Max 4 targets at once
      return [...prev, generateTarget()]
    })
  }, [gameState, generateTarget])

  const hitTarget = useCallback(
    (targetId: string) => {
      const now = Date.now()
      setTargets((prev) => {
        const target = prev.find((t) => t.id === targetId)
        if (!target) return prev

        setScore((currentScore) => {
          let newScore = currentScore + target.points

          // Combo system - bonus points for quick successive hits
          if (now - lastHit < 1000) {
            setCombo((c) => c + 1)
            if (combo > 2) {
              newScore += Math.floor(combo / 3) // Bonus points for combos
            }
          } else {
            setCombo(0)
          }

          setLastHit(now)
          onScoreChange(newScore)
          return newScore
        })

        return prev.filter((t) => t.id !== targetId)
      })
    },
    [lastHit, combo, onScoreChange],
  )

  // Game timer
  useEffect(() => {
    if (gameState !== "playing") return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameState("ended")
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameState])

  // Target spawning
  useEffect(() => {
    if (gameState !== "playing") return

    const spawnInterval = setInterval(
      () => {
        spawnTarget()
      },
      1500 - Math.min(score * 50, 1000),
    ) // Spawn faster as score increases

    return () => clearInterval(spawnInterval)
  }, [gameState, spawnTarget, score])

  // Target lifecycle management
  useEffect(() => {
    if (gameState !== "playing") return

    const updateInterval = setInterval(() => {
      setTargets((prev) =>
        prev
          .map((target) => ({
            ...target,
            timeLeft: target.timeLeft - 100,
          }))
          .filter((target) => target.timeLeft > 0),
      )
    }, 100)

    return () => clearInterval(updateInterval)
  }, [gameState])

  // Check win condition
  useEffect(() => {
    if (score >= GAME_CONFIG.TARGET_SCORE) {
      setGameState("ended")
      onGameEnd(score, true)
    }
  }, [score, onGameEnd])

  // Check game end
  useEffect(() => {
    if (gameState === "ended" && score < GAME_CONFIG.TARGET_SCORE) {
      onGameEnd(score, false)
    }
  }, [gameState, score, onGameEnd])

  const getTargetColor = (type: GameTarget["type"]) => {
    switch (type) {
      case "bonus":
        return "border-secondary bg-secondary/20 text-secondary"
      case "penalty":
        return "border-destructive bg-destructive/20 text-destructive"
      default:
        return "border-primary bg-primary/20 text-primary"
    }
  }

  const getTargetIcon = (type: GameTarget["type"]) => {
    switch (type) {
      case "bonus":
        return <Zap className="w-6 h-6" />
      case "penalty":
        return <Clock className="w-6 h-6" />
      default:
        return <Coins className="w-6 h-6" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Game HUD */}
      <div className="flex flex-wrap gap-4 justify-between items-center">
        <div className="flex items-center gap-4">
          <Card className="px-4 py-2 bg-card/50 backdrop-blur-sm neon-border border-primary/50">
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-primary" />
              <span className="font-display text-xl font-bold text-primary">{score}</span>
              <span className="text-sm text-muted-foreground">/ {GAME_CONFIG.TARGET_SCORE}</span>
            </div>
          </Card>

          <Card className="px-4 py-2 bg-card/50 backdrop-blur-sm neon-border border-secondary/50">
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-secondary" />
              <span className="font-display text-xl font-bold text-secondary">{timeLeft}s</span>
            </div>
          </Card>

          {combo > 2 && (
            <Card className="px-4 py-2 bg-card/50 backdrop-blur-sm neon-border border-accent/50 animate-pulse-glow">
              <div className="flex items-center gap-2">
                <Zap className="w-5 h-5 text-accent" />
                <span className="font-display text-lg font-bold text-accent">COMBO x{combo}</span>
              </div>
            </Card>
          )}
        </div>

        <Progress value={(score / GAME_CONFIG.TARGET_SCORE) * 100} className="w-48 h-3" />
      </div>

      {/* Game Area */}
      <Card className="relative h-96 md:h-[500px] bg-card/30 backdrop-blur-sm neon-border border-primary/30 overflow-hidden">
        <div
          ref={gameAreaRef}
          className="absolute inset-0 cursor-crosshair"
          style={{
            background: "radial-gradient(circle at 50% 50%, rgba(112, 66, 248, 0.1) 0%, transparent 70%)",
          }}
        >
          {targets.map((target) => (
            <Button
              key={target.id}
              className={`absolute rounded-full transition-all duration-200 hover:scale-110 active:scale-95 neon-border glow-sm ${getTargetColor(target.type)}`}
              style={{
                left: target.x,
                top: target.y,
                width: target.size,
                height: target.size,
                animation: `pulse-glow 1s ease-in-out infinite`,
              }}
              onClick={() => hitTarget(target.id)}
            >
              <div className="flex flex-col items-center justify-center">
                {getTargetIcon(target.type)}
                <span className="text-xs font-bold">{target.points > 0 ? `+${target.points}` : target.points}</span>
              </div>
            </Button>
          ))}

          {targets.length === 0 && gameState === "playing" && (
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center text-muted-foreground">
                <Clock className="w-16 h-16 mx-auto mb-4 opacity-50" />
                <p className="font-display text-lg">Targets incoming...</p>
              </div>
            </div>
          )}
        </div>
      </Card>

      {/* Game Instructions */}
      <Card className="p-4 bg-card/50 backdrop-blur-sm neon-border border-muted/50">
        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-primary/20 border border-primary"></div>
            <span>Normal targets: +1 point</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-secondary/20 border border-secondary"></div>
            <span>Bonus targets: +3 points</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-4 h-4 rounded-full bg-destructive/20 border border-destructive"></div>
            <span>Penalty targets: -1 point</span>
          </div>
        </div>
      </Card>
    </div>
  )
}
