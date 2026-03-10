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

function ConversationRow({ item }: { item: ActiveConversation }) {
  return (
    <li className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-gray-200 bg-white px-4 py-3 shadow-sm">
      <span className="font-mono text-sm text-gray-900">
        {formatPhone(item.phone)}
      </span>
      <div className="flex items-center gap-4 text-sm text-gray-500">
        <span>Última atualização: {formatLastUpdated(item.last_updated_at)}</span>
        <span className="rounded bg-gray-100 px-2 py-0.5 font-medium text-gray-700">
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
      <h1 className="text-2xl font-semibold text-gray-900">Status do agente</h1>
      <p className="mt-1 text-gray-500">
        Conversas ativas no assistente (sinistros e onboardings).
      </p>

      <div className="mt-6 flex items-center gap-2 rounded-lg border border-blue-200 bg-blue-50 px-4 py-2 text-sm text-blue-800">
        <span className="font-medium">Total ativo:</span>
        <span>{data.total_active} conversa(s)</span>
      </div>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-medium text-gray-900">
          Conversas de sinistro ativas
        </h2>
        {data.active_claims.length === 0 ? (
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            Nenhuma conversa de sinistro ativa no momento.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.active_claims.map((item) => (
              <ConversationRow key={item.phone} item={item} />
            ))}
          </ul>
        )}
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-medium text-gray-900">
          Onboardings em andamento
        </h2>
        {data.active_onboardings.length === 0 ? (
          <p className="rounded-lg border border-gray-200 bg-gray-50 px-4 py-6 text-center text-sm text-gray-500">
            Nenhum onboarding em andamento no momento.
          </p>
        ) : (
          <ul className="space-y-2">
            {data.active_onboardings.map((item) => (
              <ConversationRow key={item.phone} item={item} />
            ))}
          </ul>
        )}
      </section>
    </main>
  );
}
