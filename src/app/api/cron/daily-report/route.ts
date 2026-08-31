import { NextResponse } from 'next/server';
import { getTodayReportMessage, sendTelegramMessage } from '@/lib/telegram/bot';

export const dynamic = 'force-dynamic';

const DEFAULT_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '-5573060380';

/**
 * Scheduled Cron Job: Runs daily at 18:00 (10:00 UTC) to send the daily closing report
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trigger = searchParams.get('trigger');

    const reportMessage = await getTodayReportMessage();
    const res = await sendTelegramMessage(DEFAULT_CHAT_ID, reportMessage);

    return NextResponse.json({
      ok: true,
      timestamp: new Date().toISOString(),
      trigger: trigger || 'vercel-cron-18:00',
      telegramResult: res,
    });
  } catch (err) {
    console.error('[Cron 18:00 Report Error]:', err);
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : 'Unknown error' },
      { status: 500 },
    );
  }
}
