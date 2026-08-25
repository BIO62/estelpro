/**
 * Import Sylius product CSV → Supabase `products`.
 * Images: CloudFront URL from Images_main (optional --upload to Storage).
 * Prices: CSV often empty → enrich from Sylius shop API (--enrich-price).
 *
 * Usage:
 *   node scripts/import-sylius-csv.mjs "C:/Users/odkos/Downloads/sylius.product-2026-08-25.csv"
 *   node scripts/import-sylius-csv.mjs path/to.csv --enrich-price
 *   node scripts/import-sylius-csv.mjs path/to.csv --upload
 */
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';

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
    } catch {
      /* ignore */
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SYLIUS_BASE = (process.env.NEXT_PUBLIC_SYLIUS_URL || 'https://estel.nextstore.mn').replace(/\/$/, '');
const CDN_BASE =
  process.env.SYLIUS_IMAGE_CDN ||
  'https://d2zu1tgnlo40u9.cloudfront.net/uploads/cache/app_shop_product_detail_medium';
const BUCKET = 'product-images';

const args = process.argv.slice(2);
const csvPath =
  args.find((a) => !a.startsWith('--')) ||
  path.join(process.env.USERPROFILE || '', 'Downloads', 'sylius.product-2026-08-25.csv');
const ENRICH_PRICE = args.includes('--enrich-price');
const UPLOAD = args.includes('--upload');
const DRY = args.includes('--dry');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY missing');
  process.exit(1);
}
if (!fs.existsSync(csvPath)) {
  console.error('CSV not found:', csvPath);
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function parseCsv(text) {
  const rows = [];
  let i = 0;
  let field = '';
  let row = [];
  let inQuotes = false;
  while (i < text.length) {
    const ch = text[i];
    if (inQuotes) {
      if (ch === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i += 1;
        continue;
      }
      field += ch;
      i += 1;
      continue;
    }
    if (ch === '"') {
      inQuotes = true;
      i += 1;
      continue;
    }
    if (ch === ',') {
      row.push(field);
      field = '';
      i += 1;
      continue;
    }
    if (ch === '\n' || (ch === '\r' && text[i + 1] === '\n')) {
      row.push(field);
      field = '';
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
      i += ch === '\r' ? 2 : 1;
      continue;
    }
    if (ch === '\r') {
      row.push(field);
      field = '';
      if (row.some((c) => c.trim() !== '')) rows.push(row);
      row = [];
      i += 1;
      continue;
    }
    field += ch;
    i += 1;
  }
  if (field.length || row.length) {
    row.push(field);
    if (row.some((c) => c.trim() !== '')) rows.push(row);
  }
  return rows;
}

function imageUrlFromCsv(rel) {
  if (!rel) return null;
  if (/^https?:\/\//i.test(rel)) return rel;
  return `${CDN_BASE}/${rel.replace(/^\//, '')}`;
}

function amount(priceInCents) {
  if (priceInCents == null || priceInCents === '') return 0;
  const n = Number(priceInCents);
  if (!Number.isFinite(n)) return 0;
  return n > 1_000_000 ? Math.round(n / 100) : n;
}

async function ensureBucket() {
  if (!UPLOAD) return;
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET || b.id === BUCKET)) return;
  await supabase.storage.createBucket(BUCKET, { public: true, fileSizeLimit: 8 * 1024 * 1024 });
}

async function uploadFromUrl(code, sourceUrl) {
  try {
    const res = await fetch(sourceUrl);
    if (!res.ok) return sourceUrl;
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = (sourceUrl.match(/\.(jpe?g|png|webp|gif)/i) || [, 'png'])[1].toLowerCase().replace('jpeg', 'jpg');
    const objectPath = `${code}/0.${ext}`;
    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, buf, {
      contentType: res.headers.get('content-type') || `image/${ext}`,
      upsert: true,
    });
    if (error) return sourceUrl;
    return supabase.storage.from(BUCKET).getPublicUrl(objectPath).data.publicUrl;
  } catch {
    return sourceUrl;
  }
}

async function fetchPrice(code) {
  try {
    const res = await fetch(`${SYLIUS_BASE}/api/v2/shop/products/${encodeURIComponent(code)}`, {
      headers: { Accept: 'application/json' },
    });
    if (!res.ok) return null;
    const p = await res.json();
    let variantPath = p.defaultVariant;
    if (!variantPath && Array.isArray(p.variants) && p.variants.length) {
      variantPath = typeof p.variants[0] === 'string' ? p.variants[0] : null;
    }
    if (p.variants?.[0] && typeof p.variants[0] === 'object' && p.variants[0].price != null) {
      const v = p.variants[0];
      return {
        price: amount(v.price),
        original_price:
          v.originalPrice && v.originalPrice > v.price ? amount(v.originalPrice) : null,
        stock: typeof v.onHand === 'number' ? v.onHand : 0,
        sku: v.code || code,
        brand: p.brand?.name || null,
      };
    }
    if (!variantPath) return { brand: p.brand?.name || null };
    const vUrl = variantPath.startsWith('http') ? variantPath : `${SYLIUS_BASE}${variantPath}`;
    const vr = await fetch(vUrl, { headers: { Accept: 'application/json' } });
    if (!vr.ok) return { brand: p.brand?.name || null };
    const v = await vr.json();
    return {
      price: amount(v.price),
      original_price:
        v.originalPrice && v.originalPrice > v.price ? amount(v.originalPrice) : null,
      stock: typeof v.onHand === 'number' ? v.onHand : 0,
      sku: v.code || code,
      brand: p.brand?.name || null,
    };
  } catch {
    return null;
  }
}

function mapRows(header, dataRows) {
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  const get = (row, key) => (row[idx[key]] ?? '').trim();
  const localeRank = (locale) => {
    if (locale === 'mn_MN') return 0;
    if (locale.startsWith('mn')) return 1;
    if (locale === 'en_US' || locale.startsWith('en')) return 2;
    return 9;
  };

  /** @type {Map<string, {rank:number, product:object}>} */
  const byCode = new Map();

  for (const row of dataRows) {
    const code = get(row, 'Code');
    if (!code) continue;
    const locale = get(row, 'Locale') || '';
    const rank = localeRank(locale);
    const existing = byCode.get(code);
    if (existing && existing.rank <= rank) continue;

    const taxons = get(row, 'Taxons')
      .split('|')
      .map((t) => t.trim())
      .filter(Boolean);
    const mainTaxon = get(row, 'Main_taxon') || taxons[0] || null;
    const enabled = get(row, 'Enabled') === '1' || get(row, 'Enabled').toLowerCase() === 'true';
    const csvPrice = get(row, 'Price');
    const imgRel = get(row, 'Images_main');
    const cdn = imageUrlFromCsv(imgRel);

    byCode.set(code, {
      rank,
      product: {
        code,
        sku: code,
        name: get(row, 'Name') || code,
        slug: code,
        price: amount(csvPrice),
        original_price: null,
        stock: 0,
        is_tax: true,
        brand: null,
        taxon: mainTaxon,
        taxons,
        image_url: cdn,
        gallery: cdn ? [cdn] : [],
        short_description: get(row, 'Short_description') || null,
        description: get(row, 'Description') || null,
        enabled,
        synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      },
    });
  }

  return [...byCode.values()].map((x) => x.product);
}

function writeLocalCache(products) {
  const outDir = path.join(process.cwd(), 'data');
  fs.mkdirSync(outDir, { recursive: true });
  const outPath = path.join(outDir, 'products.json');
  const payload = {
    generated_at: new Date().toISOString(),
    source: 'sylius-csv',
    count: products.length,
    products: products.map((p) => ({
      id: p.code,
      code: p.code,
      sku: p.sku || p.code,
      name: p.name,
      slug: p.slug || p.code,
      price: p.price || 0,
      original_price: p.original_price,
      stock: p.stock || 0,
      is_tax: p.is_tax !== false,
      brand: p.brand,
      taxon: p.taxon,
      taxons: p.taxons || [],
      image_url: p.image_url,
      gallery: p.gallery || [],
      short_description: p.short_description,
      description: p.description,
      enabled: p.enabled !== false,
    })),
  };
  fs.writeFileSync(outPath, JSON.stringify(payload));
  console.log('Wrote local cache:', outPath, `(${products.length})`);
}

async function main() {
  console.log('CSV:', csvPath);
  const text = fs.readFileSync(csvPath, 'utf8');
  const rows = parseCsv(text);
  const header = rows[0];
  const products = mapRows(header, rows.slice(1));
  console.log('Unique codes:', products.length);
  console.log('Columns:', header.join(', '));

  await ensureBucket();

  const BATCH = 50;
  let upserted = 0;
  let tableMissing = false;

  for (let i = 0; i < products.length; i += BATCH) {
    const chunk = products.slice(i, i + BATCH);

    if (ENRICH_PRICE) {
      await Promise.all(
        chunk.map(async (p) => {
          const enriched = await fetchPrice(p.code);
          if (enriched) Object.assign(p, enriched);
        }),
      );
      console.log(`Enriched ${Math.min(i + BATCH, products.length)} / ${products.length}`);
    }

    if (UPLOAD) {
      for (const p of chunk) {
        if (p.image_url) {
          p.image_url = await uploadFromUrl(p.code, p.image_url);
          p.gallery = [p.image_url];
        }
      }
    }

    if (DRY || tableMissing) continue;

    const payload = chunk.map((p) => ({ ...p }));

    const { error } = await supabase.from('products').upsert(payload, { onConflict: 'code' });
    if (error) {
      if (/schema cache|does not exist|Could not find/i.test(error.message)) {
        console.error('Supabase products table missing. Run supabase/products.sql then re-import.');
        tableMissing = true;
        continue;
      }
      if (/taxons/i.test(error.message)) {
        const fallback = payload.map(({ taxons: _t, ...rest }) => rest);
        const { error: err2 } = await supabase.from('products').upsert(fallback, { onConflict: 'code' });
        if (err2) {
          console.error('Upsert fail batch', i / BATCH + 1, err2.message);
          continue;
        }
      } else {
        console.error('Upsert fail batch', i / BATCH + 1, error.message);
        continue;
      }
    }
    upserted += payload.length;
    console.log(`Upserted ${Math.min(i + BATCH, products.length)} / ${products.length}`);
  }

  writeLocalCache(products);

  if (!DRY && !tableMissing) {
    const { count } = await supabase.from('products').select('id', { count: 'exact', head: true });
    console.log(`Done. Upserted ~${upserted}. Table count: ${count ?? '?'}`);
  } else {
    console.log(`Done. Local cache ready. Supabase upserted: ${upserted}`);
  }
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
