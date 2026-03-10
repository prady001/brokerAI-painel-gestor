import { api } from '@/lib/api';
import { formatTtl } from '@/lib/format-ttl';
import type { ActiveConversation } from '@/lib/types';

function formatLastUpdated(iso: string): string {
  try {
    return new Date(iso).toLocaleString('pt-BR', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  } catch {
    return '—';
  }
}

function formatPhone(phone: string): string {
  const d = phone.replace(/\D/g, '');
  if (d.length >= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return phone;
}

type ConversationType = 'claim' | 'onboarding';

function ConversationRow({
  item,
  type,
}: {
  item: ActiveConversation;
  type: ConversationType;
}) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-bg-card px-4 py-3 shadow-card-glow transition-[border-color,box-shadow] duration-200 ease-out hover:border-border-hover">
      <span className="font-mono text-sm text-text-primary">
        {formatPhone(item.phone)}
      </span>
      <div className="flex flex-wrap items-center gap-3 text-sm text-text-secondary">
        <span>Última atualização: {formatLastUpdated(item.last_updated_at)}</span>
        <span
          className={`rounded px-2 py-0.5 font-medium ${
            type === 'claim'
              ? 'bg-amber-500/15 text-amber-400'
              : 'bg-cyan-500/15 text-cyan-400'
          }`}
        >
          {type === 'claim' ? 'Sinistro' : 'Onboarding'}
        </span>
        <span className="rounded bg-white/5 px-2 py-0.5 font-mono text-text-muted">
          TTL: {formatTtl(item.ttl_seconds)}
        </span>
      </div>
    </li>
  );
}

export default async function AgentStatusPage() {
  const data = await api.agentStatus();

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-text-primary">
        Status do agente
      </h1>
      <p className="mt-1 text-text-secondary">
        Conversas ativas no assistente (sinistros e onboardings).
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-border bg-blue-500/10 px-4 py-2 text-sm text-blue-light">
        <span className="font-medium">Total ativo:</span>
        <span>{data.total_active} conversa(s)</span>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-medium text-text-primary">
          Conversas de sinistro ativas
        </h2>
        {data.active_claims.length === 0 ? (
          <p className="rounded-lg border border-border bg-bg-card px-4 py-6 text-center text-sm text-text-muted">
            Nenhuma conversa de sinistro ativa no momento.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.active_claims.map((item) => (
              <ConversationRow key={item.phone} item={item} type="claim" />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-medium text-text-primary">
          Onboardings em andamento
        </h2>
        {data.active_onboardings.length === 0 ? (
          <p className="rounded-lg border border-border bg-bg-card px-4 py-6 text-center text-sm text-text-muted">
            Nenhum onboarding em andamento no momento.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.active_onboardings.map((item) => (
              <ConversationRow key={item.phone} item={item} type="onboarding" />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
