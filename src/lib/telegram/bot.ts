import { type AdOrder, type AdOrderItem } from '@/lib/ad/orders';
import { listOrders, getOrder } from '@/lib/ad/orders-repo';
import { listProducts, type DbProduct } from '@/lib/ad/products-repo';
import { FOOTER_LINKS } from '@/lib/constants';
import { SALON_DISCOUNT_TIERS } from '@/lib/auth/salon-discount';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8853756606:AAHgf0_kiA373mqyvi5mAxR49IDPPJb4Www';
const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5573060380';

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
 * Generates the official daily operational report (for 18:00 auto-trigger or on-demand)
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
    const unpaidOrders = todayOrders.filter((o) => o.paymentStatus !== 'paid');
    const unpaidRevenue = unpaidOrders.reduce((sum, o) => sum + (o.total || 0), 0);

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

    const productMap: Record<string, { qty: number; total: number }> = {};
    todayOrders.forEach((o) => {
      o.items?.forEach((it: AdOrderItem) => {
        const q = it.qty || (it as { quantity?: number }).quantity || 1;
        const sub = Number(it.price || 0) * q;
        if (!productMap[it.name]) {
          productMap[it.name] = { qty: 0, total: 0 };
        }
        productMap[it.name].qty += q;
        productMap[it.name].total += sub;
      });
    });

    const productEntries = Object.entries(productMap).sort((a, b) => b[1].qty - a[1].qty);

    const productsListText = productEntries.length > 0
      ? productEntries.map(([name, data], idx) => `  ${idx + 1}. <b>${escapeHtml(name)}</b> — ${data.qty} ширхэг <i>(${data.total.toLocaleString()}₮)</i>`).join('\n')
      : '  (Өнөөдөр хараахан бүтээгдэхүүн гараагүй байна)';

    return `
📊 <b>ӨДРИЙН НЭГДСЭН ТАЙЛАН (18:00 ЦАГИЙН ХААЛТ)</b>
📅 <b>Огноо:</b> ${todayStr}
━━━━━━━━━━━━━━━━━━━━
💰 <b>Нийт борлуулалт:</b> <b>${totalRevenue.toLocaleString()}₮</b> (${todayOrders.length} захиалга)
  • ✅ <b>Төлбөр төлөгдсөн:</b> ${paidRevenue.toLocaleString()}₮ (${paidOrders.length} захиалга)
  • ⏳ <b>Төлбөр хүлээгдэж буй:</b> ${unpaidRevenue.toLocaleString()}₮ (${unpaidOrders.length} захиалга)

📍 <b>Салбаруудаар:</b>
  • 🟣 <b>Улаанбаатар:</b> ${ubRev.toLocaleString()}₮ (${ubCount} захиалга)
  • 🟢 <b>Дархан салбар:</b> ${darkhanRev.toLocaleString()}₮ (${darkhanCount} захиалга)
  • 🔵 <b>Эрдэнэт салбар:</b> ${erdenetRev.toLocaleString()}₮ (${erdenetCount} захиалга)

🛍️ <b>Өнөөдөр гарсан бүтээгдэхүүнүүд:</b>
${productsListText}
━━━━━━━━━━━━━━━━━━━━
🏢 <i>ESTEL Professional Mongolia · Удирдлагын систем</i>
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
 * Handles incoming bot webhook events (Executive Assistant & AI Queries)
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

  // 1. Direct explicit /today command
  if (lower === '/today' || lower === 'тайлан' || lower === 'өдрийн тайлан' || lower === '/report') {
    const report = await getTodayReportMessage();
    await sendTelegramMessage(chatId, report);
    return { handled: true, command: 'today' };
  }

  // 2. Direct explicit /stock command
  if (lower === '/stock' || lower === 'нөөц') {
    const stock = await getStockReportMessage();
    await sendTelegramMessage(chatId, stock);
    return { handled: true, command: 'stock' };
  }

  // 3. AI Executive Operations Query with Live Data Context
  const aiKey = process.env.GROQ_API_KEY || process.env.GEMINI_API_KEY || '';
  if (aiKey) {
    try {
      const aiResponse = await callExecutiveAI(rawText, aiKey);
      if (aiResponse) {
        const cleanMessage = formatTelegramHtml(aiResponse);
        await sendTelegramMessage(chatId, `🤖 <b>Удирдлагын Туслах:</b>\n\n${cleanMessage}`);
        return { handled: true, command: 'ai_executive_response' };
      }
    } catch (err) {
      console.error('[AI Query Error]:', err);
    }
  }

  // 4. Fallback if AI fails
  const helpReply = `
🤖 <b>ESTEL Удирдлагын Туслах</b>
Таны асуулт: <i>"${escapeHtml(rawText)}"</i>

Ашиглах боломжтой тушаалууд:
• 📊 <b>/today</b> — Өдрийн 18:00 цагийн хаалтын нэгдсэн тайлан
• ⚠️ <b>/stock</b> — Үлдэгдэл 10-аас доош үлдсэн бараануудын жагсаалт
• 📦 <b>/orders</b> — Сүүлийн захиалгууд
  `.trim();

  await sendTelegramMessage(chatId, helpReply);
  return { handled: true, command: 'fallback' };
}

/**
 * Calls AI with full Live Database context as an Internal Executive Assistant
 */
async function callExecutiveAI(prompt: string, apiKey: string): Promise<string | null> {
  const key = apiKey.trim();
  if (!key) return null;

  // 1. Build Live Database Context
  let liveContext = '';
  try {
    const [orders, productsRes] = await Promise.all([
      listOrders(),
      listProducts(),
    ]);

    const todayStr = new Date().toISOString().slice(0, 10);
    const todayOrders = orders.filter((o) => (o.date || '').slice(0, 10) === todayStr);
    const totalTodayRevenue = todayOrders.reduce((sum, o) => sum + (o.total || 0), 0);

    const recentOrdersText = orders.slice(0, 8).map((o) => {
      const b = detectBranch(o);
      const items = (o.items || []).map((it) => `${it.name} x${it.qty || (it as { quantity?: number }).quantity || 1}`).join(', ');
      return `• №${o.id}: ${o.customerName} (${o.phone}) | Дүн: ${(o.total || 0).toLocaleString()}₮ | Төлөв: ${o.paymentStatus === 'paid' ? 'Төлөгдсөн' : 'Төлөөгүй'} | Салбар: ${b.label} | Бараа: ${items || 'Тодорхойгүй'}`;
    }).join('\n');

    const products = productsRes.items || [];
    const sampleProductsText = products.slice(0, 20).map((p) => {
      return `• ${p.name} (SKU: ${p.sku || '-'}) | Үнэ: ${Number(p.price || 0).toLocaleString()}₮ | Нөөц: ${p.stock ?? 'Бэлэн'}`;
    }).join('\n');

    liveContext = `
[СИСТЕМИЙН БОДИТ ЦАГИЙН МЭДЭЭЛЭЛ (LIVE DATA)]:
- Өнөөдөр (${todayStr}): Нийт ${todayOrders.length} захиалга ирсэн, нийт дүн: ${totalTodayRevenue.toLocaleString()}₮.
- Сүүлийн захиалгууд:
${recentOrdersText || 'Захиалга байхгүй'}

- Бүтээгдэхүүний жинхэнэ каталог (ESTEL):
${sampleProductsText}

- Салбарууд: 1. УБ Баянзүрх Соманг плаза, 2. И-март Чингис 2-р давхар, 3. Эрдэнэт Орхон молл, 4. Эрдэнэт Автоцентр
- Хүргэлтийн нөхцөл: 100,000₮ дээш үнэгүй хүргэлт, УБ 5,000₮, Орон нутаг 7,000₮
- Салоны гэрээт хөнгөлөлт: 5%, 10%, 15%, 20%
    `.trim();
  } catch (err) {
    console.error('Failed to fetch live context for AI:', err);
  }

  const systemInstruction = `Чи бол ESTEL Professional Mongolia (estelpro.mn) компанийн ҮҮСГЭН БАЙГУУЛАГЧ / УДИРДЛАГЫН ДОТООД УХААЛАГ ТУСЛАХ AI юм.
Чи байгууллагын эзэн болон удирдлагын багтай харьцаж байна.

ЧУХАЛ ДҮРЭМ ЖУРАМ:
1. Тэд гадны хэрэглэгч биш тул өөрийнх нь компани руу залгахыг (7707-2207 г.м утас), эсвэл харилцагчийн лавлах утас өгөхийг ХАТУУ ХОРИГЛОНО.
2. Тэдний асуусан захиалга, өнөөдрийн борлуулалт, барааны нэр төрөл, үлдэгдэл, салбаруудын мэдээлэлд доорх [СИСТЕМИЙН БОДИТ ЦАГИЙН МЭДЭЭЛЭЛ]-ийг ашиглан шууд бодит тоо баримтаар нь товч, тодорхой, бизнесийн соёлтой тайлагна.
3. Текстдээ ямар ч ** од тэмдэгт БҮҮ АШИГЛА! Тодруулах үгээ <b>үг</b> тагаар бич. Жагсаалтад • тэмдэг ашигла.
4. Хэрэглэгч латин монголоор бичсэн бол (жишээ нь: "onoodor manaid zahialga orj irsen uu") "Өнөөдөр манайд захиалга орж ирсэн үү" гэж ойлгоод монгол кириллээр шууд бодит хариулт өг.

${liveContext}`;

  // 1. Groq AI (Llama 3.3 / GPT-120B)
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
        temperature: 0.3,
        max_tokens: 800,
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
      contents: [{ role: 'user', parts: [{ text: `${systemInstruction}\n\nУдирдлагын асуулт: ${prompt}` }] }],
    }),
  });
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.[0]?.text || null;
}

/**
 * Cleans markdown asterisks and converts to clean Telegram HTML
 */
function formatTelegramHtml(text: string): string {
  if (!text) return '';
  return text
    // Replace **bold** with <b>bold</b>
    .replace(/\*\*([^*]+)\*\*/g, '<b>$1</b>')
    // Replace *italic* with <i>italic</i>
    .replace(/\*([^*]+)\*/g, '<i>$1</i>')
    // Replace markdown headers ### with bold
    .replace(/^#{1,4}\s+(.+)$/gm, '<b>$1</b>')
    // Replace markdown bullets * or - with •
    .replace(/^[\*\-]\s+/gm, '• ')
    // Remove any remaining raw asterisks
    .replace(/\*{1,2}/g, '');
}

function escapeHtml(text: string): string {
  return String(text || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}
