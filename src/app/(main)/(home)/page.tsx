import { Suspense } from 'react';
import Image from 'next/image';
import HeroImage from '@/assets/images/hero-image.png';
import { FadeInItem } from '@/components/shared/FadeInStagger';
import { HomeSearchProvider } from '@/components/features/home/HomeSearchProvider';
import { SearchBar } from '@/components/features/home/SearchBar';
import { RestaurantListSection } from '@/components/features/home/RestaurantListSection';
import { LazyCategoriesSection } from '@/components/features/home/LazyCategoriesSection';

export default function HomePage() {
  return (
    <HomeSearchProvider>
      <div className='mb-13'>
        {/* --- Hero Section --- */}
        <FadeInItem index={0} eager>
          <section
            className='relative flex items-center justify-center'
            style={{
              height:
                'clamp(648px, 648px + (827px - 648px) * ((100vw - 393px) / (1440px - 393px)), 827px)',
            }}
          >
            <Image
              src={HeroImage}
              alt=''
              fill
              priority
              fetchPriority='high'
              sizes='100vw'
              className='object-cover'
            />
            <div className='absolute inset-0 bg-black/35' />
            <div className='flex flex-col gap-6 md:gap-10 z-10 w-full md:mt-5 md:w-186 px-4 text-center'>
              {/* --- Hero Title --- */}
              <FadeInItem index={1} eager>
                <div className='flex flex-col gap-1 md:gap-2'>
                  <h1 className='text-display-lg-track md:text-display-2xl-track font-extrabold text-white text-center'>
                    Explore Culinary Experiences
                  </h1>
                  <p className='font-bold text-lg tracking-tight-3 md:text-display-xs md:tracking-none text-white'>
                    Search and refine your choice to discover the perfect
                    restaurant.
                  </p>
                </div>
              </FadeInItem>

              {/* --- Search Bar (Client) --- */}
              <FadeInItem index={2} eager>
                <SearchBar />
              </FadeInItem>
            </div>
          </section>
        </FadeInItem>

        {/* --- Categories Section --- */}
        <LazyCategoriesSection />

        {/* --- Restaurant List Section (Client) --- */}
        <Suspense>
          <RestaurantListSection />
        </Suspense>
      </div>
    </HomeSearchProvider>
  );
}
