"use client"

import { useState, useEffect } from "react"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Trophy, Medal, Award, Clock, Wallet } from "lucide-react"
import type { LeaderboardEntry } from "@/lib/supabase/client"

interface LeaderboardModalProps {
  isOpen: boolean
  onClose: () => void
}

export default function LeaderboardModal({ isOpen, onClose }: LeaderboardModalProps) {
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      fetchLeaderboard()
    }
  }, [isOpen])

  const fetchLeaderboard = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/leaderboard")
      if (response.ok) {
        const data = await response.json()
        setLeaderboard(data)
      }
    } catch (error) {
      console.error("Error fetching leaderboard:", error)
    } finally {
      setLoading(false)
    }
  }

  const getRankIcon = (index: number) => {
    switch (index) {
      case 0:
        return <Trophy className="w-6 h-6 text-yellow-400" />
      case 1:
        return <Medal className="w-6 h-6 text-gray-300" />
      case 2:
        return <Award className="w-6 h-6 text-amber-600" />
      default:
        return <span className="w-6 h-6 flex items-center justify-center text-cyan-400 font-bold">#{index + 1}</span>
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const truncateAddress = (address: string | null) => {
    if (!address) return "Anonymous"
    return `${address.slice(0, 6)}...${address.slice(-4)}`
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="bg-black/95 border border-purple-500/30 text-white max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-bold text-center bg-gradient-to-r from-purple-400 to-cyan-400 bg-clip-text text-transparent">
            🏆 MONAD MISSION 7 LEADERBOARD
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {loading ? (
            <div className="flex justify-center items-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-400"></div>
            </div>
          ) : leaderboard.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No scores yet. Be the first to make it to the leaderboard!
            </div>
          ) : (
            <div className="space-y-2">
              {leaderboard.map((entry, index) => (
                <div
                  key={entry.id}
                  className={`flex items-center justify-between p-4 rounded-lg border transition-all duration-300 ${
                    index === 0
                      ? "bg-gradient-to-r from-yellow-500/20 to-orange-500/20 border-yellow-500/50 shadow-lg shadow-yellow-500/20"
                      : index === 1
                        ? "bg-gradient-to-r from-gray-400/20 to-gray-600/20 border-gray-400/50 shadow-lg shadow-gray-400/20"
                        : index === 2
                          ? "bg-gradient-to-r from-amber-600/20 to-amber-800/20 border-amber-600/50 shadow-lg shadow-amber-600/20"
                          : "bg-gray-800/50 border-gray-700/50 hover:border-purple-500/50"
                  }`}
                >
                  <div className="flex items-center space-x-4">
                    {getRankIcon(index)}
                    <div>
                      <div className="font-bold text-lg">{entry.player_name}</div>
                      <div className="flex items-center space-x-2 text-sm text-gray-400">
                        <Wallet className="w-3 h-3" />
                        <span>{truncateAddress(entry.wallet_address)}</span>
                      </div>
                    </div>
                  </div>

                  <div className="text-right">
                    <div className="text-2xl font-bold text-purple-400">{entry.score}</div>
                    <div className="flex items-center space-x-1 text-sm text-gray-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatTime(entry.time_taken)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="flex justify-center pt-4">
            <Button
              onClick={onClose}
              className="bg-gradient-to-r from-purple-600 to-cyan-600 hover:from-purple-700 hover:to-cyan-700 text-white px-8 py-2"
            >
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
