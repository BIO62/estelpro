import fs from 'fs';
import path from 'path';

const ROOT = path.resolve('ref-html');
const SRC = path.resolve('src/app');

const PAGE_MAP = {
  'list-main.txt': 'products/page.tsx',
  'about-main.txt': 'about/page.tsx',
  'detail-main.txt': 'products/[id]/page.tsx',
  'detail-simple-main.txt': 'products/simple/page.tsx',
  'payment-main.txt': 'checkout/page.tsx',
  'qpay-main.txt': 'checkout/qpay/page.tsx',
  'academy-main.txt': 'academy/page.tsx',
  'index-dresser-main.txt': 'dresser/page.tsx',
  'terms-main.txt': 'terms/page.tsx',
  'delivery_term-main.txt': 'terms/delivery/page.tsx',
  'payment_term-main.txt': 'terms/payment/page.tsx',
  'login-main.txt': 'login/page.tsx',
  'login-dresser-main.txt': 'login/dresser/page.tsx',
  'register-main.txt': 'register/page.tsx',
  'forgot-main.txt': 'forgot-password/page.tsx',
  'verify-main.txt': 'verify/page.tsx',
  'new-password-main.txt': 'new-password/page.tsx',
  'profile-main.txt': 'account/profile/page.tsx',
  'address-main.txt': 'account/address/page.tsx',
  'orders-main.txt': 'account/orders/page.tsx',
  'order-detail-main.txt': 'account/orders/[id]/page.tsx',
  'wishlist-main.txt': 'wishlist/page.tsx',
};

const HREF_MAP = {
  'index.html': '/',
  'list.html': '/products',
  'about.html': '/about',
  'terms.html': '/terms',
  'delivery_term.html': '/terms/delivery',
  'payment_term.html': '/terms/payment',
  'detail.html': '/products/1',
  'detail-simple.html': '/products/simple',
  'payment.html': '/checkout',
  'qpay.html': '/checkout/qpay',
  'login.html': '/login',
  'login-dresser.html': '/login/dresser',
  'register.html': '/register',
  'forgot.html': '/forgot-password',
  'verify.html': '/verify',
  'new-password.html': '/new-password',
  'profile.html': '/account/profile',
  'address.html': '/account/address',
  'orders.html': '/account/orders',
  'order-detail.html': '/account/orders/1',
  'wishlist.html': '/wishlist',
  'index-dresser.html': '/dresser',
  'academy.html': '/academy',
};

const CLIENT_PAGES = new Set([
  'products/page.tsx',
  'products/[id]/page.tsx',
  'products/simple/page.tsx',
  'checkout/page.tsx',
  'checkout/qpay/page.tsx',
  'verify/page.tsx',
]);

function parseStyle(styleStr) {
  const obj = {};
  styleStr.split(';').forEach((part) => {
    const idx = part.indexOf(':');
    if (idx === -1) return;
    const key = part.slice(0, idx).trim();
    const val = part.slice(idx + 1).trim();
    if (!key) return;
    const camel = key.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    obj[camel] = val;
  });
  return JSON.stringify(obj).replace(/"([^"]+)":/g, '$1:');
}

let extractedScripts = '';

function convertHtml(html) {
  let out = html;
  extractedScripts = '';

  // Extract and convert style blocks
  out = out.replace(/<style>([\s\S]*?)<\/style>/gi, (_, css) => {
    const escaped = css.trim().replace(/`/g, '\\`').replace(/\$\{/g, '\\${');
    return `<style dangerouslySetInnerHTML={{ __html: \`${escaped}\` }} />`;
  });

  // Extract script blocks for useEffect
  out = out.replace(/<script>([\s\S]*?)<\/script>/gi, (_, js) => {
    extractedScripts += js.trim() + '\n';
    return '';
  });

  // Remove HTML comments
  out = out.replace(/<!--[\s\S]*?-->/g, '');

  // Convert img src to assetUrl
  out = out.replace(/<img([^>]*?)src="(images\/[^"]+)"([^>]*?)>/gi, (_, before, src, after) => {
    const selfClose = before.includes('/') || after.includes('/') ? '' : '';
    const attrs = `${before}src={assetUrl('${src}')}${after}`.replace(/\s+/g, ' ').trim();
    if (attrs.endsWith('/')) return `<img ${attrs}>`;
    return `<img ${attrs} />`;
  });

  // Convert style attributes
  out = out.replace(/\sstyle="([^"]*)"/g, (_, s) => ` style={${parseStyle(s)}}`);

  // class -> className
  out = out.replace(/\sclass="/g, ' className="');

  // for -> htmlFor on labels
  out = out.replace(/(<label[^>]*)\sfor="/g, '$1 htmlFor="');

  // inputmode -> inputMode
  out = out.replace(/\sinputmode="/g, ' inputMode="');
  out = out.replace(/\stabindex="(-?\d+)"/g, ' tabIndex={$1}');
  out = out.replace(/\smaxlength="(\d+)"/g, ' maxLength={$1}');
  out = out.replace(/\smaxLength="(\d+)"/g, ' maxLength={$1}');

  // Self-close void elements
  out = out.replace(/<br>/gi, '<br />');
  out = out.replace(/<hr([^>]*)>/gi, '<hr$1 />');
  out = out.replace(/<input([^>]*[^/])>/gi, '<input$1 />');

  // Convert internal links - we'll use Link for .html hrefs
  // First pass: collect and convert <a href="xxx.html"> to Link
  out = out.replace(/<a\s([^>]*?)href="([^"]*?)"([^>]*?)>([\s\S]*?)<\/a>/gi, (match, before, href, after, content) => {
    if (href.startsWith('http') || href.startsWith('#') || href.startsWith('mailto:') || href === '') {
      return match.replace(/\sclass="/g, ' className="');
    }
    const route = HREF_MAP[href] || href.replace('.html', '').replace(/_/g, '/');
    const attrs = `${before}${after}`.replace(/\sclass="/g, ' className="').trim();
    return `<Link href="${route}" ${attrs}>${content}</Link>`;
  });

  // Fix del -> use del as is (valid in JSX)
  // Fix selected on option - use defaultValue on select instead if needed

  // Escape literal > at start of text nodes (e.g. ">6 хүртэл")
  out = out.replace(/>(\s*)>(?=[^\s<])/g, (match, ws) => `>${ws}{'>'}`);

  return out.trim();
}

function getPageScripts(outPath) {
  if (outPath === 'products/page.tsx') {
    return `
  useEffect(() => {
    const priceRange = document.getElementById('priceRange');
    const priceRangeVal = document.getElementById('priceRangeVal');
    const priceRangeMobile = document.getElementById('priceRangeMobile');
    const priceRangeValMobile = document.getElementById('priceRangeValMobile');
    const onPriceInput = (e: Event, valEl: HTMLElement | null) => {
      if (valEl) valEl.textContent = Number((e.target as HTMLInputElement).value).toLocaleString() + '₮';
    };
    priceRange?.addEventListener('input', (e) => onPriceInput(e, priceRangeVal));
    priceRangeMobile?.addEventListener('input', (e) => onPriceInput(e, priceRangeValMobile));
    const sortBtn = document.getElementById('sortDropdown');
    const sortChevron = sortBtn?.querySelector('img') as HTMLElement | null;
    const dropdown = sortBtn?.closest('.dropdown');
    dropdown?.addEventListener('show.bs.dropdown', () => { if (sortChevron) sortChevron.style.transform = 'rotate(180deg)'; });
    dropdown?.addEventListener('hide.bs.dropdown', () => { if (sortChevron) sortChevron.style.transform = ''; });
    document.querySelectorAll('.sort-option').forEach((btn) => {
      btn.addEventListener('click', function (this: HTMLElement) {
        const label = document.getElementById('sortLabel');
        if (label) label.textContent = this.dataset.label || '';
        document.querySelectorAll('.sort-option').forEach((b) => {
          b.classList.remove('fw-semibold', 'fc-main');
          b.querySelector('img')?.classList.add('opacity-0');
        });
        this.classList.add('fw-semibold', 'fc-main');
        this.querySelector('img')?.classList.remove('opacity-0');
      });
    });
  }, []);
`;
  }
  if (outPath === 'products/[id]/page.tsx' || outPath === 'products/simple/page.tsx') {
    return `
  useEffect(() => {
    document.querySelectorAll('.thumbBtn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const mainImg = document.getElementById('mainProductImg') as HTMLImageElement | null;
        const imgPath = (btn as HTMLElement).dataset.img;
        if (mainImg && imgPath) mainImg.src = assetUrl(imgPath);
        document.querySelectorAll('.thumbBtn').forEach((b) => b.classList.remove('active'));
        btn.classList.add('active');
      });
    });
    const nameEl = document.getElementById('selectedColorName');
    const subEl = document.getElementById('selectedColorSub');
    document.querySelectorAll('.colorSwatch').forEach((swatch) => {
      swatch.addEventListener('mouseenter', () => {
        if (nameEl) nameEl.textContent = (swatch as HTMLElement).dataset.code || '';
        if (subEl) subEl.textContent = (swatch as HTMLElement).dataset.sub || '';
      });
      swatch.addEventListener('mouseleave', () => {
        const active = document.querySelector('.colorSwatch.active') as HTMLElement | null;
        if (active && nameEl) nameEl.textContent = active.dataset.name || '';
        if (active && subEl) subEl.textContent = active.dataset.sub || '';
      });
      swatch.addEventListener('click', () => {
        document.querySelectorAll('.colorSwatch').forEach((s) => s.classList.remove('active'));
        swatch.classList.add('active');
        if (nameEl) nameEl.textContent = (swatch as HTMLElement).dataset.name || '';
        if (subEl) subEl.textContent = (swatch as HTMLElement).dataset.sub || '';
      });
    });
    const toggleBtn = document.getElementById('colorToggleBtn');
    toggleBtn?.addEventListener('click', () => {
      document.getElementById('colorGrid')?.classList.toggle('d-none');
      document.getElementById('colorList')?.classList.toggle('d-none');
    });
    document.querySelectorAll('.qtyMinus, .qtyPlus').forEach((btn) => {
      btn.addEventListener('click', () => {
        const input = btn.closest('.qtyControl')?.querySelector('.qtyInput') as HTMLInputElement | null;
        if (!input) return;
        let v = parseInt(input.value, 10) || 1;
        if (btn.classList.contains('qtyMinus')) v = Math.max(1, v - 1);
        else v += 1;
        input.value = String(v);
      });
    });
  }, []);
`;
  }
  if (outPath === 'verify/page.tsx') {
    return `
  useEffect(() => {
    document.querySelectorAll('.otp-box').forEach((inp, idx, all) => {
      inp.addEventListener('input', function (this: HTMLInputElement) {
        this.value = this.value.replace(/\\D/g, '');
        if (this.value && idx < all.length - 1) (all[idx + 1] as HTMLInputElement).focus();
      });
      inp.addEventListener('keydown', function (this: HTMLInputElement, e) {
        if ((e as KeyboardEvent).key === 'Backspace' && !this.value && idx > 0) (all[idx - 1] as HTMLInputElement).focus();
      });
    });
    let t = 90;
    const tEl = document.getElementById('otpTimer');
    const ti = setInterval(() => {
      t--;
      if (t <= 0) { clearInterval(ti); if (tEl) tEl.textContent = '00:00'; return; }
      if (tEl) tEl.textContent = (Math.floor(t / 60) < 10 ? '0' : '') + Math.floor(t / 60) + ':' + (t % 60 < 10 ? '0' : '') + (t % 60);
    }, 1000);
    return () => clearInterval(ti);
  }, []);
`;
  }
  if (outPath === 'checkout/page.tsx') {
    return `
  useEffect(() => {
    document.querySelectorAll('input[name="payMethod"]').forEach((radio) => {
      radio.addEventListener('change', function (this: HTMLInputElement) {
        document.querySelectorAll('.pay-panel').forEach((p) => p.classList.add('d-none'));
        const panel = document.getElementById('panel-' + this.value);
        if (panel) panel.classList.remove('d-none');
      });
    });
    let qpaySeconds = 299;
    const qpayEl = document.getElementById('payQpayTimer');
    const qpayInterval = setInterval(() => {
      qpaySeconds--;
      if (qpaySeconds < 0) { if (qpayEl) qpayEl.textContent = '00:00'; clearInterval(qpayInterval); return; }
      const m = String(Math.floor(qpaySeconds / 60)).padStart(2, '0');
      const s = String(qpaySeconds % 60).padStart(2, '0');
      if (qpayEl) qpayEl.textContent = m + ':' + s;
    }, 1000);
    (window as unknown as { selectBank?: (btn: HTMLElement, name: string, acc: string) => void }).selectBank = (btn, name, acc) => {
      document.querySelectorAll('.bank-btn').forEach((b) => b.classList.remove('active'));
      btn.classList.add('active');
      const bankName = document.getElementById('bankName');
      const bankAccNum = document.getElementById('bankAccNum');
      if (bankName) bankName.textContent = name;
      if (bankAccNum) bankAccNum.textContent = acc;
    };
    return () => clearInterval(qpayInterval);
  }, []);
`;
  }
  return '';
}

for (const [mainFile, outPath] of Object.entries(PAGE_MAP)) {
  const mainPath = path.join(ROOT, mainFile);
  if (!fs.existsSync(mainPath)) {
    console.log('SKIP missing:', mainFile);
    continue;
  }
  const html = fs.readFileSync(mainPath, 'utf8');
  const jsx = convertHtml(html);
  const pageScripts = getPageScripts(outPath);
  const isClient = CLIENT_PAGES.has(outPath) || !!pageScripts;

  const imports = [];
  if (isClient) imports.push("'use client';", '');
  imports.push("import Link from 'next/link';");
  imports.push("import { assetUrl } from '@/lib/constants';");
  if (pageScripts) imports.push("import { useEffect } from 'react';");

  const componentName = outPath
    .split('/')
    .map((s) => s.replace(/\[id\]/, 'Detail').replace(/-/g, ' '))
    .map((s) => s.replace(/\b\w/g, (c) => c.toUpperCase()).replace(/ /g, ''))
    .join('') + 'Page';

  const fnName = outPath.includes('[id]')
    ? 'OrderDetailPage'
    : outPath === 'products/[id]/page.tsx'
      ? 'ProductDetailPage'
      : outPath.split('/').pop()?.replace('.tsx', '').split('-').map((w, i) => i === 0 ? w.charAt(0).toUpperCase() + w.slice(1) : w.charAt(0).toUpperCase() + w.slice(1)).join('') + 'Page';

  // Better naming
  const nameMap = {
    'products/page.tsx': 'ProductsPage',
    'about/page.tsx': 'AboutPage',
    'products/[id]/page.tsx': 'ProductDetailPage',
    'products/simple/page.tsx': 'ProductSimplePage',
    'checkout/page.tsx': 'CheckoutPage',
    'checkout/qpay/page.tsx': 'QpayPage',
    'academy/page.tsx': 'AcademyPage',
    'dresser/page.tsx': 'DresserPage',
    'terms/page.tsx': 'TermsPage',
    'terms/delivery/page.tsx': 'DeliveryTermsPage',
    'terms/payment/page.tsx': 'PaymentTermsPage',
    'login/page.tsx': 'LoginPage',
    'login/dresser/page.tsx': 'LoginDresserPage',
    'register/page.tsx': 'RegisterPage',
    'forgot-password/page.tsx': 'ForgotPasswordPage',
    'verify/page.tsx': 'VerifyPage',
    'new-password/page.tsx': 'NewPasswordPage',
    'account/profile/page.tsx': 'ProfilePage',
    'account/address/page.tsx': 'AddressPage',
    'account/orders/page.tsx': 'OrdersPage',
    'account/orders/[id]/page.tsx': 'OrderDetailPage',
    'wishlist/page.tsx': 'WishlistPage',
  };

  const compName = nameMap[outPath] || 'Page';

  let content = `${imports.join('\n')}

export default function ${compName}() {
${pageScripts ? pageScripts : ''}
  return (
    <>
${jsx.split('\n').map((l) => '      ' + l).join('\n')}
    </>
  );
}
`;

  const outFull = path.join(SRC, outPath);
  fs.mkdirSync(path.dirname(outFull), { recursive: true });
  fs.writeFileSync(outFull, content);
  console.log('Wrote', outPath);
}

console.log('Done');
