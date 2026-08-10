-- ============================================================
-- Infa's Fiesta 2026 — RSVP table
-- Run this in Supabase SQL Editor once.
-- Safe to re-run (idempotent): existing policies are dropped first.
-- IMPORTANT: run it in the SAME project as the URL + anon key in
-- js/supabase-config.js (currently: lrsgzxkqsomghvqxhekh).
-- ============================================================

create table if not exists public.rsvps (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  guests int not null default 1,
  message text,
  created_at timestamptz not null default now()
);

alter table public.rsvps enable row level security;

drop policy if exists "Public can insert rsvps" on public.rsvps;
drop policy if exists "Public can view rsvps" on public.rsvps;

create policy "Public can insert rsvps"
on public.rsvps for insert
with check (true);

create policy "Public can view rsvps"
on public.rsvps for select
using (true);