-- ESTEL salon directory + OTP login (temporary DB for the salon channel).
-- Run this in the Supabase SQL editor, then seed with: npm run seed:salons

create extension if not exists "pgcrypto";

create table if not exists public.salons (
  id uuid primary key default gen_random_uuid(),
  salon_code text not null unique,
  salon_name text not null,
  contact_name text not null,
  phone text not null,
  email text not null unique,
  city text not null,
  district text,
  address text not null,
  is_active boolean not null default true,
  created_at timestamptz not null default now()
);

create index if not exists salons_phone_idx on public.salons (phone);
create index if not exists salons_city_idx on public.salons (city);

-- OTP codes for salon login. `channel` is 'email' while SMS Pro is not wired up;
-- switching to SMS later only means writing 'sms' + the phone as destination.
create table if not exists public.salon_otps (
  id bigserial primary key,
  salon_id uuid not null references public.salons (id) on delete cascade,
  channel text not null default 'email' check (channel in ('email', 'sms')),
  destination text not null,
  code text not null,
  purpose text not null default 'login',
  expires_at timestamptz not null,
  consumed_at timestamptz,
  created_at timestamptz not null default now()
);

create index if not exists salon_otps_lookup_idx
  on public.salon_otps (salon_id, purpose, consumed_at);

-- Only the server (service role) touches these tables, so RLS stays on with no
-- policies: anon/authenticated keys get nothing.
alter table public.salons enable row level security;
alter table public.salon_otps enable row level security;
