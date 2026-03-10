export default function ClientsLoading() {
  return (
    <main className="p-6">
      <div className="h-8 w-32 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-4 w-64 animate-pulse rounded bg-gray-100" />

      <div className="mt-6 flex flex-col gap-4 sm:flex-row sm:items-center">
        <div className="h-10 w-full max-w-xs animate-pulse rounded-md bg-gray-200" />
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-gray-200 bg-white">
        <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
          <div className="flex gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="h-4 w-24 animate-pulse rounded bg-gray-200"
              />
            ))}
          </div>
        </div>
        <div className="divide-y divide-gray-100">
          {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="flex gap-4 px-4 py-3">
              <div className="h-4 w-40 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-28 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
              <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-4 flex items-center justify-between border-t border-gray-200 pt-4">
        <div className="h-10 w-24 animate-pulse rounded-md bg-gray-100" />
        <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
        <div className="h-10 w-20 animate-pulse rounded-md bg-gray-100" />
      </div>
    </main>
  );
}
