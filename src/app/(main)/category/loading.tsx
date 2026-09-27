import { RestaurantCardSkeleton } from '@/components/shared/Skeletons';

// --- Loading Skeleton (Category) ---
export default function CategoryLoading() {
  return (
    <div className='custom-container pt-20 md:pt-22 lg:pt-32 pb-12 bg-white'>
      <div className='mx-auto max-w-7xl'>
        {/* --- Title Skeleton --- */}
        <div className='mb-5 md:mb-8 h-9 lg:h-11 w-48 animate-pulse rounded-xl bg-neutral-200' />

        <div className='flex flex-col gap-5 lg:flex-row lg:gap-8'>
          {/* --- Filter Sidebar Skeleton (Desktop) --- */}
          <div className='hidden w-66.5 shrink-0 lg:block'>
            <div className='h-120 animate-pulse rounded-xl bg-neutral-200' />
          </div>

          {/* --- Filter Button Skeleton (Mobile) --- */}
          <div className='h-11 w-full animate-pulse rounded-xl bg-neutral-200 lg:hidden' />

          {/* --- Restaurant List Skeleton --- */}
          <div className='flex-1 min-w-0'>
            <div className='grid grid-cols-1 gap-3 sm:grid-cols-2'>
              {Array.from({ length: 8 }).map((_, i) => (
                <RestaurantCardSkeleton key={i} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
