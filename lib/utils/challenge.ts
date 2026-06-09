export function getCurrentChallengeDay(startDate: Date): number {
  const now = startOfLocalDay(new Date())
  const challengeStart = startOfLocalDay(startDate)
  const diffMs = now.getTime() - challengeStart.getTime()
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24)) + 1
  return Math.min(Math.max(diffDays, 1), 7)
}

export function getChallengeStartDate(): Date {
  const envDate = process.env.NEXT_PUBLIC_CHALLENGE_START_DATE
  if (envDate) return parseLocalDate(envDate)
  // Default to today for dev
  return new Date()
}

function parseLocalDate(value: string): Date {
  const dateOnly = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value)
  if (!dateOnly) return new Date(value)

  const [, year, month, day] = dateOnly
  return new Date(Number(year), Number(month) - 1, Number(day))
}

function startOfLocalDay(date: Date): Date {
  const localDate = new Date(date)
  localDate.setHours(0, 0, 0, 0)
  return localDate
}

export function isDayPassed(dayNumber: number, startDate: Date): boolean {
  const dayDate = new Date(startDate)
  dayDate.setDate(dayDate.getDate() + dayNumber - 1)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  dayDate.setHours(0, 0, 0, 0)
  return dayDate < today
}

export function isToday(dayNumber: number, startDate: Date): boolean {
  const dayDate = new Date(startDate)
  dayDate.setDate(dayDate.getDate() + dayNumber - 1)
  const today = new Date()
  return (
    dayDate.getDate() === today.getDate() &&
    dayDate.getMonth() === today.getMonth() &&
    dayDate.getFullYear() === today.getFullYear()
  )
}
