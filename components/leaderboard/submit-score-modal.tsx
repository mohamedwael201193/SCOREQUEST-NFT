"use client"

import type React from "react"

import { useState } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Trophy, User, Clock } from "lucide-react"
import { useWeb3 } from "@/lib/web3-context"

interface SubmitScoreModalProps {
  isOpen: boolean
  onClose: () => void
  score: number
  timeTaken: number
  onScoreSubmitted: () => void
}

export default function SubmitScoreModal({
  isOpen,
  onClose,
  score,
  timeTaken,
  onScoreSubmitted,
}: SubmitScoreModalProps) {
  const [playerName, setPlayerName] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)
  const { account } = useWeb3()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!playerName.trim()) return

    setIsSubmitting(true)
    try {
      const response = await fetch("/api/leaderboard", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          player_name: playerName.trim(),
          wallet_address: account,
          score,
          time_taken: timeTaken,
        }),
      })

      if (response.ok) {
        onScoreSubmitted()
        onClose()
        setPlayerName("")
      } else {
        console.error("Failed to submit score")
      }
    } catch (error) {
      console.error("Error submitting score:", error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border border-purple-500/30 text-white max-w-md">
        <DialogHeader>
          <DialogTitle className="text-xl font-bold text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🎉 SUBMIT YOUR SCORE
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Score Display */}
          <div className="text-center space-y-2">
            <div className="flex items-center justify-center space-x-2">
              <Trophy className="w-8 h-8 text-yellow-400" />
              <span className="text-3xl font-bold text-purple-400">{score}</span>
            </div>
            <div className="flex items-center justify-center space-x-2 text-gray-400">
              <Clock className="w-4 h-4" />
              <span>Time: {formatTime(timeTaken)}</span>
            </div>
          </div>

          {/* Submit Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="playerName" className="block text-sm font-medium text-gray-300">
                Player Name
              </label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  id="playerName"
                  type="text"
                  value={playerName}
                  onChange={(e) => setPlayerName(e.target.value)}
                  placeholder="Enter your name"
                  maxLength={50}
                  required
                  className="pl-10 bg-gray-800/50 border-gray-700 text-white placeholder:text-gray-500 focus:border-purple-500"
                />
              </div>
            </div>

            {account && (
              <div className="text-xs text-gray-400 bg-gray-800/30 p-2 rounded">
                Wallet: {account.slice(0, 6)}...{account.slice(-4)}
              </div>
            )}

            <div className="flex space-x-3">
              <Button
                type="button"
                onClick={onClose}
                variant="outline"
                className="flex-1 border-gray-600 text-gray-300 hover:bg-gray-800 bg-transparent"
                disabled={isSubmitting}
              >
                Skip
              </Button>
              <Button
                type="submit"
                disabled={!playerName.trim() || isSubmitting}
                className="flex-1 bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white"
              >
                {isSubmitting ? "Submitting..." : "Submit Score"}
              </Button>
            </div>
          </form>
        </div>
      </DialogContent>
    </Dialog>
  )
}
