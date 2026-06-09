'use client'

import { useEffect, useState } from 'react'

type Props = {
  endDate: Date
}

export default function CountdownTimer({ endDate }: Props) {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 })
  const [isOver, setIsOver] = useState(false)

  useEffect(() => {
    const tick = () => {
      const now = new Date()
      const diff = endDate.getTime() - now.getTime()

      if (diff <= 0) {
        setIsOver(true)
        return
      }

      setTimeLeft({
        days: Math.floor(diff / (1000 * 60 * 60 * 24)),
        hours: Math.floor((diff / (1000 * 60 * 60)) % 24),
        minutes: Math.floor((diff / (1000 * 60)) % 60),
        seconds: Math.floor((diff / 1000) % 60),
      })
    }

    tick()
    const id = setInterval(tick, 1000)
    return () => clearInterval(id)
  }, [endDate])

  if (isOver) {
    return (
      <div className="text-accent font-bold text-lg animate-pulse">
        🏁 Challenge Complete!
      </div>
    )
  }

  return (
    <div className="flex gap-3 items-center justify-center">
      {[
        { value: timeLeft.days, label: 'Days' },
        { value: timeLeft.hours, label: 'Hrs' },
        { value: timeLeft.minutes, label: 'Min' },
        { value: timeLeft.seconds, label: 'Sec' },
      ].map(({ value, label }) => (
        <div key={label} className="flex flex-col items-center">
          <div className="bg-surface border border-border rounded-xl w-14 h-14 flex items-center justify-center text-2xl font-bold text-white tabular-nums">
            {value.toString().padStart(2, '0')}
          </div>
          <span className="text-xs text-text-secondary mt-1">{label}</span>
        </div>
      ))}
    </div>
  )
}
