import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { LazyToaster } from '@/components/ui/lazy-toaster';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

const BASE_URL = 'https://resto-app-by-yusuf-ar.vercel.app';

export const metadata: Metadata = {
  title: {
    default: 'Foody — Explore Culinary Experiences',
    template: '%s | Foody',
  },
  description:
    'Search and refine your choice to discover the perfect restaurant.',
  keywords: ['food', 'restaurant', 'order', 'delivery'],
};

// --- Organization JSON-LD ---
const organizationSchema = {
  '@context': 'https://schema.org',
  '@type': 'Organization',
  name: 'Foody',
  url: BASE_URL,
  logo: `${BASE_URL}/icon.png`,
  description:
    'Search and refine your choice to discover the perfect restaurant.',
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='id' suppressHydrationWarning>
      <body className={nunito.className}>
        <script
          type='application/ld+json'
          dangerouslySetInnerHTML={{ __html: JSON.stringify(organizationSchema) }}
        />
        <Providers>
          {children}
          <LazyToaster />
        </Providers>
      </body>
    </html>
  );
}
