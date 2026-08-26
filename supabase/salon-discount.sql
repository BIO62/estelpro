-- 20 / 15 / 10 / 5
alter table public.salons
  add column if not exists discount_tier text not null default 'et';

alter table public.salons
  add column if not exists discount_percent integer not null default 15;

update public.salons set discount_tier = 'p20', discount_percent = 20 where discount_tier in ('top20', 'p20');
update public.salons set discount_tier = 'ep', discount_percent = 15 where discount_tier in ('gold15', 'ep');
update public.salons set discount_tier = 'et', discount_percent = 15 where discount_tier in ('contract15', 'et');
update public.salons set discount_tier = 'es', discount_percent = 10 where discount_tier = 'es';
update public.salons set discount_tier = 'p5', discount_percent = 5
  where discount_tier in ('vip5', 'other', 'p5');

alter table public.salons drop constraint if exists salons_discount_tier_check;
alter table public.salons
  add constraint salons_discount_tier_check
  check (discount_tier in ('p20', 'ep', 'et', 'es', 'p5'));

update public.salons
set discount_percent = case discount_tier
  when 'p20' then 20
  when 'ep' then 15
  when 'et' then 15
  when 'es' then 10
  when 'p5' then 5
  else 15
end;

alter table public.salons alter column discount_tier set default 'et';
alter table public.salons alter column discount_percent set default 15;

create index if not exists salons_discount_percent_idx on public.salons (discount_percent desc);
