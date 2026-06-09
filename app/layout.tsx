import type { Metadata } from 'next'
import './globals.css'
import BottomNavWrapper from '@/components/ui/BottomNavWrapper'

export const metadata: Metadata = {
  title: 'Five7 — 7 Days. 5K. No Excuses.',
  description: 'Track your 7-day daily 5K challenge with friends.',
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#0a0a0a',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="bg-background text-white">
        <main className="max-w-[430px] mx-auto min-h-screen">
          {children}
        </main>
        <BottomNavWrapper />
      </body>
    </html>
  )
}
