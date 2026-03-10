import { Skeleton } from '@/components/skeleton';

export default function AgentStatusLoading() {
  return (
    <main className="p-6">
      <Skeleton className="h-8 w-56" />
      <Skeleton className="mt-2 h-4 w-80" />

      <Skeleton className="mt-6 h-12 w-48 rounded-lg" />

      <section className="mt-8">
        <Skeleton className="mb-3 h-5 w-64" />
        <ul className="space-y-2">
          {[1, 2].map((i) => (
            <li key={i}>
              <Skeleton className="h-14 rounded-lg" />
            </li>
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <Skeleton className="mb-3 h-5 w-56" />
        <ul className="space-y-2">
          {[1, 2, 3].map((i) => (
            <li key={i}>
              <Skeleton className="h-14 rounded-lg" />
            </li>
          ))}
        </ul>
      </section>
    </main>
  );
}
