# Five7 🏃‍♂️🔥
### 7 Days. 5K. No Excuses.

A mobile-first web app for your group 7-day daily 5K running challenge — with a live leaderboard, trash talk feed, streaks, and achievement badges.

---

## Quick Start (4 steps)

### 1. Supabase Setup
1. Create a project at [supabase.com](https://supabase.com)
2. Go to **SQL Editor** → paste and run `supabase-schema.sql`
3. **Update the challenge start date** in the last insert statement
4. Go to **Settings → API** → copy your `Project URL` and `anon public` key

### 2. Google OAuth
1. [console.cloud.google.com](https://console.cloud.google.com) → New Project → `five7`
2. **APIs & Services → OAuth consent screen** → External → fill in app name
3. **APIs & Services → Credentials → Create → OAuth Client ID** (Web application)
4. Authorized redirect URI: `https://<your-supabase-ref>.supabase.co/auth/v1/callback`
5. Also add: `http://localhost:3000/auth/callback` for local dev
6. Copy Client ID + Secret → Supabase Dashboard → **Authentication → Providers → Google** → paste and save

### 3. Local Development
```bash
# Copy and fill in your env vars
cp .env.local.example .env.local

# Install dependencies
npm install

# Start dev server
npm run dev
```
Open [http://localhost:3000](http://localhost:3000)

### 4. Deploy to Vercel
```bash
# Push to GitHub first
git init && git add . && git commit -m "init"
# Create repo on github.com and push

# Then: vercel.com → Add New Project → import repo
# Add env vars: NEXT_PUBLIC_SUPABASE_URL + NEXT_PUBLIC_SUPABASE_ANON_KEY
# Deploy!
```
After deploy, add your Vercel URL to Google OAuth authorized redirect URIs.

---

## Environment Variables

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
NEXT_PUBLIC_CHALLENGE_START_DATE=2026-06-10   # Your challenge start date
```

---

## Features

| Page | What it does |
|------|-------------|
| `/` | Landing page with animated runner + Google Sign-In |
| `/onboarding` | Pick display name + emoji avatar |
| `/dashboard` | Day status, your stats, mini leaderboard, feed preview |
| `/log` | Submit today's run (distance + time + optional screenshot) |
| `/leaderboard` | Full ranked leaderboard — Overall or Today tabs, real-time |
| `/feed` | Trash talk feed with emoji reactions, real-time |

## Badges

| Badge | How to earn |
|-------|------------|
| 🔥 Iron Streak | Complete all 7 days |
| ⚡ Speed Demon | Sub-30 min 5K |
| 🚀 Rocket Start | Submit before 8am |
| 💀 Comeback Kid | Run after missing a day |
| 👑 Daily King/Queen | Best pace on any day |
| 🏆 Champion | #1 on final leaderboard |

---

*Five7 — Built for friends who run together* 🏃
