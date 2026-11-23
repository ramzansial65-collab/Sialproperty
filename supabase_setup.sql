-- SIAL PROPERTY ADVISER: run this in Supabase SQL Editor.
-- This database is for property listing records ONLY. Firebase remains for bikeApplications.
create table if not exists public.listings (
  id uuid primary key default gen_random_uuid(),
  title text not null,
  city text not null,
  area text not null default '',
  property_type text not null default 'House',
  purpose text not null default 'Sale',
  price numeric,
  size text not null default '',
  beds integer,
  baths integer,
  description text not null default '',
  image_urls jsonb not null default '[]'::jsonb,
  video_url text not null default '',
  status text not null default 'pending' check (status in ('pending','approved')),
  created_by text not null default '',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
alter table public.listings enable row level security;
revoke all on public.listings from anon, authenticated;
grant select on public.listings to anon, authenticated;
grant insert, update, delete on public.listings to authenticated;

drop policy if exists "Public can read approved listings" on public.listings;
create policy "Public can read approved listings"
on public.listings for select to anon, authenticated
using (status = 'approved' or lower(coalesce(auth.jwt()->>'email','')) = 'ramzansial65@gmail.com');

drop policy if exists "Admin can insert listings" on public.listings;
create policy "Admin can insert listings"
on public.listings for insert to authenticated
with check (lower(coalesce(auth.jwt()->>'email','')) = 'ramzansial65@gmail.com');

drop policy if exists "Admin can update listings" on public.listings;
create policy "Admin can update listings"
on public.listings for update to authenticated
using (lower(coalesce(auth.jwt()->>'email','')) = 'ramzansial65@gmail.com')
with check (lower(coalesce(auth.jwt()->>'email','')) = 'ramzansial65@gmail.com');

drop policy if exists "Admin can delete listings" on public.listings;
create policy "Admin can delete listings"
on public.listings for delete to authenticated
using (lower(coalesce(auth.jwt()->>'email','')) = 'ramzansial65@gmail.com');
