-- Owner role + job title (position), separate from system role.
-- Run once in Supabase SQL Editor.

alter table public.app_users
  drop constraint if exists app_users_role_check;

alter table public.app_users
  add constraint app_users_role_check
  check (role in ('consumer', 'owner', 'director', 'manager', 'operator'));

alter table public.app_users
  add column if not exists position text;

update public.app_users
set role = 'owner',
    kind = 'staff',
    status = 'active',
    email_verified = true,
    position = coalesce(nullif(position, ''), 'ceo'),
    name = coalesce(nullif(name, ''), 'Ерөнхий захирал'),
    updated_at = now()
where email = 'director@estel.mn';
