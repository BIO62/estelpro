import fs from 'fs';
import path from 'path';
import xlsxPkg from 'xlsx';
import { createClient } from '@supabase/supabase-js';

const xlsx = xlsxPkg.readFile ? xlsxPkg : xlsxPkg.default || xlsxPkg;

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

if (!URL || !SERVICE_KEY) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY тохируулаагүй байна.');
  process.exit(1);
}

const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });
const scriptsDir = path.join(process.cwd(), 'scripts');
const files = fs.readdirSync(scriptsDir).filter((f) => f.endsWith('.xlsx'));

const customerFile = files.find((f) => f.includes('2026.7.27'));
const salonFile = files.find((f) => f.includes('2026.8.24'));

async function importSalons() {
  if (!salonFile) return console.log('Salon file not found');
  const wb = xlsx.readFile(path.join(scriptsDir, salonFile));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  console.log('\n--- Parsing Salons ---');
  // Row 4 is header: ['Код', 'Нэр', 'Харилцагчийн бүлэг', 'Регистр №', 'Хаяг', 'Харилцагчийн ангиллын код', 'Үүсгэсэн огноо', 'Харилцагчийн ангиллын нэр', 'Утас']
  const salonRows = [];
  for (let i = 5; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    const code = String(row[0]).trim();
    const name = String(row[1] || '').trim();
    const district = String(row[2] || '').trim();
    const registerNo = String(row[3] || '').trim();
    const address = String(row[4] || '').trim();
    const categoryCode = String(row[5] || '001').trim();
    const categoryName = String(row[7] || 'САЛОН').trim();
    const phone = String(row[8] || '').replace(/[^0-9+]/g, '').trim();
    const nameUpper = `${name} ${categoryName}`;
    let discount_tier = 'et';
    let discount_percent = 15;
    if (/(^|[\s./])ES(\s|$)/i.test(nameUpper) || categoryCode === '003') {
      discount_tier = 'es';
      discount_percent = 10;
    } else if (/(^|[\s./])EP(\s|$)/i.test(nameUpper)) {
      discount_tier = 'ep';
      discount_percent = 15;
    } else if (/(^|[\s./])ET(\s|$)/i.test(nameUpper) || categoryCode === '002') {
      discount_tier = 'et';
      discount_percent = 15;
    } else if (categoryCode === '001') {
      discount_tier = 'p20';
      discount_percent = 20;
    }

    // Determine city
    const city = district.includes('аймаг') ? district : 'Улаанбаатар';

    salonRows.push({
      salon_code: code,
      salon_name: name,
      contact_name: name,
      phone: phone ? (phone.startsWith('+976') ? phone : `+976${phone}`) : '+97600000000',
      email: `${code.toLowerCase()}@salon.estel.mn`,
      city: city,
      district: district,
      address: address || `${district}, Монгол`,
      is_active: true,
      discount_tier,
      discount_percent,
    });
  }

  console.log(`Parsed ${salonRows.length} real salons.`);
  // Upsert to Supabase
  const BATCH = 200;
  for (let i = 0; i < salonRows.length; i += BATCH) {
    const batch = salonRows.slice(i, i + BATCH);
    const { error } = await supabase.from('salons').upsert(batch, { onConflict: 'salon_code' });
    if (error) {
      console.error(`Salon batch error at ${i}:`, error.message);
    } else {
      console.log(`Upserted salons: ${i + batch.length}/${salonRows.length}`);
    }
  }
}

async function importCustomers() {
  if (!customerFile) return console.log('Customer file not found');
  const wb = xlsx.readFile(path.join(scriptsDir, customerFile));
  const sheet = wb.Sheets[wb.SheetNames[0]];
  const rows = xlsx.utils.sheet_to_json(sheet, { header: 1 });

  console.log('\n--- Parsing Customers / Stylists ---');
  // Row 0 is header: ['Код', 'Нэр', 'Харилцагчийн бүлэг', 'Регистр №', 'Хаяг', 'Харилцагчийн ангиллын код', 'Харилцагчийн ангиллын нэр', 'Зассан огноо', 'Утас', 'Хямдал хувь']
  const customerRows = [];
  for (let i = 1; i < rows.length; i++) {
    const row = rows[i];
    if (!row || !row[0]) continue;
    const code = String(row[0]).trim();
    const name = String(row[1] || '').trim();
    const district = String(row[2] || '').trim();
    const registerNo = String(row[3] || '').trim();
    const address = String(row[4] || '').trim();
    const categoryCode = String(row[5] || '').trim();
    const tierName = String(row[6] || 'GOLD MEMBER').trim();
    const phone = String(row[8] || '').replace(/[^0-9+]/g, '').trim();
    const discount = Number(row[9] || (tierName.includes('GOLD') ? 15 : 10));
    const percent = [20, 15, 10, 5].includes(discount) ? discount : discount >= 12 ? 15 : discount >= 8 ? 10 : 5;
    const discount_tier = percent === 20 ? 'p20' : percent === 10 ? 'es' : percent === 5 ? 'p5' : tierName.includes('GOLD') ? 'ep' : 'et';

    const city = district.includes('аймаг') ? district : 'Улаанбаатар';

    customerRows.push({
      salon_code: code,
      salon_name: name,
      contact_name: name,
      phone: phone ? (phone.startsWith('+976') ? phone : `+976${phone}`) : `+976${code}`,
      email: `${code.toLowerCase()}@stylist.estel.mn`,
      city: city,
      district: district,
      address: address || `${district}, Монгол`,
      is_active: true,
      discount_tier,
      discount_percent: percent,
    });
  }

  console.log(`Parsed ${customerRows.length} real customers/stylists.`);
  const BATCH = 200;
  for (let i = 0; i < customerRows.length; i += BATCH) {
    const batch = customerRows.slice(i, i + BATCH);
    const { error } = await supabase.from('salons').upsert(batch, { onConflict: 'salon_code' });
    if (error) {
      console.error(`Customer batch error at ${i}:`, error.message);
    } else {
      console.log(`Upserted customers: ${i + batch.length}/${customerRows.length}`);
    }
  }
}

async function run() {
  await importSalons();
  await importCustomers();
  const { count } = await supabase.from('salons').select('id', { count: 'exact', head: true });
  console.log(`\n===========================================`);
  console.log(`✅ TOTAL CLIENTS IN SUPABASE: ${count}`);
  console.log(`===========================================`);
}

run();
