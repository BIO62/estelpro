// scripts/uat/run-all-uat.mjs
// Master UAT Test Suite Runner

import { runBot1Crawler } from './bot1-crawler.mjs';
import { runBot2Simulation } from './bot2-e2e-simulation.mjs';
import { runBot3SpeedLoad } from './bot3-load-speed.mjs';

async function main() {
  console.log('===============================================================');
  console.log('🚀 ESTEL PROFESSIONAL MONGOLIA — UAT AUTOMATED BOTS TEST SUITE');
  console.log('===============================================================');
  console.log(`🕒 Эхэлсэн цаг: ${new Date().toLocaleString()}`);
  console.log(`🌐 Шалгаж буй сайт: https://estelpro.vercel.app\n`);

  const startTime = Date.now();

  const bot1 = await runBot1Crawler();
  const bot2 = await runBot2Simulation();
  const bot3 = await runBot3SpeedLoad();

  const totalDuration = ((Date.now() - startTime) / 1000).toFixed(1);

  console.log('\n===============================================================');
  console.log('🏁 [UAT НЭГДСЭН ТАЙЛАН / FINAL EXECUTIVE SUMMARY]');
  console.log('===============================================================');
  console.log(`✅ BOT 1 (Хуудсууд & Холбоос):   ${bot1.healthScore} (${bot1.passed}/${bot1.totalRoutes} хуудас OK)`);
  console.log(`✅ BOT 2 (Бизнес урсгал & API):    ${bot2.score} (${bot2.passed}/${bot2.totalTests} процесс OK)`);
  console.log(`✅ BOT 3 (Хурд & Ачааллын тест):    ${bot3.successRate} (Дундаж: ${bot3.avgLatency}, Үнэлгээ: ${bot3.verdict})`);
  console.log(`⏱️ Нийт туршилтын хугацаа:         ${totalDuration} секунд`);
  console.log('===============================================================\n');

  console.log(JSON.stringify({ bot1, bot2, bot3 }, null, 2));
}

main().catch(console.error);
