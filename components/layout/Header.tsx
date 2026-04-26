"use client";

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Heart, User } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWatchlist } from '@/hooks/useWatchlist';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WatchlistDrawer } from '@/components/watchlist/WatchlistDrawer';
import { AuthButton } from '@/components/auth/AuthButton';
import { getCategories } from '@/lib/products';
import type { Category } from '@/types';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [scrolled, setScrolled] = useState(false);
  const { itemCount } = useCart();
  const { itemCount: watchlistCount } = useWatchlist();
  const router = useRouter();
  const searchRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 40);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  useEffect(() => {
    if (isSearchOpen && searchRef.current) searchRef.current.focus();
  }, [isSearchOpen]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
      setIsSearchOpen(false);
    }
  };

  // Nav links — primary categories shown inline on desktop
  const primaryCategories = categories.slice(0, 5);

  return (
    <>
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          scrolled ? 'bg-white border-b border-gray-100 shadow-sm' : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="flex items-center justify-between h-16 md:h-20">

            {/* LEFT — Mobile hamburger + Desktop nav links */}
            <div className="flex items-center gap-6">
              <button
                onClick={() => setIsMenuOpen(true)}
                className={`md:hidden p-1 transition-colors ${scrolled ? 'text-gray-900' : 'text-white'}`}
                aria-label="Open menu"
              >
                <Menu className="w-6 h-6" />
              </button>

              {/* Desktop links */}
              <nav className="hidden md:flex items-center gap-7">
                {primaryCategories.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className={`text-xs font-bold tracking-[0.12em] uppercase transition-colors hover-underline ${
                      scrolled ? 'text-gray-900 hover:text-black' : 'text-white/80 hover:text-white'
                    }`}
                  >
                    {cat.name}
                  </Link>
                ))}
                <Link
                  href="/categories"
                  className={`text-xs font-bold tracking-[0.12em] uppercase transition-colors hover-underline ${
                    scrolled ? 'text-gray-500 hover:text-black' : 'text-white/50 hover:text-white'
                  }`}
                >
                  All
                </Link>
              </nav>
            </div>

            {/* CENTER — Logo */}
            <Link
              href="/"
              className="absolute left-1/2 -translate-x-1/2 flex flex-col items-center"
            >
              <span
                className={`text-xl md:text-2xl font-black tracking-[0.08em] uppercase transition-colors leading-none ${
                  scrolled ? 'text-black' : 'text-white'
                }`}
              >
                StyleHub
              </span>
              <span
                className={`text-[9px] tracking-[0.3em] uppercase font-medium transition-colors ${
                  scrolled ? 'text-gray-400' : 'text-white/50'
                }`}
              >
                Sri Lanka
              </span>
            </Link>

            {/* RIGHT — Icons */}
            <div className="flex items-center gap-1 md:gap-2">
              {/* Search */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className={`p-2 transition-colors ${scrolled ? 'text-gray-700 hover:text-black' : 'text-white/80 hover:text-white'}`}
                aria-label="Search"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist */}
              <div className="hidden sm:block">
                <WatchlistDrawer>
                  <button className={`p-2 transition-colors relative ${scrolled ? 'text-gray-700 hover:text-black' : 'text-white/80 hover:text-white'}`}>
                    <Heart className="w-5 h-5" />
                    {watchlistCount > 0 && (
                      <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold leading-none">
                        {watchlistCount}
                      </span>
                    )}
                  </button>
                </WatchlistDrawer>
              </div>

              {/* Account */}
              <div className="hidden sm:block">
                <AuthButton />
              </div>

              {/* Cart */}
              <CartDrawer>
                <button className={`p-2 transition-colors relative ${scrolled ? 'text-gray-700 hover:text-black' : 'text-white/80 hover:text-white'}`}>
                  <ShoppingBag className="w-5 h-5" />
                  {itemCount > 0 && (
                    <span className="absolute -top-0.5 -right-0.5 bg-black text-white text-[9px] rounded-full w-3.5 h-3.5 flex items-center justify-center font-bold leading-none">
                      {itemCount}
                    </span>
                  )}
                </button>
              </CartDrawer>
            </div>

          </div>
        </div>
      </header>

      {/* FULLSCREEN SEARCH OVERLAY */}
      {isSearchOpen && (
        <div className="fixed inset-0 z-[60] bg-white flex flex-col">
          <div className="flex items-center justify-between px-6 md:px-10 h-16 md:h-20 border-b border-gray-100">
            <span className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400">Search</span>
            <button
              onClick={() => setIsSearchOpen(false)}
              className="p-2 text-gray-900 hover:text-black"
            >
              <X className="w-6 h-6" />
            </button>
          </div>
          <div className="flex-1 flex items-start pt-16 px-6 md:px-10">
            <form onSubmit={handleSearch} className="w-full max-w-3xl mx-auto">
              <div className="relative">
                <input
                  ref={searchRef}
                  type="text"
                  placeholder="Search styles, brands, categories..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full text-3xl md:text-5xl font-light text-gray-900 placeholder-gray-300 border-0 border-b-2 border-gray-200 focus:border-black pb-4 pr-12 outline-none bg-transparent transition-colors"
                />
                <button type="submit" className="absolute right-0 bottom-4 text-gray-400 hover:text-black transition-colors">
                  <Search className="w-6 h-6" />
                </button>
              </div>
              <p className="mt-5 text-xs text-gray-400 tracking-widest uppercase">Press Enter to search</p>
            </form>
          </div>
        </div>
      )}

      {/* MOBILE SIDE MENU */}
      {isMenuOpen && (
        <div className="fixed inset-0 z-[60] flex">
          <div className="bg-black text-white w-80 max-w-full h-full flex flex-col py-8 px-8 overflow-y-auto">
            <div className="flex items-center justify-between mb-12">
              <span className="text-sm font-black tracking-[0.15em] uppercase">StyleHub LK</span>
              <button onClick={() => setIsMenuOpen(false)} className="text-white/60 hover:text-white p-1">
                <X className="w-5 h-5" />
              </button>
            </div>

            <nav className="flex-1 space-y-1">
              {categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  onClick={() => setIsMenuOpen(false)}
                  className="block py-3 text-xl font-bold text-white/80 hover:text-white transition-colors hover-underline"
                >
                  {cat.name}
                </Link>
              ))}
            </nav>

            <div className="border-t border-white/10 pt-6 mt-6 space-y-4">
              <Link href="/account" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                <User className="w-4 h-4" />
                My Account
              </Link>
              <Link href="/help" onClick={() => setIsMenuOpen(false)} className="flex items-center gap-3 text-sm text-white/60 hover:text-white transition-colors">
                Help & Support
              </Link>
            </div>
          </div>
          {/* Backdrop */}
          <div className="flex-1 bg-black/40 backdrop-blur-sm" onClick={() => setIsMenuOpen(false)} />
        </div>
      )}
    </>
  );
}
