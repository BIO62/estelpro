-- Run once in Supabase SQL Editor, then: npm run import:products -- --enrich-price

create extension if not exists "pgcrypto";

create table if not exists public.products (
  id uuid primary key default gen_random_uuid(),
  sylius_id integer,
  code text not null unique,
  sku text,
  name text not null,
  slug text,
  price numeric not null default 0,
  original_price numeric,
  stock integer not null default 0,
  is_tax boolean not null default true,
  brand text,
  taxon text,
  taxons jsonb not null default '[]'::jsonb,
  image_url text,
  gallery jsonb not null default '[]'::jsonb,
  short_description text,
  description text,
  enabled boolean not null default true,
  synced_at timestamptz not null default now(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists products_sku_idx on public.products (sku);
create index if not exists products_code_idx on public.products (code);
create index if not exists products_name_idx on public.products (name);

alter table public.products enable row level security;
alter table public.products add column if not exists taxons jsonb not null default '[]'::jsonb;
