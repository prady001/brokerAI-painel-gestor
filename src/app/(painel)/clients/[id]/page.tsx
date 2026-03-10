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
      <nav className="mb-4 text-sm text-gray-500">
        <Link href="/clients" className="transition-colors hover:text-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 rounded">
          Clientes
        </Link>
        <span className="mx-2">/</span>
        <span className="text-gray-900">{client.full_name}</span>
      </nav>

      <section className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-gray-900">{client.full_name}</h1>
        <dl className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              CPF/CNPJ
            </dt>
            <dd className="mt-0.5 font-mono text-sm text-gray-900">
              {client.cpf_cnpj ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Telefone
            </dt>
            <dd className="mt-0.5 text-sm text-gray-900">
              {formatPhone(client.phone_whatsapp)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              E-mail
            </dt>
            <dd className="mt-0.5 text-sm text-gray-900">
              {client.email ?? '—'}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Data de nascimento
            </dt>
            <dd className="mt-0.5 text-sm text-gray-900">
              {formatDate(client.birth_date)}
            </dd>
          </div>
          <div>
            <dt className="text-xs font-medium uppercase tracking-wider text-gray-500">
              Cadastrado em
            </dt>
            <dd className="mt-0.5 text-sm text-gray-900">
              {formatDate(client.created_at)}
            </dd>
          </div>
        </dl>
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Apólices</h2>
        <PolicyList policies={client.policies} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Sinistros</h2>
        <ClaimList claims={client.claims} />
      </section>

      <section className="mt-8">
        <h2 className="mb-3 text-lg font-semibold text-gray-900">Renovações</h2>
        <RenewalList renewals={client.renewals} />
      </section>
    </main>
  );
}
