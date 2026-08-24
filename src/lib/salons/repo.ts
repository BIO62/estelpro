import { isSupabaseConfigured, supabaseAdmin } from '@/lib/supabase/server';
import { findUserByEmail, findUserBySalonCode, normalizeSalonCode, saveOtp, takeOtp } from '@/lib/auth/store';

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

const OTP_TTL_MS = 10 * 60 * 1000;

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
  if (!db) {
    const user = findUserBySalonCode(normalized);
    if (!user) return null;
    return {
      id: user.id,
      salonCode: user.salonCode || normalized,
      salonName: user.salonName || user.name,
      contactName: user.name,
      phone: user.phone || '',
      email: user.email,
      city: user.city || '',
      district: user.district || null,
      address: user.address || '',
    };
  }
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
  if (!db) {
    const user = findUserByEmail(email);
    return user?.salonCode ? findSalonByCode(user.salonCode) : null;
  }
  const { data, error } = await db
    .from('salons')
    .select('*')
    .eq('email', email.trim().toLowerCase())
    .maybeSingle();
  if (error) throw new Error(error.message);
  return data ? fromRow(data as SalonRow & { id: string }) : null;
}

export async function listSalons({ limit = 50, offset = 0, search = '' } = {}) {
  const db = supabaseAdmin();
  if (!db) return { salons: [] as Salon[], total: 0 };
  let query = db.from('salons').select('*', { count: 'exact' }).order('salon_code');
  if (search.trim()) {
    const term = `%${search.trim()}%`;
    query = query.or(`salon_code.ilike.${term},salon_name.ilike.${term},phone.ilike.${term},city.ilike.${term}`);
  }
  const { data, count, error } = await query.range(offset, offset + limit - 1);
  if (error) throw new Error(error.message);
  return { salons: (data || []).map((row) => fromRow(row as SalonRow & { id: string })), total: count || 0 };
}

export async function saveSalonOtp(salon: Salon, code: string, channel: 'email' | 'sms' = 'email') {
  const destination = channel === 'sms' ? salon.phone : salon.email;
  const expiresAt = Date.now() + OTP_TTL_MS;
  const db = supabaseAdmin();
  if (!db) {
    saveOtp({ email: salon.email, code, purpose: 'login', expiresAt });
    return { destination, expiresAt };
  }
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
  if (!db) return takeOtp(salon.email, 'login', code);
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
