export default function AgentStatusLoading() {
  return (
    <main className="p-6">
      <div className="h-8 w-56 animate-pulse rounded bg-gray-200" />
      <div className="mt-2 h-4 w-80 animate-pulse rounded bg-gray-100" />

      <div className="mt-6 h-12 w-48 animate-pulse rounded-lg bg-blue-100" />

      <section className="mt-8">
        <div className="mb-3 h-5 w-64 animate-pulse rounded bg-gray-200" />
        <ul className="space-y-2">
          {[1, 2].map((i) => (
            <li
              key={i}
              className="h-14 animate-pulse rounded-lg border border-gray-200 bg-gray-50"
            />
          ))}
        </ul>
      </section>

      <section className="mt-8">
        <div className="mb-3 h-5 w-56 animate-pulse rounded bg-gray-200" />
        <ul className="space-y-2">
          {[1, 2, 3].map((i) => (
            <li
              key={i}
              className="h-14 animate-pulse rounded-lg border border-gray-200 bg-gray-50"
            />
          ))}
        </ul>
      </section>
    </main>
  );
}
