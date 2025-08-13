"use client"

import type React from "react"

import { useState, useEffect, useCallback, useRef } from "react"
import { Card } from "@/components/ui/card"
import { Progress } from "@/components/ui/progress"
import { Zap, Clock, Trophy } from "lucide-react"
import { GAME_CONFIG } from "@/lib/constants"
import { GameAnimations } from "@/lib/animations"
import { soundManager } from "@/lib/sound-manager" // Added sound manager import

interface TargetType {
  id: number
  x: number
  y: number
  type: "normal" | "bonus" | "penalty"
  timeLeft: number
}

interface GameAreaProps {
  onGameEnd: (score: number, won: boolean, timeTaken: number) => void
  onScoreChange: (score: number) => void
}

export function EnhancedGameArea({ onGameEnd, onScoreChange }: GameAreaProps) {
  const [targets, setTargets] = useState<TargetType[]>([])
  const [score, setScore] = useState(0)
  const [timeLeft, setTimeLeft] = useState(GAME_CONFIG.GAME_DURATION)
  const [combo, setCombo] = useState(0)
  const [gameActive, setGameActive] = useState(true)
  const [startTime] = useState(Date.now())

  const gameAreaRef = useRef<HTMLDivElement>(null)
  const scorePopupRef = useRef<HTMLDivElement>(null)
  const comboRef = useRef<HTMLDivElement>(null)

  // Initialize animations
  useEffect(() => {
    GameAnimations.initializeGSAP()
  }, [])

  // Game timer
  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          setGameActive(false)
          const timeTaken = Math.floor((Date.now() - startTime) / 1000)
          soundManager.play(score >= GAME_CONFIG.TARGET_SCORE ? "victory" : "gameOver")
          onGameEnd(score, score >= GAME_CONFIG.TARGET_SCORE, timeTaken)
          return 0
        }
        if (prev <= 10) {
          soundManager.play("tick", 0.3)
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [gameActive, score, startTime, onGameEnd])

  // Target spawning
  useEffect(() => {
    if (!gameActive) return

    const spawnTarget = () => {
      const gameArea = gameAreaRef.current
      if (!gameArea) return

      const rect = gameArea.getBoundingClientRect()
      const targetSize = 60
      const margin = 20

      const newTarget: TargetType = {
        id: Date.now() + Math.random(),
        x: margin + Math.random() * (rect.width - targetSize - margin * 2),
        y: margin + Math.random() * (rect.height - targetSize - margin * 2),
        type: Math.random() < 0.15 ? "bonus" : Math.random() < 0.1 ? "penalty" : "normal",
        timeLeft: GAME_CONFIG.TARGET_LIFETIME,
      }

      setTargets((prev) => [...prev, newTarget])

      // Animate target spawn
      setTimeout(() => {
        const targetElement = document.getElementById(`target-${newTarget.id}`)
        if (targetElement) {
          GameAnimations.animateTargetSpawn(targetElement)
        }
      }, 50)
    }

    const baseInterval = Math.max(300, 1000 - score * 20)
    const interval = setInterval(spawnTarget, baseInterval)

    return () => clearInterval(interval)
  }, [gameActive, score])

  // Target lifetime management
  useEffect(() => {
    if (!gameActive) return

    const timer = setInterval(() => {
      setTargets((prev) =>
        prev
          .map((target) => ({ ...target, timeLeft: target.timeLeft - 100 }))
          .filter((target) => {
            if (target.timeLeft <= 0) {
              soundManager.play("miss", 0.3)
            }
            return target.timeLeft > 0
          }),
      )
    }, 100)

    return () => clearInterval(timer)
  }, [gameActive])

  const handleTargetClick = useCallback(
    (target: TargetType, event: React.MouseEvent) => {
      const targetElement = event.currentTarget as HTMLElement
      const rect = targetElement.getBoundingClientRect()
      const centerX = rect.left + rect.width / 2
      const centerY = rect.top + rect.height / 2

      let points = 0
      let newCombo = combo

      if (target.type === "penalty") {
        points = -1
        newCombo = 0
        soundManager.play("penalty")
        GameAnimations.screenShake(5)
        GameAnimations.createParticleBurst(centerX, centerY, "#ef4444")
      } else {
        points = target.type === "bonus" ? 3 : 1
        newCombo = combo + 1

        // Combo bonus
        if (newCombo >= 3) {
          points += Math.floor(newCombo / 3)
          soundManager.play("combo", 0.7)
        }

        soundManager.play(target.type === "bonus" ? "bonus" : "hit")

        const color = target.type === "bonus" ? "#06b6d4" : "#8b5cf6"
        GameAnimations.createParticleBurst(centerX, centerY, color)
      }

      const newScore = Math.max(0, score + points)
      setScore(newScore)
      setCombo(newCombo)
      onScoreChange(newScore)

      // Animate target hit
      GameAnimations.animateTargetHit(targetElement, target.type === "bonus")

      // Show score popup
      if (scorePopupRef.current) {
        scorePopupRef.current.textContent = points > 0 ? `+${points}` : `${points}`
        scorePopupRef.current.style.left = `${centerX}px`
        scorePopupRef.current.style.top = `${centerY}px`
        scorePopupRef.current.className = `fixed text-2xl font-bold pointer-events-none z-50 ${
          points > 0 ? "text-green-400" : "text-red-400"
        }`
        GameAnimations.animateScorePopup(scorePopupRef.current, points)
      }

      // Animate combo
      if (newCombo > combo && comboRef.current) {
        GameAnimations.animateCombo(comboRef.current, newCombo)
      }

      // Remove target
      setTargets((prev) => prev.filter((t) => t.id !== target.id))

      // Check win condition
      if (newScore >= GAME_CONFIG.TARGET_SCORE) {
        setGameActive(false)
        const timeTaken = Math.floor((Date.now() - startTime) / 1000)
        setTimeout(() => onGameEnd(newScore, true, timeTaken), 500)
      }
    },
    [combo, score, startTime, onGameEnd, onScoreChange],
  )

  const getTargetColor = (type: TargetType["type"]) => {
    switch (type) {
      case "bonus":
        return "bg-cyan-500 border-cyan-400 shadow-cyan-500/50"
      case "penalty":
        return "bg-red-500 border-red-400 shadow-red-500/50"
      default:
        return "bg-purple-500 border-purple-400 shadow-purple-500/50"
    }
  }

  const getTargetIcon = (type: TargetType["type"]) => {
    switch (type) {
      case "bonus":
        return <Zap className="w-6 h-6" />
      case "penalty":
        return <Zap className="w-6 h-6" />
      default:
        return <Zap className="w-6 h-6" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Game HUD */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card className="p-4 bg-card/50 backdrop-blur-sm neon-border border-primary/50">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-primary" />
            <div>
              <div className="text-sm text-muted-foreground">Score</div>
              <div className="text-2xl font-bold text-primary">{score}</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm neon-border border-secondary/50">
          <div className="flex items-center gap-2">
            <Clock className="w-5 h-5 text-secondary" />
            <div>
              <div className="text-sm text-muted-foreground">Time</div>
              <div className="text-2xl font-bold text-secondary">{timeLeft}s</div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm neon-border border-accent/50">
          <div className="flex items-center gap-2">
            <Zap className="w-5 h-5 text-accent" />
            <div>
              <div className="text-sm text-muted-foreground">Combo</div>
              <div ref={comboRef} className="text-2xl font-bold text-accent">
                {combo}x
              </div>
            </div>
          </div>
        </Card>

        <Card className="p-4 bg-card/50 backdrop-blur-sm neon-border border-primary/50">
          <div>
            <div className="text-sm text-muted-foreground mb-2">Progress</div>
            <Progress value={(score / GAME_CONFIG.TARGET_SCORE) * 100} className="h-3" />
            <div className="text-xs text-muted-foreground mt-1">
              {score} / {GAME_CONFIG.TARGET_SCORE}
            </div>
          </div>
        </Card>
      </div>

      {/* Game Area */}
      <Card className="relative overflow-hidden neon-border border-primary/50">
        <div
          ref={gameAreaRef}
          className="relative h-[500px] bg-gradient-to-br from-background via-background/50 to-primary/5 cursor-crosshair"
          style={{
            backgroundImage: `
              radial-gradient(circle at 25% 25%, rgba(139, 92, 246, 0.1) 0%, transparent 50%),
              radial-gradient(circle at 75% 75%, rgba(6, 182, 212, 0.1) 0%, transparent 50%)
            `,
          }}
        >
          {targets.map((target) => (
            <button
              key={target.id}
              id={`target-${target.id}`}
              onClick={(e) => handleTargetClick(target, e)}
              className={`absolute w-15 h-15 rounded-full border-2 flex items-center justify-center text-white font-bold transition-all duration-200 hover:scale-110 shadow-lg ${getTargetColor(
                target.type,
              )}`}
              style={{
                left: target.x,
                top: target.y,
                boxShadow: `0 0 20px currentColor`,
              }}
            >
              {getTargetIcon(target.type)}
            </button>
          ))}
        </div>
      </Card>

      {/* Score Popup */}
      <div ref={scorePopupRef} className="fixed pointer-events-none z-50" />
    </div>
  )
}
