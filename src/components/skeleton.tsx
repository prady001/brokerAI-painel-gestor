interface SkeletonProps {
  className?: string;
}

export function Skeleton({ className = '' }: SkeletonProps) {
  return (
    <div
      className={`animate-shimmer rounded-md bg-[length:200%_100%] bg-[linear-gradient(90deg,#e5e7eb_0%,#f3f4f6_50%,#e5e7eb_100%)] ${className}`}
      aria-hidden
    />
  );
}
