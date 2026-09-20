'use client';

import { useEffect, useRef, useState, type CSSProperties } from 'react';
import { FadeInStaggerProps, FadeInItemProps } from '@/types';

// --- Fade In Stagger Container ---
export function FadeInStagger({ children, className }: FadeInStaggerProps) {
  return <div className={className}>{children}</div>;
}

// --- Fade In Item ---
export function FadeInItem({
  children,
  className,
  index = 0,
  eager = false,
}: FadeInItemProps) {
  const ref = useRef<HTMLDivElement>(null);
  const [isInView, setIsInView] = useState(false);
  const [hasPlayed, setHasPlayed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (eager) {
      if (
        typeof node.getAnimations === 'function' &&
        node.getAnimations().length === 0
      ) {
        setHasPlayed(true);
      }

      const onEnd = (e: Event) => {
        if (e.target === node) setHasPlayed(true);
      };
      node.addEventListener('animationend', onEnd);
      return () => node.removeEventListener('animationend', onEnd);
    }

    if (typeof IntersectionObserver === 'undefined') {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.15 }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager]);

  const state = eager
    ? hasPlayed
      ? ''
      : 'fade-in-eager'
    : isInView
      ? 'fade-in-visible'
      : 'fade-in-hidden';

  return (
    <div
      ref={ref}
      className={[state, className].filter(Boolean).join(' ') || undefined}
      style={
        { '--fade-delay': `${Math.min(index * 0.15, 0.6)}s` } as CSSProperties
      }
    >
      {children}
    </div>
  );
}
