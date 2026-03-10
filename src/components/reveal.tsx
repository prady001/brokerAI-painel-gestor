'use client';

import type { ReactNode } from 'react';
import { useEffect, useRef } from 'react';

const REVEAL_VARIANTS = [
  'reveal',
  'reveal-left',
  'reveal-right',
  'reveal-scale',
  'reveal-blur',
] as const;

type RevealVariant = (typeof REVEAL_VARIANTS)[number];

interface RevealProps {
  variant?: RevealVariant;
  delay?: number;
  className?: string;
  children: ReactNode;
}

const REVEAL_OPTIONS: IntersectionObserverInit = {
  threshold: 0.08,
  rootMargin: '0px 0px -60px 0px',
};

export function Reveal({
  variant = 'reveal',
  delay = 0,
  className = '',
  children,
}: RevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    let timeoutId: ReturnType<typeof setTimeout> | null = null;

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (!entry.isIntersecting) continue;
          const target = entry.target as HTMLElement;
          const delayMs = parseInt(
            target.dataset.revealDelay ?? '0',
            10
          );
          timeoutId = setTimeout(() => {
            target.classList.add('visible');
            timeoutId = null;
          }, delayMs);
          observer.unobserve(target);
          break;
        }
      },
      REVEAL_OPTIONS
    );

    observer.observe(el);
    return () => {
      observer.disconnect();
      if (timeoutId !== null) clearTimeout(timeoutId);
    };
  }, []);

  return (
    <div
      ref={ref}
      className={`${variant} ${className}`.trim()}
      data-reveal-delay={delay}
    >
      {children}
    </div>
  );
}
