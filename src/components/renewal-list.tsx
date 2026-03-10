import type { RenewalResponse } from '@/lib/types';

const RENEWAL_STATUS_STYLES: Record<RenewalResponse['status'], string> = {
  pending: 'bg-slate-100 text-slate-700',
  contacted: 'bg-blue-100 text-blue-800',
  confirmed: 'bg-emerald-100 text-emerald-800',
  refused: 'bg-red-100 text-red-800',
  no_response: 'bg-amber-100 text-amber-800',
  lost: 'bg-gray-100 text-gray-600',
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
      <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-500">
        Nenhuma renovação cadastrada.
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
              Vencimento
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
              Intenção
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Último contato
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Contatos
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {renewals.map((renewal) => (
            <tr key={renewal.id}>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-900">
                {formatDate(renewal.expiry_date)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${RENEWAL_STATUS_STYLES[renewal.status]}`}
                >
                  {RENEWAL_STATUS_LABELS[renewal.status]}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {renewal.client_intent
                  ? INTENT_LABELS[renewal.client_intent] ?? renewal.client_intent
                  : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {formatDate(renewal.last_contact_at)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600 tabular-nums">
                {renewal.contact_count}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
