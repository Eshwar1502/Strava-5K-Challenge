import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getChallengeStartDate, getCurrentChallengeDay } from '@/lib/utils/challenge'
import LeaderboardClient from './LeaderboardClient'

export default async function LeaderboardPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const startDate = getChallengeStartDate()
  const currentDay = getCurrentChallengeDay(startDate)

  // All runs with profile info
  const { data: allRuns } = await supabase
    .from('runs')
    .select('user_id, day_number, distance_km, duration_seconds, pace_seconds_per_km, submitted_at, profiles(display_name, emoji)')
    .order('day_number')

  // Today's best pace runner id
  const { data: todayBest } = await supabase
    .from('runs')
    .select('user_id')
    .eq('day_number', currentDay)
    .order('pace_seconds_per_km', { ascending: true })
    .limit(1)
    .single()

  return (
    <LeaderboardClient
      allRuns={(allRuns as any[]) ?? []}
      currentUserId={user.id}
      currentDay={currentDay}
      dailyKingId={todayBest?.user_id ?? null}
    />
  )
}
