import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

import { COOKIE, verifySessionToken } from '@/lib/auth/token-edge';
import { isLeadershipRole, isStaffRole } from '@/lib/auth/roles';

const PUBLIC_PREFIXES = ['/login', '/register', '/verify', '/forgot-password', '/api/auth'];

function isPublic(pathname: string) {
  if (pathname === '/' || pathname.startsWith('/_next')) return true;
  if (pathname.startsWith('/list') || pathname.startsWith('/products')) return true;
  if (pathname.startsWith('/new') || pathname.startsWith('/about') || pathname.startsWith('/academy')) return true;
  if (pathname.startsWith('/wishlist')) return true;
  return PUBLIC_PREFIXES.some((p) => pathname === p || pathname.startsWith(`${p}/`));
}

function loginRedirect(request: NextRequest, path: string) {
  const url = request.nextUrl.clone();
  url.pathname = path;
  url.search = '';
  return NextResponse.redirect(url);
}

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  if (isPublic(pathname)) return NextResponse.next();

  const token = request.cookies.get(COOKIE)?.value;
  const session = token ? await verifySessionToken(token) : null;

  if (pathname.startsWith('/ad')) {
    if (!session || !isStaffRole(session.role)) {
      return loginRedirect(request, '/login/staff');
    }
    if (
      pathname.startsWith('/ad/staff') &&
      !isLeadershipRole(session.role)
    ) {
      return loginRedirect(request, session.role === 'operator' ? '/ad/orders' : '/ad');
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/account')) {
    if (!session || session.role !== 'consumer') {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      url.searchParams.set('next', pathname);
      return NextResponse.redirect(url);
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/dresser')) {
    const dresserCookie = request.cookies.get('estel_dresser')?.value === '1';
    if (!session || session.role !== 'salon') {
      return loginRedirect(request, '/login?kind=salon');
    }
    return NextResponse.next();
  }

  if (pathname.startsWith('/login/staff')) {
    if (session && isStaffRole(session.role)) {
      return loginRedirect(request, session.role === 'operator' ? '/ad/orders' : '/ad');
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/ad/:path*', '/account/:path*', '/dresser/:path*', '/login/staff'],
};
