import { createClient } from '@/lib/supabase/server'
import LandingPage from '@/components/landing/LandingPage'
import { getChallengeStartDate, getCurrentChallengeDay } from '@/lib/utils/challenge'

export default async function Home() {
  const supabase = createClient()

  // Get participant count
  const { count } = await supabase
    .from('profiles')
    .select('*', { count: 'exact', head: true })

  const startDate = getChallengeStartDate()
  const currentDay = getCurrentChallengeDay(startDate)

  // Challenge end = start + 6 days (day 7 end of day)
  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + 7)

  return (
    <LandingPage
      participantCount={count ?? 0}
      currentDay={currentDay}
      challengeEndDate={endDate}
    />
  )
}
