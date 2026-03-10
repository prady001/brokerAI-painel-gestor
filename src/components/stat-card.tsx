import type { ReactNode } from 'react';

interface StatCardVariation {
  value: string;
  direction: 'up' | 'down';
}

interface StatCardProps {
  title: string;
  value: string | number;
  icon?: ReactNode;
  barPercent?: number;
  variation?: StatCardVariation;
  valueGradient?: boolean;
}

export function StatCard({
  title,
  value,
  icon,
  barPercent,
  variation,
  valueGradient = false,
}: StatCardProps) {
  const valueClass = valueGradient
    ? 'mt-1 font-mono text-2xl font-extrabold tabular-nums gradient-text'
    : 'mt-1 font-mono text-2xl font-extrabold tabular-nums text-text-primary';

  return (
    <div className="card-hover-glow group rounded-lg border border-border bg-bg-card p-5 shadow-card-glow">
      <div className="flex items-start justify-between">
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-text-muted">{title}</p>
          <div className="mt-1 flex flex-wrap items-baseline gap-2">
            <p className={valueClass}>{value}</p>
            {variation && (
              <span
                className={
                  variation.direction === 'up' ? 'dash-kpi-up' : 'dash-kpi-down'
                }
              >
                {variation.value}
              </span>
            )}
          </div>
        </div>
        {icon && (
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-white/5 text-text-secondary transition-colors duration-200 ease-out group-hover:bg-white/10 group-hover:text-text-primary">
            {icon}
          </div>
        )}
      </div>
      {typeof barPercent === 'number' && barPercent >= 0 && (
        <div className="dash-kpi-bar mt-3" role="progressbar" aria-valuenow={barPercent} aria-valuemin={0} aria-valuemax={100}>
          <div
            className="dash-kpi-fill"
            style={{ width: `${Math.min(100, Math.max(0, barPercent))}%` }}
          />
        </div>
      )}
    </div>
  );
}
