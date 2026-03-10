import { api } from '@/lib/api';
import { ClientTable } from '@/components/client-table';
import { PageHeader } from '@/components/page-header';
import { Pagination } from '@/components/pagination';
import { Reveal } from '@/components/reveal';
import { SearchInput } from '@/components/search-input';

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
      <PageHeader
        tag="Sua carteira"
        title="Clientes"
        titleGradient
        subtitle="Lista de clientes com busca e paginação."
      />

      <Reveal variant="reveal" delay={0}>
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <SearchInput defaultValue={search} />
        </div>
      </Reveal>

      <Reveal variant="reveal" delay={100} className="mt-4">
        <ClientTable clients={clients} />
      </Reveal>

      <Reveal variant="reveal" delay={150} className="mt-4">
        <Pagination
          currentPage={page}
          hasNext={hasNext}
          search={search || undefined}
        />
      </Reveal>
    </main>
  );
}
