'use client';

import { useEffect } from 'react';
import { ErrorFeedback } from '@/components/error-feedback';

interface ClientsErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ClientsError({ error, reset }: ClientsErrorProps) {
  useEffect(() => {
    console.error('Clients error:', error);
  }, [error]);

  return (
    <ErrorFeedback
      title="Erro ao carregar clientes"
      description="Não foi possível carregar a lista de clientes. Tente novamente."
      onRetry={reset}
    />
  );
}
