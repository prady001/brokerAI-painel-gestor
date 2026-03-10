import type { ClaimResponse } from '@/lib/types';

const CLAIM_STATUS_STYLES: Record<ClaimResponse['status'], string> = {
  open: 'bg-blue-100 text-blue-800',
  in_progress: 'bg-amber-100 text-amber-800',
  waiting_insurer: 'bg-purple-100 text-purple-800',
  escalated: 'bg-orange-100 text-orange-800',
  closed: 'bg-gray-100 text-gray-700',
};

const CLAIM_STATUS_LABELS: Record<ClaimResponse['status'], string> = {
  open: 'Aberto',
  in_progress: 'Em andamento',
  waiting_insurer: 'Aguardando seguradora',
  escalated: 'Escalado',
  closed: 'Encerrado',
};

const SEVERITY_STYLES: Record<NonNullable<ClaimResponse['severity']>, string> = {
  simple: 'bg-slate-100 text-slate-700',
  grave: 'bg-red-100 text-red-800',
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
      <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-500">
        Nenhum sinistro registrado.
      </p>
    );
  }

  return (
    <div className="overflow-hidden rounded-lg border border-gray-200 bg-white shadow-sm">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Tipo
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Severidade
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Ocorrência
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Abertura
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {claims.map((claim) => (
            <tr
              key={claim.id}
              className="transition-colors duration-150 hover:bg-gray-50"
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
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
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {formatDate(claim.occurrence_date)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {formatDate(claim.opened_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
