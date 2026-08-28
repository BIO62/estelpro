import { NextResponse } from 'next/server';
import { handleTelegramWebhook } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';

const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '8853756606:AAHgf0_kiA373mqyvi5mAxR49IDPPJb4Www';

/**
 * Telegram Webhook Handler (Receives bot updates)
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      message?: {
        chat?: { id?: number | string };
        text?: string;
        from?: { first_name?: string; username?: string };
      };
    };

    const result = await handleTelegramWebhook(body);
    return NextResponse.json({ ok: true, result });
  } catch (err: unknown) {
    console.error('[Telegram Webhook Error]:', err);
    return NextResponse.json({ ok: false, error: err instanceof Error ? err.message : 'Unknown' }, { status: 200 });
  }
}

/**
 * Setup or Check Webhook URL
 * Visit /api/telegram/webhook?setWebhook=https://estelpro.vercel.app/api/telegram/webhook
 */
export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const targetUrl = searchParams.get('setWebhook');

  if (targetUrl) {
    const webhookUrl = targetUrl === 'true'
      ? 'https://estelpro.vercel.app/api/telegram/webhook'
      : targetUrl;

    try {
      const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/setWebhook?url=${encodeURIComponent(webhookUrl)}`);
      const data = await res.json();
      return NextResponse.json({ action: 'setWebhook', webhookUrl, data });
    } catch (err: unknown) {
      return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
    }
  }

  // Get current webhook info
  try {
    const res = await fetch(`https://api.telegram.org/bot${BOT_TOKEN}/getWebhookInfo`);
    const data = await res.json();
    return NextResponse.json({ ok: true, webhookInfo: data });
  } catch (err: unknown) {
    return NextResponse.json({ error: err instanceof Error ? err.message : 'Failed' }, { status: 500 });
  }
}
