'use client'

import { usePathname } from 'next/navigation'
import BottomNav from './BottomNav'

const AUTH_PAGES = ['/dashboard', '/log', '/leaderboard', '/feed']

export default function BottomNavWrapper() {
  const pathname = usePathname()
  const show = AUTH_PAGES.some((p) => pathname.startsWith(p))
  if (!show) return null
  return <BottomNav />
}
