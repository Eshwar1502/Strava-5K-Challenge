'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import { createClient } from '@/lib/supabase/client'
import HeroAnimation from './HeroAnimation'
import CountdownTimer from '@/components/ui/CountdownTimer'

type Props = {
  participantCount: number
  currentDay: number
  challengeEndDate: Date
}

export default function LandingPage({ participantCount, currentDay, challengeEndDate }: Props) {
  const [loading, setLoading] = useState(false)
  const supabase = createClient()

  const handleJoin = async () => {
    setLoading(true)
    await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${window.location.origin}/auth/callback`,
      },
    })
  }

  const isActive = currentDay >= 1 && currentDay <= 7

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4 py-12">
      <div className="max-w-[430px] w-full text-center space-y-8">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          <h1 className="text-7xl font-black tracking-tighter">
            <span className="text-white">Five</span>
            <span className="text-accent">7</span>
          </h1>
          <p className="text-text-secondary mt-2 text-lg font-medium tracking-wide uppercase">
            7 Days · 5K · No Excuses
          </p>
        </motion.div>

        {/* Animated runner */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <HeroAnimation />
        </motion.div>

        {/* Stats strip */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="flex items-center justify-center gap-6 text-sm"
        >
          <div className="text-center">
            <div className="text-white font-bold text-xl">{participantCount}</div>
            <div className="text-text-secondary text-xs">Runners</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-white font-bold text-xl">
              {isActive ? `Day ${currentDay}` : '—'}
            </div>
            <div className="text-text-secondary text-xs">of 7</div>
          </div>
          <div className="w-px h-8 bg-border" />
          <div className="text-center">
            <div className="text-white font-bold text-xl">5K</div>
            <div className="text-text-secondary text-xs">Daily</div>
          </div>
        </motion.div>

        {/* Countdown or live status */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.5 }}
          className="space-y-2"
        >
          {isActive ? (
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-accent/20 border border-accent/40 rounded-full">
              <span className="w-2 h-2 bg-accent rounded-full animate-pulse" />
              <span className="text-accent font-semibold">Challenge is Live!</span>
            </div>
          ) : (
            <div>
              <p className="text-text-secondary text-sm mb-3">Challenge ends in</p>
              <CountdownTimer endDate={challengeEndDate} />
            </div>
          )}
        </motion.div>

        {/* CTA */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.6 }}
        >
          <button
            onClick={handleJoin}
            disabled={loading}
            className="w-full bg-accent hover:bg-accent-light active:scale-95 text-white rounded-2xl py-4 px-6 font-bold text-lg transition-all disabled:opacity-70 flex items-center justify-center gap-3 shadow-lg shadow-accent/30"
          >
            {loading ? (
              <>
                <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                Signing in...
              </>
            ) : (
              <>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#fff" />
                  <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#fff" />
                  <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#fff" />
                  <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#fff" />
                </svg>
                Join the Challenge
              </>
            )}
          </button>
          <p className="text-text-secondary text-xs mt-3">Sign in with Google · Free · No download needed</p>
        </motion.div>
      </div>
    </div>
  )
}
