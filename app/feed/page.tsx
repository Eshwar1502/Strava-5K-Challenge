import { createClient } from '@/lib/supabase/server'
import { redirect } from 'next/navigation'
import FeedClient from './FeedClient'

export default async function FeedPage() {
  const supabase = createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/')

  const { data: profile } = await supabase
    .from('profiles')
    .select('display_name, emoji')
    .eq('id', user.id)
    .single()

  // Posts with author + reactions
  const { data: posts } = await supabase
    .from('feed_posts')
    .select(`
      id,
      user_id,
      content,
      is_system_post,
      created_at,
      profiles(display_name, emoji),
      reactions(id, user_id, emoji)
    `)
    .order('created_at', { ascending: false })
    .limit(50)

  return (
    <FeedClient
      initialPosts={(posts as any[]) ?? []}
      currentUserId={user.id}
      currentUserEmoji={profile?.emoji ?? '🏃'}
      currentUserName={profile?.display_name ?? 'Runner'}
    />
  )
}
