export type Badge = {
  id: string
  emoji: string
  label: string
  description: string
}

export const BADGES: Record<string, Badge> = {
  iron_streak: {
    id: 'iron_streak',
    emoji: '🔥',
    label: 'Iron Streak',
    description: 'Completed all 7 days',
  },
  speed_demon: {
    id: 'speed_demon',
    emoji: '⚡',
    label: 'Speed Demon',
    description: 'Sub-30 min 5K',
  },
  rocket_start: {
    id: 'rocket_start',
    emoji: '🚀',
    label: 'Rocket Start',
    description: 'Submitted before 8am',
  },
  comeback_kid: {
    id: 'comeback_kid',
    emoji: '💀',
    label: 'Comeback Kid',
    description: 'Ran after missing a day',
  },
  daily_king: {
    id: 'daily_king',
    emoji: '👑',
    label: 'Daily King/Queen',
    description: 'Best pace on a given day',
  },
  champion: {
    id: 'champion',
    emoji: '🏆',
    label: 'Champion',
    description: '#1 on final leaderboard',
  },
}

export type RunRecord = {
  day_number: number
  duration_seconds: number
  distance_km: number
  pace_seconds_per_km: number
  submitted_at: string
}

export function computeBadges(
  runs: RunRecord[],
  totalDays: number,
  isDailyKing: boolean,
  isChampion: boolean
): Badge[] {
  const earned: Badge[] = []

  if (runs.length === totalDays) {
    earned.push(BADGES.iron_streak)
  }

  const hasSubThirty = runs.some((r) => r.duration_seconds < 30 * 60)
  if (hasSubThirty) earned.push(BADGES.speed_demon)

  const hasRocketStart = runs.some(() => {
    return false // evaluated at submit time via submitted_at hour
  })
  void hasRocketStart

  // Check rocket start from submitted_at hour
  const hasRocket = runs.some((r) => {
    const hour = new Date(r.submitted_at).getHours()
    return hour < 8
  })
  if (hasRocket) earned.push(BADGES.rocket_start)

  // Comeback kid: submitted after a missed day
  const dayNumbers = runs.map((r) => r.day_number).sort()
  for (let i = 1; i < dayNumbers.length; i++) {
    if (dayNumbers[i] - dayNumbers[i - 1] > 1) {
      earned.push(BADGES.comeback_kid)
      break
    }
  }

  if (isDailyKing) earned.push(BADGES.daily_king)
  if (isChampion) earned.push(BADGES.champion)

  return earned
}

export function computeStreak(runs: RunRecord[], currentDay: number): number {
  let streak = 0
  for (let d = currentDay; d >= 1; d--) {
    if (runs.find((r) => r.day_number === d)) {
      streak++
    } else {
      break
    }
  }
  return streak
}
