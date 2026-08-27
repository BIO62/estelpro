-- Admin orders. Run in Supabase SQL editor. Server uses service role; RLS has no policies.

create table if not exists public.orders (
  id text primary key,
  customer_name text not null default '',
  last_name text,
  first_name text,
  email text,
  phone text not null default '',
  extra_phone text,
  source text not null default 'manual',
  payment_method text not null default '',
  manager text,
  address text,
  delivery_fee numeric not null default 0,
  delivery_type text,
  vat_type text,
  invoice_id text,
  total numeric not null default 0,
  payment_status text not null default 'unpaid',
  status text not null default 'pending_payment',
  date text not null,
  note text,
  items jsonb not null default '[]'::jsonb,
  payments jsonb not null default '[]'::jsonb,
  timeline jsonb not null default '[]'::jsonb,
  deleted_at text,
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);

create index if not exists orders_date_idx on public.orders (date desc);
create index if not exists orders_phone_idx on public.orders (phone);
create index if not exists orders_invoice_idx on public.orders (invoice_id);
create index if not exists orders_status_idx on public.orders (status);
create index if not exists orders_deleted_idx on public.orders (deleted_at);

create table if not exists public.order_seq (
  name text primary key,
  value integer not null
);

insert into public.order_seq (name, value) values ('orders', 1000)
  on conflict (name) do nothing;

create or replace function public.next_order_id()
returns text
language plpgsql
as $$
declare
  v integer;
begin
  update public.order_seq
  set value = value + 1
  where name = 'orders'
  returning value into v;
  if v is null then
    insert into public.order_seq (name, value) values ('orders', 1001)
    returning value into v;
  end if;
  return v::text;
end;
$$;

alter table public.orders enable row level security;
alter table public.order_seq enable row level security;
