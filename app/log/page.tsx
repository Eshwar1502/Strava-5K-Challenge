import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import { getChallengeStartDate, getCurrentChallengeDay } from '@/lib/utils/challenge'
import RunForm from '@/components/forms/RunForm'

export default async function LogPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const startDate = getChallengeStartDate()
  const currentDay = getCurrentChallengeDay(startDate)

  const { data: existingRun } = await supabase
    .from('runs')
    .select('id, distance_km, duration_seconds, pace_seconds_per_km, screenshot_url')
    .eq('user_id', user.id)
    .eq('day_number', currentDay)
    .single()

  return (
    <div className="pb-24 px-4 pt-6">
      <div className="mb-6">
        <p className="text-text-secondary text-sm">Challenge</p>
        <h1 className="text-2xl font-black text-white">Log Day {currentDay} Run</h1>
        <p className="text-text-secondary text-sm mt-1">Target: 5.0 km</p>
      </div>

      <RunForm
        userId={user.id}
        dayNumber={currentDay}
        existingRun={existingRun ?? null}
      />
    </div>
  )
}
