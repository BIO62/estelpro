// Seeds the Supabase `salons` table with a deterministic demo directory.
// Usage: npm run seed:salons [count]   (default 2000)
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
      // file is optional
    }
  }
}

loadEnv();

const URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!URL || !SERVICE_KEY) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY тохируулаагүй байна (.env.local).');
  process.exit(1);
}

const COUNT = Number(process.argv[2] || 2000);
const START_CODE = 1001;

// Deterministic RNG so re-running the seed produces the same directory.
function mulberry32(seed) {
  return function random() {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

const rand = mulberry32(20260824);
const pick = (list) => list[Math.floor(rand() * list.length)];
const between = (min, max) => min + Math.floor(rand() * (max - min + 1));

const UB_DISTRICTS = [
  'Баянзүрх',
  'Сүхбаатар',
  'Чингэлтэй',
  'Хан-Уул',
  'Баянгол',
  'Сонгинохайрхан',
  'Налайх',
  'Багануур',
];

const PROVINCES = [
  'Дархан-Уул',
  'Орхон',
  'Сэлэнгэ',
  'Дорнод',
  'Ховд',
  'Увс',
  'Баян-Өлгий',
  'Архангай',
  'Өвөрхангай',
  'Хөвсгөл',
  'Дундговь',
  'Говь-Алтай',
  'Завхан',
  'Сүхбаатар',
  'Дорноговь',
];

const SALON_FIRST = [
  'Amina',
  'Aurum',
  'Bella',
  'Blossom',
  'Chic',
  'Diamond',
  'Elegant',
  'Erdene',
  'Glamour',
  'Golden',
  'Hair Lab',
  'Lavish',
  'Lotus',
  'Luxe',
  'Mirage',
  'Nomin',
  'Ocean',
  'Orchid',
  'Pearl',
  'Royal',
  'Sakura',
  'Serenity',
  'Silk',
  'Sunrise',
  'Tsagaan',
  'Urban',
  'Velvet',
  'Vogue',
  'White',
  'Zaya',
];

const SALON_SECOND = ['Beauty', 'Studio', 'Salon', 'Hair', 'Style', 'Lounge', 'Room', 'Atelier', 'Concept', 'Spa'];

const LAST_NAMES = [
  'Батбаяр',
  'Болд',
  'Ганбаатар',
  'Дорж',
  'Энхбат',
  'Жаргал',
  'Лхагва',
  'Мөнх',
  'Нэргүй',
  'Отгон',
  'Пүрэв',
  'Сүхбаатар',
  'Түвшин',
  'Уранцэцэг',
  'Хишиг',
  'Цэрэн',
  'Чулуун',
  'Ямаа',
];

const FIRST_NAMES = [
  'Ануужин',
  'Билгүүн',
  'Гантулга',
  'Дулмаа',
  'Ерөөл',
  'Жавхлан',
  'Заяа',
  'Ирээдүй',
  'Хонгорзул',
  'Мандах',
  'Наранцэцэг',
  'Оюунаа',
  'Сарнай',
  'Тэмүүлэн',
  'Ундрах',
  'Хулан',
  'Цэцэгмаа',
  'Энхжин',
];

const STREETS = [
  'Их тойруу',
  'Энхтайваны өргөн чөлөө',
  'Чингисийн өргөн чөлөө',
  'Нарны зам',
  'Сеулын гудамж',
  'Олимпийн гудамж',
  'Тээвэрчдийн гудамж',
  'Бага тойруу',
  'Дунд гол',
  'Токиогийн гудамж',
];

const BUILDINGS = ['тауэр', 'плаза', 'центр', 'residence', 'хотхон', 'бизнес центр'];

function salonName() {
  return `${pick(SALON_FIRST)} ${pick(SALON_SECOND)}`;
}

function phone() {
  // Mongolian mobile prefixes.
  const prefix = pick([80, 85, 86, 88, 89, 90, 91, 94, 95, 96, 99]);
  return `+976${prefix}${String(between(0, 999999)).padStart(6, '0')}`;
}

function place() {
  // Roughly two thirds of salons sit in Ulaanbaatar.
  if (rand() < 0.66) {
    const district = pick(UB_DISTRICTS);
    return {
      city: 'Улаанбаатар',
      district,
      address: `${district} дүүрэг, ${between(1, 26)}-р хороо, ${pick(STREETS)} ${between(1, 90)}, ${pick(
        BUILDINGS
      )}, ${between(1, 60)} тоот`,
    };
  }
  const province = pick(PROVINCES);
  return {
    city: province,
    district: null,
    address: `${province} аймаг, ${between(1, 12)}-р баг, ${pick(STREETS)} ${between(1, 40)}, ${between(1, 30)} тоот`,
  };
}

const rows = [];
const usedPhones = new Set();

for (let i = 0; i < COUNT; i += 1) {
  const code = `SLN-${START_CODE + i}`;
  let mobile = phone();
  while (usedPhones.has(mobile)) mobile = phone();
  usedPhones.add(mobile);
  const { city, district, address } = place();
  const name = salonName();
  rows.push({
    salon_code: code,
    salon_name: name,
    contact_name: `${pick(LAST_NAMES)} ${pick(FIRST_NAMES)}`,
    phone: mobile,
    email: `${code.toLowerCase().replace('-', '')}@salon.estel.mn`,
    city,
    district,
    address,
  });
}

const supabase = createClient(URL, SERVICE_KEY, { auth: { persistSession: false } });

const BATCH = 500;
let written = 0;

for (let i = 0; i < rows.length; i += BATCH) {
  const batch = rows.slice(i, i + BATCH);
  const { error } = await supabase.from('salons').upsert(batch, { onConflict: 'salon_code' });
  if (error) {
    console.error(`Batch ${i / BATCH + 1} failed:`, error.message);
    process.exit(1);
  }
  written += batch.length;
  console.log(`${written}/${rows.length} salons upserted`);
}

const { count } = await supabase.from('salons').select('id', { count: 'exact', head: true });
console.log(`Done. salons table now holds ${count} rows.`);
console.log(`Demo login codes: SLN-${START_CODE} … SLN-${START_CODE + COUNT - 1}`);
