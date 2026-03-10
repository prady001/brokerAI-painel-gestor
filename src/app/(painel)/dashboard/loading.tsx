import { Skeleton } from '@/components/skeleton';

export default function DashboardLoading() {
  return (
    <main className="p-6">
      <Skeleton className="h-8 w-48" />
      <Skeleton className="mt-2 h-4 w-72" />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-border bg-bg-card p-5 shadow-card-glow"
          >
            <Skeleton className="h-4 w-24" />
            <Skeleton className="mt-3 h-8 w-20" />
          </div>
        ))}
      </section>

      <section className="mt-8 max-w-md">
        <div className="rounded-lg border border-border bg-bg-card p-5 shadow-card-glow">
          <Skeleton className="mb-3 h-4 w-48" />
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li key={i}>
                <Skeleton className="h-10 w-full" />
              </li>
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
