"use client";

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Search, ShoppingBag, Menu, X, Heart, CircleHelp as HelpCircle, AlignJustify, ChevronDown, Shirt } from 'lucide-react';
import { useCart } from '@/hooks/useCart';
import { useWatchlist } from '@/hooks/useWatchlist';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { WatchlistDrawer } from '@/components/watchlist/WatchlistDrawer';
import { AuthButton } from '@/components/auth/AuthButton';
import { getCategories } from '@/lib/products';
import type { Category } from '@/types';

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isCategoriesOpen, setIsCategoriesOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [categories, setCategories] = useState<Category[]>([]);
  const { itemCount } = useCart();
  const { itemCount: watchlistCount } = useWatchlist();
  const router = useRouter();

  useEffect(() => {
    getCategories().then(setCategories);
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
      setSearchQuery('');
    }
  };

  return (
    <>
      <header className="bg-white shadow-sm border-b sticky top-0 z-40">
        {/* Top Bar */}
        <div className="bg-gray-900 text-white text-xs py-2 px-4 text-center hidden md:block">
          <span>Free island-wide delivery on orders above Rs. 3,000 &nbsp;|&nbsp; Easy 30-day returns &nbsp;|&nbsp; 100% authentic products</span>
        </div>

        {/* Main Header */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            {/* Logo */}
            <Link href="/" className="flex items-center space-x-2 flex-shrink-0">
              <div className="w-9 h-9 bg-rose-600 rounded-lg flex items-center justify-center">
                <Shirt className="w-5 h-5 text-white" />
              </div>
              <div>
                <h1 className="text-lg font-extrabold text-gray-900 leading-none tracking-tight">StyleHub LK</h1>
                <p className="text-xs text-gray-500 leading-none">Fashion & Lifestyle</p>
              </div>
            </Link>

            {/* Search Bar - Desktop */}
            <div className="hidden md:flex flex-1 max-w-2xl mx-8">
              <form onSubmit={handleSearch} className="relative w-full">
                <input
                  type="text"
                  placeholder="Search for clothes, brands, styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-11 pr-4 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-gray-50 text-sm"
                />
                <button
                  type="submit"
                  className="absolute left-3.5 top-3 text-gray-400 hover:text-rose-500 transition-colors"
                >
                  <Search className="h-4 w-4" />
                </button>
              </form>
            </div>

            {/* Right Side Icons */}
            <div className="flex items-center space-x-1">
              <Link href="/help" className="hidden md:flex items-center space-x-1 px-3 py-2 text-gray-600 hover:text-rose-600 transition-colors text-sm">
                <HelpCircle className="w-4 h-4" />
                <span className="font-medium">Help</span>
              </Link>

              <button className="md:hidden p-2 text-gray-600 hover:text-gray-900">
                <Link href="/search">
                  <Search className="w-5 h-5" />
                </Link>
              </button>

              <div className="hidden sm:block">
                <WatchlistDrawer>
                  <button className="flex p-2 text-gray-600 hover:text-rose-600 transition-colors relative">
                    <Heart className="w-5 h-5" />
                    {watchlistCount > 0 && (
                      <span className="absolute -top-1 -right-1 bg-rose-500 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                        {watchlistCount}
                      </span>
                    )}
                  </button>
                </WatchlistDrawer>
              </div>

              <div className="hidden sm:block">
                <AuthButton />
              </div>

              <CartDrawer>
                <button className="flex items-center space-x-1.5 px-3 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors relative text-sm font-medium">
                  <ShoppingBag className="w-4 h-4" />
                  <span className="hidden sm:block">Bag</span>
                  {itemCount > 0 && (
                    <span className="absolute -top-1 -right-1 bg-gray-900 text-white text-xs rounded-full w-4 h-4 flex items-center justify-center font-bold">
                      {itemCount}
                    </span>
                  )}
                </button>
              </CartDrawer>

              <button
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="md:hidden p-2 text-gray-600 hover:text-gray-900"
              >
                {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="border-t border-gray-100 bg-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="hidden md:flex items-center space-x-1 py-3">
              <div className="relative mr-2">
                <button
                  onClick={() => setIsCategoriesOpen(!isCategoriesOpen)}
                  className="flex items-center space-x-2 px-4 py-2 bg-rose-600 text-white rounded-lg hover:bg-rose-700 transition-colors font-medium text-sm"
                >
                  <AlignJustify className="w-4 h-4" />
                  <span>All Categories</span>
                  <ChevronDown className={`w-3.5 h-3.5 transition-transform ${isCategoriesOpen ? 'rotate-180' : ''}`} />
                </button>

                {isCategoriesOpen && (
                  <>
                    <div className="fixed inset-0 z-10" onClick={() => setIsCategoriesOpen(false)} />
                    <div className="absolute top-full left-0 mt-2 w-60 bg-white rounded-xl shadow-xl border border-gray-100 py-2 z-20">
                      {categories.map((category) => (
                        <Link
                          key={category.id}
                          href={`/categories/${category.slug}`}
                          onClick={() => setIsCategoriesOpen(false)}
                          className="block px-4 py-2.5 text-sm text-gray-700 hover:bg-rose-50 hover:text-rose-600 transition-colors"
                        >
                          {category.name}
                        </Link>
                      ))}
                    </div>
                  </>
                )}
              </div>

              {categories.slice(0, 6).map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="text-sm text-gray-700 hover:text-rose-600 font-medium transition-colors whitespace-nowrap px-3 py-2 rounded-lg hover:bg-rose-50"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        </nav>

        {/* Mobile Menu */}
        {isMenuOpen && (
          <div className="md:hidden bg-white border-t border-gray-100">
            <div className="px-4 py-3 space-y-2">
              <form onSubmit={handleSearch} className="relative mb-4">
                <input
                  type="text"
                  placeholder="Search styles..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full px-4 py-2.5 pl-10 border border-gray-200 rounded-xl focus:ring-2 focus:ring-rose-400 text-sm"
                />
                <button type="submit" className="absolute left-3 top-3 text-gray-400">
                  <Search className="h-4 w-4" />
                </button>
              </form>

              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/categories/${category.slug}`}
                  className="block py-2.5 px-3 text-gray-700 hover:text-rose-600 font-medium rounded-lg hover:bg-rose-50 transition-colors text-sm"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {category.name}
                </Link>
              ))}

              <div className="border-t border-gray-100 pt-3 mt-2 space-y-2">
                <div className="py-1">
                  <AuthButton />
                </div>
                <WatchlistDrawer>
                  <button className="w-full text-left py-2.5 px-3 text-gray-700 hover:text-rose-600 text-sm rounded-lg hover:bg-rose-50">
                    Wishlist ({watchlistCount})
                  </button>
                </WatchlistDrawer>
                <Link
                  href="/help"
                  className="block py-2.5 px-3 text-gray-700 hover:text-rose-600 text-sm rounded-lg hover:bg-rose-50"
                  onClick={() => setIsMenuOpen(false)}
                >
                  Help & Support
                </Link>
              </div>
            </div>
          </div>
        )}
      </header>
    </>
  );
}
