import { type AdOrder, type AdOrderItem } from '@/lib/ad/orders';
import { listOrders, getOrder } from '@/lib/ad/orders-repo';
import { listProducts, type DbProduct } from '@/lib/ad/products-repo';
import { BRANCHES, FOOTER_LINKS } from '@/lib/constants';
import { SALON_DISCOUNT_TIERS } from '@/lib/auth/salon-discount';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8853756606:AAHgf0_kiA373mqyvi5mAxR49IDPPJb4Www';
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5573060380';
const GEMINI_API_KEY = process.env.GEMINI_API_KEY || '';

export async function sendTelegramMessage(
  chatId: string | number,
  text: string,
  options?: { parse_mode?: 'HTML' | 'Markdown' },
) {
  if (!BOT_TOKEN) return null;
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: options?.parse_mode || 'HTML',
      }),
    });
    return (await res.json()) as { ok: boolean; result?: unknown; description?: string };
  } catch (err) {
    console.error('[Telegram] Failed to send message:', err);
    return null;
  }
}

export function detectBranch(order: Partial<AdOrder>): { code: string; label: string; badge: string } {
  const haystack = [order.address, order.note, order.customerName]
    .filter(Boolean)
    .join(' ')
    .toLowerCase();

  if (haystack.includes('дархан')) {
    return { code: 'darkhan', label: 'ДАРХАН САЛБАР', badge: '🟢 ДАРХАН' };
  }
  if (haystack.includes('эрдэнэт') || haystack.includes('орхон')) {
    return { code: 'erdenet', label: 'ЭРДЭНЭТ САЛБАР', badge: '🔵 ЭРДЭНЭТ' };
  }
  if (
    haystack.includes('улаанбаатар') ||
    haystack.includes('сбд') ||
    haystack.includes('худ') ||
    haystack.includes('бзд') ||
    haystack.includes('бгд') ||
    haystack.includes('схд') ||
    haystack.includes('чд')
  ) {
    return { code: 'ub', label: 'УЛААНБААТАР', badge: '🟣 УБ ТӨВ' };
  }
  return { code: 'other', label: 'ОРОН НУТАГ / БУСАД', badge: '🚚 ОРОН НУТАГ' };
}

/**
 * Sends a real-time notification to the Telegram group whenever a new order is created
 */
export async function notifyTelegramNewOrder(order: AdOrder) {
  const branch = detectBranch(order);
  const itemsText = (order.items || [])
    .map((it: AdOrderItem) => {
      const q = it.qty || (it as { quantity?: number }).quantity || 1;
      return `  • <b>${escapeHtml(it.name)}</b> × ${q} ширхэг <i>(${Number(it.price * q).toLocaleString()}₮)</i>`;
    })
    .join('\n');

  const customer = [order.customerName, order.lastName, order.firstName].filter(Boolean)[0] || 'Харилцагч';
  const deliveryFee = Number(order.deliveryFee ?? 0);
  const total = Number(order.total ?? 0);

  const message = `
📦 <b>ШИНЭ ЗАХИАЛГА ИРЛЭЭ! [${branch.label}]</b>
━━━━━━━━━━━━━━━━━━━━
🔢 <b>Захиалгын №:</b> #${order.id}
👤 <b>Харилцагч:</b> ${escapeHtml(customer)}
📞 <b>Утас:</b> <code>${escapeHtml(order.phone || 'Тодорхойгүй')}</code>
${order.email ? `✉️ <b>Имэйл:</b> ${escapeHtml(order.email)}\n` : ''}📍 <b>Хаяг:</b> ${escapeHtml(order.address || 'Тодорхойгүй')}
${order.note ? `📝 <b>Тэмдэглэл:</b> <i>${escapeHtml(order.note)}</i>\n` : ''}
🛍️ <b>Бүтээгдэхүүн (${order.items?.length || 0}):</b>
${itemsText || '  • Бүтээгдэхүүний мэдээлэл байхгүй'}

🚚 <b>Хүргэлт:</b> ${deliveryFee > 0 ? `${deliveryFee.toLocaleString()}₮` : 'Үнэгүй (100k+)'}
💰 <b>НИЙТ ТӨЛӨХ:</b> <b>${total.toLocaleString()}₮</b>
💳 <b>Төлбөрийн хэлбэр:</b> ${escapeHtml(order.paymentMethod || 'Бэлнээр / Дансаар')}
━━━━━━━━━━━━━━━━━━━━
🔗 <a href="https://estelpro.vercel.app/ad/orders/${order.id}">Систем дээр дэлгэрэнгүй харах</a>
  `.trim();

  return sendTelegramMessage(DEFAULT_CHAT_ID, message);
}

/**
 * Generates an instant daily sales report
 */
export async function getTodayReportMessage() {
  try {
    const orders = await listOrders();
    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => {
      const d = (o.date || '').slice(0, 10);
      return d === todayStr;
    });

    const totalRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);
    const paidOrders = todayOrders.filter((o) => o.paymentStatus === 'paid');
    const paidRevenue = paidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    let ubCount = 0, ubRev = 0;
    let darkhanCount = 0, darkhanRev = 0;
    let erdenetCount = 0, erdenetRev = 0;

    todayOrders.forEach((o) => {
      const b = detectBranch(o);
      if (b.code === 'darkhan') {
        darkhanCount++;
        darkhanRev += o.total || 0;
      } else if (b.code === 'erdenet') {
        erdenetCount++;
        erdenetRev += o.total || 0;
      } else {
        ubCount++;
        ubRev += o.total || 0;
      }
    });

    const productMap: Record<string, number> = {};
    todayOrders.forEach((o) => {
      o.items?.forEach((it: AdOrderItem) => {
        const q = it.qty || (it as { quantity?: number }).quantity || 1;
        productMap[it.name] = (productMap[it.name] || 0) + q;
      });
    });

    const topProducts = Object.entries(productMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5);

    const topProductsText = topProducts.length > 0
      ? topProducts.map(([name, qty], idx) => `  ${idx + 1}. <b>${escapeHtml(name)}</b> — ${qty} ширхэг`).join('\n')
      : '  (Өнөөдөр хараахан бүтээгдэхүүн гараагүй байна)';

    return `
📊 <b>ӨДРИЙН НЭГДСЭН ТАЙЛАН (${todayStr})</b>
━━━━━━━━━━━━━━━━━━━━
📦 <b>Нийт захиалга:</b> ${todayOrders.length} захиалга
💰 <b>Нийт борлуулалт:</b> <b>${totalRevenue.toLocaleString()}₮</b>
✅ <b>Төлбөр төлөгдсөн:</b> ${paidRevenue.toLocaleString()}₮ (${paidOrders.length} захиалга)
⏳ <b>Төлбөр хүлээгдэж буй:</b> ${(totalRevenue - paidRevenue).toLocaleString()}₮

📍 <b>Салбаруудаар:</b>
  • 🟣 <b>Улаанбаатар:</b> ${ubRev.toLocaleString()}₮ (${ubCount} захиалга)
  • 🟢 <b>Дархан:</b> ${darkhanRev.toLocaleString()}₮ (${darkhanCount} захиалга)
  • 🔵 <b>Эрдэнэт:</b> ${erdenetRev.toLocaleString()}₮ (${erdenetCount} захиалга)

🔥 <b>Хамгийн их зарагдсан ТОП бүтээгдэхүүн:</b>
${topProductsText}
━━━━━━━━━━━━━━━━━━━━
🤖 <i>ESTEL AI Assistant · Бодит цагийн дата</i>
    `.trim();
  } catch (err) {
    return `❌ Тайлан бодоход алдаа гарлаа: ${err instanceof Error ? err.message : 'Алдаа'}`;
  }
}

/**
 * Generates low stock warning report
 */
export async function getStockReportMessage() {
  try {
    const res = await listProducts();
    const products: DbProduct[] = res.items || [];
    const lowStock = products
      .filter((p: DbProduct) => typeof p.stock === 'number' && p.stock <= 10)
      .sort((a: DbProduct, b: DbProduct) => (a.stock || 0) - (b.stock || 0))
      .slice(0, 10);

    if (lowStock.length === 0) {
      return `✅ <b>НӨӨЦИЙН МЭДЭЭ:</b> Бүх бүтээгдэхүүний үлдэгдэл хэвийн байна (10-аас доош нөөцтэй бараа байхгүй).`;
    }

    const listText = lowStock
      .map((p: DbProduct, idx: number) => `  ${idx + 1}. [${p.sku || 'SKU'}] <b>${escapeHtml(p.name)}</b> — <b>${p.stock} ширхэг</b> үлдсэн`)
      .join('\n');

    return `
⚠️ <b>АНХААРУУЛГА: ҮЛДЭГДЭЛ БАГАССАН БАРААНУУД</b>
━━━━━━━━━━━━━━━━━━━━
Нөөц 10 болон түүнээс доош үлдсэн бүтээгдэхүүнүүд:

${listText}
━━━━━━━━━━━━━━━━━━━━
Татан авалтын захиалгыг системээр баталгаажуулна уу.
    `.trim();
  } catch (err) {
    return `❌ Үлдэгдэл шалгахад алдаа гарлаа: ${err instanceof Error ? err.message : 'Алдаа'}`;
  }
}

/**
 * Handles incoming bot webhook events (Commands, Chatbot, AI Queries)
 */
export async function handleTelegramWebhook(body: {
  message?: {
    chat?: { id?: number | string };
    text?: string;
    from?: { first_name?: string; username?: string };
  };
}) {
  const msg = body.message;
  if (!msg || !msg.text || !msg.chat?.id) return { handled: false };

  const chatId = msg.chat.id;
  const rawText = msg.text.trim();
  const lower = rawText.toLowerCase();

  // 1. Greetings (сайн уу, sainuu, hi, hello)
  const greetingWords = ['сайн уу', 'сайна уу', 'sainuu', 'sn uu', 'сайн байна уу', 'өглөөний мэнд', 'өдрийн мэнд', 'оройн мэнд', 'hi', 'hello', 'hey'];
  if (greetingWords.some((g) => lower === g || lower.startsWith(g + ' ') || lower.endsWith(' ' + g))) {
    const greetMsg = `
👋 Сайн байна уу, <b>${escapeHtml(msg.from?.first_name || 'Танд')}</b> өдрийн мэнд хүргэе! ✨
Би бол <b>ESTEL Professional Mongolia</b>-ийн ухаалаг AI туслах байна.

Танд юугаар туслах вэ?
• 🛍️ <b>Бүтээгдэхүүний үнэ, үлдэгдэл асуух</b> <i>(Жишээ: "Otium шампунь хэд вэ?", "Будаг байна уу?")</i>
• 📦 <b>Захиалга шалгах</b> <i>(Жишээ: "Захиалга 1332401")</i>
• 🚚 <b>Хүргэлтийн нөхцөл</b> <i>(Жишээ: "Хүргэлт ямар үнэтэй вэ?")</i>
• 🏢 <b>Салбарын хаяг, цагийн хуваарь</b> <i>(Жишээ: "Салбарууд хаана байдаг вэ?")</i>
• 💇‍♀️ <b>Салоны хөнгөлөлт</b> <i>(Жишээ: "Салоны гэрээ ямар хөнгөлөлттэй вэ?")</i>
• 📊 <b>Борлуулалтын тайлан</b> <i>(Бичих: /today эсвэл "өнөөдөр")</i>
    `.trim();
    await sendTelegramMessage(chatId, greetMsg);
    return { handled: true, command: 'greeting' };
  }

  // 2. /start or /help or тусламж
  if (lower.startsWith('/start') || lower.startsWith('/help') || lower === 'тусламж') {
    const helpMsg = `
👋 Сайн байна уу, <b>${escapeHtml(msg.from?.first_name || 'Менежер')}</b>!
Би бол <b>ESTEL Professional Mongolia</b>-ийн ухаалаг AI туслах бот юм. Та сайт, бүтээгдэхүүн, захиалгатай холбоотой хүссэн бүхнээ надаас асууж болно!

📌 <b>Ашиглаж болох тушаалууд:</b>
• <b>/today</b> эсвэл <code>өнөөдөр</code> — Өнөөдрийн нийт борлуулалт, салбаруудын тайлан
• <b>/stock</b> эсвэл <code>үлдэгдэл</code> — Нөөц дуусаж буй бүтээгдэхүүнүүд
• <b>/orders</b> эсвэл <code>захиалга</code> — Сүүлийн захиалгуудыг харах
• <b>/branches</b> эсвэл <code>салбар</code> — Салбаруудын хаяг, цагийн хуваарь
• <b>/delivery</b> эсвэл <code>хүргэлт</code> — Хүргэлтийн үнэ, нөхцөл
• <b>/salon</b> эсвэл <code>салон</code> — Салоны хамтын ажиллагаа, хөнгөлөлтийн хувь

💡 <b>Энгийн яриагаар асуух жишээ:</b>
• <i>"Otium шампунь үнэ хэд вэ?"</i>
• <i>"Princess Essex будаг ямар үнэтэй вэ?"</i>
• <i>"Манай салбарууд хаана хаана байдаг вэ?"</i>
• <i>"Хүргэлт хэдэн төгрөгөөс дээш үнэгүй билээ?"</i>
• <i>"Захиалга 1332401 шалгаад өгөөч"</i>
    `.trim();
    await sendTelegramMessage(chatId, helpMsg);
    return { handled: true, command: 'help' };
  }

  // 3. /today or "өнөөдөр" / "борлуулалт" / "тайлан"
  if (lower.startsWith('/today') || lower.includes('өнөөдөр') || lower.includes('тайлан') || lower.includes('борлуулалт')) {
    const report = await getTodayReportMessage();
    await sendTelegramMessage(chatId, report);
    return { handled: true, command: 'today' };
  }

  // 4. /stock or "үлдэгдэл" / "нөөц" / "дуусаж"
  if (lower.startsWith('/stock') || lower.includes('үлдэгдэл') || lower.includes('нөөц') || lower.includes('дуусаж')) {
    const stock = await getStockReportMessage();
    await sendTelegramMessage(chatId, stock);
    return { handled: true, command: 'stock' };
  }

  // 5. Specific Order Lookup (e.g., #1332401 or 1332401)
  const orderNumMatch = rawText.match(/#?(\d{6,8})/);
  if (orderNumMatch && (lower.includes('захиалга') || lower.includes('order') || lower.includes('шалга') || rawText.startsWith('#'))) {
    const orderId = orderNumMatch[1];
    const order = await getOrder(orderId);
    if (order) {
      const branch = detectBranch(order);
      const items = (order.items || [])
        .map((it: AdOrderItem) => `  • ${it.name} × ${it.qty || (it as { quantity?: number }).quantity || 1} (${(it.price * (it.qty || 1)).toLocaleString()}₮)`)
        .join('\n');

      const text = `
📋 <b>ЗАХИАЛГЫН ДЭЛГЭРЭНГҮЙ [№${order.id}]</b>
━━━━━━━━━━━━━━━━━━━━
📍 <b>Салбар:</b> ${branch.label}
👤 <b>Харилцагч:</b> ${escapeHtml(order.customerName)}
📞 <b>Утас:</b> <code>${escapeHtml(order.phone || 'Байхгүй')}</code>
📍 <b>Хаяг:</b> ${escapeHtml(order.address || 'Тодорхойгүй')}
💳 <b>Төлбөрийн хэлбэр:</b> ${escapeHtml(order.paymentMethod || 'Бэлнээр')}
💵 <b>Төлөв:</b> ${order.paymentStatus === 'paid' ? 'Төлөгдсөн ✅' : 'Төлөгдөөгүй ⏳'}
🚚 <b>Хүргэлт:</b> ${(order.deliveryFee || 0).toLocaleString()}₮
💰 <b>НИЙТ ДҮН:</b> <b>${(order.total || 0).toLocaleString()}₮</b>

🛍️ <b>Бүтээгдэхүүн:</b>
${items || '  • Мэдээлэл байхгүй'}
━━━━━━━━━━━━━━━━━━━━
🔗 <a href="https://estelpro.vercel.app/ad/orders/${order.id}">Систем дээр нээх</a>
      `.trim();
      await sendTelegramMessage(chatId, text);
      return { handled: true, command: 'order_lookup' };
    }
  }

  // 6. /orders or "захиалга"
  if (lower.startsWith('/orders') || lower === 'захиалга' || lower === 'захиалгууд') {
    const orders = await listOrders();
    const recent = orders.slice(0, 5);
    if (recent.length === 0) {
      await sendTelegramMessage(chatId, 'Одоогоор захиалга байхгүй байна.');
      return { handled: true, command: 'orders' };
    }
    const recentText = recent
      .map((o) => `• <b>#${o.id}</b> — ${escapeHtml(o.customerName)}: <b>${(o.total || 0).toLocaleString()}₮</b> (${o.paymentStatus === 'paid' ? 'Төлсөн ✅' : 'Төлөөгүй ⏳'})`)
      .join('\n');

    await sendTelegramMessage(
      chatId,
      `📋 <b>СҮҮЛИЙН 5 ЗАХИАЛГА:</b>\n━━━━━━━━━━━━━━━━━━━━\n${recentText}\n━━━━━━━━━━━━━━━━━━━━\n<a href="https://estelpro.vercel.app/ad/orders">Бүх захиалгыг системээр харах</a>`,
    );
    return { handled: true, command: 'orders' };
  }

  // 7. Branch / Location Query
  if (lower.startsWith('/branches') || lower.includes('салбар') || lower.includes('байршил') || lower.includes('хаяг') || lower.includes('хаана')) {
    const branchList = BRANCHES.map(
      (b, i) => `<b>${i + 1}. ${escapeHtml(b.name)}</b>\n📍 Хаяг: ${escapeHtml(b.address)}\n⏰ Цаг: ${escapeHtml(b.hours)}`,
    ).join('\n\n');

    const contact = FOOTER_LINKS.contact;
    const branchMsg = `
🏢 <b>ESTEL PROFESSIONAL САЛБАРУУД:</b>
━━━━━━━━━━━━━━━━━━━━
${branchList}

📞 <b>Холбоо барих утаснууд:</b>
${contact.phones.map((p) => `• <code>${p}</code>`).join('\n')}
✉️ Имэйл: <code>${contact.email}</code>
━━━━━━━━━━━━━━━━━━━━
🔗 <a href="https://estelpro.vercel.app/about">Бидний тухай хуудас харах</a>
    `.trim();

    await sendTelegramMessage(chatId, branchMsg);
    return { handled: true, command: 'branches' };
  }

  // 8. Delivery Terms Query
  if (lower.startsWith('/delivery') || lower.includes('хүргэлт') || lower.includes('хүргэлтийн нөхцөл') || lower.includes('үнэгүй хүргэлт')) {
    const deliveryMsg = `
🚚 <b>ХҮРГЭЛТИЙН НӨХЦӨЛ & ҮНЭ ТАРИФ:</b>
━━━━━━━━━━━━━━━━━━━━
• 🎁 <b>Үнэгүй хүргэлт:</b> <b>100,000₮</b>-өөс дээш худалдан авалтад хүргэлт ҮНЭГҮЙ!
• 🏙 <b>Улаанбаатар хот дотор:</b> Стандарт хүргэлт <b>5,000₮</b> (1–2 ажлын өдөр)
• 🇲🇳 <b>Орон нутгийн унаанд тавих:</b> <b>7,000₮</b> (Хот хоорондын тээвэрт хүлээлгэн өгнө)
• 🏢 <b>Салбараас өөрөө авах (Pickup):</b> ҮНЭГҮЙ

⏰ <b>Хүргэлтийн хуваарь:</b>
Даваа - Бямба: 10:00 - 20:00 цагийн хооронд хүргэгдэнэ.
━━━━━━━━━━━━━━━━━━━━
🔗 <a href="https://estelpro.vercel.app/terms/delivery">Дэлгэрэнгүй нөхцөл унших</a>
    `.trim();

    await sendTelegramMessage(chatId, deliveryMsg);
    return { handled: true, command: 'delivery' };
  }

  // 9. Salon Partnership & Discount Query
  if (lower.startsWith('/salon') || lower.includes('салон') || lower.includes('хөнгөлөлт') || lower.includes('үсчин') || lower.includes('гэрээ')) {
    const tiers = SALON_DISCOUNT_TIERS.map((t) => `• <b>${t.label}:</b> Гэрээт хамтрагч салон`).join('\n');
    const salonMsg = `
💇‍♀️ <b>САЛОН / ҮСЧДИЙН ХӨНГӨЛӨЛТИЙН СИСТЕМ:</b>
━━━━━━━━━━━━━━━━━━━━
ESTEL Professional нь мэргэжлийн салон, стилистүүдтэй дараах шатлалаар онцгой хөнгөлөлттэй хамтран ажилладаг:

${tiers}

🌟 <b>Хамтрагч салон болохын тулд:</b>
1. <a href="https://estelpro.vercel.app/register">estelpro.mn/register</a> хаягаар "Салон / Үсчин"-ээр бүртгүүлнэ.
2. Манай менежер холбогдож гэрээ байгуулан системийн хөнгөлөлтийн эрх нээнэ.
3. Системд нэвтэрч бөөний хямдралтай үнээр шууд захиалга хийх боломжтой болно.
━━━━━━━━━━━━━━━━━━━━
📞 Лавлах: <code>8620 7202</code>
    `.trim();

    await sendTelegramMessage(chatId, salonMsg);
    return { handled: true, command: 'salon' };
  }

  // 10. Product Search by Name / Keyword
  const productSearchWords = ['будаг', 'шампунь', 'маск', 'тос', 'спрей', 'ангижруулагч', 'otium', 'curex', 'essex', 'couture', 'newtone', 'alpha', 'үнэ', 'байна уу', 'хэд вэ', 'хэдтэй'];
  const isProductSearch = productSearchWords.some((w) => lower.includes(w));

  if (isProductSearch) {
    const res = await listProducts();
    const allProducts: DbProduct[] = res.items || [];

    // Clean search terms: remove punctuation and common stop words
    const cleanLower = lower.replace(/["'”„`?:!.,]/g, ' ');
    const searchTerms = cleanLower
      .replace(/үнэ|хэд|вэ|байна|уу|юу|манайд|байгаа|эсвэл|ямар|байнауу|хэдтэй/g, ' ')
      .trim()
      .split(/\s+/)
      .filter((w) => w.length >= 2);

    const matches = allProducts.filter((p: DbProduct) => {
      const title = (p.name || '').toLowerCase();
      const sku = (p.sku || '').toLowerCase();
      return searchTerms.some((st) => title.includes(st) || sku.includes(st));
    });

    if (matches.length > 0) {
      const list = matches.slice(0, 6).map((p: DbProduct, idx: number) => {
        const priceStr = Number(p.price || 0).toLocaleString() + '₮';
        const stockStr = typeof p.stock === 'number' ? `(${p.stock}ш үлдсэн)` : '(Бэлэн байгаа)';
        return `${idx + 1}. <b>${escapeHtml(p.name)}</b>\n   💰 Үнэ: <b>${priceStr}</b> · 📦 Нөөц: ${stockStr}`;
      }).join('\n\n');

      const productMsg = `
🛍 <b>БҮТЭЭГДЭХҮҮНИЙ МЭДЭЭЛЭЛ:</b>
━━━━━━━━━━━━━━━━━━━━
Таны хайсан бүтээгдэхүүнүүд:

${list}
━━━━━━━━━━━━━━━━━━━━
🔗 <a href="https://estelpro.vercel.app/products">Сайт дээр бүх барааг үзэх</a>
      `.trim();

      await sendTelegramMessage(chatId, productMsg);
      return { handled: true, command: 'product_search' };
    }
  }

  // 11. AI Universal Integration (Groq Llama 3.3 / Gemini)
  const aiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || '';
  if (aiKey) {
    try {
      const aiResponse = await callUniversalAI(rawText, aiKey);
      if (aiResponse) {
        await sendTelegramMessage(chatId, `🤖 <b>ESTEL AI Туслах:</b>\n\n${escapeHtml(aiResponse)}`);
        return { handled: true, command: 'ai_response' };
      }
    } catch (err) {
      console.error('[AI Query Error]:', err);
    }
  }

  // 12. Smart Helpful Fallback
  const helpReply = `
🤖 <b>ESTEL AI ТУСЛАХ</b>
Таны асуулт: <i>"${escapeHtml(rawText)}"</i>

Би танд дараах зүйлсээр шууд тусалж чадна:
• 🛍️ <b>Бүтээгдэхүүний үнэ, үлдэгдэл</b> <i>("Otium шампунь үнэ", "Princess Essex будаг")</i>
• 📦 <b>Захиалга шалгах</b> <i>("Захиалга 1332401")</i>
• 🚚 <b>Хүргэлтийн нөхцөл</b> <i>("Хүргэлтийн үнэ хэд вэ?")</i>
• 🏢 <b>Салбаруудын байршил</b> <i>("Салбарууд хаана байдаг вэ?")</i>
• 💇‍♀️ <b>Салоны хөнгөлөлт</b> <i>("Салоны хөнгөлөлт")</i>
• 📊 <b>Өдрийн борлуулалтын тайлан</b> <i>(Бичих: /today)</i>

💡 <i>Асуултаа дээрх түлхүүр үгсээр илүү тодорхой бичиж асууна уу!</i>
  `.trim();

  await sendTelegramMessage(chatId, helpReply);
  return { handled: true, command: 'smart_help' };
}

async function callUniversalAI(prompt: string, apiKey: string): Promise<string | null> {
  const key = apiKey.trim();
  if (!key) return null;

  const systemInstruction = `Чи бол ESTEL Professional Mongolia (estelpro.mn) албан ёсны цахим дэлгүүрийн ухаалаг AI туслах юм.
Монгол хэлээр эелдэг, товч тодорхой, бизнесийн соёлтой хариул.
Компанийн мэдээлэл:
- Брэнд: ESTEL Professional Mongolia (Мэргэжлийн үс арчилгаа, будаг, салон бүтээгдэхүүн)
- Хүргэлт: 100,000₮ дээш үнэгүй, УБ хот дотор 5,000₮, орон нутаг 7,000₮
- Салбарууд: УБ Баянзүрх дүүрэг Соманг плаза, Чингисийн И-март 2-р давхар, Эрдэнэт Орхон молл, Эрдэнэт Автоцентр
- Утас: 7707 2207, 8605 7202, 8603 7202
- Салон хөнгөлөлт: 5% - 20% хүртэл гэрээт шатлалтай.`;

  // 1. If Groq API Key (starts with gsk_)
  if (key.startsWith('gsk_')) {
    const res = await fetch('https://api.groq.com/openai/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${key}`,
      },
      body: JSON.stringify({
        model: 'openai/gpt-oss-120b',
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: prompt },
        ],
        temperature: 0.5,
        max_tokens: 700,
      }),
    });
    const data = await res.json();
    return data.choices?.[0]?.message?.content || null;
  }

  // 2. Google Gemini API
  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${key}`;
  const res = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nХэрэглэгчийн асуулт: ${prompt}` }] }],
    }),
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
