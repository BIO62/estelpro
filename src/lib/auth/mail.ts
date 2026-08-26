export function maskEmail(email: string) {
  const [name, domain] = email.split('@');
  if (!name || !domain) return '***';
  return `${name.slice(0, 1)}***@${domain}`;
}

export async function sendOtpEmail(to: string, code: string) {
  const from = process.env.OTP_FROM_EMAIL || 'ESTEL <noreply@estel.mn>';
  const key = process.env.RESEND_API_KEY;
  if (!key) throw new Error('RESEND_API_KEY тохируулаагүй байна.');
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${key}`,
      'Content-Type': 'application/json',
    },
    signal: AbortSignal.timeout(10000),
    body: JSON.stringify({
      from,
      to,
      subject: 'ESTEL нэвтрэх код',
      text: `Таны OTP код: ${code}\n1 минутын дотор оруулна уу.`,
    }),
  });
  if (!res.ok) {
    const detail = await res.text().catch(() => '');
    throw new Error(`OTP имэйл илгээж чадсангүй: ${res.status} ${detail}`);
  }
}
