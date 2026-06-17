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
      className={`${isInView ? 'animate-fade-in-up' : 'opacity-0'} ${
        className ?? ''
      }`}
      style={{
        animationDelay: isInView
          ? `${Math.min(index * 0.15, 0.6)}s`
          : undefined,
      }}
    >
      {children}
    </div>
  );
}
