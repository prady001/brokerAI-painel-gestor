import type { ClaimResponse } from '@/lib/types';

const CLAIM_STATUS_STYLES: Record<ClaimResponse['status'], string> = {
  open: 'bg-blue/20 text-blue-light',
  in_progress: 'bg-amber-500/20 text-amber-400',
  waiting_insurer: 'bg-purple-500/20 text-purple-400',
  escalated: 'bg-orange-500/20 text-orange-400',
  closed: 'bg-white/10 text-text-muted',
};

const CLAIM_STATUS_LABELS: Record<ClaimResponse['status'], string> = {
  open: 'Aberto',
  in_progress: 'Em andamento',
  waiting_insurer: 'Aguardando seguradora',
  escalated: 'Escalado',
  closed: 'Encerrado',
};

const SEVERITY_STYLES: Record<NonNullable<ClaimResponse['severity']>, string> = {
  simple: 'bg-white/10 text-text-secondary',
  grave: 'bg-red-500/20 text-red-400',
};

const SEVERITY_LABELS: Record<NonNullable<ClaimResponse['severity']>, string> = {
  simple: 'Simples',
  grave: 'Grave',
};

function formatDate(iso: string | null): string {
  if (!iso) return '—';
  try {
    return new Date(iso).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

interface ClaimListProps {
  claims: ClaimResponse[];
}

export function ClaimList({ claims }: ClaimListProps) {
  if (claims.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-bg-card px-4 py-6 text-center text-text-secondary">
        Nenhum sinistro registrado.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-border bg-bg-card shadow-card-glow">
      <table className="min-w-full">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Tipo
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Severidade
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Ocorrência
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Abertura
            </th>
          </tr>
        </thead>
        <tbody>
          {claims.map((claim) => (
            <tr
              key={claim.id}
              className="border-b border-border transition-colors duration-150 ease-out hover:bg-white/5"
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-primary">
                {claim.type ?? '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                {claim.severity ? (
                  <span
                    className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${SEVERITY_STYLES[claim.severity]}`}
                  >
                    {SEVERITY_LABELS[claim.severity]}
                  </span>
                ) : (
                  '—'
                )}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${CLAIM_STATUS_STYLES[claim.status]}`}
                >
                  {CLAIM_STATUS_LABELS[claim.status]}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {formatDate(claim.occurrence_date)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {formatDate(claim.opened_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
