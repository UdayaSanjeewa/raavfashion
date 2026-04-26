"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, User, X, Menu } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWatchlist } from '@/hooks/useWatchlist';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WatchlistDrawer } from '@/components/watchlist/WatchlistDrawer';
import { AuthButton } from '@/components/auth/AuthButton';
import { getCategories } from '@/lib/products';
import type { Category } from '@/types';

/*
  RAAV FASHION – Header
  ─────────────────────
  Layout mirrors incarnage.com:
  • Logo – far left, bold italic condensed wordmark
  • Nav  – absolutely centered, ALL CAPS spaced links
  • Icons – far right (search, account, bag)
  • Entire bar is transparent over hero video; turns white on scroll
  • All text flips black when scrolled
*/

const NAV_LINKS = [
  { label: 'WOMEN',      href: '/categories/womens-fashion' },
  { label: 'MEN',        href: '/categories/mens-fashion' },
  { label: 'ACCESSORIES',href: '/categories/accessories' },
  { label: 'TRADITIONAL',href: '/categories/traditional-ethnic' },
  { label: 'SALE',       href: '/search' },
];

export function Header() {
  const [scrolled, setScrolled]         = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isMobileOpen, setIsMobileOpen] = useState(false);
  const [searchQuery, setSearchQuery]   = useState('');
  const [categories, setCategories]     = useState<Category[]>([]);
  const { itemCount }                   = useCart();
  const { itemCount: wlCount }          = useWatchlist();
  const router                          = useRouter();
  const searchRef                       = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 60);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen) searchRef.current?.focus();
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  const textColor   = scrolled ? 'text-black'      : 'text-white';
  const bgClass     = scrolled ? 'bg-white shadow-sm border-b border-gray-100' : 'bg-transparent';
  const hoverColor  = scrolled ? 'hover:text-gray-500' : 'hover:text-white/70';

  return (
    <>
      {/* ─── MAIN HEADER ──────────────────────────────────── */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${bgClass}`}>
        <div className="w-full px-6 md:px-10 lg:px-14">
          <div className="relative flex items-center h-16 md:h-[72px]">

            {/* LEFT — LOGO */}
            <Link href="/" className="flex-shrink-0 z-10">
              <span
                className={`font-black italic tracking-tight text-2xl md:text-3xl transition-colors duration-300 leading-none ${textColor}`}
                style={{ fontStyle: 'italic', letterSpacing: '-0.02em' }}
              >
                RAAV
              </span>
              <span
                className={`font-black italic tracking-tight text-2xl md:text-3xl transition-colors duration-300 leading-none opacity-50 ${textColor}`}
              >
                {' '}FASHION
              </span>
            </Link>

            {/* CENTER — DESKTOP NAV (absolutely positioned) */}
            <nav className="hidden md:flex absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 items-center gap-7 lg:gap-10">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  className={`text-[11px] font-bold tracking-[0.18em] transition-colors duration-200 ${textColor} ${hoverColor}`}
                >
                  {label}
                </Link>
              ))}
            </nav>

            {/* RIGHT — ICONS */}
            <div className={`ml-auto flex items-center gap-1 z-10 ${textColor}`}>
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2.5 transition-colors duration-200 ${hoverColor}`}
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              {/* Account */}
              <div className="hidden sm:block">
                <AuthButton />
              </div>

              {/* Wishlist */}
              <div className="hidden sm:block">
                <WatchlistDrawer>
                  <button className={`p-2.5 relative transition-colors duration-200 ${hoverColor}`}>
                    <User className="w-[18px] h-[18px]" />
                    {wlCount > 0 && (
                      <span className="absolute top-1 right-1 w-3 h-3 bg-white text-black text-[8px] font-black rounded-full flex items-center justify-center leading-none border border-black">
                        {wlCount}
                      </span>
                    )}
                  </button>
                </WatchlistDrawer>
              </div>

              {/* Cart */}
              <CartDrawer>
                <button className={`p-2.5 relative transition-colors duration-200 ${hoverColor}`}>
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  {itemCount > 0 && (
                    <span
                      className={`absolute top-1 right-1 w-3.5 h-3.5 text-[8px] font-black rounded-full flex items-center justify-center leading-none ${
                        scrolled ? 'bg-black text-white' : 'bg-white text-black'
                      }`}
                    >
                      {itemCount}
                    </span>
                  )}
                </button>
              </CartDrawer>

              {/* Mobile hamburger */}
              <button
                onClick={() => setIsMobileOpen(true)}
                className={`md:hidden p-2.5 transition-colors duration-200 ${hoverColor}`}
                aria-label="Menu"
              >
                <Menu className="w-[20px] h-[20px]" />
              </button>
            </div>

          </div>
        </div>
      </header>

      {/* ─── FULLSCREEN SEARCH OVERLAY ──────────────────── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[70] bg-black/95 flex flex-col">
          <div className="flex items-center justify-end px-8 h-16">
            <button onClick={() => setIsSearchOpen(false)} className="text-white/60 hover:text-white p-2">
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-center justify-center px-8">
            <form onSubmit={handleSearch} className="w-full max-w-2xl">
              <input
                ref={searchRef}
                type="text"
                placeholder="SEARCH STYLES, BRANDS..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-transparent border-0 border-b-2 border-white/30 focus:border-white pb-4 text-white text-3xl md:text-5xl font-black italic tracking-tight placeholder-white/20 outline-none transition-colors"
                style={{ caretColor: 'white' }}
              />
              <p className="mt-5 text-white/30 text-xs font-bold tracking-[0.25em] uppercase">
                Press Enter to Search
              </p>
            </form>
          </div>
        </div>
      )}

      {/* ─── MOBILE SIDE MENU ───────────────────────────── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[70] flex">
          <div className="bg-black w-full h-full flex flex-col px-8 py-8">
            <div className="flex items-center justify-between mb-12">
              <span className="text-white text-2xl font-black italic tracking-tight">RAAV FASHION</span>
              <button onClick={() => setIsMobileOpen(false)} className="text-white/50 hover:text-white">
                <X className="w-6 h-6" />
              </button>
            </div>
            <nav className="flex flex-col gap-2">
              {NAV_LINKS.map(({ label, href }) => (
                <Link
                  key={label}
                  href={href}
                  onClick={() => setIsMobileOpen(false)}
                  className="text-4xl font-black italic text-white/80 hover:text-white tracking-tight py-2 transition-colors"
                >
                  {label}
                </Link>
              ))}
            </nav>
            <div className="mt-auto pt-8 border-t border-white/10">
              <AuthButton />
            </div>
          </div>
        </div>
      )}
    </>
  );
}
