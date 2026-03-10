import { Skeleton } from '@/components/skeleton';

export default function ClientDetailLoading() {
  return (
    <main className="p-6">
      <Skeleton className="mb-4 h-4 w-48" />

      <div className="rounded-lg border border-border bg-bg-card p-6 shadow-card-glow">
        <Skeleton className="h-8 w-56" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <Skeleton className="h-3 w-20" />
              <Skeleton className="mt-1 h-4 w-32" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="mb-3 h-5 w-24" />
        <div className="overflow-hidden rounded-lg border border-border bg-bg-card">
          <div className="border-b border-border bg-white/5 px-4 py-3">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <Skeleton key={i} className="h-4 w-20" />
              ))}
            </div>
          </div>
          <div className="divide-y divide-border">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 px-4 py-3">
                <Skeleton className="h-4 w-24" />
                <Skeleton className="h-4 w-20" />
                <Skeleton className="h-4 w-32" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <Skeleton className="mb-3 h-5 w-28" />
        <Skeleton className="h-32 rounded-lg" />
      </div>

      <div className="mt-8">
        <Skeleton className="mb-3 h-5 w-24" />
        <Skeleton className="h-32 rounded-lg" />
      </div>
    </main>
  );
}
