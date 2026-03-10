'use client';

import { useRouter, usePathname } from 'next/navigation';
import { useCallback, useEffect, useState } from 'react';

const DEBOUNCE_MS = 300;

interface SearchInputProps {
  defaultValue?: string;
  placeholder?: string;
}

export function SearchInput({
  defaultValue = '',
  placeholder = 'Buscar por nome ou telefone...',
}: SearchInputProps) {
  const router = useRouter();
  const pathname = usePathname();
  const [value, setValue] = useState(defaultValue);

  useEffect(() => {
    setValue(defaultValue);
  }, [defaultValue]);

  const applySearch = useCallback(
    (search: string) => {
      const params = new URLSearchParams(window.location.search);
      const trimmed = search.trim();
      if (trimmed) {
        params.set('search', trimmed);
        params.set('page', '1');
      } else {
        params.delete('search');
        params.delete('page');
      }
      const query = params.toString();
      router.push(query ? `${pathname}?${query}` : pathname);
    },
    [pathname, router]
  );

  useEffect(() => {
    if (value === defaultValue) return;
    const t = setTimeout(() => applySearch(value), DEBOUNCE_MS);
    return () => clearTimeout(t);
  }, [value, defaultValue, applySearch]);

  return (
    <input
      type="search"
      value={value}
      onChange={(e) => setValue(e.target.value)}
      placeholder={placeholder}
      aria-label="Buscar clientes"
      className="w-full rounded border border-border-hover bg-bg-surface px-3 py-2 text-sm text-text-primary placeholder-text-muted transition-colors focus:border-blue focus:outline-none focus-visible:ring-1 focus-visible:ring-blue sm:max-w-xs hover:border-border-hover"
    />
  );
}
