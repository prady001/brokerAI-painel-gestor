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
      className="w-full rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-gray-900 placeholder-gray-500 transition-colors focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500 sm:max-w-xs hover:border-gray-400"
    />
  );
}
