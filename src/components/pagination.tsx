'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

interface PaginationProps {
  currentPage: number;
  hasNext: boolean;
  search?: string;
}

function buildQuery(page: number, search?: string): string {
  const params = new URLSearchParams();
  if (page > 1) params.set('page', String(page));
  if (search?.trim()) params.set('search', search.trim());
  const q = params.toString();
  return q ? `?${q}` : '';
}

export function Pagination({
  currentPage,
  hasNext,
  search,
}: PaginationProps) {
  const pathname = usePathname();
  const hasPrev = currentPage > 1;
  const prevHref = hasPrev
    ? `${pathname}${buildQuery(currentPage - 1, search)}`
    : null;
  const nextHref = hasNext
    ? `${pathname}${buildQuery(currentPage + 1, search)}`
    : null;

  if (!hasPrev && !hasNext) return null;

  return (
    <nav
      className="flex items-center justify-between border-t border-border pt-4"
      aria-label="Paginação"
    >
      <div>
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex items-center rounded border border-border-hover bg-bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
          >
            Anterior
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center rounded border border-border bg-bg-surface px-3 py-2 text-sm font-medium text-text-muted">
            Anterior
          </span>
        )}
      </div>
      <span className="text-sm text-text-secondary">Página {currentPage}</span>
      <div>
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center rounded border border-border-hover bg-bg-surface px-3 py-2 text-sm font-medium text-text-secondary transition-colors hover:bg-white/5 focus:outline-none focus-visible:ring-2 focus-visible:ring-blue focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
          >
            Próxima
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center rounded border border-border bg-bg-surface px-3 py-2 text-sm font-medium text-text-muted">
            Próxima
          </span>
        )}
      </div>
    </nav>
  );
}
