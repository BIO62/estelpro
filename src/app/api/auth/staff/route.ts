import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { listAppUsers } from '@/lib/users/repo';

export async function GET() {
  const me = await getSessionUser();
  if (!me || me.role !== 'manager') {
    return NextResponse.json({ error: 'Зөвхөн менежер.' }, { status: 403 });
  }
  const { items } = await listAppUsers({ kind: 'staff', limit: 100 });
  return NextResponse.json({
    users: items.map(({ passwordHash: _passwordHash, ...user }) => user),
  });
}
