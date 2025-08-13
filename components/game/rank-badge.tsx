import { Trophy, Medal, Award, Star } from "lucide-react"

interface RankBadgeProps {
  score: number
  className?: string
}

export function RankBadge({ score, className = "" }: RankBadgeProps) {
  const getRankInfo = (score: number) => {
    if (score >= 50) {
      return {
        rank: "Legendary",
        icon: Trophy,
        color: "text-yellow-400",
        glow: "glow text-yellow-400",
        bg: "bg-yellow-400/20",
      }
    } else if (score >= 35) {
      return {
        rank: "Gold",
        icon: Award,
        color: "text-yellow-500",
        glow: "glow-sm text-yellow-500",
        bg: "bg-yellow-500/20",
      }
    } else if (score >= 25) {
      return {
        rank: "Silver",
        icon: Medal,
        color: "text-gray-300",
        glow: "glow-sm text-gray-300",
        bg: "bg-gray-300/20",
      }
    } else if (score >= 20) {
      return {
        rank: "Bronze",
        icon: Star,
        color: "text-orange-400",
        glow: "glow-sm text-orange-400",
        bg: "bg-orange-400/20",
      }
    }
    return null
  }

  const rankInfo = getRankInfo(score)
  if (!rankInfo) return null

  const { rank, icon: Icon, color, glow, bg } = rankInfo

  return (
    <div
      className={`inline-flex items-center gap-2 px-3 py-1 rounded-full ${bg} neon-border border-current ${color} ${className}`}
    >
      <Icon className={`h-4 w-4 ${glow}`} />
      <span className="font-display text-sm font-semibold">{rank}</span>
    </div>
  )
}
