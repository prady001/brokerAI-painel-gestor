import type { ReactNode } from 'react';

interface EmptyStateProps {
  title: string;
  description: string;
  icon?: ReactNode;
  action?: ReactNode;
}

function DefaultIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="48"
      height="48"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      className="text-text-muted"
      aria-hidden
    >
      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
      <polyline points="9 22 9 12 15 12 15 22" />
    </svg>
  );
}

export function EmptyState({
  title,
  description,
  icon,
  action,
}: EmptyStateProps) {
  return (
    <div className="card-hover-glow flex flex-col items-center justify-center rounded-lg border border-border bg-bg-card px-6 py-12 text-center shadow-card-glow">
      <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-white/5 text-text-muted">
        {icon ?? <DefaultIcon />}
      </div>
      <h3 className="text-base font-semibold text-text-primary">{title}</h3>
      <p className="mt-1 max-w-sm text-sm text-text-secondary">{description}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}
