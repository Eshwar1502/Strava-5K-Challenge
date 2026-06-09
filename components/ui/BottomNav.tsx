'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Plus, Trophy, MessageCircle } from 'lucide-react'
import { cn } from '@/lib/utils/cn'

const tabs = [
  { href: '/dashboard', icon: Home, label: 'Home' },
  { href: '/log', icon: Plus, label: 'Log Run' },
  { href: '/leaderboard', icon: Trophy, label: 'Leaderboard' },
  { href: '/feed', icon: MessageCircle, label: 'Feed' },
]

export default function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
      <div className="max-w-[430px] mx-auto flex">
        {tabs.map(({ href, icon: Icon, label }) => {
          const active = pathname === href
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex-1 flex flex-col items-center justify-center gap-1 py-3 min-h-[64px] transition-colors',
                active ? 'text-accent' : 'text-text-secondary hover:text-white'
              )}
            >
              <Icon
                size={22}
                strokeWidth={active ? 2.5 : 2}
                className={cn(active && 'drop-shadow-[0_0_6px_rgba(255,87,34,0.7)]')}
              />
              <span className="text-[10px] font-medium">{label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
