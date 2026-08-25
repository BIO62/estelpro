import { NextResponse } from 'next/server';
import { findSalonByCode, takeSalonOtp } from '@/lib/salons/repo';
import { createSession, homeForRole } from '@/lib/auth/session';
import { writeAudit } from '@/lib/audit/log';

export async function POST(request: Request) {
  const body = (await request.json()) as {
    email?: string;
    salonCode?: string;
    code?: string;
    purpose?: 'register' | 'login';
  };
  const code = body.code?.trim() || '';
  const salonCode = body.salonCode?.trim();

  if (!code) return NextResponse.json({ error: 'Код оруулна уу.' }, { status: 400 });

  if (salonCode) {
    const salon = await findSalonByCode(salonCode);
    if (!salon) return NextResponse.json({ error: 'Салоны код олдсонгүй.' }, { status: 404 });
    if (!(await takeSalonOtp(salon, code))) {
      return NextResponse.json({ error: 'OTP буруу эсвэл хугацаа дууссан.' }, { status: 400 });
    }
    await createSession({ id: salon.id, email: salon.email, role: 'salon' });
    await writeAudit({
      actorId: salon.id,
      actorEmail: salon.email,
      actorRole: 'salon',
      action: 'login_otp',
      entityType: 'salon',
      entityId: salon.id,
      summary: `Салон OTP-аар нэвтэрсэн: ${salon.salonName}`,
    });
    return NextResponse.json({ ok: true, redirect: homeForRole('salon') });
  }

  return NextResponse.json(
    { error: 'Хэрэглэгчийн имэйл OTP энэ урсгалд ашиглагдахгүй.' },
    { status: 410 },
  );
}
