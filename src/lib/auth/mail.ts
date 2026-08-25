import { appendFileSync, mkdirSync } from 'fs';
import path from 'path';

export function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return '***';
  return `${name.slice(0, 1)}***@${domain}`;
}

export async function sendOtpEmail(to: string, code: string) {
  const from = process.env.OTP_FROM_EMAIL || 'ESTEL <noreply@estel.mn>';
  const key = process.env.RESEND_API_KEY;
  if (key) {
    const res = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${key}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from,
        to,
        subject: 'ESTEL нэвтрэх код',
        text: `Таны OTP код: ${code}\n5 минутын дотор оруулна уу.`,
      }),
    });
    if (res.ok) return;
    const detail = await res.text().catch(() => '');
    console.error('Resend OTP failed', res.status, detail);
  }

  mkdirSync(path.join(process.cwd(), 'data'), { recursive: true });
  appendFileSync(
    path.join(process.cwd(), 'data', 'otp-mailbox.jsonl'),
    `${JSON.stringify({ to, code, at: new Date().toISOString() })}\n`,
    'utf8'
  );
}
