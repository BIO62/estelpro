import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth/session';
import { listUsers } from '@/lib/auth/store';

export async function GET() {
  const me = await getSessionUser();
  if (!me || me.role !== 'manager') {
    return NextResponse.json({ error: 'Зөвхөн менежер.' }, { status: 403 });
  }
  const staff = listUsers()
    .filter((user) => user.kind === 'staff')
    .map(({ passwordHash: _passwordHash, ...rest }) => rest);
  return NextResponse.json({ users: staff });
}
