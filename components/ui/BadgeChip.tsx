import { Badge } from '@/lib/utils/badges'

export default function BadgeChip({ badge }: { badge: Badge }) {
  return (
    <div
      className="inline-flex items-center gap-1 px-2 py-1 bg-surface-hover rounded-full text-xs text-text-secondary border border-border"
      title={badge.description}
    >
      <span>{badge.emoji}</span>
      <span>{badge.label}</span>
    </div>
  )
}
