-- Run in Supabase SQL Editor (once).
-- Site consumers + staff audit. Salons stay in public.salons.

create extension if not exists "pgcrypto";

create table if not exists public.app_users (
  id uuid primary key default gen_random_uuid(),
  email text not null unique,
  name text not null,
  last_name text,
  phone text,
  password_hash text,
  kind text not null default 'consumer'
    check (kind in ('consumer', 'staff')),
  role text not null default 'consumer'
    check (role in ('consumer', 'owner', 'director', 'manager', 'operator')),
  -- pending_otp → pending_review (after email OTP) → active | rejected
  status text not null default 'pending_otp'
    check (status in ('pending_otp', 'pending_review', 'active', 'rejected')),
  email_verified boolean not null default false,
  address text,
  city text,
  district text,
  position text,
  notes text,
  reviewed_by uuid,
  reviewed_at timestamptz,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists app_users_status_idx on public.app_users (status);
create index if not exists app_users_kind_idx on public.app_users (kind);
create index if not exists app_users_phone_idx on public.app_users (phone);
create index if not exists app_users_role_idx on public.app_users (role);

create table if not exists public.audit_logs (
  id bigserial primary key,
  actor_id text,
  actor_email text,
  actor_role text,
  action text not null,
  entity_type text not null,
  entity_id text,
  summary text not null,
  meta jsonb not null default '{}'::jsonb,
  created_at timestamptz not null default now()
);

create index if not exists audit_logs_created_idx on public.audit_logs (created_at desc);
create index if not exists audit_logs_entity_idx on public.audit_logs (entity_type, entity_id);

alter table public.app_users enable row level security;
alter table public.audit_logs enable row level security;
