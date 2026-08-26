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

/** Logical → DB-allowed: ep→top20, et→contract15, p15/es→gold15, p5/p0→vip5 */
function classify(name) {
  const n = String(name || '');
  if (/\d+\.\s*EP\b|(^|[\s./])EP(\s|$)/i.test(n)) return { discount_tier: 'top20', discount_percent: 20 };
  if (/\d+\.\s*ET\b|(^|[\s./])ET(\s|$)/i.test(n)) return { discount_tier: 'contract15', discount_percent: 20 };
  if (/\d+\.\s*ES\b|(^|[\s./])ES(\s|$)/i.test(n)) return { discount_tier: 'gold15', discount_percent: 10 };
  if (/\/\s*S\b|\bSILVER\b/i.test(n)) return { discount_tier: 'gold15', discount_percent: 10 };
  if (/\/\s*G\b|\bGOLD\b/i.test(n)) return { discount_tier: 'gold15', discount_percent: 15 };
  if (/^\s*4\./.test(n)) return { discount_tier: 'vip5', discount_percent: 5 };
  if (/^\s*1\./.test(n)) return { discount_tier: 'vip5', discount_percent: 0 };
  return { discount_tier: 'vip5', discount_percent: 0 };
}

const { data, error } = await db.from('salons').select('id,salon_name').eq('is_active', true);
if (error) {
  console.error(error.message);
  process.exit(1);
}

const groups = {};
for (const row of data) {
  const patch = classify(row.salon_name);
  const key = `${patch.discount_tier}:${patch.discount_percent}`;
  if (!groups[key]) groups[key] = { ...patch, ids: [] };
  groups[key].ids.push(row.id);
}

for (const group of Object.values(groups)) {
  const CHUNK = 80;
  for (let i = 0; i < group.ids.length; i += CHUNK) {
    const slice = group.ids.slice(i, i + CHUNK);
    const { error: upErr } = await db
      .from('salons')
      .update({ discount_tier: group.discount_tier, discount_percent: group.discount_percent })
      .in('id', slice);
    if (upErr) {
      console.error(group.discount_tier, group.discount_percent, upErr.message);
      process.exit(1);
    }
  }
  console.log(`${group.discount_tier} ${group.discount_percent}%: ${group.ids.length}`);
}

console.log(
  JSON.stringify(
    {
      total: data.length,
      groups: Object.fromEntries(Object.entries(groups).map(([k, v]) => [k, v.ids.length])),
    },
    null,
    2,
  ),
);
