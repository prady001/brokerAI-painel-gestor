import type { PolicyResponse } from '@/lib/types';

const POLICY_TYPE_LABELS: Record<NonNullable<PolicyResponse['type']>, string> = {
  auto: 'Automóvel',
  life: 'Vida',
  home: 'Residencial',
  travel: 'Viagem',
  business: 'Empresarial',
};

const POLICY_STATUS_STYLES: Record<PolicyResponse['status'], string> = {
  active: 'bg-emerald-100 text-emerald-800',
  expired: 'bg-amber-100 text-amber-800',
  cancelled: 'bg-gray-100 text-gray-700',
};

const POLICY_STATUS_LABELS: Record<PolicyResponse['status'], string> = {
  active: 'Ativa',
  expired: 'Vencida',
  cancelled: 'Cancelada',
};

function formatDate(date: string | null): string {
  if (!date) return '—';
  try {
    return new Date(date).toLocaleDateString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    });
  } catch {
    return '—';
  }
}

function formatPremium(amount: string | null): string {
  if (!amount) return '—';
  const value = parseFloat(amount);
  if (Number.isNaN(value)) return '—';
  return value.toLocaleString('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  });
}

interface PolicyListProps {
  policies: PolicyResponse[];
}

export function PolicyList({ policies }: PolicyListProps) {
  if (policies.length === 0) {
    return (
      <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-gray-500">
        Nenhuma apólice cadastrada.
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
              Número
            </th>
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
              Vigência
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-gray-500"
            >
              Prêmio
            </th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200 bg-white">
          {policies.map((policy) => (
            <tr
              key={policy.id}
              className="transition-colors duration-150 hover:bg-gray-50"
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-gray-900 font-mono">
                {policy.policy_number}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {policy.type ? POLICY_TYPE_LABELS[policy.type] : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-gray-600">
                {formatDate(policy.start_date)} a {formatDate(policy.end_date)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${POLICY_STATUS_STYLES[policy.status]}`}
                >
                  {POLICY_STATUS_LABELS[policy.status]}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-gray-600 tabular-nums">
                {formatPremium(policy.premium_amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
