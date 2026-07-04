
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const HUB_URL =
  process.env['NEXT_PUBLIC_HUB_URL'] ||
  (process.env.NODE_ENV === 'production' ? 'https://boldmind.ng' : 'http://localhost:4001');

const SSO_COOKIE = 'boldmind_sso';

export function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get(SSO_COOKIE)?.value;

  // Authenticated users trying to reach local auth pages → send to dashboard
  if (token && ['/login', '/register'].some(p => pathname.startsWith(p))) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  // Unauthenticated users → hub login with return_url
  if (!token) {
    const loginUrl = new URL(`${HUB_URL}/login`);
    loginUrl.searchParams.set('return_url', request.nextUrl.href);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/cbt/:path*', '/profile/:path*', '/login', '/register'],
};
