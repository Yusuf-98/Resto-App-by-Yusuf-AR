import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, fireEvent, render, screen } from '@testing-library/react';
import { FadeInItem } from './FadeInStagger';

// --- IntersectionObserver Mock ---
let notify: IntersectionObserverCallback;
let observerOptions: IntersectionObserverInit | undefined;
const observe = vi.fn();
const disconnect = vi.fn();

function intersect(isIntersecting: boolean) {
  act(() => {
    notify(
      [{ isIntersecting } as IntersectionObserverEntry],
      {} as IntersectionObserver
    );
  });
}

beforeEach(() => {
  observe.mockClear();
  disconnect.mockClear();
  vi.stubGlobal(
    'IntersectionObserver',
    class {
      constructor(
        callback: IntersectionObserverCallback,
        options?: IntersectionObserverInit
      ) {
        notify = callback;
        observerOptions = options;
      }
      observe = observe;
      disconnect = disconnect;
    }
  );
});

afterEach(() => {
  vi.unstubAllGlobals();
});

describe('FadeInItem', () => {
  it('stays hidden until it scrolls into view, then reveals once', () => {
    render(<FadeInItem>Card</FadeInItem>);
    const item = screen.getByText('Card');
    expect(item).toHaveClass('fade-in-hidden');

    intersect(false);
    expect(item).toHaveClass('fade-in-hidden');

    intersect(true);
    expect(item).toHaveClass('fade-in-visible');
    expect(disconnect).toHaveBeenCalled();
  });

  it('waits for 15% of the item to be visible', () => {
    render(<FadeInItem>Card</FadeInItem>);
    expect(observerOptions).toEqual({ threshold: 0.15 });
  });

  it('plays eager items on first paint without observing', () => {
    render(<FadeInItem eager>Hero</FadeInItem>);
    expect(screen.getByText('Hero')).toHaveClass('fade-in-eager');
    expect(observe).not.toHaveBeenCalled();
  });

  it('drops the eager animation once it has played so it never replays', () => {
    render(
      <FadeInItem eager>
        <span>Inner</span>
      </FadeInItem>
    );
    const item = screen.getByText('Inner').parentElement as HTMLElement;
    expect(item).toHaveClass('fade-in-eager');

    fireEvent.animationEnd(screen.getByText('Inner'));
    expect(item).toHaveClass('fade-in-eager');

    fireEvent.animationEnd(item);
    expect(item).not.toHaveClass('fade-in-eager');
  });

  it('staggers by index and caps the delay at 0.6s', () => {
    render(
      <>
        <FadeInItem index={2}>Second</FadeInItem>
        <FadeInItem index={10}>Tenth</FadeInItem>
      </>
    );
    const delayOf = (text: string) =>
      screen.getByText(text).style.getPropertyValue('--fade-delay');

    expect(delayOf('Second')).toBe('0.3s');
    expect(delayOf('Tenth')).toBe('0.6s');
  });

  it('shows the content right away when IntersectionObserver is unavailable', () => {
    vi.stubGlobal('IntersectionObserver', undefined);
    render(<FadeInItem>Card</FadeInItem>);
    expect(screen.getByText('Card')).toHaveClass('fade-in-visible');
  });

  it('keeps a custom className alongside the animation state', () => {
    render(<FadeInItem className="relative">Card</FadeInItem>);
    const item = screen.getByText('Card');
    expect(item).toHaveClass('fade-in-hidden', 'relative');
  });
});
