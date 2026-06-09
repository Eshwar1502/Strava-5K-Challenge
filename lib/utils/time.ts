// time.ts — mm:ss ↔ seconds conversions

export function secondsToMMSS(totalSeconds: number): string {
  const mins = Math.floor(totalSeconds / 60)
  const secs = totalSeconds % 60
  return `${mins}:${secs.toString().padStart(2, '0')}`
}

export function mmssToSeconds(mm: number, ss: number): number {
  return mm * 60 + ss
}

export function formatPace(paceSecondsPerKm: number): string {
  return secondsToMMSS(Math.round(paceSecondsPerKm))
}
