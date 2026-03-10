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
    <main className="flex min-h-screen items-center justify-center bg-bg-deep px-4">
      <div className="w-full max-w-md">
        <div className="rounded-xl border border-border bg-bg-card p-8 shadow-card-glow transition-[border-color,box-shadow] duration-200 ease-out hover:border-border-hover hover:shadow-card-glow">
          <h1 className="text-2xl font-semibold text-text-primary">
            Painel do Gestor
          </h1>
          <p className="mt-1 text-sm text-text-secondary">
            Acesse com suas credenciais para gerenciar clientes e apólices.
          </p>

          <form onSubmit={handleSubmit} className="mt-6 space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-text-secondary"
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
                className="mt-1 block w-full rounded-lg border border-border-hover bg-bg-surface px-3 py-2.5 text-text-primary placeholder:text-text-muted transition-colors focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-60"
                placeholder="seu@email.com"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-text-secondary"
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
                className="mt-1 block w-full rounded-lg border border-border-hover bg-bg-surface px-3 py-2.5 text-text-primary placeholder:text-text-muted transition-colors focus:border-blue-500 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/40 disabled:opacity-60"
              />
            </div>

            {error && (
              <p
                className="text-sm text-red-400"
                role="alert"
              >
                {error}
              </p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full rounded-lg bg-gradient-to-br from-blue to-cyan px-4 py-2.5 text-sm font-medium text-white shadow-btn-primary transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-btn-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60 disabled:hover:shadow-btn-primary"
            >
              {loading ? 'Entrando…' : 'Entrar'}
            </button>
          </form>
        </div>

        <p className="mt-4 text-center text-xs text-text-muted">
          Modo mock: use <code className="rounded bg-bg-surface px-1.5 py-0.5 text-text-secondary">admin@brokerai.com</code> / <code className="rounded bg-bg-surface px-1.5 py-0.5 text-text-secondary">123456</code>
        </p>
      </div>
    </main>
  );
}
