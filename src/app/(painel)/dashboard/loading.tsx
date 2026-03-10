export default function DashboardLoading() {
  return (
    <main className="p-6">
      <div className="h-8 w-48 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-4 w-72 animate-pulse rounded bg-gray-100" />

      <section className="mt-6 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div
            key={i}
            className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm"
          >
            <div className="h-4 w-24 animate-pulse rounded bg-gray-200" />
            <div className="mt-3 h-8 w-16 animate-pulse rounded bg-gray-200" />
          </div>
        ))}
      </section>

      <section className="mt-8 max-w-md">
        <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
          <div className="mb-3 h-4 w-48 animate-pulse rounded bg-gray-200" />
          <ul className="space-y-2">
            {[1, 2, 3].map((i) => (
              <li
                key={i}
                className="h-10 animate-pulse rounded-md bg-gray-100"
              />
            ))}
          </ul>
        </div>
      </section>
    </main>
  );
}
