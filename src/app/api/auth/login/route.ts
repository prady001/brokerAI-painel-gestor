import { NextRequest, NextResponse } from 'next/server';

const MOCK_EMAIL = 'admin@brokerai.com';
const MOCK_PASSWORD = '123456';

interface LoginBody {
  email?: string;
  password?: string;
}

function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

export async function POST(req: NextRequest) {
  let body: LoginBody;
  try {
    body = (await req.json()) as LoginBody;
  } catch {
    return NextResponse.json(
      { message: 'Corpo da requisição inválido.' },
      { status: 400 }
    );
  }

  const { email = '', password = '' } = body;

  if (!email.trim()) {
    return NextResponse.json(
      { message: 'E-mail é obrigatório.' },
      { status: 400 }
    );
  }

  if (!validateEmail(email)) {
    return NextResponse.json(
      { message: 'Informe um e-mail válido.' },
      { status: 400 }
    );
  }

  if (!password) {
    return NextResponse.json(
      { message: 'Senha é obrigatória.' },
      { status: 400 }
    );
  }

  if (email !== MOCK_EMAIL || password !== MOCK_PASSWORD) {
    return NextResponse.json(
      { message: 'E-mail ou senha incorretos.' },
      { status: 401 }
    );
  }

  const res = NextResponse.json({ ok: true });
  res.cookies.set('access_token', 'fake-token', {
    httpOnly: true,
    path: '/',
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    maxAge: 60 * 60 * 24,
  });
  return res;
}
