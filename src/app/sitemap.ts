import type { MetadataRoute } from 'next';

const BASE_URL = 'https://resto-app-by-yusuf-ar.vercel.app';

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE_URL, changeFrequency: 'daily', priority: 1 },
    { url: `${BASE_URL}/category`, changeFrequency: 'daily', priority: 0.8 },
    { url: `${BASE_URL}/login`, changeFrequency: 'yearly', priority: 0.3 },
    { url: `${BASE_URL}/register`, changeFrequency: 'yearly', priority: 0.3 },
  ];
}
