import type { Metadata } from 'next';
import { Nunito } from 'next/font/google';
import './globals.css';
import { Providers } from './providers';
import { Toaster } from '@/components/ui/toaster';

const nunito = Nunito({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800'],
  display: 'swap',
});

export const metadata: Metadata = {
  title: {
    default: 'Foody — Explore Culinary Experiences',
    template: '%s | Foody',
  },
  description:
    'Search and refine your choice to discover the perfect restaurant.',
  keywords: ['food', 'restaurant', 'order', 'delivery'],
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang='id' suppressHydrationWarning>
      <body className={nunito.className}>
        <Providers>
          {children}
          <Toaster />
        </Providers>
      </body>
    </html>
  );
}
