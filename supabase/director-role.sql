-- Run once in Supabase SQL Editor so director can be stored as role = 'director'.

alter table public.app_users
  drop constraint if exists app_users_role_check;

alter table public.app_users
  add constraint app_users_role_check
  check (role in ('consumer', 'owner', 'director', 'manager', 'operator'));

update public.app_users
set role = 'director',
    kind = 'staff',
    status = 'active',
    email_verified = true,
    name = 'Захирал',
    updated_at = now()
where email = 'director@estel.mn';
