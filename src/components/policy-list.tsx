import type { PolicyResponse } from '@/lib/types';
import { EmptyState } from '@/components/empty-state';

const POLICY_TYPE_LABELS: Record<NonNullable<PolicyResponse['type']>, string> = {
  auto: 'Automóvel',
  life: 'Vida',
  home: 'Residencial',
  travel: 'Viagem',
  business: 'Empresarial',
};

const POLICY_STATUS_STYLES: Record<PolicyResponse['status'], string> = {
  active: 'bg-green/20 text-green',
  expired: 'bg-amber-500/20 text-amber-400',
  cancelled: 'bg-white/10 text-text-muted',
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
      <EmptyState
        title="Nenhuma apólice cadastrada"
        description="Este cliente ainda não possui apólices vinculadas."
      />
    );
  }

  return (
    <div className="card-hover-glow overflow-hidden rounded-lg border border-border bg-bg-card shadow-card-glow">
      <table className="min-w-full">
        <thead>
          <tr>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Número
            </th>
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
              Vigência
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Status
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-right text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Prêmio
            </th>
          </tr>
        </thead>
        <tbody>
          {policies.map((policy) => (
            <tr
              key={policy.id}
              className="border-b border-border transition-colors duration-200 ease-out hover:bg-white/[0.03]"
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium text-text-primary font-mono">
                {policy.policy_number}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {policy.type ? POLICY_TYPE_LABELS[policy.type] : '—'}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {formatDate(policy.start_date)} a {formatDate(policy.end_date)}
              </td>
              <td className="whitespace-nowrap px-4 py-3">
                <span
                  className={`inline-flex rounded-full px-2.5 py-0.5 text-xs font-medium ${POLICY_STATUS_STYLES[policy.status]}`}
                >
                  {POLICY_STATUS_LABELS[policy.status]}
                </span>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-text-secondary tabular-nums font-mono">
                {formatPremium(policy.premium_amount)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
