import Link from 'next/link';

export default function ClientNotFound() {
  return (
    <main className="flex min-h-[40vh] flex-col items-center justify-center p-6">
      <div className="max-w-md rounded-lg border border-amber-200 bg-amber-50 p-6 text-center">
        <h2 className="text-lg font-semibold text-amber-800">
          Cliente não encontrado
        </h2>
        <p className="mt-2 text-sm text-amber-700">
          O cliente solicitado não existe ou não está disponível.
        </p>
        <Link
          href="/clients"
          className="mt-4 inline-block rounded-md bg-amber-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-amber-700 active:bg-amber-800 focus:outline-none focus-visible:ring-2 focus-visible:ring-amber-500 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep"
        >
          Voltar para clientes
        </Link>
      </div>
    </main>
  );
}
