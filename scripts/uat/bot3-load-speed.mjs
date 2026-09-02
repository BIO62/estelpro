// scripts/uat/bot3-load-speed.mjs
// BOT 3: Performance, Latency & Concurrent Load Stress Tester

const BASE_URL = process.env.TARGET_URL || 'https://estelpro.vercel.app';
const CONCURRENT_USERS = 30;

const KEY_PAGES = [
  '/',
  '/products',
  '/about',
  '/academy',
  '/terms',
  '/api/home-picks',
  '/api/ad/products?limit=20',
];

export async function runBot3SpeedLoad() {
  console.log(`\n⚡ [BOT 3: PERFORMANCE & LOAD TESTER] Simulating ${CONCURRENT_USERS} concurrent requests on ${BASE_URL}...`);
  
  const tasks = [];
  const latencies = [];
  let successful = 0;
  let failed = 0;

  for (let i = 0; i < CONCURRENT_USERS; i++) {
    const page = KEY_PAGES[i % KEY_PAGES.length];
    const url = `${BASE_URL}${page}`;

    tasks.push(
      (async () => {
        const start = Date.now();
        try {
          const res = await fetch(url, { headers: { 'User-Agent': `EstelLoadBot/${i + 1}` } });
          const duration = Date.now() - start;
          latencies.push(duration);
          if (res.status >= 200 && res.status < 400) {
            successful++;
          } else {
            failed++;
          }
        } catch (err) {
          failed++;
          latencies.push(Date.now() - start);
        }
      })()
    );
  }

  const overallStart = Date.now();
  await Promise.all(tasks);
  const totalDuration = Date.now() - overallStart;

  latencies.sort((a, b) => a - b);
  const minLatency = latencies[0] || 0;
  const maxLatency = latencies[latencies.length - 1] || 0;
  const avgLatency = Math.round(latencies.reduce((sum, v) => sum + v, 0) / (latencies.length || 1));
  const p95Latency = latencies[Math.floor(latencies.length * 0.95)] || maxLatency;
  const reqPerSec = Math.round((CONCURRENT_USERS / (totalDuration / 1000)) * 10) / 10;

  const summary = {
    bot: 'Bot 3: Performance & Load Stress Test',
    concurrentRequests: CONCURRENT_USERS,
    successful,
    failed,
    successRate: `${Math.round((successful / CONCURRENT_USERS) * 100)}%`,
    totalTime: `${totalDuration}ms`,
    throughput: `${reqPerSec} req/sec`,
    minLatency: `${minLatency}ms`,
    avgLatency: `${avgLatency}ms`,
    p95Latency: `${p95Latency}ms`,
    maxLatency: `${maxLatency}ms`,
    verdict: avgLatency < 600 ? 'Маш хурдан (Шилдэг)' : (avgLatency < 1500 ? 'Хэвийн сайн' : 'Удаан'),
  };

  console.log(`  ⚡ Хурдны үнэлгээ: ${summary.verdict}`);
  console.log(`  ⏱️ Дундаж хугацаа (Avg Latency): ${summary.avgLatency}`);
  console.log(`  🚀 95% хэрэглэгчийн хурд (p95): ${summary.p95Latency}`);
  console.log(`  🎯 Амжилттай биелэлт: ${summary.successRate} (${successful}/${CONCURRENT_USERS})`);
  console.log(`\n📊 [BOT 3 FINISHED] Performance Score: ${summary.successRate} | Avg: ${summary.avgLatency}`);

  return summary;
}

if (process.argv[1].endsWith('bot3-load-speed.mjs')) {
  runBot3SpeedLoad();
}
