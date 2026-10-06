import Link from 'next/link';
import Image from 'next/image';
import RestaurantIcon from '@/assets/icons/all-restaurants.png';
import NearbyIcon from '@/assets/icons/location.png';
import DiscountIcon from '@/assets/icons/discount.png';
import BestSellerIcon from '@/assets/icons/best-seller.png';
import DeliveryIcon from '@/assets/icons/delivery.png';
import LunchIcon from '@/assets/icons/lunch.png';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';

// --- Category List ---
const CATEGORIES = [
  { label: 'All Restaurant', icon: RestaurantIcon, href: '/category' },
  { label: 'Nearby', icon: NearbyIcon, href: '/category?filter=nearby' },
  { label: 'Discount', icon: DiscountIcon, href: '/category?filter=discount' },
  {
    label: 'Best Seller',
    icon: BestSellerIcon,
    href: '/category?filter=best-seller',
  },
  { label: 'Delivery', icon: DeliveryIcon, href: '/category?filter=delivery' },
  { label: 'Lunch', icon: LunchIcon, href: '/category?category=lunch' },
];

// --- Categories Section ---
export function CategoriesSection() {
  return (
    <section className='mx-auto w-full max-w-360 px-4 py-6 md:px-30 md:py-12'>
      <FadeInStagger className='grid grid-cols-3 lg:grid-cols-6 gap-x-3 gap-y-5 md:gap-x-5'>
        {CATEGORIES.map((cat, idx) => (
          <FadeInItem key={cat.label} index={idx} eager={idx < 3}>
            <Link
              href={cat.href}
              prefetch={false}
              className='flex flex-col gap-1 md:gap-2 items-center justify-center bg-white transition-all duration-500 ease-in-out hover-scale-105'
            >
              <div className='w-full h-25 flex justify-center items-center p-2 rounded-2xl shadow-card'>
                <Image
                  src={cat.icon}
                  alt={cat.label}
                  fetchPriority={idx < 3 ? 'high' : undefined}
                  className='w-12 h-12 md:w-16.25 md:h-16.25 object-contain'
                />
              </div>
              <span className='w-full h-7 md:h-8 flex items-center justify-center text-sm tracking-tight-2 md:text-lg md:tracking-tight-3 font-bold text-neutral-950 text-center'>
                {cat.label}
              </span>
            </Link>
          </FadeInItem>
        ))}
      </FadeInStagger>
    </section>
  );
}
