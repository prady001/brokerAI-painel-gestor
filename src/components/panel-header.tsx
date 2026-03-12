'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

const pathTitles: Record<string, string> = {
  '/dashboard': 'Dashboard',
  '/clients': 'Clientes',
  '/agent-status': 'Status do agente',
};

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/clients', label: 'Clientes' },
  { href: '/agent-status', label: 'Status do agente' },
] as const;

function getPageTitle(pathname: string): string {
  if (pathTitles[pathname]) return pathTitles[pathname];
  if (pathname.startsWith('/clients/') && pathname !== '/clients') return 'Detalhe do cliente';
  return 'Painel';
}

export function PanelHeader() {
  const pathname = usePathname();
  const title = getPageTitle(pathname);

  return (
    <header className="flex flex-col gap-4 border-b border-border bg-bg-base/50 px-4 py-4 sm:px-6">
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-lg font-semibold text-text-primary">{title}</h1>
        <div className="flex items-center gap-2">
          <ThemeToggle />
          <Link
            href="/api/auth/logout"
            className="rounded-lg border border-border-hover bg-white/5 px-4 py-2 text-sm font-medium text-text-primary transition-all duration-200 ease-out hover:border-border hover:bg-white/10 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base"
          >
            Sair
          </Link>
        </div>
      </div>
      <nav className="flex flex-wrap gap-2 lg:hidden">
        {navItems.map(({ href, label }) => {
          const isActive =
            pathname === href || (href !== '/dashboard' && pathname.startsWith(href));
          return (
            <Link
              key={href}
              href={href}
              className={`rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-base ${
                isActive
                  ? 'bg-blue-500/10 text-text-primary'
                  : 'text-text-muted hover:bg-white/5 hover:text-text-secondary'
              }`}
            >
              {label}
            </Link>
          );
        })}
      </nav>
    </header>
  );
}
