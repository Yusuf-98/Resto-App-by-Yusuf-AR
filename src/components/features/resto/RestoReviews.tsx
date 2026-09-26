'use client';

import { useState } from 'react';
import Image from 'next/image';
import StarIcon from '@/assets/icons/star.png';
import { isUnoptimizedSrc } from '@/lib/image-hosts';
import { formatDate } from '@/lib/utils';
import { StarRating } from '@/components/shared/StarRating';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';
import type { RestaurantDetail } from '@/types';

export function RestoReviews({
  resto,
  rating,
}: {
  resto: RestaurantDetail;
  rating?: number;
}) {
  // --- UI State ---
  const [visibleReviewCount, setVisibleReviewCount] = useState(4);

  // --- Data ---
  const allReviews = resto?.reviews ?? [];
  const displayReviews = allReviews.slice(0, visibleReviewCount);

  return (
    <>
    {/* --- Reviews Section --- */}
    <section className='flex flex-col gap-4 lg:gap-6 lg:pt-6'>
      <div className='flex flex-col items-start justify-center gap-2 md:gap-3'>
        <h2 className='text-display-xs lg:text-display-lg-track font-extrabold text-neutral-950'>
          Review
        </h2>
        <div className='flex items-center gap-1'>
          <Image
            src={StarIcon}
            alt='Star'
            width={24}
            height={24}
            className='lg:w-8.5 lg:h-8.5'
          />
          <span className='text-md lg:text-xl font-extrabold text-neutral-950'>
            {rating?.toFixed(1)}
          </span>
          <span className='text-md lg:text-xl font-extrabold text-neutral-950'>
            ({allReviews.length} Ulasan)
          </span>
        </div>
      </div>

      {/* --- Review List --- */}
      {allReviews.length === 0 ? (
        <p className='py-8 text-center text-neutral-500'>No reviews yet</p>
      ) : (
        <div>
          <FadeInStagger className='grid grid-cols-1 gap-4 lg:gap-5 md:grid-cols-2'>
            {displayReviews.map((review, idx) => {
              const userName =
                review.user?.name ?? review.userName ?? 'User';
              const userAvatar = review.user?.avatar ?? review.userAvatar;
              return (
                <FadeInItem key={review.id ?? idx} index={idx % 4}>
                  <div className='flex flex-col gap-4 rounded-2xl bg-white p-4 shadow-card'>
                    <div className='flex items-center gap-3'>
                      <div className='flex h-15 lg:h-16 w-15 lg:w-16 shrink-0 items-center justify-center border border-neutral-700 overflow-hidden rounded-full'>
                        {userAvatar ? (
                          <Image
                            src={userAvatar}
                            alt={userName}
                            width={58}
                            height={58}
                            className='h-full w-full object-cover'
                            unoptimized={isUnoptimizedSrc(userAvatar)}
                          />
                        ) : (
                          <span className='text-4xl'>👤</span>
                        )}
                      </div>
                      <div className='flex flex-col justify-center'>
                        <p className='text-md lg:text-lg lg:tracking-tight-2 font-extrabold text-neutral-950'>
                          {userName}
                        </p>
                        <p className='text-sm lg:text-md tracking-tight-2 text-neutral-950'>
                          {formatDate(review.createdAt)}
                        </p>
                      </div>
                    </div>
                    <div className='flex flex-col gap-2'>
                      <StarRating value={review.star} readonly size='md' />
                      <p className='text-sm lg:text-md tracking-tight-2 text-neutral-950'>
                        {review.comment}
                      </p>
                    </div>
                  </div>
                </FadeInItem>
              );
            })}
          </FadeInStagger>
          {allReviews.length > 4 && (
            <div className='flex justify-center mt-6 md:mt-2 mb-10 lg:mb-12'>
              <button
                onClick={() =>
                  setVisibleReviewCount((prev) =>
                    prev >= allReviews.length
                      ? Math.max(4, prev - 2)
                      : Math.min(allReviews.length, prev + 4)
                  )
                }
                className='w-40 h-10 md:h-12 rounded-full border border-neutral-300 p-2 text-sm md:text-md font-bold tracking-tight-2 text-neutral-950 transition-all duration-500 ease-in-out hover-dim'
              >
                {visibleReviewCount >= allReviews.length
                  ? 'Show Less'
                  : 'Show More'}
              </button>
            </div>
          )}
        </div>
      )}
    </section>
    </>
  );
}
