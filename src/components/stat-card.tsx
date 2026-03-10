import type { ReactNode } from 'react';

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
}

export function StatCard({ title, value, icon }: StatCardProps) {
  return (
    <div className="group rounded-lg border border-border bg-bg-card p-5 shadow-card-glow transition-[border-color,box-shadow] duration-200 ease-out hover:border-border-hover hover:shadow-card-glow">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <p className="mt-1 font-mono text-2xl font-semibold tabular-nums text-text-primary">
            {value}
          </p>
        </div>
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-text-secondary transition-colors duration-200 ease-out group-hover:bg-white/10 group-hover:text-text-primary">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}
