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
      className="mx-auto h-10 w-10 text-red-400"
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
      <div className="w-full max-w-md rounded-xl border border-border bg-bg-card p-8 text-center shadow-card-glow transition-[border-color] duration-200 ease-out hover:border-border-hover">
        <ErrorIcon />
        <h2 className="mt-4 text-lg font-semibold text-text-primary">{title}</h2>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary">
          {description}
        </p>
        <p className="mt-1 text-xs text-text-muted">
          Se o problema persistir, verifique sua conexão ou tente mais tarde.
        </p>
        <button
          type="button"
          onClick={onRetry}
          className="mt-6 inline-flex w-full items-center justify-center rounded-lg bg-gradient-to-br from-blue to-cyan px-4 py-2.5 text-sm font-medium text-white shadow-btn-primary transition-[transform,box-shadow] duration-200 ease-out hover:-translate-y-0.5 hover:shadow-btn-primary-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-500/50 focus-visible:ring-offset-2 focus-visible:ring-offset-bg-deep active:translate-y-0 disabled:cursor-not-allowed disabled:opacity-60"
        >
          {retryLabel}
        </button>
      </div>
    </main>
  );
}
