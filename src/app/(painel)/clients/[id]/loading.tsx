export default function ClientDetailLoading() {
  return (
    <main className="p-6">
      <div className="mb-4 h-4 w-48 animate-pulse rounded bg-gray-200" />

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
        <div className="mt-4 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i}>
              <div className="h-3 w-20 animate-pulse rounded bg-gray-100" />
              <div className="mt-1 h-4 w-32 animate-pulse rounded bg-gray-200" />
            </div>
          ))}
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 h-5 w-24 animate-pulse rounded bg-gray-200" />
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <div className="border-b border-gray-200 bg-gray-50 px-4 py-3">
            <div className="flex gap-4">
              {[1, 2, 3, 4, 5].map((i) => (
                <div
                  key={i}
                  className="h-4 w-20 animate-pulse rounded bg-gray-200"
                />
              ))}
            </div>
          </div>
          <div className="divide-y divide-gray-100">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-4 px-4 py-3">
                <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-20 animate-pulse rounded bg-gray-100" />
                <div className="h-4 w-32 animate-pulse rounded bg-gray-100" />
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-8">
        <div className="mb-3 h-5 w-28 animate-pulse rounded bg-gray-200" />
        <div className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
      </div>

      <div className="mt-8">
        <div className="mb-3 h-5 w-24 animate-pulse rounded bg-gray-200" />
        <div className="h-32 animate-pulse rounded-lg border border-gray-200 bg-gray-50" />
      </div>
    </main>
  );
}
