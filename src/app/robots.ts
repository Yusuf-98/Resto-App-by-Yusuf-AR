import type { MetadataRoute } from 'next';

const BASE_URL = 'https://resto-app-by-yusuf-ar.vercel.app';

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: '*',
      allow: '/',
      disallow: ['/cart', '/checkout', '/profile', '/orders'],
    },
    sitemap: `${BASE_URL}/sitemap.xml`,
  };
}
