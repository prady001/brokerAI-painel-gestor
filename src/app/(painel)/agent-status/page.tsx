import { api } from '@/lib/api';
import { formatTtl } from '@/lib/format-ttl';
import type { ActiveConversation } from '@/lib/types';
import { EmptyState } from '@/components/empty-state';
import { PageHeader } from '@/components/page-header';
import { Reveal } from '@/components/reveal';

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
    <li className="card-hover-glow flex flex-wrap items-center justify-between gap-2 rounded-lg border border-border bg-bg-card px-4 py-3 shadow-card-glow">
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
      <PageHeader
        tag="Assistente"
        title="Status do agente"
        titleGradient
        subtitle="Conversas ativas no assistente (sinistros e onboardings)."
      />

      <Reveal variant="reveal">
        <div className="flex items-center gap-2 rounded-lg border border-border bg-blue-500/10 px-4 py-2 text-sm text-blue-light">
          {data.total_active > 0 && (
            <span className="badge-dot shrink-0" aria-hidden />
          )}
          <span className="font-medium">Total ativo:</span>
          <span>{data.total_active} conversa(s)</span>
        </div>
      </Reveal>

      <Reveal variant="reveal" delay={100} className="mt-8">
        <section>
          <h2 className="mb-3 text-lg font-medium text-text-primary">
            Conversas de sinistro ativas
          </h2>
        {data.active_claims.length === 0 ? (
          <EmptyState
            title="Nenhuma conversa de sinistro ativa"
            description="Quando houver conversas de sinistro em andamento, elas aparecerão aqui."
          />
        ) : (
          <ul className="space-y-2">
            {data.active_claims.map((item) => (
              <ConversationRow key={item.phone} item={item} type="claim" />
            ))}
          </ul>
        )}
        </section>
      </Reveal>

      <Reveal variant="reveal" delay={150} className="mt-8">
        <section>
          <h2 className="mb-3 text-lg font-medium text-text-primary">
            Onboardings em andamento
          </h2>
        {data.active_onboardings.length === 0 ? (
          <EmptyState
            title="Nenhum onboarding em andamento"
            description="Quando houver onboardings ativos, eles aparecerão aqui."
          />
        ) : (
          <ul className="space-y-2">
            {data.active_onboardings.map((item) => (
              <ConversationRow key={item.phone} item={item} type="onboarding" />
            ))}
          </ul>
        )}
        </section>
      </Reveal>
    </main>
  );
}
