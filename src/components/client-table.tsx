import Link from 'next/link';
import type { ClientResponse } from '@/lib/types';
import { maskCpf } from '@/lib/mask-cpf';

function formatDate(iso: string): string {
  try {
    const d = new Date(iso);
    return d.toLocaleDateString('pt-BR', {
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

interface ClientTableProps {
  clients: ClientResponse[];
}

export function ClientTable({ clients }: ClientTableProps) {
  if (clients.length === 0) {
    return (
      <p className="rounded-lg border border-border bg-bg-card px-4 py-8 text-center text-text-secondary">
        Nenhum cliente encontrado.
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
              Nome
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              CPF
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Telefone
            </th>
            <th
              scope="col"
              className="px-4 py-3 text-left text-xs font-medium uppercase tracking-wider text-text-muted"
            >
              Data de cadastro
            </th>
          </tr>
        </thead>
        <tbody>
          {clients.map((client) => (
            <tr
              key={client.id}
              className="border-b border-border transition-colors duration-150 ease-out hover:bg-white/5"
            >
              <td className="whitespace-nowrap px-4 py-3 text-sm font-medium">
                <Link
                  href={`/clients/${client.id}`}
                  className="text-blue-light transition-colors hover:underline focus:outline-none focus:ring-2 focus:ring-blue focus:ring-offset-2 focus:ring-offset-bg-deep rounded"
                >
                  {client.full_name}
                </Link>
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary font-mono">
                {maskCpf(client.cpf_cnpj)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {formatPhone(client.phone_whatsapp)}
              </td>
              <td className="whitespace-nowrap px-4 py-3 text-sm text-text-secondary">
                {formatDate(client.created_at)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
