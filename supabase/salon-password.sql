-- Salon password hash (optional). Null = login with phone digits.
alter table public.salons
  add column if not exists password_hash text;

-- Allow 0% tier
alter table public.salons drop constraint if exists salons_discount_tier_check;
alter table public.salons
  add constraint salons_discount_tier_check
  check (discount_tier in ('p20', 'ep', 'et', 'es', 'p5', 'p0', 'other'));

update public.salons
set discount_tier = 'p0', discount_percent = 0
where discount_tier = 'other' or discount_percent = 0;
