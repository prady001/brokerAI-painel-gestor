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
  danger: 'bg-red-50 text-red-800 border-red-200',
  warning: 'bg-amber-50 text-amber-800 border-amber-200',
  success: 'bg-emerald-50 text-emerald-800 border-emerald-200',
};

const variantBadge = {
  danger: '🔴',
  warning: '🟡',
  success: '🟢',
};

function ExpiryRow({ label, count, variant }: ExpiryItem) {
  return (
    <div
      className={`flex items-center justify-between rounded-md border px-3 py-2 transition-opacity duration-150 hover:opacity-90 ${variantStyles[variant]}`}
    >
      <span className="flex items-center gap-2 font-medium">
        <span aria-hidden>{variantBadge[variant]}</span>
        {label}
      </span>
      <span className="tabular-nums font-semibold">{count}</span>
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
    <div className="rounded-lg border border-gray-200 bg-white p-5 shadow-sm">
      <h2 className="mb-3 text-sm font-semibold text-gray-700">
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
