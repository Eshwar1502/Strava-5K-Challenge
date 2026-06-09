'use client'

import { useEffect, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import LeaderboardCard from '@/components/ui/LeaderboardCard'
import { computeStreak, computeBadges } from '@/lib/utils/badges'

type ProfileRow = { display_name: string; emoji: string }

type RunRow = {
  user_id: string
  day_number: number
  distance_km: number
  duration_seconds: number
  pace_seconds_per_km: number
  submitted_at: string
  profiles: ProfileRow | ProfileRow[] | null
}

type Props = {
  allRuns: RunRow[]
  currentUserId: string
  currentDay: number
  dailyKingId: string | null
}

type UserSummary = {
  userId: string
  name: string
  emoji: string
  totalKm: number
  streak: number
  runDays: number[]
  runs: RunRow[]
  todayPace: number | null
  isDailyKing: boolean
}

function buildSummaries(runs: RunRow[], currentDay: number, dailyKingId: string | null, finalRankUserId: string | null): UserSummary[] {
  const byUser: Record<string, RunRow[]> = {}
  for (const r of runs) {
    if (!byUser[r.user_id]) byUser[r.user_id] = []
    byUser[r.user_id].push(r)
  }

  return Object.entries(byUser)
    .map(([userId, userRuns]) => {
      const rawProfile = userRuns[0]?.profiles
      const profile = Array.isArray(rawProfile) ? rawProfile[0] : rawProfile
      const totalKm = userRuns.reduce((a, r) => a + Number(r.distance_km), 0)
      const streak = computeStreak(userRuns, currentDay)
      const runDays = userRuns.map((r) => r.day_number)
      const todayRun = userRuns.find((r) => r.day_number === currentDay)
      return {
        userId,
        name: profile?.display_name ?? 'Runner',
        emoji: profile?.emoji ?? '🏃',
        totalKm,
        streak,
        runDays,
        runs: userRuns,
        todayPace: todayRun?.pace_seconds_per_km ?? null,
        isDailyKing: userId === dailyKingId,
      }
    })
    .sort((a, b) => b.totalKm - a.totalKm)
}

export default function LeaderboardClient({ allRuns, currentUserId, currentDay, dailyKingId }: Props) {
  const [runs, setRuns] = useState<RunRow[]>(allRuns)
  const [tab, setTab] = useState<'overall' | 'today'>('overall')
  const supabase = createClient()

  useEffect(() => {
    const channel = supabase
      .channel('leaderboard-runs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'runs' }, async () => {
        const { data } = await supabase
          .from('runs')
          .select('user_id, day_number, distance_km, duration_seconds, pace_seconds_per_km, submitted_at, profiles(display_name, emoji)')
          .order('day_number')
        if (data) setRuns(data as RunRow[])
      })
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [supabase])

  const summaries = buildSummaries(runs, currentDay, dailyKingId, null)

  const sorted =
    tab === 'today'
      ? [...summaries]
          .filter((s) => s.todayPace !== null)
          .sort((a, b) => (a.todayPace ?? 9999) - (b.todayPace ?? 9999))
      : summaries

  // Champion = rank 1 in overall
  const championId = summaries[0]?.userId

  return (
    <div className="pb-24 px-4 pt-6">
      <h1 className="text-2xl font-black text-white mb-4">🏆 Leaderboard</h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-5 bg-surface border border-border rounded-xl p-1">
        {(['overall', 'today'] as const).map((t) => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-all ${
              tab === t ? 'bg-accent text-white' : 'text-text-secondary hover:text-white'
            }`}
          >
            {t === 'overall' ? '📊 Overall' : '⚡ Today'}
          </button>
        ))}
      </div>

      {/* Cards */}
      <div className="space-y-3">
        {sorted.length === 0 && (
          <div className="text-center py-12 text-text-secondary">
            <div className="text-4xl mb-3">🏃</div>
            <p>{tab === 'today' ? 'No runs logged today yet.' : 'No runs yet — be the first!'}</p>
          </div>
        )}
        {sorted.map((s, i) => {
          const badges = computeBadges(
            s.runs,
            7,
            s.isDailyKing,
            s.userId === championId
          )
          return (
            <LeaderboardCard
              key={s.userId}
              rank={i + 1}
              displayName={s.name}
              emoji={s.emoji}
              totalKm={s.totalKm}
              streak={s.streak}
              isDailyKing={s.isDailyKing}
              runDays={s.runDays}
              currentDay={currentDay}
              badges={badges}
              todayPace={s.todayPace}
              showToday={tab === 'today'}
            />
          )
        })}
      </div>
    </div>
  )
}
