interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded bg-[length:200%_100%] bg-[linear-gradient(90deg,rgba(255,255,255,0.03)_0%,rgba(255,255,255,0.08)_50%,rgba(255,255,255,0.03)_100%)] ${className}`}
      aria-hidden
    />
  );
}
