/**
 * Sylius → Supabase products sync (with images).
 *
 * 1) Run products table SQL from supabase/schema.sql
 * 2) Create public Storage bucket: product-images
 * 3) npm run sync:products
 *
 * Flow: Sylius API → download image bytes → upload Storage → upsert products row
 *        (image_url = Supabase public URL, not Sylius URL)
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
      /* missing env file */
    }
  }
}

loadEnv();

const SUPABASE_URL = process.env.SUPABASE_URL || process.env.NEXT_PUBLIC_SUPABASE_URL;
const SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;
const SYLIUS_BASE = (process.env.NEXT_PUBLIC_SYLIUS_URL || 'https://estel.nextstore.mn').replace(/\/$/, '');
const BUCKET = 'product-images';
const PAGE_SIZE = 30;
const DRY = process.argv.includes('--dry');

if (!SUPABASE_URL || !SERVICE_KEY) {
  console.error('SUPABASE_URL / SUPABASE_SERVICE_ROLE_KEY тохируулаагүй.');
  process.exit(1);
}

const supabase = createClient(SUPABASE_URL, SERVICE_KEY, { auth: { persistSession: false } });

function unwrapList(data) {
  if (Array.isArray(data)) return data;
  if (data && Array.isArray(data['hydra:member'])) return data['hydra:member'];
  if (data && Array.isArray(data.member)) return data.member;
  return [];
}

function unwrapTotal(data, fallback) {
  const total = data?.['hydra:totalItems'] ?? data?.totalItems;
  return typeof total === 'number' ? total : fallback;
}

function amount(priceInCents) {
  if (priceInCents == null) return 0;
  return priceInCents > 1_000_000 ? Math.round(priceInCents / 100) : priceInCents;
}

function imageCandidates(image) {
  if (!image) return [];
  return [image.medium, image.originalImagePath, image.thumbnail].filter(Boolean);
}

function absoluteUrl(url) {
  if (!url) return null;
  if (/^https?:\/\//i.test(url)) return url;
  return `${SYLIUS_BASE}/${String(url).replace(/^\//, '')}`;
}

function extFromContentType(ct, fallbackUrl) {
  if (ct?.includes('png')) return 'png';
  if (ct?.includes('webp')) return 'webp';
  if (ct?.includes('gif')) return 'gif';
  if (ct?.includes('jpeg') || ct?.includes('jpg')) return 'jpg';
  const m = String(fallbackUrl || '').match(/\.(jpe?g|png|webp|gif)(\?|$)/i);
  return m ? m[1].toLowerCase().replace('jpeg', 'jpg') : 'jpg';
}

async function ensureBucket() {
  const { data: buckets } = await supabase.storage.listBuckets();
  if (buckets?.some((b) => b.name === BUCKET || b.id === BUCKET)) return;
  const { error } = await supabase.storage.createBucket(BUCKET, {
    public: true,
    fileSizeLimit: 8 * 1024 * 1024,
  });
  if (error && !/already exists/i.test(error.message)) {
    console.warn('Bucket create:', error.message, '(Dashboard дээр product-images public bucket үүсгэ)');
  }
}

async function uploadImage(code, sourceUrl, index) {
  const abs = absoluteUrl(sourceUrl);
  if (!abs) return null;
  try {
    const res = await fetch(abs);
    if (!res.ok) {
      console.warn(`  image fail ${res.status}: ${abs}`);
      return null;
    }
    const buf = Buffer.from(await res.arrayBuffer());
    const ext = extFromContentType(res.headers.get('content-type'), abs);
    const objectPath = `${code}/${index}.${ext}`;
    if (DRY) return `${SUPABASE_URL}/storage/v1/object/public/${BUCKET}/${objectPath}`;

    const { error } = await supabase.storage.from(BUCKET).upload(objectPath, buf, {
      contentType: res.headers.get('content-type') || `image/${ext}`,
      upsert: true,
    });
    if (error) {
      console.warn(`  upload fail ${code}:`, error.message);
      return null;
    }
    const { data } = supabase.storage.from(BUCKET).getPublicUrl(objectPath);
    return data.publicUrl;
  } catch (err) {
    console.warn(`  image error ${code}:`, err.message);
    return null;
  }
}

async function fetchSyliusPage(page) {
  const params = new URLSearchParams({
    page: String(page),
    itemsPerPage: String(PAGE_SIZE),
  });
  const url = `${SYLIUS_BASE}/api/v2/shop/products?${params}`;
  const res = await fetch(url, { headers: { Accept: 'application/json' } });
  if (!res.ok) throw new Error(`Sylius ${res.status} ${url}`);
  return res.json();
}

async function syncAll() {
  await ensureBucket();

  let page = 1;
  let total = Infinity;
  let synced = 0;

  while ((page - 1) * PAGE_SIZE < total) {
    const data = await fetchSyliusPage(page);
    const items = unwrapList(data);
    total = unwrapTotal(data, items.length);
    console.log(`\nPage ${page} — ${items.length} items (total ~${total})`);

    for (const product of items) {
      const code = product.code || String(product.id);
      const variant = (product.variants || [])[0];
      const price = amount(variant?.price);
      const original =
        variant?.originalPrice && variant.originalPrice > variant.price
          ? amount(variant.originalPrice)
          : null;
      const stock = typeof variant?.onHand === 'number' ? variant.onHand : 0;

      const srcImages = (product.images || [])
        .flatMap(imageCandidates)
        .filter(Boolean)
        .filter((u, i, arr) => arr.indexOf(u) === i);

      const gallery = [];
      for (let i = 0; i < Math.min(srcImages.length, 5); i += 1) {
        const publicUrl = await uploadImage(code, srcImages[i], i);
        if (publicUrl) gallery.push(publicUrl);
      }

      const row = {
        sylius_id: product.id ?? null,
        code,
        sku: variant?.code || code,
        name: product.name || code,
        slug: product.slug || null,
        price,
        original_price: original,
        stock,
        is_tax: true,
        brand: product.brand?.name || 'ESTEL',
        taxon: product.mainTaxon?.name || null,
        image_url: gallery[0] || null,
        gallery,
        short_description: product.shortDescription || null,
        description: product.description || null,
        enabled: true,
        synced_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
      };

      console.log(`  ${DRY ? '[dry] ' : ''}${code} — ${row.name} — ${price}₮ — imgs ${gallery.length}`);

      if (!DRY) {
        const { error } = await supabase.from('products').upsert(row, { onConflict: 'code' });
        if (error) {
          console.error('  upsert fail:', error.message);
          continue;
        }
      }
      synced += 1;
    }

    if (items.length === 0) break;
    page += 1;
  }

  console.log(`\nDone. Synced ${synced} products${DRY ? ' (dry run)' : ''}.`);
}

syncAll().catch((err) => {
  console.error(err);
  process.exit(1);
});
