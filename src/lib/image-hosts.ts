// --- Optimized Hosts ---
export const OPTIMIZED_IMAGE_HOSTS: readonly string[] = [
  'res.cloudinary.com',
  'images.unsplash.com',
];

// --- Unoptimized Check ---
export function isUnoptimizedSrc(src: unknown): boolean {
  if (typeof src !== 'string' || !/^https?:\/\//i.test(src)) return false;
  try {
    const { protocol, hostname } = new URL(src);
    return protocol !== 'https:' || !OPTIMIZED_IMAGE_HOSTS.includes(hostname);
  } catch {
    return true;
  }
}
