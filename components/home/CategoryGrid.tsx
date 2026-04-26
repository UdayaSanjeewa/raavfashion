'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/products';
import { ArrowRight } from 'lucide-react';
import type { Category } from '@/types';

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    getCategories().then((data) => { setCategories(data); setIsLoading(false); });
  }, []);

  return (
    <section className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex items-end justify-between mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Curated For You</p>
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-none">
              Shop by Category
            </h2>
          </div>
          <Link
            href="/categories"
            className="hidden md:flex items-center gap-2 text-sm font-bold tracking-wider uppercase text-black hover-underline group"
          >
            View All
            <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            {/* Primary grid — first two categories large, rest smaller */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
              {/* First two — tall */}
              {categories.slice(0, 2).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative overflow-hidden bg-gray-100 col-span-1 md:col-span-1 row-span-2"
                  style={{ aspectRatio: '3/4' }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover img-zoom"
                  />
                  {/* Overlay */}
                  <div className="absolute inset-0 bg-black/20 group-hover:bg-black/40 transition-colors duration-500" />
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-5">
                    <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/70 mb-1">
                      {cat.productCount > 0 ? `${cat.productCount}+ items` : 'Explore'}
                    </p>
                    <h3 className="text-lg font-black text-white leading-tight">
                      {cat.name}
                    </h3>
                    <div className="mt-3 flex items-center gap-1.5 text-[10px] font-bold tracking-[0.15em] uppercase text-white/0 group-hover:text-white/90 transition-all duration-300 translate-y-1 group-hover:translate-y-0">
                      Shop Now <ArrowRight className="w-3 h-3" />
                    </div>
                  </div>
                </Link>
              ))}

              {/* Remaining — shorter */}
              {categories.slice(2).map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative overflow-hidden bg-gray-100"
                  style={{ aspectRatio: '1/1' }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover img-zoom"
                  />
                  <div className="absolute inset-0 bg-black/25 group-hover:bg-black/50 transition-colors duration-500" />
                  <div className="absolute bottom-0 left-0 right-0 p-4">
                    <h3 className="text-sm font-black text-white leading-tight">
                      {cat.name}
                    </h3>
                  </div>
                </Link>
              ))}
            </div>

            {/* Mobile view all */}
            <div className="mt-8 text-center md:hidden">
              <Link
                href="/categories"
                className="inline-flex items-center gap-2 border border-black text-black px-8 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-black hover:text-white transition-colors duration-200"
              >
                View All Categories
              </Link>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
