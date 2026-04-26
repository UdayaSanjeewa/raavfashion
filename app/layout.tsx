'use client';

import './globals.css';
import { Barlow_Condensed, Barlow } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';

/* Barlow Condensed — bold italic for headlines, matches the Carnage aesthetic */
const barlowCondensed = Barlow_Condensed({
  subsets: ['latin'],
  weight: ['400', '600', '700', '800', '900'],
  style: ['normal', 'italic'],
  variable: '--font-bc',
  display: 'swap',
});

/* Barlow — regular body text */
const barlow = Barlow({
  subsets: ['latin'],
  weight: ['300', '400', '500', '600', '700'],
  variable: '--font-b',
  display: 'swap',
});

export default function RootLayout({ children }: { children: React.ReactNode }) {
  const pathname        = usePathname();
  const hideHeaderFooter =
    pathname?.startsWith('/seller') || pathname?.startsWith('/admin');

  return (
    <html lang="en" className={`${barlowCondensed.variable} ${barlow.variable}`}>
      <head>
        <title>RAAV FASHION — Premium Fashion Sri Lanka</title>
        <meta
          name="description"
          content="RAAV FASHION — Sri Lanka's premier fashion destination. Shop the latest women's, men's and ethnic wear from verified sellers."
        />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={`${barlow.className} antialiased`}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {!hideHeaderFooter && <Header />}
            <main className="flex-1">{children}</main>
            {!hideHeaderFooter && <Footer />}
            <Toaster
              position="bottom-right"
              toastOptions={{
                style: {
                  background: '#111',
                  color: '#fff',
                  border: '1px solid #333',
                  borderRadius: '0',
                  fontSize: '13px',
                  fontFamily: 'var(--font-b)',
                },
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
