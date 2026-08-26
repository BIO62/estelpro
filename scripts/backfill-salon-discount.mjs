import { createClient } from '@supabase/supabase-js';
import { readFileSync } from 'fs';
import path from 'path';

function loadEnv() {
  for (const file of ['.env.local', '.env']) {
    try {
      const raw = readFileSync(path.join(process.cwd(), file), 'utf8');
      for (const line of raw.split(/\r?\n/)) {
        const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
        if (!match) continue;
        const [, key, rawValue] = match;
        if (process.env[key]) continue;
        process.env[key] = rawValue.replace(/^["']|["']$/g, '');
      }
    } catch {
      /* optional */
    }
  }
}

loadEnv();

const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const db = createClient(URL, KEY, { auth: { persistSession: false } });

function classify(name) {
  const n = String(name || '');
  if (/(^|[\s./])ES(\s|$)/i.test(n) || /^\d+\.\s*ES\b/i.test(n)) return { discount_tier: 'es', discount_percent: 10 };
  if (/(^|[\s./])EP(\s|$)/i.test(n) || /^\d+\.\s*EP\b/i.test(n)) return { discount_tier: 'ep', discount_percent: 15 };
  if (/(^|[\s./])ET(\s|$)/i.test(n) || /^\d+\.\s*ET\b/i.test(n)) return { discount_tier: 'et', discount_percent: 15 };
  if (/20\s*%/.test(n)) return { discount_tier: 'p20', discount_percent: 20 };
  if (/10\s*%/.test(n) || /SILVER/i.test(n)) return { discount_tier: 'es', discount_percent: 10 };
  if (/(^|\D)5\s*%/.test(n)) return { discount_tier: 'p5', discount_percent: 5 };
  if (/15\s*%/.test(n) || /GOLD/i.test(n)) return { discount_tier: 'ep', discount_percent: 15 };
  if (/^\s*4\./.test(n)) return { discount_tier: 'es', discount_percent: 10 };
  if (/^\s*1\./.test(n)) return { discount_tier: 'et', discount_percent: 15 };
  return { discount_tier: 'p5', discount_percent: 5 };
}

const { data, error } = await db.from('salons').select('id,salon_name').eq('is_active', true);
if (error) {
  console.error(error.message);
  process.exit(1);
}

const groups = { 20: [], 15: [], 10: [], 5: [] };
for (const row of data) {
  const patch = classify(row.salon_name);
  groups[patch.discount_percent].push(row.id);
}

for (const [percent, ids] of Object.entries(groups)) {
  const CHUNK = 100;
  for (let i = 0; i < ids.length; i += CHUNK) {
    const slice = ids.slice(i, i + CHUNK);
    const { error: upErr } = await db.from('salons').update({ discount_percent: Number(percent) }).in('id', slice);
    if (upErr) {
      console.error(percent, upErr.message);
      process.exit(1);
    }
  }
  console.log(`${percent}%: ${ids.length}`);
}

console.log(JSON.stringify({ total: data.length, counts: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.length])) }, null, 2));
