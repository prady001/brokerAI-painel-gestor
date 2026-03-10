'use client';

import { useEffect } from 'react';

interface ClientsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ClientsError({ error, reset }: ClientsErrorProps) {
  useEffect(() => {
    console.error('Clients error:', error);
  }, [error]);

  return (
    <main className="flex min-h-[40vh] flex-col items-center justify-center p-6">
      <div className="max-w-md rounded-lg border border-red-200 bg-red-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-red-800">
          Erro ao carregar clientes
        </h2>
        <p className="mt-2 text-sm text-red-700">
          Não foi possível carregar a lista de clientes. Tente novamente.
        </p>
        <button
          type="button"
          onClick={reset}
          className="mt-4 rounded-md bg-red-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        >
          Tentar novamente
        </button>
      </div>
    </main>
  );
}
