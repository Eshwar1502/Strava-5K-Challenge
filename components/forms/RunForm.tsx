'use client'

import { useState, useEffect, useRef } from 'react'
import { createClient } from '@/lib/supabase/client'
import { formatPace, mmssToSeconds } from '@/lib/utils/time'
import { Upload, CheckCircle, Edit2 } from 'lucide-react'

type ExistingRun = {
  id: string
  distance_km: number
  duration_seconds: number
  pace_seconds_per_km: number
  screenshot_url: string | null
}

type Props = {
  userId: string
  dayNumber: number
  existingRun?: ExistingRun | null
}

export default function RunForm({ userId, dayNumber, existingRun }: Props) {
  const [distance, setDistance] = useState(existingRun?.distance_km?.toString() ?? '5.00')
  const [minutes, setMinutes] = useState(
    existingRun ? String(Math.floor(existingRun.duration_seconds / 60)) : '30'
  )
  const [seconds, setSeconds] = useState(
    existingRun ? String(existingRun.duration_seconds % 60).padStart(2, '0') : '00'
  )
  const [file, setFile] = useState<File | null>(null)
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')
  const [isEditing, setIsEditing] = useState(!existingRun)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const supabase = createClient()

  const totalSeconds = mmssToSeconds(parseInt(minutes) || 0, parseInt(seconds) || 0)
  const dist = parseFloat(distance) || 0
  const pace = dist > 0 && totalSeconds > 0 ? totalSeconds / dist : 0

  const triggerConfetti = async () => {
    const confetti = (await import('canvas-confetti')).default
    confetti({
      particleCount: 120,
      spread: 80,
      origin: { y: 0.6 },
      colors: ['#FF5722', '#FF7043', '#FFD700', '#FFFFFF'],
    })
  }

  const handleSubmit = async () => {
    if (dist <= 0) { setError('Enter a valid distance'); return }
    if (totalSeconds <= 0) { setError('Enter a valid time'); return }
    setLoading(true)
    setError('')

    let screenshotUrl: string | null = existingRun?.screenshot_url ?? null

    if (file) {
      const ext = file.name.split('.').pop()
      const path = `${userId}/day${dayNumber}.${ext}`
      const { data: uploadData, error: uploadErr } = await supabase.storage
        .from('screenshots')
        .upload(path, file, { upsert: true })
      if (!uploadErr && uploadData) {
        const { data: urlData } = supabase.storage.from('screenshots').getPublicUrl(path)
        screenshotUrl = urlData.publicUrl
      }
    }

    const { error: upsertErr } = await supabase.from('runs').upsert(
      {
        user_id: userId,
        day_number: dayNumber,
        distance_km: dist,
        duration_seconds: totalSeconds,
        screenshot_url: screenshotUrl,
        submitted_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
      { onConflict: 'user_id,day_number' }
    )

    if (upsertErr) { setError(upsertErr.message); setLoading(false); return }

    // Auto-post to feed if best pace (done server-side ideally, but basic check here)
    setSuccess(true)
    setIsEditing(false)
    setLoading(false)
    await triggerConfetti()
  }

  if (!isEditing && existingRun) {
    return (
      <div className="space-y-4">
        <div className="bg-success/10 border border-success/30 rounded-2xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-success font-bold text-lg">
            <CheckCircle size={22} />
            Run logged for Day {dayNumber}!
          </div>
          <div className="grid grid-cols-3 gap-3">
            {[
              { label: 'Distance', value: `${existingRun.distance_km} km` },
              {
                label: 'Time',
                value: `${Math.floor(existingRun.duration_seconds / 60)}:${String(existingRun.duration_seconds % 60).padStart(2, '0')}`,
              },
              { label: 'Pace', value: `${formatPace(existingRun.pace_seconds_per_km)} /km` },
            ].map(({ label, value }) => (
              <div key={label} className="bg-surface rounded-xl p-3 text-center">
                <div className="text-white font-bold">{value}</div>
                <div className="text-text-secondary text-xs mt-0.5">{label}</div>
              </div>
            ))}
          </div>
          {existingRun.screenshot_url && (
            <img
              src={existingRun.screenshot_url}
              alt="Run screenshot"
              className="w-full rounded-xl object-cover max-h-48"
            />
          )}
        </div>
        <button
          onClick={() => setIsEditing(true)}
          className="w-full flex items-center justify-center gap-2 bg-surface border border-border rounded-xl py-3 text-text-secondary hover:text-white transition-colors"
        >
          <Edit2 size={16} />
          Edit today&apos;s run
        </button>
      </div>
    )
  }

  return (
    <div className="space-y-5">
      {success && (
        <div className="bg-success/10 border border-success/30 rounded-2xl p-4 text-success font-semibold text-center">
          🎉 Run logged! Keep crushing it!
        </div>
      )}

      {/* Distance */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Distance (km)
        </label>
        <input
          type="number"
          step="0.01"
          min="0"
          value={distance}
          onChange={(e) => setDistance(e.target.value)}
          className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-xl font-bold focus:outline-none focus:border-accent transition-colors"
        />
      </div>

      {/* Time */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Time
        </label>
        <div className="flex items-center gap-3">
          <div className="flex-1">
            <input
              type="number"
              min="0"
              max="99"
              value={minutes}
              onChange={(e) => setMinutes(e.target.value)}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-xl font-bold text-center focus:outline-none focus:border-accent transition-colors"
              placeholder="mm"
            />
            <p className="text-center text-text-secondary text-xs mt-1">min</p>
          </div>
          <span className="text-white text-2xl font-bold mb-4">:</span>
          <div className="flex-1">
            <input
              type="number"
              min="0"
              max="59"
              value={seconds}
              onChange={(e) => setSeconds(e.target.value.padStart(2, '0'))}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-xl font-bold text-center focus:outline-none focus:border-accent transition-colors"
              placeholder="ss"
            />
            <p className="text-center text-text-secondary text-xs mt-1">sec</p>
          </div>
        </div>
      </div>

      {/* Live pace */}
      {pace > 0 && (
        <div className="bg-accent/10 border border-accent/30 rounded-xl p-4 text-center">
          <div className="text-accent font-black text-2xl">{formatPace(pace)}</div>
          <div className="text-text-secondary text-sm">min/km pace</div>
        </div>
      )}

      {/* Screenshot upload */}
      <div className="space-y-2">
        <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
          Screenshot (optional)
        </label>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="w-full bg-surface border border-dashed border-border rounded-xl py-4 flex flex-col items-center gap-2 text-text-secondary hover:border-accent/50 hover:text-white transition-colors"
        >
          <Upload size={20} />
          <span className="text-sm">{file ? file.name : 'Tap to upload Strava screenshot'}</span>
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => setFile(e.target.files?.[0] ?? null)}
        />
      </div>

      {error && <p className="text-red-400 text-sm text-center">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={loading}
        className="w-full bg-accent hover:bg-accent-light active:scale-95 text-white rounded-2xl py-4 font-bold text-lg transition-all disabled:opacity-70 flex items-center justify-center gap-2 shadow-lg shadow-accent/30"
      >
        {loading ? (
          <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
        ) : (
          '🏁 Log My Run'
        )}
      </button>
    </div>
  )
}
