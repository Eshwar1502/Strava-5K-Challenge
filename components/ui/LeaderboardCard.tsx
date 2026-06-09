import ProgressGrid from './ProgressGrid'
import BadgeChip from './BadgeChip'
import { Badge } from '@/lib/utils/badges'
import { formatPace } from '@/lib/utils/time'
import { cn } from '@/lib/utils/cn'

type Props = {
  rank: number
  displayName: string
  emoji: string
  totalKm: number
  streak: number
  isDailyKing: boolean
  runDays: number[]
  currentDay: number
  badges: Badge[]
  todayPace?: number | null
  showToday?: boolean
}

const rankColors: Record<number, string> = {
  1: 'text-yellow-400',
  2: 'text-gray-300',
  3: 'text-amber-600',
}

export default function LeaderboardCard({
  rank,
  displayName,
  emoji,
  totalKm,
  streak,
  isDailyKing,
  runDays,
  currentDay,
  badges,
  todayPace,
  showToday = false,
}: Props) {
  return (
    <div className="bg-surface border border-border rounded-2xl p-4 space-y-3">
      <div className="flex items-center gap-3">
        {/* Rank */}
        <span className={cn('text-2xl font-bold w-8 text-center', rankColors[rank] ?? 'text-text-secondary')}>
          {rank <= 3 ? ['🥇', '🥈', '🥉'][rank - 1] : `#${rank}`}
        </span>

        {/* Avatar + Name */}
        <div className="flex items-center gap-2 flex-1 min-w-0">
          <span className="text-2xl">{emoji}</span>
          <span className="font-semibold text-white truncate">{displayName}</span>
          {isDailyKing && <span title="Daily King/Queen">👑</span>}
        </div>

        {/* Stats */}
        <div className="text-right">
          {showToday && todayPace ? (
            <div>
              <div className="text-white font-bold">{formatPace(todayPace)}</div>
              <div className="text-text-secondary text-xs">min/km</div>
            </div>
          ) : (
            <div>
              <div className="text-white font-bold">{totalKm.toFixed(1)} km</div>
              <div className="text-text-secondary text-xs">
                {'🔥'.repeat(Math.min(streak, 5))} {streak > 0 ? `${streak}d streak` : ''}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* 7-day progress */}
      <ProgressGrid runs={runDays} currentDay={currentDay} />

      {/* Badges */}
      {badges.length > 0 && (
        <div className="flex flex-wrap gap-1">
          {badges.map((b) => (
            <BadgeChip key={b.id} badge={b} />
          ))}
        </div>
      )}
    </div>
  )
}
