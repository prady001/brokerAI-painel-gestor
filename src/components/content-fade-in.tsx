'use client';

import type { ReactNode } from 'react';
import { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';

interface ContentFadeInProps {
  children: ReactNode;
  className?: string;
}

function FadeInInner({ children, className = '' }: ContentFadeInProps) {
  const [visible, setVisible] = useState(false);
  const [reduceMotion, setReduceMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    setReduceMotion(mq.matches);
    const handler = () => setReduceMotion(mq.matches);
    mq.addEventListener('change', handler);
    return () => mq.removeEventListener('change', handler);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setVisible(true);
    });
    return () => cancelAnimationFrame(id);
  }, []);

  const showInstantly = reduceMotion;
  const opacity = showInstantly ? 1 : visible ? 1 : 0;

  return (
    <div
      className={showInstantly ? className : `transition-opacity duration-200 ease-out ${className}`}
      style={{ opacity }}
    >
      {children}
    </div>
  );
}

export function ContentFadeIn({ children, className = '' }: ContentFadeInProps) {
  const pathname = usePathname();
  return (
    <FadeInInner key={pathname} className={className}>
      {children}
    </FadeInInner>
  );
}
