import { NextRequest, NextResponse } from 'next/server';
import { ADMIN_COOKIE } from '@/lib/admin-auth-constants';

export function proxy(request: NextRequest) {
  const expectedToken = process.env.ADMIN_SESSION_TOKEN;
  const isAuthenticated = Boolean(expectedToken && request.cookies.get(ADMIN_COOKIE)?.value === expectedToken);
  const isLogin = request.nextUrl.pathname === '/admin/login';

  if (isLogin) {
    return isAuthenticated ? NextResponse.redirect(new URL('/admin', request.url)) : NextResponse.next();
  }

  if (!isAuthenticated) {
    const loginUrl = new URL('/admin/login', request.url);
    loginUrl.searchParams.set('next', request.nextUrl.pathname);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}

export const config = { matcher: ['/admin/:path*'] };
