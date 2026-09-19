import '@testing-library/jest-dom/vitest';
import { afterEach, vi } from 'vitest';
import { cleanup } from '@testing-library/react';

// --- Unmount rendered components between tests ---
afterEach(() => {
  cleanup();
});

// --- Mock next/image (renders a plain img, avoids Next's runtime loader) ---
vi.mock('next/image', () => ({
  default: (props: Record<string, unknown>) => {
    const { src, alt, ...rest } = props;
    const resolvedSrc =
      typeof src === 'string' ? src : (src as { src: string })?.src;
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={resolvedSrc} alt={alt as string} {...rest} />;
  },
}));
