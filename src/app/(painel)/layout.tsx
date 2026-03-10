import Link from 'next/link';

export default function PainelLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-gray-200 bg-white px-6 py-3">
        <nav className="flex items-center gap-6">
          <span className="text-lg font-medium text-gray-800">BrokerAI Painel</span>
          <Link
            href="/dashboard"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Dashboard
          </Link>
          <Link
            href="/clients"
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Clientes
          </Link>
        </nav>
        <Link
          href="/api/auth/logout"
          className="text-sm text-gray-600 hover:text-gray-900"
        >
          Sair
        </Link>
      </header>
      <main className="flex-1">{children}</main>
    </div>
  );
}
