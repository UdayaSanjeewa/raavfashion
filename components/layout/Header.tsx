"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, X, Menu, ChevronDown } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWatchlist } from '@/hooks/useWatchlist';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WatchlistDrawer } from '@/components/watchlist/WatchlistDrawer';
import { AuthButton } from '@/components/auth/AuthButton';

/*
  RAAV FASHION – Header
  ─────────────────────
  Kelly Felder-inspired layout:
  • Top announcement bar (slim, black, rotating messages)
  • Logo CENTERED in header bar
  • Nav LEFT side
  • Icons RIGHT side
  • Solid white background (not transparent) — clean editorial feel
  • Subtle bottom border
*/

const NAV_LINKS = [
  {
    label: 'New Arrivals',
    href: '/search?sort=new',
    dropdown: null,
  },
  {
    label: 'Women',
    href: '/categories/womens-fashion',
    dropdown: [
      { name: 'All Women', href: '/categories/womens-fashion' },
      { name: 'Dresses', href: '/search?q=dresses' },
      { name: 'Tops & Blouses', href: '/search?q=tops' },
      { name: 'Workwear', href: '/search?q=workwear' },
      { name: 'Casual Wear', href: '/search?q=casual' },
    ],
  },
  {
    label: 'Men',
    href: '/categories/mens-fashion',
    dropdown: [
      { name: 'All Men', href: '/categories/mens-fashion' },
      { name: 'Shirts', href: '/search?q=shirts' },
      { name: 'Trousers', href: '/search?q=trousers' },
      { name: 'Formal Wear', href: '/search?q=formal' },
    ],
  },
  {
    label: 'Collections',
    href: '/categories',
    dropdown: [
      { name: 'Traditional & Ethnic', href: '/categories/traditional-ethnic' },
      { name: 'Accessories', href: '/categories/accessories' },
      { name: 'Shoes', href: '/categories/shoes-footwear' },
      { name: 'Sportswear', href: '/categories/sportswear' },
    ],
  },
  {
    label: 'Sale',
    href: '/search?sale=true',
    dropdown: null,
  },
];

const ANNOUNCEMENTS = [
  'FREE SHIPPING ON ORDERS OVER RS. 3,000',
  'NEW ARRIVALS EVERY WEEK — SHOP THE LATEST',
  'VERIFIED SELLERS · PREMIUM QUALITY · EASY RETURNS',
];

export function Header() {
  const [announcementIdx, setAnnouncementIdx] = useState(0);
  const [isSearchOpen, setIsSearchOpen]       = useState(false);
  const [isMobileOpen, setIsMobileOpen]       = useState(false);
  const [searchQuery, setSearchQuery]         = useState('');
  const [activeDropdown, setActiveDropdown]   = useState<string | null>(null);
  const { itemCount }                         = useCart();
  const { itemCount: wlCount }                = useWatchlist();
  const router                                = useRouter();
  const searchRef                             = useRef<HTMLInputElement>(null);
  const dropdownTimer                         = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    const timer = setInterval(() => {
      setAnnouncementIdx((i) => (i + 1) % ANNOUNCEMENTS.length);
    }, 4000);
    return () => clearInterval(timer);
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

  const openDropdown = (label: string) => {
    if (dropdownTimer.current) clearTimeout(dropdownTimer.current);
    setActiveDropdown(label);
  };

  const closeDropdown = () => {
    dropdownTimer.current = setTimeout(() => setActiveDropdown(null), 120);
  };

  return (
    <>
      {/* ── ANNOUNCEMENT BAR ── */}
      <div className="bg-black text-white text-center py-2.5 px-4 overflow-hidden">
        <p className="text-[11px] font-semibold tracking-[0.2em] uppercase transition-all duration-500">
          {ANNOUNCEMENTS[announcementIdx]}
        </p>
      </div>

      {/* ── MAIN HEADER ── */}
      <header className="sticky top-0 z-50 bg-white border-b border-gray-100">
        <div className="w-full px-5 md:px-10">
          <div className="relative flex items-center h-14 md:h-16">

            {/* LEFT — DESKTOP NAV */}
            <nav className="hidden lg:flex items-center gap-6 xl:gap-8 flex-1">
              {NAV_LINKS.map(({ label, href, dropdown }) => (
                <div
                  key={label}
                  className="relative"
                  onMouseEnter={() => dropdown && openDropdown(label)}
                  onMouseLeave={() => dropdown && closeDropdown()}
                >
                  <Link
                    href={href}
                    className={`flex items-center gap-0.5 text-[12px] font-medium tracking-wide text-gray-800 hover:text-black transition-colors py-1 ${
                      label === 'Sale' ? 'text-red-600 hover:text-red-700 font-semibold' : ''
                    }`}
                  >
                    {label}
                    {dropdown && <ChevronDown className="w-3 h-3 ml-0.5 opacity-50" />}
                  </Link>

                  {/* Dropdown */}
                  {dropdown && activeDropdown === label && (
                    <div
                      className="absolute top-full left-0 pt-3 z-50"
                      onMouseEnter={() => openDropdown(label)}
                      onMouseLeave={() => closeDropdown()}
                    >
                      <div className="bg-white border border-gray-100 shadow-lg py-2 min-w-[180px]">
                        {dropdown.map((item) => (
                          <Link
                            key={item.name}
                            href={item.href}
                            className="block px-5 py-2.5 text-[12px] text-gray-600 hover:text-black hover:bg-gray-50 transition-colors"
                          >
                            {item.name}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </nav>

            {/* CENTER — LOGO */}
            <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
              <Link href="/" className="flex items-center">
                <span
                  className="font-black italic text-black leading-none select-none"
                  style={{
                    fontFamily: 'var(--font-bc), Impact, sans-serif',
                    fontStyle: 'italic',
                    fontWeight: 900,
                    fontSize: 'clamp(1.25rem, 2.5vw, 1.6rem)',
                    letterSpacing: '-0.02em',
                  }}
                >
                  RAAV<span className="opacity-40 ml-1.5">FASHION</span>
                </span>
              </Link>
            </div>

            {/* RIGHT — ICONS */}
            <div className="ml-auto flex items-center gap-0.5">
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-2.5 text-gray-700 hover:text-black transition-colors"
                aria-label="Search"
              >
                <Search className="w-[18px] h-[18px]" />
              </button>

              <div className="hidden sm:block">
                <AuthButton />
              </div>

              <div className="hidden sm:block">
                <WatchlistDrawer>
                  <button className="p-2.5 relative text-gray-700 hover:text-black transition-colors">
                    <Heart className="w-[18px] h-[18px]" />
                    {wlCount > 0 && (
                      <span className="absolute top-1.5 right-1 w-[14px] h-[14px] bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                        {wlCount}
                      </span>
                    )}
                  </button>
                </WatchlistDrawer>
              </div>

              <CartDrawer>
                <button className="p-2.5 relative text-gray-700 hover:text-black transition-colors">
                  <ShoppingBag className="w-[18px] h-[18px]" />
                  {itemCount > 0 && (
                    <span className="absolute top-1.5 right-1 w-[14px] h-[14px] bg-black text-white text-[8px] font-black rounded-full flex items-center justify-center leading-none">
                      {itemCount}
                    </span>
                  )}
                </button>
              </CartDrawer>

              <button
                onClick={() => setIsMobileOpen(true)}
                className="lg:hidden p-2.5 text-gray-700 hover:text-black transition-colors"
                aria-label="Menu"
              >
                <Menu className="w-[20px] h-[20px]" />
              </button>
            </div>

          </div>
        </div>

        {/* Mobile nav bar — second row on small screens */}
        <div className="lg:hidden flex items-center gap-4 overflow-x-auto scrollbar-hide px-5 py-2 border-t border-gray-50">
          {NAV_LINKS.map(({ label, href }) => (
            <Link
              key={label}
              href={href}
              className={`text-[11px] font-medium whitespace-nowrap text-gray-600 hover:text-black transition-colors py-0.5 flex-shrink-0 ${
                label === 'Sale' ? 'text-red-600 font-semibold' : ''
              }`}
            >
              {label}
            </Link>
          ))}
        </div>
      </header>

      {/* ── SEARCH OVERLAY ── */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col">
          <div className="flex items-center justify-between px-8 h-16 border-b border-gray-100">
            <span
              className="font-black italic text-black text-xl"
              style={{ fontFamily: 'var(--font-bc), Impact, sans-serif' }}
            >
              SEARCH
            </span>
            <button onClick={() => setIsSearchOpen(false)} className="text-gray-400 hover:text-black p-2 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <div className="flex-1 flex flex-col items-center justify-center px-8 -mt-16">
            <form onSubmit={handleSearch} className="w-full max-w-xl">
              <div className="relative">
                <Search className="absolute left-0 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-300" />
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search for styles, brands..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-transparent border-0 border-b-2 border-gray-200 focus:border-black pl-8 pb-4 text-black text-2xl md:text-3xl font-medium placeholder-gray-200 outline-none transition-colors"
                />
              </div>
              <p className="mt-5 text-gray-300 text-xs tracking-[0.2em] uppercase">Press Enter to Search</p>
            </form>
          </div>
        </div>
      )}

      {/* ── MOBILE MENU ── */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[70] bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 h-14 border-b border-gray-100">
            <span
              className="font-black italic text-black text-xl"
              style={{ fontFamily: 'var(--font-bc), Impact, sans-serif' }}
            >
              RAAV FASHION
            </span>
            <button onClick={() => setIsMobileOpen(false)} className="text-gray-400 hover:text-black p-1 transition-colors">
              <X className="w-5 h-5" />
            </button>
          </div>
          <nav className="flex flex-col divide-y divide-gray-50 px-6 overflow-y-auto flex-1">
            {NAV_LINKS.map(({ label, href }) => (
              <Link
                key={label}
                href={href}
                onClick={() => setIsMobileOpen(false)}
                className={`py-4 text-base font-medium text-gray-800 hover:text-black transition-colors ${
                  label === 'Sale' ? 'text-red-600' : ''
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
          <div className="p-6 border-t border-gray-100">
            <AuthButton />
          </div>
        </div>
      )}
    </>
  );
}
