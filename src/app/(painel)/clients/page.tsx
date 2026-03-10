import { api } from '@/lib/api';
import { ClientTable } from '@/components/client-table';
import { SearchInput } from '@/components/search-input';
import { Pagination } from '@/components/pagination';

const PAGE_SIZE = 50;

interface ClientsPageProps {
  searchParams: { search?: string; page?: string };
}

export default async function ClientsPage({ searchParams }: ClientsPageProps) {
  const search = searchParams.search ?? '';
  const page = Math.max(1, parseInt(searchParams.page ?? '1', 10) || 1);
  const skip = (page - 1) * PAGE_SIZE;

  const raw = await api.clients({
    skip,
    limit: PAGE_SIZE + 1,
    search: search || undefined,
  });
  const hasNext = raw.length > PAGE_SIZE;
  const clients = raw.slice(0, PAGE_SIZE);

  return (
    <main className="p-6">
      <h1 className="text-2xl font-semibold text-text-primary">Clientes</h1>
      <p className="mt-1 text-text-secondary">
        Lista de clientes com busca e paginação.
      </p>

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <SearchInput defaultValue={search} />
      </div>

      <div className="mt-4">
        <ClientTable clients={clients} />
      </div>

      <div className="mt-4">
        <Pagination
          currentPage={page}
          hasNext={hasNext}
          search={search || undefined}
        />
      </div>
    </main>
  );
}
