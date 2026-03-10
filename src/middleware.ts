import { NextRequest, NextResponse } from 'next/server';

export function middleware(req: NextRequest) {
  const token = req.cookies.get('access_token');
  const isLoginPage = req.nextUrl.pathname === '/login';
  if (!token && !isLoginPage) {
    return NextResponse.redirect(new URL('/login', req.url));
  }
  if (token && isLoginPage) {
    return NextResponse.redirect(new URL('/dashboard', req.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*', '/clients/:path*', '/agent-status/:path*', '/login'],
};
