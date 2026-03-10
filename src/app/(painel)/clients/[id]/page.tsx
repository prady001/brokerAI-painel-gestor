import Link from 'next/link';
import { notFound } from 'next/navigation';
import { api } from '@/lib/api';
import { PolicyList } from '@/components/policy-list';
import { ClaimList } from '@/components/claim-list';
import { RenewalList } from '@/components/renewal-list';

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

function formatPhone(phone: string | null): string {
  if (!phone) return '—';
  const d = phone.replace(/\D/g, '');
  if (d.length >= 10) {
    return `(${d.slice(0, 2)}) ${d.slice(2, 6)}-${d.slice(6)}`;
  }
  return phone;
}

interface ClientDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ClientDetailPage({ params }: ClientDetailPageProps) {
  const { id } = await params;
  const client = await api.clientFull(id);

  if (!client) {
    notFound();
  }

  return (
    <main className="p-6">
      <nav className="mb-4 text-sm text-text-secondary">
        <Link
          href="/clients"
          className="transition-colors hover:text-text-primary focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-bg-deep rounded"
        >
          Clientes
        </Link>
        <span className="mx-2 text-text-muted">/</span>
        <span className="text-text-primary">{client.full_name}</span>
      </nav>

      <section className="rounded-lg border border-border bg-bg-card p-6 shadow-card-glow">
        <h1 className="text-2xl font-semibold text-text-primary">{client.full_name}</h1>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
              CPF/CNPJ
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-text-primary">
              {client.cpf_cnpj ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Telefone
            </dt>
            <dd className="mt-0.5 text-sm text-text-primary">
              {formatPhone(client.phone_whatsapp)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
              E-mail
            </dt>
            <dd className="mt-0.5 text-sm text-text-primary">
              {client.email ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Data de nascimento
            </dt>
            <dd className="mt-0.5 text-sm text-text-primary">
              {formatDate(client.birth_date)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-text-muted">
              Cadastrado em
            </dt>
            <dd className="mt-0.5 text-sm text-text-primary">
              {formatDate(client.created_at)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Apólices</h2>
        <PolicyList policies={client.policies} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Sinistros</h2>
        <ClaimList claims={client.claims} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-text-primary">Renovações</h2>
        <RenewalList renewals={client.renewals} />
      </section>
    </main>
  );
}
