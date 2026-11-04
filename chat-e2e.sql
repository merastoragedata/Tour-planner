-- Run once in Supabase SQL editor (private 1-to-1 chat + encrypted messages)
alter table public.yatra_chat add column if not exists to_u text;
alter table public.yatra_chat add column if not exists enc boolean default false;
-- optional: old plain messages stay readable; new messages are stored encrypted.
