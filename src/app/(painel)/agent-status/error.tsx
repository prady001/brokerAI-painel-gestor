'use client';

import { useEffect } from 'react';
import { ErrorFeedback } from '@/components/error-feedback';

interface AgentStatusErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function AgentStatusError({
  error,
  reset,
}: AgentStatusErrorProps) {
  useEffect(() => {
    console.error('Agent status error:', error);
  }, [error]);

  return (
    <ErrorFeedback
      title="Erro ao carregar o status do agente"
      description="Não foi possível carregar as conversas ativas (sinistros e onboardings). Tente novamente."
      onRetry={reset}
    />
  );
}
