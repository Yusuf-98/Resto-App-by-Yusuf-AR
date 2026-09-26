'use client';

import dynamic from 'next/dynamic';

// --- Toaster (loaded after hydration) ---
const Toaster = dynamic(() => import('./toaster').then((m) => m.Toaster), {
  ssr: false,
});

export function LazyToaster() {
  return <Toaster />;
}
