'use client';

import { useRef } from 'react';
import { useInView } from 'framer-motion';
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
}: FadeInItemProps) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, amount: 0.15 });

  return (
    <div
      ref={ref}
      className={`transition-all ${
        isInView ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-15'
      } ${className ?? ''}`}
      style={{
        transitionDuration: '1000ms',
        transitionDelay: `${Math.min(index * 0.15, 0.6) * 1000}ms`,
        transitionTimingFunction: 'cubic-bezier(0.25, 0.1, 0.25, 1)',
      }}
    >
      {children}
    </div>
  );
}
