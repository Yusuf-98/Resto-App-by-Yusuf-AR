import type { NextConfig } from 'next';
import { OPTIMIZED_IMAGE_HOSTS } from './src/lib/image-hosts';

const nextConfig: NextConfig = {
  images: {
    remotePatterns: OPTIMIZED_IMAGE_HOSTS.map((hostname) => ({
      protocol: 'https' as const,
      hostname,
    })),
  },
};

export default nextConfig;
