'use client';

import { useRef, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Plus, Minus, X } from 'lucide-react';
import BagBlack from '@/assets/icons/bag-black.png';
import {
  useCart,
  useAddToCart,
  useUpdateCartItem,
  useDeleteCartItem,
} from '@/hooks/queries/cart';
import { useAuthStore } from '@/store/auth.store';
import { useModalA11y } from '@/hooks/use-modal-a11y';
import { isUnoptimizedSrc } from '@/lib/image-hosts';
import { formatCurrency } from '@/lib/utils';
import { toast } from '@/hooks/use-toast';
import { FadeInStagger, FadeInItem } from '@/components/shared/FadeInStagger';
import type { RestaurantDetail, MenuItem } from '@/types';
import { PLACEHOLDER_IMAGE } from './constants';

// --- Menu Tabs ---
const MENU_TABS = ['all', 'food', 'drink'] as const;

export function RestoMenu({
  resto,
  id,
}: {
  resto: RestaurantDetail;
  id: string;
}) {
  const router = useRouter();
  const { isAuthenticated } = useAuthStore();

  // --- UI State ---
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});
  const [activeTab, setActiveTab] = useState<'all' | 'food' | 'drink'>('all');
  const [visibleMenuCount, setVisibleMenuCount] = useState(4);
  const [pendingKey, setPendingKey] = useState<string | null>(null);
  const [selectedMenuItem, setSelectedMenuItem] = useState<MenuItem | null>(
    null
  );
  const menuDialogRef = useModalA11y(!!selectedMenuItem, () =>
    setSelectedMenuItem(null)
  );

  // --- Data ---
  const { data: cartGroups } = useCart();
  const addToCart = useAddToCart();
  const updateCartItem = useUpdateCartItem();
  const deleteCartItem = useDeleteCartItem();
  const cartGroup = cartGroups?.find(
    (g) => String(g.restaurant?.id) === String(id)
  );
  const cartItemsByMenuId = new Map(
    (cartGroup?.items ?? []).map((ci) => [String(ci.menu?.id ?? ci.menuId), ci])
  );
  const selectedKey = selectedMenuItem ? String(selectedMenuItem.id) : null;
  const selectedQty = selectedKey
    ? (cartItemsByMenuId.get(selectedKey)?.quantity ?? 0)
    : 0;
  const selectedPending = selectedKey ? pendingKey === selectedKey : false;
  const allMenu = resto?.menus ?? resto?.menu ?? [];
  const filteredMenu =
    activeTab === 'all'
      ? allMenu
      : allMenu.filter(
          (m) => (m.type ?? m.category)?.toLowerCase() === activeTab
        );
  const displayMenu = filteredMenu.slice(0, visibleMenuCount);
  const totalItems = (cartGroup?.items ?? []).reduce(
    (s, i) => s + i.quantity,
    0
  );
  const totalPrice = (cartGroup?.items ?? []).reduce(
    (s, i) => s + (i.menu?.price ?? 0) * i.quantity,
    0
  );

  // --- Handlers ---
  function handleTabChange(tab: 'all' | 'food' | 'drink') {
    setActiveTab(tab);
    setVisibleMenuCount(4);
  }

  function handleTabKeyDown(e: React.KeyboardEvent, index: number) {
    let nextIndex: number;
    if (e.key === 'ArrowRight') nextIndex = (index + 1) % MENU_TABS.length;
    else if (e.key === 'ArrowLeft')
      nextIndex = (index - 1 + MENU_TABS.length) % MENU_TABS.length;
    else if (e.key === 'Home') nextIndex = 0;
    else if (e.key === 'End') nextIndex = MENU_TABS.length - 1;
    else return;

    e.preventDefault();
    const nextTab = MENU_TABS[nextIndex];
    handleTabChange(nextTab);
    tabRefs.current[nextTab]?.focus();
  }

  async function changeQty(item: MenuItem, delta: number) {
    if (!isAuthenticated) {
      router.push('/login');
      return;
    }
    const key = String(item.id);
    const existing = cartItemsByMenuId.get(key);
    const nextQty = Math.max(0, (existing?.quantity ?? 0) + delta);
    if (nextQty === (existing?.quantity ?? 0)) return;

    setPendingKey(key);
    try {
      if (existing && nextQty === 0) {
        await deleteCartItem.mutateAsync(String(existing.id));
      } else if (existing) {
        await updateCartItem.mutateAsync({
          id: String(existing.id),
          quantity: nextQty,
        });
      } else {
        await addToCart.mutateAsync({
          restaurantId: Number(id),
          menuId: Number(item.id),
          quantity: nextQty,
        });
        const name = item.foodName ?? item.name ?? 'Item';
        toast({ title: `${name} ditambahkan ke cart`, variant: 'success' });
      }
    } catch {
      toast({ title: 'Gagal memperbarui cart', variant: 'error' });
    } finally {
      setPendingKey(null);
    }
  }

  return (
    <>
    {/* --- Menu Section --- */}
    <section className='flex flex-col gap-5 pb-6 md:gap-5 lg:gap-6'>
      <h2 className='text-display-xs lg:text-display-lg-track font-extrabold text-neutral-950'>
        Menu
      </h2>

      {/* --- Menu Tabs --- */}
      <div
        role='tablist'
        aria-label='Menu category'
        className='flex gap-2 md:gap-3'
      >
        {MENU_TABS.map((tab, index) => (
          <button
            key={tab}
            ref={(el) => {
              tabRefs.current[tab] = el;
            }}
            role='tab'
            id={`menu-tab-${tab}`}
            aria-selected={activeTab === tab}
            aria-controls='menu-tabpanel'
            tabIndex={activeTab === tab ? 0 : -1}
            onClick={() => handleTabChange(tab)}
            onKeyDown={(e) => handleTabKeyDown(e, index)}
            className={`rounded-full border px-4 py-2 text-sm md:text-md tracking-tight-2 capitalize transition-all duration-500 ease-in-out cursor-pointer ${
              activeTab === tab
                ? 'border-primary-100 bg-primary-50 text-primary-100 font-bold hover-bg-primary'
                : 'border-neutral-300 bg-white text-neutral-950 hover-dark font-semibold'
            }`}
          >
            {tab === 'all'
              ? 'All Menu'
              : tab.charAt(0).toUpperCase() + tab.slice(1)}
          </button>
        ))}
      </div>

      {/* --- Menu Grid --- */}
      <div
        role='tabpanel'
        id='menu-tabpanel'
        aria-labelledby={`menu-tab-${activeTab}`}
      >
      {filteredMenu.length === 0 ? (
        <p className='py-12 text-center text-neutral-500'>
          No menu items in this category
        </p>
      ) : (
        <>
          <FadeInStagger className='grid grid-cols-2 gap-5 md:gap-5 md:grid-cols-3 lg:grid-cols-4'>
            {displayMenu.map((item, idx) => {
              const key = String(item.id ?? idx);
              const qty = cartItemsByMenuId.get(key)?.quantity ?? 0;
              const isPending = pendingKey === key;
              const itemName = item.foodName ?? item.name ?? 'Menu';
              return (
                <FadeInItem key={key} index={idx % 4} eager={idx < 2}>
                  <div
                    role='button'
                    tabIndex={0}
                    onClick={() => setSelectedMenuItem(item)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        setSelectedMenuItem(item);
                      }
                    }}
                    className='flex flex-col overflow-hidden rounded-2xl bg-white transition-all duration-500 ease-in-out hover-scale-105 cursor-pointer'
                  >
                    <div
                      className='relative w-full'
                      style={{ aspectRatio: '1 / 1' }}
                    >
                      <Image
                        src={item.image ?? PLACEHOLDER_IMAGE}
                        alt={itemName}
                        fill
                        sizes='(max-width: 768px) 50vw, 25vw'
                        className='object-cover'
                        unoptimized={isUnoptimizedSrc(item.image)}
                      />
                    </div>
                    <div
                      className='flex flex-col md:flex-row md:items-center md:justify-between'
                      style={{
                        padding: 'clamp(8px, 0.6vw + 5.6px, 16px)',
                        gap: 'clamp(8px, 1vw + 4px, 16px)',
                      }}
                    >
                      <div className='flex flex-col min-w-0'>
                        <p
                          className='font-medium text-neutral-950'
                          style={{
                            fontSize: 'clamp(12px, 0.4vw + 10.4px, 16px)',
                          }}
                        >
                          {itemName}
                        </p>
                        <p
                          className='font-extrabold text-neutral-950'
                          style={{
                            fontSize: 'clamp(14px, 0.6vw + 11.6px, 20px)',
                          }}
                        >
                          {formatCurrency(item.price)}
                        </p>
                      </div>

                      {/* --- Add to Cart / Quantity Stepper --- */}
                      <div onClick={(e) => e.stopPropagation()}>
                      {qty === 0 ? (
                        <button
                          onClick={() => changeQty(item, 1)}
                          disabled={isPending}
                          className='w-full h-9 md:w-19.75 lg:h-10 flex items-center justify-center rounded-full bg-primary-100 font-bold text-white transition-all duration-500 ease-in-out hover-dim active:scale-[0.98] disabled:opacity-50'
                          style={{
                            fontSize: 'clamp(12px, 0.4vw + 10.4px, 16px)',
                          }}
                        >
                          Add
                        </button>
                      ) : (
                        <div
                          className='flex items-center justify-between'
                          style={{
                            width: 'clamp(114px, 9.4vw + 76.6px, 123px)',
                            height: 'clamp(36px, 0.4vw + 34.4px, 40px)',
                          }}
                        >
                          <button
                            onClick={() => changeQty(item, -1)}
                            disabled={isPending}
                            aria-label={`Decrease quantity of ${itemName}`}
                            className='flex items-center justify-center rounded-full border border-neutral-300 text-neutral-950 shrink-0 transition-all duration-500 ease-in-out hover-dark disabled:opacity-50'
                            style={{
                              width: 'clamp(32px, 1.2vw + 27.8px, 40px)',
                              height: 'clamp(32px, 1.2vw + 27.8px, 40px)',
                            }}
                          >
                            <Minus
                              style={{
                                width: 'clamp(16px, 0.6vw + 13.9px, 24px)',
                                height: 'clamp(16px, 0.6vw + 13.9px, 24px)',
                              }}
                            />
                          </button>
                          <span
                            className='font-semibold text-neutral-950 tracking-tight-2'
                            style={{
                              fontSize: 'clamp(14px, 0.6vw + 11.6px, 20px)',
                            }}
                          >
                            {qty}
                          </span>
                          <button
                            onClick={() => changeQty(item, 1)}
                            disabled={isPending}
                            aria-label={`Increase quantity of ${itemName}`}
                            className='flex items-center justify-center rounded-full bg-primary-100 text-white transition-all duration-500 ease-in-out hover-dim shrink-0 disabled:opacity-50'
                            style={{
                              width: 'clamp(32px, 1.2vw + 27.8px, 40px)',
                              height: 'clamp(32px, 1.2vw + 27.8px, 40px)',
                            }}
                          >
                            <Plus
                              style={{
                                width: 'clamp(16px, 0.6vw + 13.9px, 24px)',
                                height: 'clamp(16px, 0.6vw + 13.9px, 24px)',
                              }}
                            />
                          </button>
                        </div>
                      )}
                      </div>
                    </div>
                  </div>
                </FadeInItem>
              );
            })}
          </FadeInStagger>
          {filteredMenu.length > 4 && (
            <div className='flex justify-center md:mt-2'>
              <button
                onClick={() =>
                  setVisibleMenuCount((prev) =>
                    prev >= filteredMenu.length
                      ? Math.max(4, prev - 2)
                      : Math.min(filteredMenu.length, prev + 4)
                  )
                }
                className='w-40 h-10 md:h-12 rounded-full border border-neutral-300 p-2 text-sm md:text-md font-bold tracking-tight-2 text-neutral-950 transition-all duration-500 ease-in-out hover-dim'
              >
                {visibleMenuCount >= filteredMenu.length
                  ? 'Show Less'
                  : 'Show More'}
              </button>
            </div>
          )}
        </>
      )}
      </div>
    </section>

    {/* --- Sticky Cart Bar --- */}
    {totalItems > 0 && (
      <div className='custom-container fixed inset-x-0 bottom-0 z-40 h-20 bg-white shadow-card flex items-center'>
        <div className='flex w-full items-center justify-between gap-4'>
          <div className='flex flex-col gap-0.5'>
            <div className='flex items-center gap-2'>
              <Image src={BagBlack} alt='Shopping Bag' className='h-6 w-6' />
              <span className='text-md tracking-tight-2 text-neutral-950'>
                {totalItems} Items
              </span>
            </div>
            <span className='text-xl font-extrabold text-neutral-950'>
              {formatCurrency(totalPrice)}
            </span>
          </div>
          <Link
            href='/cart'
            className='w-57.5 h-11 flex items-center justify-center shrink-0 rounded-full bg-primary-100 p-2 gap-2 text-md font-bold tracking-tight-2 text-center text-neutral-25 transition-all duration-500 ease-in-out hover-dim'
          >
            Checkout
          </Link>
        </div>
      </div>
    )}

    {/* --- Menu Item Detail Modal --- */}
    {selectedMenuItem && (
      <div
        className='fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4'
        onClick={() => setSelectedMenuItem(null)}
      >
        <div
          ref={menuDialogRef}
          role='dialog'
          aria-modal='true'
          aria-labelledby='menu-item-title'
          tabIndex={-1}
          onClick={(e) => e.stopPropagation()}
          className='w-full max-w-md overflow-hidden rounded-2xl bg-white outline-none'
        >
          <div className='relative w-full' style={{ aspectRatio: '1 / 1' }}>
            <Image
              src={selectedMenuItem.image ?? PLACEHOLDER_IMAGE}
              alt={
                selectedMenuItem.foodName ?? selectedMenuItem.name ?? 'Menu'
              }
              fill
              sizes='(max-width: 768px) 100vw, 448px'
              className='object-cover'
              unoptimized={isUnoptimizedSrc(selectedMenuItem.image)}
            />
            <button
              onClick={() => setSelectedMenuItem(null)}
              aria-label='Close'
              className='absolute right-3 top-3 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-neutral-950'
            >
              <X className='h-5 w-5' />
            </button>
          </div>
          <div className='flex flex-col gap-3 p-5'>
            <h2
              id='menu-item-title'
              className='text-xl font-extrabold text-neutral-950'
            >
              {selectedMenuItem.foodName ?? selectedMenuItem.name ?? 'Menu'}
            </h2>
            <p className='text-lg font-extrabold text-neutral-950'>
              {formatCurrency(selectedMenuItem.price)}
            </p>
            {selectedMenuItem.description && (
              <p className='text-sm text-neutral-500'>
                {selectedMenuItem.description}
              </p>
            )}

            {/* --- Add to Cart / Quantity Stepper --- */}
            {selectedQty === 0 ? (
              <button
                onClick={() => changeQty(selectedMenuItem, 1)}
                disabled={selectedPending}
                className='mt-2 h-11 w-full rounded-full bg-primary-100 font-bold text-white transition-all duration-500 ease-in-out hover-dim active:scale-[0.98] disabled:opacity-50'
              >
                Add
              </button>
            ) : (
              <div className='mt-2 flex items-center justify-between'>
                <button
                  onClick={() => changeQty(selectedMenuItem, -1)}
                  disabled={selectedPending}
                  aria-label={`Decrease quantity of ${selectedMenuItem.foodName ?? selectedMenuItem.name ?? 'Menu'}`}
                  className='flex h-10 w-10 items-center justify-center rounded-full border border-neutral-300 text-neutral-950 transition-all duration-500 ease-in-out hover-dark disabled:opacity-50'
                >
                  <Minus className='h-5 w-5' />
                </button>
                <span className='text-lg font-semibold tracking-tight-2 text-neutral-950'>
                  {selectedQty}
                </span>
                <button
                  onClick={() => changeQty(selectedMenuItem, 1)}
                  disabled={selectedPending}
                  aria-label={`Increase quantity of ${selectedMenuItem.foodName ?? selectedMenuItem.name ?? 'Menu'}`}
                  className='flex h-10 w-10 items-center justify-center rounded-full bg-primary-100 text-white transition-all duration-500 ease-in-out hover-dim disabled:opacity-50'
                >
                  <Plus className='h-5 w-5' />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
    </>
  );
}
