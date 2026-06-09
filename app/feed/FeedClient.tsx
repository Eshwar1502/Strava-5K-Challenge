'use client'

import { useEffect, useRef, useState } from 'react'
import { createClient } from '@/lib/supabase/client'
import FeedPost from '@/components/ui/FeedPost'
import { Send } from 'lucide-react'

const REACTION_EMOJIS = ['👏', '🔥', '💀', '😂']

type Reaction = { id: string; user_id: string; emoji: string }

type Post = {
  id: string
  user_id: string
  content: string
  is_system_post: boolean
  created_at: string
  profiles: { display_name: string; emoji: string } | null
  reactions: Reaction[]
}

type Props = {
  initialPosts: Post[]
  currentUserId: string
  currentUserEmoji: string
  currentUserName: string
}

function buildReactions(reactions: Reaction[], currentUserId: string) {
  return REACTION_EMOJIS.map((emoji) => {
    const matching = reactions.filter((r) => r.emoji === emoji)
    return {
      emoji,
      count: matching.length,
      reacted: matching.some((r) => r.user_id === currentUserId),
    }
  })
}

export default function FeedClient({ initialPosts, currentUserId, currentUserEmoji, currentUserName }: Props) {
  const [posts, setPosts] = useState<Post[]>(initialPosts)
  const [message, setMessage] = useState('')
  const [posting, setPosting] = useState(false)
  const supabase = createClient()
  const inputRef = useRef<HTMLTextAreaElement>(null)

  const refetchPosts = async () => {
    const { data } = await supabase
      .from('feed_posts')
      .select(`id, user_id, content, is_system_post, created_at, profiles(display_name, emoji), reactions(id, user_id, emoji)`)
      .order('created_at', { ascending: false })
      .limit(50)
    if (data) setPosts(data as Post[])
  }

  useEffect(() => {
    const channel = supabase
      .channel('feed-realtime')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'feed_posts' }, refetchPosts)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'reactions' }, refetchPosts)
      .subscribe()
    return () => { supabase.removeChannel(channel) }
  }, [])

  const handlePost = async () => {
    const trimmed = message.trim()
    if (!trimmed || posting) return
    setPosting(true)
    await supabase.from('feed_posts').insert({
      user_id: currentUserId,
      content: trimmed,
      is_system_post: false,
    })
    setMessage('')
    setPosting(false)
    inputRef.current?.focus()
  }

  return (
    <div className="pb-28 pt-6">
      {/* Header */}
      <div className="px-4 mb-4">
        <h1 className="text-2xl font-black text-white">💬 Trash Talk</h1>
        <p className="text-text-secondary text-sm mt-1">Banter, shoutouts, excuses…</p>
      </div>

      {/* Compose box */}
      <div className="px-4 mb-5">
        <div className="bg-surface border border-border rounded-2xl p-3 flex items-end gap-3">
          <span className="text-2xl mb-1">{currentUserEmoji}</span>
          <textarea
            ref={inputRef}
            value={message}
            onChange={(e) => setMessage(e.target.value.slice(0, 140))}
            onKeyDown={(e) => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handlePost() } }}
            placeholder="Say something…"
            rows={2}
            className="flex-1 bg-transparent text-white placeholder:text-text-secondary resize-none focus:outline-none text-sm leading-relaxed"
          />
          <button
            onClick={handlePost}
            disabled={!message.trim() || posting}
            className="mb-0.5 bg-accent hover:bg-accent-light disabled:opacity-40 text-white rounded-xl p-2.5 transition-all active:scale-95"
          >
            {posting ? (
              <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin block" />
            ) : (
              <Send size={16} />
            )}
          </button>
        </div>
        <div className="flex justify-end mt-1">
          <span className="text-xs text-text-secondary">{message.length}/140</span>
        </div>
      </div>

      {/* Posts */}
      <div className="px-4 space-y-3">
        {posts.length === 0 && (
          <div className="text-center py-16 text-text-secondary">
            <div className="text-5xl mb-3">💬</div>
            <p className="font-semibold">No posts yet.</p>
            <p className="text-sm mt-1">Be the first to say something!</p>
          </div>
        )}
        {posts.map((post) => (
          <FeedPost
            key={post.id}
            postId={post.id}
            userId={post.user_id}
            authorEmoji={post.profiles?.emoji ?? '🏃'}
            authorName={post.profiles?.display_name ?? 'Runner'}
            content={post.content}
            createdAt={post.created_at}
            isSystemPost={post.is_system_post}
            reactions={buildReactions(post.reactions, currentUserId)}
            currentUserId={currentUserId}
          />
        ))}
      </div>
    </div>
  )
}
