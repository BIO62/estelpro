// scripts/uat/bot1-crawler.mjs
// BOT 1: Comprehensive Site Crawler & Broken Link / Page Health Checker

const BASE_URL = process.env.TARGET_URL || 'https://estelpro.vercel.app';

const ROUTES_TO_TEST = [
  '/',
  '/products',
  '/products/simple',
  '/about',
  '/academy',
  '/terms',
  '/terms/delivery',
  '/terms/payment',
  '/login',
  '/login/dresser',
  '/login/staff',
  '/register',
  '/forgot-password',
  '/verify',
  '/new-password',
  '/wishlist',
  '/checkout',
  '/checkout/qpay',
  '/account/profile',
  '/account/orders',
  '/account/address',
  '/ad',
  '/ad/orders',
  '/ad/products',
  '/ad/customers',
  '/ad/salons',
  '/ad/staff',
  '/ad/activity',
  '/ad/create-order',
  '/dresser',
  '/dresser/list',
  '/dresser/account',
];

export async function runBot1Crawler() {
  console.log(`\n🔍 [BOT 1: SITE CRAWLER & ROUTE CHECKER] Starting crawl on ${BASE_URL}...`);
  const results = [];
  let passed = 0;
  let failed = 0;

  for (const route of ROUTES_TO_TEST) {
    const url = `${BASE_URL}${route}`;
    const start = Date.now();
    try {
      const res = await fetch(url, { headers: { 'User-Agent': 'EstelUATBot/1.0' } });
      const duration = Date.now() - start;
      const isOk = res.status >= 200 && res.status < 400;
      
      if (isOk) passed++;
      else failed++;

      results.push({
        route,
        status: res.status,
        duration: `${duration}ms`,
        ok: isOk,
      });
      console.log(`  ${isOk ? '✅' : '❌'} [${res.status}] ${route} (${duration}ms)`);
    } catch (err) {
      failed++;
      results.push({
        route,
        status: 'ERROR',
        error: err.message,
        ok: false,
      });
      console.log(`  ❌ [ERR] ${route} - ${err.message}`);
    }
  }

  const summary = {
    bot: 'Bot 1: Site Crawler & Link Checker',
    totalRoutes: ROUTES_TO_TEST.length,
    passed,
    failed,
    healthScore: `${Math.round((passed / ROUTES_TO_TEST.length) * 100)}%`,
    details: results,
  };

  console.log(`\n📊 [BOT 1 FINISHED] Health Score: ${summary.healthScore} (${passed}/${ROUTES_TO_TEST.length} Passed)`);
  return summary;
}

if (process.argv[1].endsWith('bot1-crawler.mjs')) {
  runBot1Crawler();
}
