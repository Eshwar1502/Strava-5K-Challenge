'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { createClient } from '@/lib/supabase/client'

const EMOJIS = ['🏃', '🚀', '🔥', '⚡', '💪', '🎯', '🦅', '🐆', '💨', '🏅', '👟', '🌪']

type Props = {
  userId: string
  defaultName: string
}

export default function OnboardingForm({ userId, defaultName }: Props) {
  const [name, setName] = useState(defaultName)
  const [selectedEmoji, setSelectedEmoji] = useState('🏃')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const router = useRouter()
  const supabase = createClient()

  const handleSubmit = async () => {
    if (!name.trim()) { setError('Enter a display name'); return }
    setLoading(true)
    setError('')
    const { error: err } = await supabase.from('profiles').upsert({
      id: userId,
      display_name: name.trim(),
      emoji: selectedEmoji,
    })
    if (err) { setError(err.message); setLoading(false); return }
    router.push('/dashboard')
  }

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-[430px] w-full space-y-8">
        <div className="text-center">
          <div className="text-5xl mb-4">{selectedEmoji}</div>
          <h1 className="text-3xl font-black text-white">Welcome to Five7</h1>
          <p className="text-text-secondary mt-2">Set up your runner profile</p>
        </div>

        <div className="space-y-6">
          {/* Name input */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              maxLength={30}
              className="w-full bg-surface border border-border rounded-xl px-4 py-3 text-white text-lg font-semibold focus:outline-none focus:border-accent transition-colors"
              placeholder="Display name"
            />
          </div>

          {/* Emoji picker */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-text-secondary uppercase tracking-wider">
              Pick Your Avatar
            </label>
            <div className="grid grid-cols-6 gap-2">
              {EMOJIS.map((e) => (
                <button
                  key={e}
                  onClick={() => setSelectedEmoji(e)}
                  className={`text-2xl h-12 rounded-xl transition-all ${
                    selectedEmoji === e
                      ? 'bg-accent/20 border-2 border-accent scale-110'
                      : 'bg-surface border border-border hover:border-accent/50'
                  }`}
                >
                  {e}
                </button>
              ))}
            </div>
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
              "Let's Go! 🏃"
            )}
          </button>
        </div>
      </div>
    </div>
  )
}
