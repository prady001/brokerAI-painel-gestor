import type { RenewalResponse } from '@/lib/types';

const RENEWAL_STATUS_STYLES: Record<RenewalResponse['status'], string> = {
  pending: 'bg-white/10 text-text-secondary',
  contacted: 'bg-blue/20 text-blue-light',
  confirmed: 'bg-green/20 text-green',
  refused: 'bg-red-500/20 text-red-400',
  no_response: 'bg-amber-500/20 text-amber-400',
  lost: 'bg-white/10 text-text-muted',
};

const RENEWAL_STATUS_LABELS: Record<RenewalResponse['status'], string> = {
  pending: 'Pendente',
  contacted: 'Contatado',
  confirmed: 'Confirmado',
  refused: 'Recusado',
  no_response: 'Sem resposta',
  lost: 'Perdido',
};

const INTENT_LABELS: Record<string, string> = {
  wants_renewal: 'Quer renovar',
  refused: 'Não quer renovar',
  wants_quote: 'Quer cotação',
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

interface RenewalListProps {
  renewals: RenewalResponse[];
}

export function RenewalList({ renewals }: RenewalListProps) {
  if (renewals.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-bg-card px-4 py-6 text-center text-text-secondary">
        Nenhuma renovação cadastrada.
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
              Vencimento
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
              Intenção
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Último contato
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Contatos
            </th>
          </tr>
        </thead>
        <tbody>
          {renewals.map((renewal) => (
            <tr
              key={renewal.id}
              className="border-b border-border transition-colors duration-150 ease-out hover:bg-white/5"
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-primary font-mono">
                {formatDate(renewal.expiry_date)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${RENEWAL_STATUS_STYLES[renewal.status]}`}
                >
                  {RENEWAL_STATUS_LABELS[renewal.status]}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {renewal.client_intent
                  ? INTENT_LABELS[renewal.client_intent] ?? renewal.client_intent
                  : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {formatDate(renewal.last_contact_at)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-text-secondary tabular-nums font-mono">
                {renewal.contact_count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
