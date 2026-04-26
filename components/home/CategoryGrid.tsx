'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/products';
import type { Category } from '@/types';

/*
  RAAV FASHION – Category Grid
  ─────────────────────────────
  Kelly Felder-inspired editorial layout:
  • Full-width two-column split (Women / Men) with tall portrait images
  • 4-column mini grid below for sub-categories
  • Clean sans-serif labels, not italic headlines
  • Hover: subtle image scale + underline label
*/

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getCategories().then((d) => { setCategories(d); setLoading(false); });
  }, []);

  const hero = categories.slice(0, 2);
  const sub  = categories.slice(2, 6);

  if (loading) {
    return (
      <section className="bg-white py-10">
        <div className="grid grid-cols-2 gap-3 px-5 md:px-10">
          {[0, 1].map((i) => (
            <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
          ))}
        </div>
      </section>
    );
  }

  return (
    <section className="bg-white">

      {/* ── SECTION HEADER ── */}
      <div className="px-5 md:px-10 pt-14 pb-8 flex items-center justify-between">
        <h2 className="text-xl font-semibold text-black tracking-tight">Shop by Category</h2>
        <Link
          href="/categories"
          className="text-[11px] font-medium text-gray-500 hover:text-black tracking-widest uppercase transition-colors border-b border-gray-300 hover:border-black pb-0.5"
        >
          View All
        </Link>
      </div>

      {/* ── HERO PAIR ── */}
      {hero.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-2 px-5 md:px-10">
          {hero.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden bg-gray-100"
              style={{ aspectRatio: '3/4' }}
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                />
              )}
              {/* bottom gradient */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />

              {/* Label */}
              <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                <h3 className="text-white text-2xl md:text-3xl font-semibold tracking-tight mb-3">
                  {cat.name}
                </h3>
                <span className="inline-block text-white text-[11px] font-semibold tracking-[0.18em] uppercase border-b border-white pb-0.5 group-hover:border-white/60 transition-colors">
                  Shop Now
                </span>
              </div>
            </Link>
          ))}
        </div>
      )}

      {/* ── SUB CATEGORIES ── */}
      {sub.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2 px-5 md:px-10 pt-2 pb-10">
          {sub.map((cat) => (
            <Link
              key={cat.id}
              href={`/categories/${cat.slug}`}
              className="group relative overflow-hidden bg-gray-100"
              style={{ aspectRatio: '1/1' }}
            >
              {cat.image && (
                <Image
                  src={cat.image}
                  alt={cat.name}
                  fill
                  className="object-cover transition-transform duration-700 group-hover:scale-[1.05]"
                />
              )}
              <div className="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent" />
              <div className="absolute bottom-0 left-0 right-0 p-4">
                <h3 className="text-white text-sm font-semibold tracking-tight">{cat.name}</h3>
                {cat.productCount > 0 && (
                  <p className="text-white/50 text-[10px] mt-0.5 tracking-widest uppercase">{cat.productCount}+ items</p>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </section>
  );
}
