import { mkdir, writeFile, access } from 'fs/promises';
import path from 'path';

const BASE = 'https://alphalabs.mn/nextstore-html/estel';
const ROOT = path.resolve('public');

const PATHS = [
  'images/favicon.svg',
  'images/logo.svg',
  'images/nextstoreWhite.svg',
  'images/storePay.png',
  'images/pocketZero.png',
  'videos/reel1.mp4',
  'images/demo/product1.jpg',
  'images/demo/product2.jpg',
  'images/demo/product3.jpg',
  'images/demo/product4.jpg',
  'images/demo/product5.jpg',
  'images/demo/product6.jpg',
  'images/demo/product7.png',
  'images/demo/product8.png',
  'images/demo/product9.png',
  'images/demo/product10.png',
  'images/demo/product11.png',
  'images/demo/product12.png',
  'images/demo/product13.png',
  'images/demo/1000x1000.jpg',
  'images/demo/branch1.jpg',
  'images/demo/branch3.jpg',
  'images/demo/qpay.png',
  'images/demo/qr-code.svg',
  'images/demo/khanbank.png',
  'images/demo/golomt.png',
  'images/demo/mbank.png',
  'images/demo/xac.png',
  'images/demo/state.png',
  'images/demo/tdb.png',
  'images/demo/index 2500x1160.jpg',
  'images/demo/index 2500x1160.png',
  'images/demo/index mob 800x1422.png',
  'images/demo/index mob Ad 800x1422.png',
  'images/demo/featured 2500x1215 2 (1).jpg',
  'images/demo/featured 2500x1215 2 (2).jpg',
  'images/demo/featured mob 800x1288 1 copy.jpg',
  'images/demo/featured mob 800x1288 2.jpg',
  'images/demo/bestseller 2500x1212 copy (1).jpg',
  'images/demo/bestseller 2500x1212 copy (2).jpg',
  'images/demo/bestseller 2500x1212 copy (3).jpg',
  'images/demo/bestseller mob 800x1388 (1).jpg',
  'images/demo/bestseller mob 800x1388 (2).jpg',
  'images/demo/bottomDesktopImage.webp',
  'images/demo/midDesktopImage.webp',
  'images/demo/mainSlide1.webp',
  'images/demo/slide3.webp',
  'images/demo/category1.avif',
  'images/demo/category2.avif',
  'images/demo/category3.avif',
  'images/demo/category4.avif',
  'images/demo/category5.avif',
  'images/demo/category6.avif',
  'images/taxon/800x375 taxon banner.jpg',
  'images/taxon/үсний будаг.jpg',
  'images/taxon/үс арчилгаа.jpg',
  'images/taxon/арьс & бие арчилгаа.jpg',
  'images/taxon/Alpha.jpg',
  'images/taxon/хүүхдийн арчилгаа.jpg',
  'images/taxon/хэлбэржүүлэлт.jpg',
  'images/taxon/бүх бүтээгдэхүүн.jpg',
  ...Array.from({ length: 12 }, (_, i) => `images/brands/500x500px logo ${i + 1}.jpg`),
];

function remoteUrl(rel) {
  return `${BASE}/${rel.split('/').map(encodeURIComponent).join('/')}`;
}

async function exists(file) {
  try {
    await access(file);
    return true;
  } catch {
    return false;
  }
}

async function extraFromIndex() {
  try {
    const res = await fetch(`${BASE}/index.html`);
    if (!res.ok) return [];
    const html = await res.text();
    const found = new Set();
    const re = /(?:src|href)=["']([^"']+\.(?:jpg|jpeg|png|webp|avif|svg|mp4|css))["']/gi;
    let match;
    while ((match = re.exec(html))) {
      let rel = match[1].replace(/^\.\//, '').replace(/^\//, '');
      if (rel.startsWith('http')) continue;
      if (rel.startsWith('css/')) continue;
      found.add(rel);
    }
    return [...found];
  } catch {
    return [];
  }
}

async function download(rel) {
  const dest = path.join(ROOT, rel);
  if (await exists(dest)) return 'skip';
  await mkdir(path.dirname(dest), { recursive: true });
  const res = await fetch(remoteUrl(rel));
  if (!res.ok) return `fail ${res.status}`;
  const buf = Buffer.from(await res.arrayBuffer());
  if (buf.length < 40) return 'empty';
  await writeFile(dest, buf);
  return `ok ${buf.length}`;
}

const extras = await extraFromIndex();
const all = [...new Set([...PATHS, ...extras])];
let ok = 0;
let skip = 0;
let fail = 0;
for (const rel of all) {
  const result = await download(rel);
  if (result === 'skip') skip += 1;
  else if (result.startsWith('ok')) ok += 1;
  else {
    fail += 1;
    console.log(`${rel}: ${result}`);
  }
}
console.log(`downloaded=${ok} skipped=${skip} failed=${fail} total=${all.length}`);
