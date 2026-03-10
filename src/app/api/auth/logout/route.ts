import { NextRequest, NextResponse } from 'next/server';

export async function GET(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  res.cookies.set('access_token', '', { path: '/', maxAge: 0 });
  return res;
}

export async function POST(req: NextRequest) {
  const res = NextResponse.redirect(new URL('/login', req.url));
  res.cookies.set('access_token', '', { path: '/', maxAge: 0 });
  return res;
}
