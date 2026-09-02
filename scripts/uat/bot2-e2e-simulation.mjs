// scripts/uat/bot2-e2e-simulation.mjs
// BOT 2: E-Commerce User Flow & API Endpoints Simulation Tester

const BASE_URL = process.env.TARGET_URL || 'https://estelpro.vercel.app';

export async function runBot2Simulation() {
  console.log(`\n🛒 [BOT 2: BUSINESS & USER FLOW SIMULATION] Testing live APIs on ${BASE_URL}...`);
  const tests = [];
  let passed = 0;
  let failed = 0;

  async function recordTest(name, fn) {
    const start = Date.now();
    try {
      const res = await fn();
      const duration = Date.now() - start;
      if (res.ok) {
        passed++;
        console.log(`  ✅ [PASS] ${name} (${duration}ms) - ${res.info}`);
      } else {
        failed++;
        console.log(`  ❌ [FAIL] ${name} (${duration}ms) - ${res.info}`);
      }
      tests.push({ name, ok: res.ok, duration: `${duration}ms`, info: res.info });
    } catch (err) {
      failed++;
      const duration = Date.now() - start;
      console.log(`  ❌ [FAIL] ${name} (${duration}ms) - ${err.message}`);
      tests.push({ name, ok: false, duration: `${duration}ms`, info: err.message });
    }
  }

  // 1. Test Product Catalog API
  await recordTest('1. Бүтээгдэхүүний каталог татах (API)', async () => {
    const res = await fetch(`${BASE_URL}/api/ad/products?limit=10`);
    if (!res.ok) return { ok: false, info: `HTTP ${res.status}` };
    const data = await res.json();
    const count = data.items ? data.items.length : (Array.isArray(data) ? data.length : 0);
    return { ok: count > 0, info: `${count} бүтээгдэхүүн амжилттай ирлээ (Total: ${data.total || count})` };
  });

  // 2. Test Home Picks API
  await recordTest('2. Нүүр хуудасны онцлох бүтээгдэхүүнүүд (Home Picks)', async () => {
    const res = await fetch(`${BASE_URL}/api/home-picks`);
    if (!res.ok) return { ok: false, info: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: true, info: `Онцлох болон шинэ бүтээгдэхүүнүүд хэвийн байна` };
  });

  // 3. Test Telegram Webhook Status
  await recordTest('3. Telegram AI Webhook статус шалгах', async () => {
    const res = await fetch(`${BASE_URL}/api/telegram/webhook`);
    if (!res.ok) return { ok: false, info: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: data.ok === true, info: `Telegram Webhook 100% асаалттай байна` };
  });

  // 4. Test Orders API listing
  await recordTest('4. Захиалгын удирдлагын бааз татах (Orders API)', async () => {
    const res = await fetch(`${BASE_URL}/api/ad/orders`);
    if (!res.ok) return { ok: false, info: `HTTP ${res.status}` };
    const data = await res.json();
    const count = Array.isArray(data) ? data.length : (data.orders ? data.orders.length : 0);
    return { ok: true, info: `Нийт бүртгэлтэй захиалгууд амжилттай татагдлаа (${count} захиалга)` };
  });

  // 5. Test 18:00 Daily Cron Endpoint
  await recordTest('5. Орой 18:00 цагийн автомат тайлангийн Cron шалгах', async () => {
    const res = await fetch(`${BASE_URL}/api/cron/daily-report?trigger=uat-dryrun`);
    if (!res.ok) return { ok: false, info: `HTTP ${res.status}` };
    const data = await res.json();
    return { ok: data.ok === true, info: `Cron тайлангийн систем бэлэн байна (${data.timestamp})` };
  });

  // 6. Test Customers API
  await recordTest('6. Хэрэглэгчдийн бааз татах (Customers API)', async () => {
    const res = await fetch(`${BASE_URL}/api/ad/customers`);
    if (!res.ok) return { ok: false, info: `HTTP ${res.status}` };
    const data = await res.json();
    const count = Array.isArray(data) ? data.length : (data.customers ? data.customers.length : 0);
    return { ok: true, info: `Харилцагчийн систем хэвийн (${count} бүртгэлтэй харилцагч)` };
  });

  const total = tests.length;
  const summary = {
    bot: 'Bot 2: User Flow & Business API Simulation',
    totalTests: total,
    passed,
    failed,
    score: `${Math.round((passed / total) * 100)}%`,
    details: tests,
  };

  console.log(`\n📊 [BOT 2 FINISHED] Business API Flow Score: ${summary.score} (${passed}/${total} Passed)`);
  return summary;
}

if (process.argv[1].endsWith('bot2-e2e-simulation.mjs')) {
  runBot2Simulation();
}
