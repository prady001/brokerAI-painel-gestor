'use client';

import { useEffect, useState } from 'react';

export function CursorGlow() {
  const [position, setPosition] = useState<{ x: number; y: number } | null>(null);
  const [active, setActive] = useState(false);

  useEffect(() => {
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const hoverNone = window.matchMedia('(hover: none)').matches;
    if (reducedMotion || hoverNone) return;

    let rafId: number | null = null;
    let pending = { x: 0, y: 0 };

    function handleMove(e: MouseEvent) {
      pending = { x: e.clientX, y: e.clientY };
      if (rafId === null) {
        rafId = requestAnimationFrame(() => {
          setPosition(pending);
          setActive(true);
          rafId = null;
        });
      }
    }

    document.addEventListener('mousemove', handleMove, { passive: true });
    return () => {
      document.removeEventListener('mousemove', handleMove);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, []);

  if (!active || position === null) return null;

  return (
    <div
      className="pointer-events-none fixed inset-0 z-[9998]"
      aria-hidden
      style={{
        background: `radial-gradient(
          circle  clamp(280px, 40vw, 480px) at ${position.x}px ${position.y}px,
          var(--gradient-glow) 0%,
          transparent 70%
        )`,
        opacity: 0.35,
      }}
    />
  );
}
