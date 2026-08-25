import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';

export type AppUserStatus = 'pending_otp' | 'pending_review' | 'active' | 'rejected';
export type AppUserKind = 'consumer' | 'staff';
export type AppUserRole = 'consumer' | 'manager' | 'operator';

export type AppUser = {
  id: string;
  email: string;
  name: string;
  lastName: string | null;
  phone: string | null;
  kind: AppUserKind;
  role: AppUserRole;
  status: AppUserStatus;
  emailVerified: boolean;
  address: string | null;
  city: string | null;
  district: string | null;
  notes: string | null;
  createdAt: string;
  updatedAt: string;
};

type Row = {
  id: string;
  email: string;
  name: string;
  last_name: string | null;
  phone: string | null;
  kind: AppUserKind;
  role: AppUserRole;
  status: AppUserStatus;
  email_verified: boolean;
  address: string | null;
  city: string | null;
  district: string | null;
  notes: string | null;
  created_at: string;
  updated_at: string;
};

function fromRow(row: Row): AppUser {
  return {
    id: row.id,
    email: row.email,
    name: row.name,
    lastName: row.last_name,
    phone: row.phone,
    kind: row.kind,
    role: row.role,
    status: row.status,
    emailVerified: row.email_verified,
    address: row.address,
    city: row.city,
    district: row.district,
    notes: row.notes,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export function appUsersReady() {
  return isSupabaseConfigured() && !!supabaseAdmin();
}

export async function createAppUser(input: {
  id?: string;
  email: string;
  name: string;
  lastName?: string;
  phone?: string;
  passwordHash?: string;
  kind?: AppUserKind;
  role?: AppUserRole;
  status?: AppUserStatus;
  emailVerified?: boolean;
}) {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from('app_users')
    .insert({
      id: input.id,
      email: input.email.toLowerCase(),
      name: input.name,
      last_name: input.lastName || null,
      phone: input.phone || null,
      password_hash: input.passwordHash || null,
      kind: input.kind || 'consumer',
      role: input.role || 'consumer',
      status: input.status || 'pending_otp',
      email_verified: input.emailVerified ?? false,
      updated_at: new Date().toISOString(),
    })
    .select('*')
    .single();
  if (error) throw new Error(error.message);
  return fromRow(data as Row);
}

export async function findAppUserByEmail(email: string) {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from('app_users')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as Row) : null;
}

export async function deleteUnverifiedAppUser(email: string) {
  const db = supabaseAdmin();
  if (!db) return;
  const { error } = await db
    .from('app_users')
    .delete()
    .eq('email', email.trim().toLowerCase())
    .eq('email_verified', false);
  if (error) throw new Error(error.message);
}

export async function listAppUsers(opts?: {
  status?: AppUserStatus | 'ALL';
  kind?: AppUserKind;
  q?: string;
  limit?: number;
  offset?: number;
}) {
  const db = supabaseAdmin();
  if (!db) return { items: [] as AppUser[], total: 0 };
  const limit = opts?.limit ?? 50;
  const offset = opts?.offset ?? 0;
  let query = db
    .from('app_users')
    .select('*', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1);

  if (opts?.kind) query = query.eq('kind', opts.kind);
  if (opts?.status && opts.status !== 'ALL') query = query.eq('status', opts.status);
  if (opts?.q?.trim()) {
    const q = opts.q.trim();
    query = query.or(`name.ilike.%${q}%,email.ilike.%${q}%,phone.ilike.%${q}%,last_name.ilike.%${q}%`);
  }

  const { data, error, count } = await query;
  if (error) throw new Error(error.message);
  return { items: (data as Row[]).map(fromRow), total: count ?? 0 };
}

export async function updateAppUser(
  id: string,
  patch: Partial<{
    name: string;
    lastName: string | null;
    phone: string | null;
    address: string | null;
    city: string | null;
    district: string | null;
    notes: string | null;
    status: AppUserStatus;
    emailVerified: boolean;
    role: AppUserRole;
  }>,
) {
  const db = supabaseAdmin();
  if (!db) return null;
  const row: Record<string, unknown> = { updated_at: new Date().toISOString() };
  if (patch.name !== undefined) row.name = patch.name;
  if (patch.lastName !== undefined) row.last_name = patch.lastName;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.address !== undefined) row.address = patch.address;
  if (patch.city !== undefined) row.city = patch.city;
  if (patch.district !== undefined) row.district = patch.district;
  if (patch.notes !== undefined) row.notes = patch.notes;
  if (patch.status !== undefined) row.status = patch.status;
  if (patch.emailVerified !== undefined) row.email_verified = patch.emailVerified;
  if (patch.role !== undefined) row.role = patch.role;
  if (patch.status === 'active' || patch.status === 'rejected') {
    row.reviewed_at = new Date().toISOString();
  }

  const { data, error } = await db.from('app_users').update(row).eq('id', id).select('*').single();
  if (error) throw new Error(error.message);
  return fromRow(data as Row);
}

export async function markAppUserEmailVerified(email: string) {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from('app_users')
    .update({
      email_verified: true,
      status: 'active',
      updated_at: new Date().toISOString(),
    })
    .eq('email', email.trim().toLowerCase())
    .select('*')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as Row) : null;
}
