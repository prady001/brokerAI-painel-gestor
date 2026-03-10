'use client';

import { useEffect } from 'react';
import { ErrorFeedback } from '@/components/error-feedback';

interface ClientDetailErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ClientDetailError({
  error,
  reset,
}: ClientDetailErrorProps) {
  useEffect(() => {
    console.error('Client detail error:', error);
  }, [error]);

  return (
    <ErrorFeedback
      title="Erro ao carregar o cliente"
      description="Não foi possível carregar os dados deste cliente. Tente novamente."
      onRetry={reset}
    />
  );
}
