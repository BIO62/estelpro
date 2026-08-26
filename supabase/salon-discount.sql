-- Prefer running this in Supabase SQL editor so new tier ids are allowed.
-- Until then the app maps: ep→top20, et→contract15, p15/es→gold15, p5/p0→vip5.

alter table public.salons drop constraint if exists salons_discount_tier_check;
alter table public.salons
  add constraint salons_discount_tier_check
  check (discount_tier in (
    'top20', 'gold15', 'contract15', 'vip5',
    'ep', 'et', 'p15', 'es', 'p5', 'p0',
    'p20', 'other'
  ));

alter table public.salons alter column discount_tier set default 'vip5';
alter table public.salons alter column discount_percent set default 0;
