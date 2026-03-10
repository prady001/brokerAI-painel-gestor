'use client';

import { useEffect } from 'react';
import { ErrorFeedback } from '@/components/error-feedback';

interface DashboardErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function DashboardError({ error, reset }: DashboardErrorProps) {
  useEffect(() => {
    console.error('Dashboard error:', error);
  }, [error]);

  return (
    <ErrorFeedback
      title="Erro ao carregar o dashboard"
      description="Não foi possível carregar os dados do resumo. Verifique se os dados estão disponíveis e tente novamente."
      onRetry={reset}
    />
  );
}
