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
      className="flex items-center justify-between border-t border-gray-200 pt-4"
      aria-label="Paginação"
    >
      <div>
        {prevHref ? (
          <Link
            href={prevHref}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Anterior
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400">
            Anterior
          </span>
        )}
      </div>
      <span className="text-sm text-gray-600">Página {currentPage}</span>
      <div>
        {nextHref ? (
          <Link
            href={nextHref}
            className="inline-flex items-center rounded-md border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 transition-colors hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Próxima
          </Link>
        ) : (
          <span className="inline-flex cursor-not-allowed items-center rounded-md border border-gray-200 bg-gray-50 px-3 py-2 text-sm font-medium text-gray-400">
            Próxima
          </span>
        )}
      </div>
    </nav>
  );
}
