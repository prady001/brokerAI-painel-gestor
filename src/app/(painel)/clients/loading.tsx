import { Skeleton } from '@/components/skeleton';

export default function ClientsLoading() {
  return (
    <main className="p-6">
      <Skeleton className="h-8 w-32" />
      <Skeleton className="mt-2 h-4 w-64" />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <Skeleton className="h-10 w-full max-w-xs rounded-md" />
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <Skeleton key={i} className="h-4 w-24" />
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex gap-4 px-4 py-3">
              <Skeleton className="h-4 w-40" />
              <Skeleton className="h-4 w-28" />
              <Skeleton className="h-4 w-32" />
              <Skeleton className="h-4 w-24" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <Skeleton className="h-10 w-24 rounded-md" />
        <Skeleton className="h-4 w-20" />
        <Skeleton className="h-10 w-20 rounded-md" />
      </div>
    </main>
  );
}
