'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import { cn } from '@/lib/utils/cn'

type Reaction = {
  emoji: string
  count: number
  reacted: boolean
  id?: string
}

type Props = {
  postId: string
  userId: string
  authorEmoji: string
  authorName: string
  content: string
  createdAt: string
  isSystemPost: boolean
  reactions: Reaction[]
  currentUserId: string
}

const REACTION_EMOJIS = ['👏', '🔥', '💀', '😂']

function timeAgo(dateStr: string): string {
  const date = new Date(dateStr)
  const diff = Date.now() - date.getTime()
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins}m ago`
  const hrs = Math.floor(mins / 60)
  if (hrs < 24) return `${hrs}h ago`
  return `${Math.floor(hrs / 24)}d ago`
}

export default function FeedPost({
  postId,
  authorEmoji,
  authorName,
  content,
  createdAt,
  isSystemPost,
  reactions,
  currentUserId,
}: Props) {
  const [localReactions, setLocalReactions] = useState<Reaction[]>(reactions)
  const supabase = createClient()

  const handleReaction = async (emoji: string) => {
    const existing = localReactions.find((r) => r.emoji === emoji)
    if (!existing) return

    if (existing.reacted) {
      // Remove reaction
      await supabase
        .from('reactions')
        .delete()
        .match({ post_id: postId, user_id: currentUserId, emoji })

      setLocalReactions((prev) =>
        prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count - 1, reacted: false } : r
        )
      )
    } else {
      // Add reaction
      await supabase
        .from('reactions')
        .insert({ post_id: postId, user_id: currentUserId, emoji })

      setLocalReactions((prev) =>
        prev.map((r) =>
          r.emoji === emoji ? { ...r, count: r.count + 1, reacted: true } : r
        )
      )
    }
  }

  return (
    <div
      className={cn(
        'bg-surface border rounded-2xl p-4 space-y-3',
        isSystemPost ? 'border-accent/40 bg-accent/5' : 'border-border'
      )}
    >
      <div className="flex items-start gap-3">
        <span className="text-2xl mt-0.5">{authorEmoji}</span>
        <div className="flex-1 min-w-0">
          <div className="flex items-baseline gap-2">
            <span className="font-semibold text-white text-sm">{authorName}</span>
            <span className="text-text-secondary text-xs">{timeAgo(createdAt)}</span>
            {isSystemPost && (
              <span className="text-xs text-accent font-medium">📌 auto</span>
            )}
          </div>
          <p className="text-white/90 text-sm mt-1 leading-relaxed">{content}</p>
        </div>
      </div>

      {/* Reactions */}
      <div className="flex gap-2">
        {REACTION_EMOJIS.map((emoji) => {
          const r = localReactions.find((x) => x.emoji === emoji) ?? {
            emoji,
            count: 0,
            reacted: false,
          }
          return (
            <button
              key={emoji}
              onClick={() => handleReaction(emoji)}
              className={cn(
                'flex items-center gap-1 px-2.5 py-1 rounded-full text-sm border transition-colors',
                r.reacted
                  ? 'bg-accent/20 border-accent/50 text-white'
                  : 'bg-surface-hover border-border text-text-secondary hover:text-white'
              )}
            >
              <span>{emoji}</span>
              {r.count > 0 && <span className="text-xs">{r.count}</span>}
            </button>
          )
        })}
      </div>
    </div>
  )
}
