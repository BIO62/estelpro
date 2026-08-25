import fs from 'fs';
import path from 'path';
import xlsxPkg from 'xlsx';
const xlsx = xlsxPkg.readFile ? xlsxPkg : xlsxPkg.default || xlsxPkg;

// 1. Load environment variables
function loadEnv() {
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
}

loadEnv();

const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

const scriptsDir = path.join(process.cwd(), 'scripts');
const files = fs.readdirSync(scriptsDir).filter(f => f.endsWith('.xlsx'));

console.log('Found Excel files in scripts:', files);

let customerFile = files.find(f => f.includes('2026.7.27'));
let salonFile = files.find(f => f.includes('2026.8.24'));

if (customerFile) {
  const wb = xlsx.readFile(path.join(scriptsDir, customerFile));
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n=== CUSTOMERS (${customerFile}) ===`);
  console.log(`Total rows: ${rows.length}`);
  console.log('Row 0 (headers):', rows[0]);
  console.log('Row 1 (sample):', rows[1]);
  console.log('Row 2 (sample):', rows[2]);
  console.log('Row 3 (sample):', rows[3]);
}

if (salonFile) {
  const wb = xlsx.readFile(path.join(scriptsDir, salonFile));
  const sheetName = wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });
  console.log(`\n=== SALONS (${salonFile}) ===`);
  console.log(`Total rows: ${rows.length}`);
  for (let i = 0; i < Math.min(8, rows.length); i++) {
    console.log(`Row ${i}:`, rows[i]);
  }
}
