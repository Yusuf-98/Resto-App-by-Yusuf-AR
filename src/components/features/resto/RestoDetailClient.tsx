'use client';

import { Suspense } from 'react';
import Image from 'next/image';
import { Share2 } from 'lucide-react';
import StarIcon from '@/assets/icons/star.png';
import { isUnoptimizedSrc } from '@/lib/image-hosts';
import { getDummyDistance } from '@/lib/utils';
import type { RestaurantDetail } from '@/types';
import { RestoHero } from './RestoHero';
import { RestoMenu } from './RestoMenu';
import { RestoReviews } from './RestoReviews';

export default function RestoDetailClient({
  resto,
  id,
}: {
  resto: RestaurantDetail;
  id: string;
}) {
  // --- Data ---
  const rating = resto?.star ?? resto?.rating ?? resto?.averageRating;
  const location = resto?.place ?? resto?.location;

  // --- Handlers ---
  async function handleShare() {
    if (navigator.share) {
      try {
        await navigator.share({
          title: resto?.name,
          url: window.location.href,
        });
      } catch {}
    } else {
      await navigator.clipboard.writeText(window.location.href);
    }
  }

  return (
    <div className='relative custom-container pt-20 pb-24 md:pb-27 lg:pb-30 md:pt-22 lg:pt-32 bg-white'>
      {/* --- Hero --- */}
      <Suspense>
        <RestoHero resto={resto} />
      </Suspense>

      <div className='mx-auto max-w-7xl mt-2.25'>
        {/* --- Restaurant Info --- */}
        <div className='flex items-center justify-between pt-6'>
          <div className='flex items-center gap-2 md:gap-4'>
            <div className='flex h-22.5 w-22.5 lg:w-30 lg:h-30 shrink-0 items-center justify-center overflow-hidden rounded-full bg-orange-50 shadow-sm'>
              {resto?.logo ? (
                <Image
                  src={resto.logo}
                  alt={resto.name}
                  width={64}
                  height={64}
                  className='h-full w-full object-cover'
                  unoptimized={isUnoptimizedSrc(resto.logo)}
                />
              ) : (
                <span className='text-3xl'>🍔</span>
              )}
            </div>
            <div className='flex flex-col gap-1.25'>
              <h1 className='text-md font-extrabold text-neutral-950 lg:text-display-md-track'>
                {resto?.name}
              </h1>
              <div className='flex items-center gap-1'>
                <Image src={StarIcon} alt='Star' width={24} height={24} />
                <span className='text-sm lg:text-lg tracking-tight-2 font-semibold text-neutral-950'>
                  {rating?.toFixed(1)}
                </span>
              </div>
              <div className='text-sm lg:text-lg font-medium text-neutral-950'>
                {location}
                {resto?.id != null && ` • ${getDummyDistance(resto.id)} km`}
              </div>
            </div>
          </div>
          <button
            onClick={handleShare}
            aria-label='Share'
            className='w-11 h-11 md:w-35 md:h-11 flex items-center justify-center gap-3 rounded-full border border-neutral-300 bg-white md:px-4 md:py-3 text-sm md:text-md tracking-tight-2 font-bold text-neutral-950 transition-all duration-500 ease-in-out hover-dark cursor-pointer'
          >
            <Share2 className='h-5 w-5 md:h-6 md:w-6' />
            <span className='hidden sm:inline'>Share</span>
          </button>
        </div>

        <hr className='border-neutral-300 my-5 lg:my-8' />

        {/* --- Menu --- */}
        <Suspense>
          <RestoMenu resto={resto} id={id} />
        </Suspense>

        <hr className='border-neutral-300 my-4 lg:my-2' />

        {/* --- Reviews --- */}
        <Suspense>
          <RestoReviews resto={resto} rating={rating} />
        </Suspense>
      </div>
    </div>
  );
}
