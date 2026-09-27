'use client';

import dynamic from 'next/dynamic';

// --- Categories Section (loaded after initial page load) ---
const CategoriesSection = dynamic(
  () =>
    import('./CategoriesSection').then((m) => m.CategoriesSection),
  {
    ssr: false,
    loading: () => (
      <section className='mx-auto w-full max-w-360 px-4 py-6 md:px-30 md:py-12'>
        <div className='grid grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-5 md:gap-x-5'>
          {Array.from({ length: 6 }).map((_, i) => (
            <div
              key={i}
              className='flex flex-col gap-1 md:gap-2 items-center justify-center'
            >
              <div className='w-full h-25 rounded-2xl shadow-card' />
              <div className='w-full h-7 md:h-8' />
            </div>
          ))}
        </div>
      </section>
    ),
  }
);

export function LazyCategoriesSection() {
  return <CategoriesSection />;
}
