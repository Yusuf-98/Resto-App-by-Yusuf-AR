'use client';

import { useState } from 'react';
import Image from 'next/image';
import { motion, AnimatePresence, type Variants } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { FadeInItem } from '@/components/shared/FadeInStagger';
import type { RestaurantDetail } from '@/types';
import { PLACEHOLDER_IMAGE } from './constants';

// --- Hero Slide Animation Variants ---
const heroSlideVariants: Variants = {
  enter: (dir: number) => ({
    x: dir > 0 ? '100%' : dir < 0 ? '-100%' : 0,
    opacity: dir === 0 ? 0 : 1,
  }),
  center: { x: 0, opacity: 1 },
  exit: (dir: number) => ({
    x: dir > 0 ? '-100%' : '100%',
    opacity: 1,
  }),
};

export function RestoHero({ resto }: { resto: RestaurantDetail }) {
  // --- UI State ---
  const [heroIndex, setHeroIndex] = useState(0);
  const [heroDirection, setHeroDirection] = useState(0);

  // --- Data ---
  const heroImages =
    resto?.images && resto.images.length > 0
      ? resto.images
      : [PLACEHOLDER_IMAGE];

  // --- Handlers ---
  function paginate(direction: 1 | -1) {
    setHeroDirection(direction);
    setHeroIndex(
      (prev) => (prev + direction + heroImages.length) % heroImages.length
    );
  }

  return (
    <>
    {/* --- Hero Images (Desktop) --- */}
    <div className='hidden md:h-105 lg:h-117.5 grid-cols-[1.11fr_0.89fr] gap-5 overflow-hidden md:grid'>
      <FadeInItem index={0} eager className='relative'>
        <Image
          src={resto?.images?.[0] ?? PLACEHOLDER_IMAGE}
          alt={resto?.name ?? ''}
          fill
          sizes='60.17vw'
          className='object-cover rounded-2xl'
          priority
          fetchPriority='high'
        />
      </FadeInItem>
      <div className='grid grid-rows-[2fr_1fr] gap-5'>
        <FadeInItem index={1} eager className='relative overflow-hidden'>
          <Image
            src={resto?.images?.[2] ?? PLACEHOLDER_IMAGE}
            alt='Photo 4'
            fill
            sizes='44.83vw'
            className='object-cover rounded-2xl'
          />
        </FadeInItem>
        <div className='grid grid-cols-2 gap-5'>
          {[1, 3].map((i, idx) => (
            <FadeInItem
              key={i}
              index={2 + idx}
              eager
              className='relative overflow-hidden'
            >
              <Image
                src={resto?.images?.[i] ?? PLACEHOLDER_IMAGE}
                alt={`Photo ${i}`}
                fill
                sizes='22.4vw'
                className='object-cover rounded-2xl'
              />
            </FadeInItem>
          ))}
        </div>
      </div>
    </div>

    {/* --- Hero Images (Mobile Slider) --- */}
    <FadeInItem index={0} eager className='relative h-65 md:hidden'>
      <div className='absolute inset-0 overflow-hidden rounded-2xl'>
        <AnimatePresence
          initial={false}
          custom={heroDirection}
          mode='popLayout'
        >
          <motion.div
            key={heroIndex}
            custom={heroDirection}
            variants={heroSlideVariants}
            initial='enter'
            animate='center'
            exit='exit'
            transition={{ duration: 0.35, ease: 'easeInOut' }}
            drag={heroImages.length > 1 ? 'x' : false}
            dragConstraints={{ left: 0, right: 0 }}
            dragElastic={0.2}
            onDragEnd={(_e, info) => {
              const threshold = 50;
              if (info.offset.x < -threshold) {
                setHeroDirection(1);
                setHeroIndex((prev) => (prev + 1) % heroImages.length);
              } else if (info.offset.x > threshold) {
                setHeroDirection(-1);
                setHeroIndex(
                  (prev) => (prev - 1 + heroImages.length) % heroImages.length
                );
              }
            }}
            className='absolute inset-0 cursor-grab active:cursor-grabbing'
          >
            <Image
              src={heroImages[heroIndex] ?? PLACEHOLDER_IMAGE}
              alt={resto?.name ?? ''}
              fill
              sizes='100vw'
              className='object-cover rounded-2xl pointer-events-none'
              priority
              fetchPriority='high'
            />
          </motion.div>
        </AnimatePresence>
      </div>
      <div
        aria-hidden='true'
        className='absolute -bottom-5 left-1/2 z-10 flex -translate-x-1/2 gap-1'
      >
        {heroImages.map((_, i) => (
          <span
            key={i}
            className={`h-2 w-2 rounded-full transition-all duration-500 ease-in-out ${
              i === heroIndex ? 'bg-primary-100' : 'bg-accent-gray'
            }`}
          />
        ))}
      </div>

      {/* --- Slider Arrows --- */}
      {heroImages.length > 1 && (
        <>
          <button
            type='button'
            onClick={() => paginate(-1)}
            aria-label='Previous photo'
            className='absolute left-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-neutral-950 shadow-sm'
          >
            <ChevronLeft className='h-5 w-5' />
          </button>
          <button
            type='button'
            onClick={() => paginate(1)}
            aria-label='Next photo'
            className='absolute right-2 top-1/2 z-10 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full bg-white/80 text-neutral-950 shadow-sm'
          >
            <ChevronRight className='h-5 w-5' />
          </button>
        </>
      )}
    </FadeInItem>
    </>
  );
}
