import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';

function normalizeSalonCode(code: string) {
  return code.trim().toUpperCase().replace(/\s+/g, '');
}

export type Salon = {
  id: string;
  salonCode: string;
  salonName: string;
  contactName: string;
  phone: string;
  email: string;
  city: string;
  district: string | null;
  address: string;
};

export type SalonRow = {
  id?: string;
  salon_code: string;
  salon_name: string;
  contact_name: string;
  phone: string;
  email: string;
  city: string;
  district: string | null;
  address: string;
};

const OTP_TTL_MS = 5 * 60 * 1000;

function fromRow(row: SalonRow & { id: string }): Salon {
  return {
    id: row.id,
    salonCode: row.salon_code,
    salonName: row.salon_name,
    contactName: row.contact_name,
    phone: row.phone,
    email: row.email,
    city: row.city,
    district: row.district,
    address: row.address,
  };
}

export function salonsBackend() {
  return isSupabaseConfigured() ? 'supabase' : 'local';
}

export async function findSalonByCode(code: string): Promise<Salon | null> {
  const normalized = normalizeSalonCode(code);
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from('salons')
    .select('*')
    .eq('salon_code', normalized)
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as SalonRow & { id: string }) : null;
}

export async function findSalonByEmail(email: string): Promise<Salon | null> {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from('salons')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .eq('is_active', true)
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as SalonRow & { id: string }) : null;
}

export async function findSalonByPhone(phone: string): Promise<Salon | null> {
  const cleanPhone = phone.trim().replace(/\D/g, '');
  if (!cleanPhone) return null;
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from('salons')
    .select('*')
    .ilike('phone', `%${cleanPhone}%`)
    .eq('is_active', true)
    .limit(1);
  if (error) throw new Error(error.message);
  return data && data.length > 0 ? fromRow(data[0] as SalonRow & { id: string }) : null;
}

export async function findSalonByIdentifier(identifier: string): Promise<Salon | null> {
  const clean = identifier.trim();
  if (!clean) return null;

  // 1. Try by code
  const byCode = await findSalonByCode(clean);
  if (byCode) return byCode;

  // 2. Try by email
  if (clean.includes('@')) {
    const byEmail = await findSalonByEmail(clean);
    if (byEmail) return byEmail;
  }

  // 3. Try by phone
  const byPhone = await findSalonByPhone(clean);
  if (byPhone) return byPhone;

  return null;
}

export async function listSalons({ limit = 50, offset = 0, search = '' } = {}) {
  const db = supabaseAdmin();
  if (!db) return { salons: [] as Salon[], total: 0 };
  let query = db.from('salons').select('*', { count: 'exact' }).eq('is_active', true).order('salon_code');
  if (search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`salon_code.ilike.${term},salon_name.ilike.${term},phone.ilike.${term},city.ilike.${term}`);
  }
  const { data, count, error } = await query.range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return { salons: (data || []).map((row) => fromRow(row as SalonRow & { id: string })), total: count || 0 };
}

export async function deactivateSalon(id: string) {
  const db = supabaseAdmin();
  if (!db) return null;
  const { data, error } = await db
    .from('salons')
    .update({ is_active: false })
    .eq('id', id)
    .select('id,salon_code,salon_name')
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data;
}

export async function saveSalonOtp(salon: Salon, code: string, channel: 'email' | 'sms' = 'email') {
  const destination = channel === 'sms' ? salon.phone : salon.email;
  const expiresAt = Date.now() + OTP_TTL_MS;
  const db = supabaseAdmin();
  if (!db) throw new Error('Supabase тохируулаагүй байна.');
  await db.from('salon_otps').update({ consumed_at: new Date().toISOString() }).match({
    salon_id: salon.id,
    purpose: 'login',
    consumed_at: null,
  });
  const { error } = await db.from('salon_otps').insert({
    salon_id: salon.id,
    channel,
    destination,
    code,
    purpose: 'login',
    expires_at: new Date(expiresAt).toISOString(),
  });
  if (error) throw new Error(error.message);
  return { destination, expiresAt };
}

export async function takeSalonOtp(salon: Salon, code: string) {
  const db = supabaseAdmin();
  if (!db) return false;
  const { data, error } = await db
    .from('salon_otps')
    .select('id')
    .eq('salon_id', salon.id)
    .eq('purpose', 'login')
    .eq('code', code)
    .is('consumed_at', null)
    .gt('expires_at', new Date().toISOString())
    .order('created_at', { ascending: false })
    .limit(1);
  if (error) throw new Error(error.message);
  const match = data?.[0];
  if (!match) return false;
  await db.from('salon_otps').update({ consumed_at: new Date().toISOString() }).eq('id', match.id);
  return true;
}

export async function upsertSalons(rows: SalonRow[]) {
  const db = supabaseAdmin();
  if (!db) throw new Error('Supabase тохируулаагүй байна.');
  const { error, count } = await db.from('salons').upsert(rows, { onConflict: 'salon_code', count: 'exact' });
  if (error) throw new Error(error.message);
  return count ?? rows.length;
}

export async function updateSalon(
  id: string,
  patch: Partial<{
    salonName: string;
    contactName: string;
    phone: string;
    email: string;
    city: string;
    district: string | null;
    address: string;
  }>,
) {
  const db = supabaseAdmin();
  if (!db) throw new Error('Supabase тохируулаагүй байна.');
  const row: Record<string, unknown> = {};
  if (patch.salonName !== undefined) row.salon_name = patch.salonName;
  if (patch.contactName !== undefined) row.contact_name = patch.contactName;
  if (patch.phone !== undefined) row.phone = patch.phone;
  if (patch.email !== undefined) row.email = patch.email.trim().toLowerCase();
  if (patch.city !== undefined) row.city = patch.city;
  if (patch.district !== undefined) row.district = patch.district;
  if (patch.address !== undefined) row.address = patch.address;
  const { data, error } = await db.from('salons').update(row).eq('id', id).select('*').single();
  if (error) throw new Error(error.message);
  return fromRow(data as SalonRow & { id: string });
}

export async function createSalon(input: {
  salonCode: string;
  salonName: string;
  contactName: string;
  email: string;
  phone?: string;
  city?: string;
  district?: string;
  address?: string;
}) {
  const db = supabaseAdmin();
  if (!db) throw new Error('Supabase тохируулаагүй байна.');
  const code = normalizeSalonCode(input.salonCode);
  const row = {
    salon_code: code,
    salon_name: input.salonName.trim(),
    contact_name: input.contactName.trim(),
    email: input.email.trim().toLowerCase(),
    phone: (input.phone || '').trim() || '00000000',
    city: (input.city || 'Улаанбаатар').trim(),
    district: input.district?.trim() || null,
    address: (input.address || '').trim() || '—',
    is_active: true,
  };
  const { data, error } = await db.from('salons').insert(row).select('*').single();
  if (error) throw new Error(error.message);
  return fromRow(data as SalonRow & { id: string });
}
