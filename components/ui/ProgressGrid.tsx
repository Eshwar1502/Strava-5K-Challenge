import { cn } from '@/lib/utils/cn'

type DayStatus = 'done' | 'missed' | 'today' | 'future'

type Props = {
  runs: number[] // day numbers that have been submitted
  currentDay: number
  totalDays?: number
}

export default function ProgressGrid({ runs, currentDay, totalDays = 7 }: Props) {
  const getStatus = (day: number): DayStatus => {
    if (runs.includes(day)) return 'done'
    if (day === currentDay) return 'today'
    if (day < currentDay) return 'missed'
    return 'future'
  }

  const statusToEmoji: Record<DayStatus, string> = {
    done: '✅',
    missed: '❌',
    today: '⏳',
    future: '⬜',
  }

  return (
    <div className="flex gap-1">
      {Array.from({ length: totalDays }, (_, i) => i + 1).map((day) => {
        const status = getStatus(day)
        return (
          <div
            key={day}
            className={cn(
              'flex items-center justify-center w-8 h-8 rounded-lg text-sm',
              status === 'done' && 'bg-success/20',
              status === 'missed' && 'bg-red-500/10',
              status === 'today' && 'bg-accent/20 ring-1 ring-accent',
              status === 'future' && 'bg-surface'
            )}
            title={`Day ${day}`}
          >
            {statusToEmoji[status]}
          </div>
        )
      })}
    </div>
  )
}
