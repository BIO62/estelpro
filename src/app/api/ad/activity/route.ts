import { NextResponse } from 'next/server';

import { listAuditLogs } from '@/lib/audit/log';
import { getSessionUser } from '@/lib/auth/session';
import { canViewActivityLog } from '@/lib/auth/roles';

export const dynamic = 'force-dynamic';

export async function GET(req: Request) {
  const session = await getSessionUser();
  if (!session || !canViewActivityLog(session.role)) {
    return NextResponse.json({ error: 'Хандах эрхгүй.' }, { status: 401 });
  }

  const { searchParams } = new URL(req.url);
  const page = Math.max(1, Number(searchParams.get('page') || '1'));
  const limit = Math.min(100, Number(searchParams.get('limit') || '50'));
  const offset = (page - 1) * limit;

  try {
    const { items, total } = await listAuditLogs({ limit, offset });
    return NextResponse.json({ logs: items, total, page, limit });
  } catch (e) {
    const msg = e instanceof Error ? e.message : 'Алдаа';
    return NextResponse.json(
      {
        error: /schema cache|does not exist|Could not find/i.test(msg)
          ? 'audit_logs table алга. supabase/users.sql ажиллуулна уу.'
          : msg,
        logs: [],
        total: 0,
      },
      { status: 500 },
    );
  }
}
