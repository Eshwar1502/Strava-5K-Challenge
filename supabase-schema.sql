-- ============================
-- Five7 — Supabase SQL Schema
-- Run each block in order in the SQL Editor
-- ============================

-- 1. profiles
create table profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  display_name text not null,
  emoji text not null default '🏃',
  created_at timestamptz default now()
);
alter table profiles enable row level security;
create policy "Profiles are viewable by all users" on profiles for select using (auth.role() = 'authenticated');
create policy "Users can insert own profile" on profiles for insert with check (auth.uid() = id);
create policy "Users can update own profile" on profiles for update using (auth.uid() = id);

-- 2. runs
create table runs (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  day_number int not null check (day_number between 1 and 7),
  distance_km numeric(4,2) not null default 5.00,
  duration_seconds int not null,
  pace_seconds_per_km int generated always as (floor(duration_seconds / distance_km)::int) stored,
  screenshot_url text,
  submitted_at timestamptz default now(),
  updated_at timestamptz default now(),
  unique(user_id, day_number)
);
alter table runs enable row level security;
create policy "Runs are viewable by all authenticated users" on runs for select using (auth.role() = 'authenticated');
create policy "Users can insert own runs" on runs for insert with check (auth.uid() = user_id);
create policy "Users can update own runs" on runs for update using (auth.uid() = user_id);

-- 3. feed_posts
create table feed_posts (
  id uuid primary key default gen_random_uuid(),
  user_id uuid references profiles(id) on delete cascade not null,
  content text not null check (char_length(content) <= 140),
  is_system_post boolean default false,
  created_at timestamptz default now()
);
alter table feed_posts enable row level security;
create policy "Feed posts viewable by all" on feed_posts for select using (auth.role() = 'authenticated');
create policy "Users can insert posts" on feed_posts for insert with check (auth.uid() = user_id);

-- 4. reactions
create table reactions (
  id uuid primary key default gen_random_uuid(),
  post_id uuid references feed_posts(id) on delete cascade not null,
  user_id uuid references profiles(id) on delete cascade not null,
  emoji text not null check (emoji in ('👏', '🔥', '💀', '😂')),
  created_at timestamptz default now(),
  unique(post_id, user_id, emoji)
);
alter table reactions enable row level security;
create policy "Reactions viewable by all" on reactions for select using (auth.role() = 'authenticated');
create policy "Users can insert reactions" on reactions for insert with check (auth.uid() = user_id);
create policy "Users can delete own reactions" on reactions for delete using (auth.uid() = user_id);

-- 5. challenge_config
create table challenge_config (
  id int primary key default 1,
  challenge_name text default 'Five7',
  start_date date not null,
  created_at timestamptz default now()
);
-- ⚠️ UPDATE THIS DATE to your actual challenge start date before going live:
insert into challenge_config (start_date) values ('2025-06-10');

-- 6. Storage bucket for screenshots
insert into storage.buckets (id, name, public) values ('screenshots', 'screenshots', true);
create policy "Anyone authenticated can upload screenshots"
  on storage.objects for insert
  with check (bucket_id = 'screenshots' and auth.role() = 'authenticated');
create policy "Screenshots are publicly viewable"
  on storage.objects for select
  using (bucket_id = 'screenshots');
