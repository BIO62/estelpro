import { createClient } from '@supabase/supabase-js';
import { randomBytes, scryptSync } from 'crypto';
import { readFileSync } from 'fs';
import path from 'path';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      for (const line of readFileSync(path.join(process.cwd(), file), 'utf8').split(/\r?\n/)) {
        const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!m || process.env[m[1]]) continue;
        process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
      }
    } catch {}
  }
}

loadEnv();

function hashPassword(password) {
  const salt = randomBytes(16).toString('hex');
  const hash = scryptSync(password, salt, 32).toString('hex');
  return `${salt}:${hash}`;
}

const db = createClient(
  process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY,
  { auth: { persistSession: false } },
);

const passwordHash = hashPassword('123');

const salons = [
  { code: '2020', percent: 20, tier: 'top20', name: 'Тест салон 20%' },
  { code: '2015', percent: 15, tier: 'gold15', name: 'Тест салон 15%' },
  { code: '2010', percent: 10, tier: 'gold15', name: 'Тест салон 10%' },
  { code: '2005', percent: 5, tier: 'vip5', name: 'Тест салон 5%' },
];

for (const s of salons) {
  const row = {
    salon_code: s.code,
    salon_name: s.name,
    contact_name: s.name,
    phone: `+976${s.code}0000`,
    email: `${s.code}@test.estel.mn`,
    city: 'Улаанбаатар',
    district: 'Тест',
    address: 'Тест хаяг',
    is_active: true,
    discount_tier: s.tier,
    discount_percent: s.percent,
    password_hash: passwordHash,
  };

  let { error } = await db.from('salons').upsert(row, { onConflict: 'salon_code' });
  if (error && /password_hash/i.test(error.message)) {
    const { password_hash: _, ...without } = row;
    ({ error } = await db.from('salons').upsert(without, { onConflict: 'salon_code' }));
    if (!error) {
      // try set hash separately; if column missing, phone login won't use 123
      await db.from('salons').update({ password_hash: passwordHash }).eq('salon_code', s.code);
    }
  }
  if (error) {
    console.error(s.code, error.message);
    process.exit(1);
  }
  console.log(`OK ${s.code} → ${s.percent}%  password=123`);
}
