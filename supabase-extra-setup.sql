-- Run once in Supabase → SQL editor.
-- Storage for (1) AI story voices and (2) the pictures shown in 15-minute reminders.

insert into storage.buckets (id, name, public) values ('story-audio','story-audio', true)
  on conflict (id) do update set public = true;
insert into storage.buckets (id, name, public) values ('event-cards','event-cards', true)
  on conflict (id) do update set public = true;

drop policy if exists "yatra story audio read"   on storage.objects;
drop policy if exists "yatra story audio write"  on storage.objects;
drop policy if exists "yatra story audio update" on storage.objects;
drop policy if exists "yatra event cards read"   on storage.objects;
drop policy if exists "yatra event cards write"  on storage.objects;
drop policy if exists "yatra event cards update" on storage.objects;

create policy "yatra story audio read"   on storage.objects for select to anon using (bucket_id = 'story-audio');
create policy "yatra story audio write"  on storage.objects for insert to anon with check (bucket_id = 'story-audio');
create policy "yatra story audio update" on storage.objects for update to anon using (bucket_id = 'story-audio');
create policy "yatra event cards read"   on storage.objects for select to anon using (bucket_id = 'event-cards');
create policy "yatra event cards write"  on storage.objects for insert to anon with check (bucket_id = 'event-cards');
create policy "yatra event cards update" on storage.objects for update to anon using (bucket_id = 'event-cards');
