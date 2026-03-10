interface PageHeaderProps {
  tag?: string;
  title: string;
  titleGradient?: boolean;
  subtitle?: string;
}

export function PageHeader({
  tag,
  title,
  titleGradient = false,
  subtitle,
}: PageHeaderProps) {
  return (
    <header className="mb-6">
      {tag && <span className="section-tag block">{tag}</span>}
      <h1
        className={`section-title ${titleGradient ? 'gradient-text' : ''}`}
      >
        {title}
      </h1>
      {subtitle && <p className="section-subtitle mt-2">{subtitle}</p>}
    </header>
  );
}
