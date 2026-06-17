'use client';

import { motion } from 'framer-motion';
import { useInView } from 'framer-motion';
import { useRef } from 'react';
import { FadeInStaggerProps, FadeInItemProps } from '@/types';

// --- Fade In Stagger Container ---
export function FadeInStagger({ children, className }: FadeInStaggerProps) {
  return <div className={className}>{children}</div>;
}

// --- Fade In Item ---
export function FadeInItem({ children, className }: FadeInItemProps) {
  return <div className={className}>{children}</div>;
}
