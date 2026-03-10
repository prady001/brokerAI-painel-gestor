'use client';

interface ErrorFeedbackProps {
  title: string;
  description: string;
  retryLabel?: string;
  onRetry: () => void;
}

function ErrorIcon() {
  return (
    <svg
      className="mx-auto h-10 w-10 text-red-500"
      fill="none"
      viewBox="0 0 24 24"
      stroke="currentColor"
      strokeWidth={1.5}
      aria-hidden
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
      />
    </svg>
  );
}

export function ErrorFeedback({
  title,
  description,
  retryLabel = 'Tentar novamente',
  onRetry,
}: ErrorFeedbackProps) {
  return (
    <main className="flex min-h-[40vh] flex-col items-center justify-center p-6">
      <div className="w-full max-w-md rounded-xl border border-red-200 bg-red-50/80 p-8 text-center shadow-sm">
        <ErrorIcon />
        <h2 className="mt-4 text-lg font-semibold text-red-800">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-red-700">{description}</p>
        <p className="mt-1 text-xs text-red-600/90">
          Se o problema persistir, verifique sua conexão ou tente mais tarde.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex items-center justify-center rounded-lg bg-red-600 px-4 py-2.5 text-sm font-medium text-white shadow-sm transition-colors hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 active:bg-red-800"
        >
          {retryLabel}
        </button>
      </div>
    </main>
  );
}
