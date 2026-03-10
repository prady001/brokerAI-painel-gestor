'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const navItems = [
  { href: '/dashboard', label: 'Dashboard' },
  { href: '/clients', label: 'Clientes' },
  { href: '/agent-status', label: 'Status do agente' },
] as const;

function NavLink({
  href,
  label,
  isActive,
}: {
  href: string;
  label: string;
  isActive: boolean;
}) {
  return (
    <Link
      href={href}
      className={`flex items-center gap-2 rounded-md px-3 py-2 text-sm font-medium transition-all duration-200 ease-out focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep ${
        isActive
          ? 'bg-blue-500/10 text-text-primary'
          : 'text-text-muted hover:bg-white/5 hover:text-text-secondary'
      }`}
    >
      {label}
    </Link>
  );
}

export function PanelSidebar() {
  const pathname = usePathname();

  return (
    <aside className="hidden w-[220px] flex-shrink-0 flex-col border-r border-border bg-bg-surface lg:flex">
      <div className="flex items-center gap-2 border-b border-border px-4 py-4">
        <Link
          href="/dashboard"
          className="rounded text-base font-bold text-text-primary transition-colors hover:text-blue-light focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-surface"
        >
          BrokerAI
        </Link>
      </div>
      <nav className="flex flex-col gap-0.5 p-2">
        {navItems.map(({ href, label }) => (
          <NavLink
            key={href}
            href={href}
            label={label}
            isActive={pathname === href || (href !== '/dashboard' && pathname.startsWith(href))}
          />
        ))}
      </nav>
    </aside>
  );
}
