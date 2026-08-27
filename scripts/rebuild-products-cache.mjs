/**
 * Rebuild data/products.json from Sylius CSV + existing cache + live prices.
 *   node scripts/rebuild-products-cache.mjs
 *   node scripts/rebuild-products-cache.mjs --no-fetch
 */
import fs from 'fs';
import path from 'path';

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

const CSV_PATH = path.join(process.cwd(), 'scripts', 'sylius.product-2026-08-25.csv');
const OUT_PATH = path.join(process.cwd(), 'data', 'products.json');
const SYLIUS_BASE = (process.env.NEXT_PUBLIC_SYLIUS_URL || 'https://estel.nextstore.mn').replace(/\/$/, '');
const CDN_BASE =
  process.env.SYLIUS_IMAGE_CDN ||
  'https://d2zu1tgnlo40u9.cloudfront.net/uploads/cache/app_shop_product_detail_medium';
const FETCH_PRICES = !process.argv.includes('--no-fetch');

const BRAND_HINTS = [
  ['deluxe', 'De Luxe'],
  ['niagara', 'Niagara'],
  ['sensation', 'Sensation'],
  ['prima', 'Prima Blonde'],
  ['otium', 'Otium'],
  ['couture', 'Couture Luxury'],
  ['luxury', 'Couture Luxury'],
  ['keratin', 'Keratin+'],
  ['q3', 'Q3 Comfort'],
  ['lissage', 'Lissage'],
  ['rehair', 'reHair'],
  ['alpha', 'Alpha'],
  ['little', 'Little ME'],
  ['airex', 'Airex'],
  ['обними', 'Обними'],
  ['obnimi', 'Обними'],
  ['18 plus', 'Estel 18+'],
  ['18plus', 'Estel 18+'],
  ['curex', 'Curex'],
  ['only', 'Only'],
  ['mohito', 'Mohito'],
];

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

function amount(raw) {
  if (raw == null || raw === '') return 0;
  const n = Number(raw);
  if (!Number.isFinite(n) || n <= 0) return 0;
  if (n >= 400000) return Math.round(n / 100);
  if (n > 1_000_000) return Math.round(n / 100);
  return n;
}

function isPlaceholderPrice(n) {
  return !n || n <= 100;
}

function parseRichText(raw) {
  if (!raw) return null;
  const text = String(raw).trim();
  if (!text) return null;
  if (text.startsWith('[')) {
    try {
      const blocks = JSON.parse(text);
      const html = (Array.isArray(blocks) ? blocks : [])
        .map((b) => b?.data?.content)
        .filter(Boolean)
        .join('');
      return html || text;
    } catch {
      return text;
    }
  }
  return text;
}

function imageUrlFromCsv(rel) {
  if (!rel) return null;
  if (/^https?:\/\//i.test(rel)) return rel;
  return `${CDN_BASE}/${rel.replace(/^\//, '')}`;
}

function inferBrand(name, taxon) {
  const hay = `${name} ${taxon || ''}`.toLowerCase();
  for (const [needle, label] of BRAND_HINTS) {
    if (hay.includes(needle)) return label;
  }
  return 'ESTEL';
}

function extractSku(code, name, existing) {
  const fromName = String(name || '').match(/\((\d{8,14})\)/);
  if (fromName) return fromName[1];
  if (/^\d{8,14}$/.test(String(existing || ''))) return existing;
  if (/^\d{8,14}$/.test(String(code || ''))) return code;
  return existing || code;
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
    const brand = p.brand?.name || null;
    if (p.variants?.[0] && typeof p.variants[0] === 'object' && p.variants[0].price != null) {
      const v = p.variants[0];
      return {
        price: amount(v.price),
        original_price: v.originalPrice && v.originalPrice > v.price ? amount(v.originalPrice) : null,
        stock: typeof v.onHand === 'number' ? v.onHand : undefined,
        sku: v.code || undefined,
        brand,
      };
    }
    if (!variantPath) return brand ? { brand } : null;
    const vUrl = variantPath.startsWith('http') ? variantPath : `${SYLIUS_BASE}${variantPath}`;
    const vr = await fetch(vUrl, { headers: { Accept: 'application/json' } });
    if (!vr.ok) return brand ? { brand } : null;
    const v = await vr.json();
    return {
      price: amount(v.price),
      original_price: v.originalPrice && v.originalPrice > v.price ? amount(v.originalPrice) : null,
      stock: typeof v.onHand === 'number' ? v.onHand : undefined,
      sku: v.code || undefined,
      brand,
    };
  } catch {
    return null;
  }
}

async function main() {
  if (!fs.existsSync(CSV_PATH)) {
    console.error('CSV missing:', CSV_PATH);
    process.exit(1);
  }

  let existing = [];
  try {
    existing = JSON.parse(fs.readFileSync(OUT_PATH, 'utf8')).products || [];
  } catch {
    existing = [];
  }
  const prev = new Map(existing.map((p) => [p.code, p]));

  const rows = parseCsv(fs.readFileSync(CSV_PATH, 'utf8'));
  const header = rows[0];
  const idx = Object.fromEntries(header.map((h, i) => [h.trim(), i]));
  const get = (row, key) => (row[idx[key]] ?? '').trim();
  const localeRank = (locale) => {
    if (locale === 'mn_MN') return 0;
    if (String(locale).startsWith('mn')) return 1;
    if (locale === 'en_US' || String(locale).startsWith('en')) return 2;
    return 9;
  };

  const byCode = new Map();
  for (const row of rows.slice(1)) {
    const code = get(row, 'Code');
    if (!code) continue;
    const locale = get(row, 'Locale') || '';
    const rank = localeRank(locale);
    const current = byCode.get(code);
    if (current && current.rank <= rank) continue;

    const taxons = get(row, 'Taxons')
      .split('|')
      .map((t) => t.trim())
      .filter(Boolean);
    const mainTaxon = get(row, 'Main_taxon') || taxons[0] || null;
    const enabled = get(row, 'Enabled') === '1' || get(row, 'Enabled').toLowerCase() === 'true';
    const img = imageUrlFromCsv(get(row, 'Images_main'));
    const old = prev.get(code) || {};
    const csvPrice = amount(get(row, 'Price'));
    const oldPrice = Number(old.price) || 0;
    const price = !isPlaceholderPrice(csvPrice)
      ? csvPrice
      : !isPlaceholderPrice(oldPrice)
        ? oldPrice
        : csvPrice || oldPrice || 0;

    byCode.set(code, {
      rank,
      product: {
        id: code,
        code,
        sku: extractSku(code, get(row, 'Name') || old.name, old.sku),
        name: get(row, 'Name') || old.name || code,
        slug: old.slug || code,
        price,
        original_price: old.original_price ?? null,
        stock: Number(old.stock) > 0 ? Number(old.stock) : 5,
        is_tax: old.is_tax !== false,
        brand: old.brand || inferBrand(get(row, 'Name') || old.name, mainTaxon),
        taxon: mainTaxon,
        taxons,
        image_url: img || old.image_url || null,
        gallery: img ? [img] : Array.isArray(old.gallery) ? old.gallery : [],
        short_description: parseRichText(get(row, 'Short_description')) || old.short_description || null,
        description: parseRichText(get(row, 'Description')) || old.description || null,
        enabled,
      },
    });
  }

  const products = [...byCode.values()].map((x) => x.product);
  const needPrice = products.filter((p) => p.enabled !== false && isPlaceholderPrice(p.price));
  console.log(`CSV products: ${products.length}. Placeholder price: ${needPrice.length}`);

  if (FETCH_PRICES && needPrice.length) {
    const BATCH = 8;
    for (let i = 0; i < needPrice.length; i += BATCH) {
      const chunk = needPrice.slice(i, i + BATCH);
      await Promise.all(
        chunk.map(async (p) => {
          const extra = await fetchPrice(p.code);
          if (!extra) return;
          if (extra.price && !isPlaceholderPrice(extra.price)) p.price = extra.price;
          if (extra.original_price) p.original_price = extra.original_price;
          if (extra.stock != null) p.stock = extra.stock;
          if (extra.sku) p.sku = extractSku(p.code, p.name, extra.sku);
          if (extra.brand) p.brand = extra.brand;
        }),
      );
      console.log(`Prices ${Math.min(i + BATCH, needPrice.length)} / ${needPrice.length}`);
    }
  }

  for (const p of products) {
    if (p.price >= 400000) p.price = Math.round(p.price / 100);
    p.sku = extractSku(p.code, p.name, p.sku);
    if (!p.brand) p.brand = inferBrand(p.name, p.taxon);
  }

  const payload = {
    generated_at: new Date().toISOString(),
    source: 'sylius-csv+cache',
    count: products.length,
    products,
  };
  fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
  fs.writeFileSync(OUT_PATH, JSON.stringify(payload));

  const enabled = products.filter((p) => p.enabled !== false);
  const stillBad = enabled.filter((p) => isPlaceholderPrice(p.price)).length;
  const noDesc = enabled.filter((p) => !p.description && !p.short_description).length;
  const noImg = enabled.filter((p) => !p.image_url).length;
  console.log(
    `Wrote ${OUT_PATH} enabled=${enabled.length} placeholderPrice=${stillBad} noText=${noDesc} noImg=${noImg}`,
  );
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});
