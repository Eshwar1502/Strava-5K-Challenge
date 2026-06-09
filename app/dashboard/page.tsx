import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import Link from 'next/link'
import { getChallengeStartDate, getCurrentChallengeDay } from '@/lib/utils/challenge'
import { formatPace } from '@/lib/utils/time'
import { computeStreak } from '@/lib/utils/badges'
import { Trophy, Zap, Flame, ChevronRight, Plus } from 'lucide-react'

export default async function DashboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, emoji')
    .eq('id', user.id)
    .single()

  if (!profile) redirect('/onboarding')

  const startDate = getChallengeStartDate()
  const currentDay = getCurrentChallengeDay(startDate)

  // My runs
  const { data: myRuns } = await supabase
    .from('runs')
    .select('day_number, distance_km, duration_seconds, pace_seconds_per_km, submitted_at')
    .eq('user_id', user.id)
    .order('day_number')

  const runs = myRuns ?? []
  const todayRun = runs.find((r) => r.day_number === currentDay)
  const totalKm = runs.reduce((acc, r) => acc + Number(r.distance_km), 0)
  const bestPace = runs.length > 0 ? Math.min(...runs.map((r) => r.pace_seconds_per_km)) : null
  const streak = computeStreak(runs, currentDay)

  // Leaderboard top 3
  const { data: allRuns } = await supabase
    .from('runs')
    .select('user_id, distance_km, profiles(display_name, emoji)')

  type RunRow = { user_id: string; distance_km: number; profiles: { display_name: string; emoji: string } | null }
  const totals: Record<string, { km: number; name: string; emoji: string }> = {}
  for (const r of (allRuns as RunRow[] ?? [])) {
    if (!totals[r.user_id]) {
      totals[r.user_id] = { km: 0, name: r.profiles?.display_name ?? 'Runner', emoji: r.profiles?.emoji ?? '🏃' }
    }
    totals[r.user_id].km += Number(r.distance_km)
  }
  const top3 = Object.entries(totals)
    .sort((a, b) => b[1].km - a[1].km)
    .slice(0, 3)

  // Recent feed posts
  const { data: feedPosts } = await supabase
    .from('feed_posts')
    .select('content, profiles(display_name, emoji)')
    .order('created_at', { ascending: false })
    .limit(2)

  const today = new Date()
  const dayLabel = today.toLocaleDateString('en-IN', { weekday: 'long', month: 'short', day: 'numeric' })

  return (
    <div className="pb-24 px-4 pt-6 space-y-5">
      {/* Header */}
      <div>
        <p className="text-text-secondary text-sm">{dayLabel}</p>
        <h1 className="text-2xl font-black text-white mt-0.5">
          {profile.emoji} Hey, {profile.display_name.split(' ')[0]}!
        </h1>
        <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 bg-accent/15 rounded-full">
          <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
          <span className="text-accent text-sm font-semibold">Day {currentDay} of 7</span>
        </div>
      </div>

      {/* Today's run card */}
      {todayRun ? (
        <div className="bg-success/10 border border-success/30 rounded-2xl p-4 space-y-2">
          <div className="flex items-center gap-2 text-success font-bold">
            ✅ Day {currentDay} run logged!
          </div>
          <div className="grid grid-cols-3 gap-2 mt-2">
            {[
              { label: 'Distance', value: `${Number(todayRun.distance_km).toFixed(1)} km` },
              { label: 'Time', value: `${Math.floor(todayRun.duration_seconds / 60)}:${String(todayRun.duration_seconds % 60).padStart(2, '0')}` },
              { label: 'Pace', value: `${formatPace(todayRun.pace_seconds_per_km)}/km` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface rounded-xl p-2 text-center">
                <div className="text-white font-bold text-sm">{value}</div>
                <div className="text-text-secondary text-xs">{label}</div>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <Link
          href="/log"
          className="block bg-accent/10 border border-accent/40 rounded-2xl p-5 text-center hover:bg-accent/20 transition-colors"
        >
          <div className="text-4xl mb-2">🏃</div>
          <div className="text-white font-bold text-lg">Log Today&apos;s Run</div>
          <div className="text-text-secondary text-sm mt-1">Day {currentDay} · 5K target</div>
          <div className="mt-3 inline-flex items-center gap-2 bg-accent text-white px-4 py-2 rounded-xl font-semibold text-sm">
            <Plus size={16} /> Start logging
          </div>
        </Link>
      )}

      {/* Your stats */}
      <div>
        <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider mb-3">Your Stats</h2>
        <div className="grid grid-cols-3 gap-3">
          {[
            { icon: <Trophy size={16} className="text-accent" />, label: 'Total', value: `${totalKm.toFixed(1)} km` },
            { icon: <Zap size={16} className="text-accent" />, label: 'Best Pace', value: bestPace ? formatPace(bestPace) : '—' },
            { icon: <Flame size={16} className="text-accent" />, label: 'Streak', value: streak > 0 ? `${streak}🔥` : '0' },
          ].map(({ icon, label, value }) => (
            <div key={label} className="bg-surface border border-border rounded-2xl p-3 text-center">
              <div className="flex justify-center mb-1">{icon}</div>
              <div className="text-white font-bold">{value}</div>
              <div className="text-text-secondary text-xs">{label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Mini leaderboard */}
      {top3.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Leaderboard</h2>
            <Link href="/leaderboard" className="text-accent text-sm flex items-center gap-1">
              Full <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {top3.map(([uid, data], i) => (
              <div
                key={uid}
                className={`flex items-center gap-3 bg-surface border rounded-xl p-3 ${uid === user.id ? 'border-accent/40' : 'border-border'}`}
              >
                <span className="text-lg w-6 text-center">{['🥇', '🥈', '🥉'][i]}</span>
                <span className="text-xl">{data.emoji}</span>
                <span className="text-white font-semibold flex-1 text-sm truncate">{data.name}</span>
                <span className="text-accent font-bold text-sm">{data.km.toFixed(1)} km</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Feed preview */}
      {feedPosts && feedPosts.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-sm font-semibold text-text-secondary uppercase tracking-wider">Feed</h2>
            <Link href="/feed" className="text-accent text-sm flex items-center gap-1">
              Join the chat <ChevronRight size={14} />
            </Link>
          </div>
          <div className="space-y-2">
            {(feedPosts as Array<{ content: string; profiles: { display_name: string; emoji: string } | null }>).map((post, i) => (
              <div key={i} className="bg-surface border border-border rounded-xl p-3 flex items-start gap-2">
                <span className="text-lg">{post.profiles?.emoji ?? '🏃'}</span>
                <div>
                  <span className="text-white/70 text-xs font-medium">{post.profiles?.display_name}</span>
                  <p className="text-white text-sm mt-0.5">{post.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
