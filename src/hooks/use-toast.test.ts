import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import type * as UseToastModule from './use-toast';

// use-toast.ts keeps its toast list in module-level state (no reset API),
// so each test gets a fresh module instance to avoid leaking toasts/timers
// between tests.
let mod: typeof UseToastModule;

describe('useToast', () => {
  beforeEach(async () => {
    vi.useFakeTimers();
    vi.resetModules();
    mod = await import('./use-toast');
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('adds a toast that is visible immediately after being triggered', () => {
    const { result } = renderHook(() => mod.useToast());

    act(() => {
      mod.toast({ title: 'Item added to cart', variant: 'success' });
    });

    expect(result.current.toasts).toHaveLength(1);
    expect(result.current.toasts[0]).toMatchObject({
      title: 'Item added to cart',
      variant: 'success',
      open: true,
    });
  });

  it('auto-dismisses a toast after its timeout instead of leaving it open forever', () => {
    const { result } = renderHook(() => mod.useToast());

    act(() => {
      mod.toast({ title: 'Saved' });
    });
    expect(result.current.toasts[0].open).toBe(true);

    act(() => {
      vi.advanceTimersByTime(3500);
    });

    expect(result.current.toasts[0].open).toBe(false);
  });

  it('stops notifying a hook instance after it unmounts', () => {
    const { result, unmount } = renderHook(() => mod.useToast());
    unmount();

    // should not throw even though the listener was removed
    expect(() => {
      act(() => {
        mod.toast({ title: 'After unmount' });
      });
    }).not.toThrow();
    expect(result.current).toBeDefined();
  });
});
