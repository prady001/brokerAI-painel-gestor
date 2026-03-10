'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  function validateEmail(value: string): boolean {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setError(null);

    const trimmedEmail = email.trim();
    if (!trimmedEmail) {
      setError('E-mail é obrigatório.');
      return;
    }
    if (!validateEmail(trimmedEmail)) {
      setError('Informe um e-mail válido.');
      return;
    }
    if (!password) {
      setError('Senha é obrigatória.');
      return;
    }

    setLoading(true);
    try {
      const res = await fetch('/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: trimmedEmail, password }),
        credentials: 'include',
      });

      const data = (await res.json().catch(() => ({}))) as { message?: string };

      if (!res.ok) {
        setError(data.message ?? 'Erro ao fazer login. Tente novamente.');
        return;
      }

      router.push('/dashboard');
      router.refresh();
    } catch {
      setError('Erro de conexão. Verifique sua rede e tente novamente.');
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="flex min-h-screen items-center justify-center bg-gray-50 px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-gray-200 bg-white p-8 shadow-sm transition-shadow hover:shadow-md">
          <h1 className="text-2xl font-semibold text-gray-900">
            Painel do Gestor
          </h1>
          <p className="mt-1 text-sm text-gray-500">
            Acesse com suas credenciais para gerenciar clientes e apólices.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                E-mail
              </label>
              <input
                id="email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                Senha
              </label>
              <input
                id="password"
                type="password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                disabled={loading}
                className="mt-1 block w-full rounded-lg border border-gray-300 px-3 py-2 text-gray-900 shadow-sm transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 hover:border-gray-400 disabled:bg-gray-100 disabled:text-gray-500"
              />
            </div>

            {error && (
              <p
                className="text-sm text-red-600"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 active:bg-blue-800 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-gray-500">
          Modo mock: use <code className="rounded bg-gray-100 px-1">admin@brokerai.com</code> / <code className="rounded bg-gray-100 px-1">123456</code>
        </p>
      </div>
    </main>
  );
}
