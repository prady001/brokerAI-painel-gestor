interface ExpiryItem {
  label: string;
  count: number;
  variant: 'danger' | 'warning' | 'success';
}

interface ExpiryAlertProps {
  expiring30d: number;
  expiring60d: number;
  expiring90d: number;
}

const variantStyles = {
  danger:
    'bg-red-500/10 text-red-400 border border-red-500/30',
  warning:
    'bg-amber-500/10 text-amber-400 border border-amber-500/30',
  success:
    'bg-green-500/10 text-green-400 border border-green-500/30',
};

const variantLabelStyles = {
  danger: 'text-red-400',
  warning: 'text-amber-400',
  success: 'text-green-400',
};

function ExpiryRow({ label, count, variant }: ExpiryItem) {
  return (
    <div
      className={`flex items-center justify-between rounded-lg border px-3 py-2.5 transition-opacity duration-150 hover:opacity-90 ${variantStyles[variant]}`}
    >
      <span className={`font-medium ${variantLabelStyles[variant]}`}>
        {label}
      </span>
      <span className="font-mono tabular-nums font-semibold text-text-primary">
        {count}
      </span>
    </div>
  );
}

export function ExpiryAlert({
  expiring30d,
  expiring60d,
  expiring90d,
}: ExpiryAlertProps) {
  const items: ExpiryItem[] = [
    { label: 'Vencem em até 30 dias', count: expiring30d, variant: 'danger' },
    { label: 'Vencem em 31–60 dias', count: expiring60d, variant: 'warning' },
    { label: 'Vencem em 61–90 dias', count: expiring90d, variant: 'success' },
  ];

  return (
    <div className="rounded-lg border border-border bg-bg-card p-5 shadow-card-glow">
      <h2 className="mb-3 text-sm font-semibold text-text-primary">
        Apólices por faixa de vencimento
      </h2>
      <ul className="space-y-2">
        {items.map((item) => (
          <li key={item.label}>
            <ExpiryRow {...item} />
          </li>
        ))}
      </ul>
    </div>
  );
}
