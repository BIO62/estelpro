import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

for (const file of ['.env.local', '.env']) {
  try {
    const raw = fs.readFileSync(path.join(process.cwd(), file), 'utf8');
    for (const line of raw.split(/\r?\n/)) {
      const match = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/i);
      if (!match) continue;
      const [, key, rawValue] = match;
      if (process.env[key]) continue;
      process.env[key] = rawValue.replace(/^["']|["']$/g, '');
    }
  } catch {}
}

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY, {
  auth: { persistSession: false },
});

async function clean() {
  console.log('Deleting dummy SLN-... demo records from Supabase...');
  const { error } = await supabase.from('salons').delete().like('salon_code', 'SLN-%');
  if (error) {
    console.error('Delete error:', error.message);
    return;
  }
  const { count } = await supabase.from('salons').select('id', { count: 'exact', head: true });
  console.log(`\n==============================================`);
  console.log(`✅ EXACT REAL CLIENTS IN SUPABASE: ${count}`);
  console.log(`==============================================\n`);
}

clean();
