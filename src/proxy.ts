import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (!pathname.startsWith('/dresser')) return NextResponse.next();
  if (request.cookies.get('estel_dresser')?.value === '1') return NextResponse.next();
  return NextResponse.redirect(new URL('/login/dresser', request.url));
}

export const config = {
  matcher: ['/dresser', '/dresser/:path*'],
};
