'use client';

import './globals.css';
import { Inter } from 'next/font/google';
import { Header } from '@/components/layout/Header';
import { Footer } from '@/components/layout/Footer';
import { AuthProvider } from '@/components/providers/AuthProvider';
import { Toaster } from 'sonner';
import { usePathname } from 'next/navigation';

const inter = Inter({
  subsets: ['latin'],
  variable: '--font-inter',
  display: 'swap',
});

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const isSellerRoute = pathname?.startsWith('/seller');
  const isAdminRoute = pathname?.startsWith('/admin');
  const hideHeaderFooter = isSellerRoute || isAdminRoute;

  return (
    <html lang="en" className={inter.variable}>
      <head>
        <title>StyleHub LK — Sri Lanka&apos;s Premier Fashion Marketplace</title>
        <meta name="description" content="Discover the latest fashion trends on StyleHub LK. Shop women's, men's, and ethnic wear from verified sellers across Sri Lanka." />
        <link rel="icon" href="/favicon.ico" />
        <meta name="theme-color" content="#000000" />
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=5" />
      </head>
      <body className={inter.className}>
        <AuthProvider>
          <div className="flex flex-col min-h-screen">
            {!hideHeaderFooter && <Header />}
            <main className="flex-1">
              {children}
            </main>
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
                }
              }}
            />
          </div>
        </AuthProvider>
      </body>
    </html>
  );
}
