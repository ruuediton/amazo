-- Create tables for WhatsApp Clone functionality
-- Run this in your Supabase SQL Editor

-- 1. Chat Rooms
CREATE TABLE IF NOT EXISTS public.chat_rooms (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  name text,
  type text NOT NULL,
  description text,
  icon_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Chat Participants
CREATE TABLE IF NOT EXISTS public.chat_participants (
  room_id uuid REFERENCES public.chat_rooms(id),
  user_id uuid REFERENCES auth.users(id),
  role text DEFAULT 'user',
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  PRIMARY KEY (room_id, user_id)
);

-- 3. Chat Messages
CREATE TABLE IF NOT EXISTS public.chat_messages (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  room_id uuid REFERENCES public.chat_rooms(id),
  user_id uuid REFERENCES auth.users(id),
  content text,
  type text DEFAULT 'text',
  image_url text,
  reply_to_id uuid REFERENCES public.chat_messages(id),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Chat Reactions
CREATE TABLE IF NOT EXISTS public.chat_reactions (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  message_id uuid REFERENCES public.chat_messages(id),
  user_id uuid REFERENCES auth.users(id),
  emoji text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(message_id, user_id, emoji)
);

-- 5. Storage bucket for images
-- Note: Storage buckets are usually created via the dashboard, but you can try:
insert into storage.buckets (id, name, public)
select 'chat_images', 'chat_images', true
where not exists (
    select 1 from storage.buckets where id = 'chat_images'
);

-- 6. Enable RLS
ALTER TABLE public.chat_rooms ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_messages ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_reactions ENABLE ROW LEVEL SECURITY;

-- 7. Policies (Permissive for development, tighten for production)

-- Chat Rooms
CREATE POLICY "Public rooms are viewable by everyone" ON public.chat_rooms FOR SELECT USING (true);
CREATE POLICY "Users can insert rooms" ON public.chat_rooms FOR INSERT WITH CHECK (auth.role() = 'authenticated');

-- Chat Participants
CREATE POLICY "Participants viewable by everyone" ON public.chat_participants FOR SELECT USING (true);
CREATE POLICY "Users can join rooms" ON public.chat_participants FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Users can update own participant status" ON public.chat_participants FOR UPDATE USING (auth.uid() = user_id);

-- Chat Messages
CREATE POLICY "Messages viewable by everyone" ON public.chat_messages FOR SELECT USING (true);
CREATE POLICY "Users can insert messages" ON public.chat_messages FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Chat Reactions
CREATE POLICY "Reactions viewable by everyone" ON public.chat_reactions FOR SELECT USING (true);
CREATE POLICY "Users can insert reactions" ON public.chat_reactions FOR INSERT WITH CHECK (auth.uid() = user_id);

-- Storage Policies
create policy "Public Access"
  on storage.objects for select
  using ( bucket_id = 'chat_images' );

create policy "Authenticated Users can upload"
  on storage.objects for insert
  with check ( bucket_id = 'chat_images' and auth.role() = 'authenticated' );
