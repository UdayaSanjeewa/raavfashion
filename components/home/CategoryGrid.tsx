'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { getCategories } from '@/lib/products';
import type { Category } from '@/types';

/*
  RAAV FASHION – Category Grid
  ─────────────────────────────
  Two large featured categories side-by-side (full bleed image, white text overlay)
  then a horizontal scrollable strip of smaller category cards below.
  Style: dark, athletic, bold italic labels — matching Carnage/RAAV look.
*/

export function CategoryGrid() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading]       = useState(true);

  useEffect(() => {
    getCategories().then((d) => { setCategories(d); setLoading(false); });
  }, []);

  const hero    = categories.slice(0, 2);   // Women, Men — large blocks
  const rest    = categories.slice(2);      // the rest as smaller strip

  return (
    <section className="bg-white">

      {/* ── SECTION LABEL ── */}
      <div className="px-8 md:px-14 pt-16 pb-8 flex items-end justify-between">
        <div>
          <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-2">
            Collections
          </p>
          <h2
            className="font-display text-5xl md:text-6xl lg:text-7xl text-black leading-none"
            style={{ fontFamily: 'var(--font-bc), Impact, sans-serif', fontStyle: 'italic', fontWeight: 900 }}
          >
            SHOP BY CATEGORY
          </h2>
        </div>
        <Link
          href="/categories"
          className="hidden md:block text-[11px] font-bold tracking-[0.2em] uppercase text-black border-b-2 border-black pb-0.5 hover:text-gray-600 hover:border-gray-600 transition-colors"
        >
          VIEW ALL
        </Link>
      </div>

      {loading ? (
        <div className="grid grid-cols-2 gap-1 px-1 pb-1">
          {[0, 1].map((i) => <div key={i} className="aspect-[2/3] bg-gray-100 animate-pulse" />)}
        </div>
      ) : (
        <>
          {/* ── HERO PAIR — large side-by-side ── */}
          {hero.length > 0 && (
            <div className="grid grid-cols-2 gap-[3px] px-0">
              {hero.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/categories/${cat.slug}`}
                  className="group relative overflow-hidden bg-gray-900"
                  style={{ aspectRatio: '2/3' }}
                >
                  <Image
                    src={cat.image}
                    alt={cat.name}
                    fill
                    className="object-cover img-zoom opacity-90 group-hover:opacity-80 transition-opacity duration-500"
                  />
                  {/* Bottom gradient */}
                  <div
                    className="absolute inset-0"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.65) 0%, rgba(0,0,0,0) 55%)' }}
                  />
                  {/* Label */}
                  <div className="absolute bottom-0 left-0 right-0 p-6 md:p-8">
                    <h3
                      className="text-white leading-none mb-3"
                      style={{
                        fontFamily: 'var(--font-bc), Impact, sans-serif',
                        fontStyle: 'italic',
                        fontWeight: 900,
                        fontSize: 'clamp(2rem, 4vw, 3.5rem)',
                        textTransform: 'uppercase',
                        letterSpacing: '-0.01em',
                      }}
                    >
                      {cat.name}
                    </h3>
                    <span className="inline-block bg-white text-black text-[10px] font-black tracking-[0.18em] uppercase px-5 py-2.5 group-hover:bg-gray-100 transition-colors duration-200">
                      SHOP NOW
                    </span>
                  </div>
                </Link>
              ))}
            </div>
          )}

          {/* ── REST — horizontal scroll strip ── */}
          {rest.length > 0 && (
            <div className="overflow-x-auto scrollbar-hide px-0 pt-[3px]">
              <div className="flex gap-[3px]" style={{ minWidth: 'max-content' }}>
                {rest.map((cat) => (
                  <Link
                    key={cat.id}
                    href={`/categories/${cat.slug}`}
                    className="group relative overflow-hidden bg-gray-900 flex-shrink-0"
                    style={{ width: 260, aspectRatio: '3/4' }}
                  >
                    <Image
                      src={cat.image}
                      alt={cat.name}
                      fill
                      className="object-cover img-zoom opacity-90 group-hover:opacity-75 transition-opacity duration-500"
                    />
                    <div
                      className="absolute inset-0"
                      style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 50%)' }}
                    />
                    <div className="absolute bottom-0 left-0 right-0 p-5">
                      <h3
                        className="text-white text-xl leading-tight"
                        style={{
                          fontFamily: 'var(--font-bc), Impact, sans-serif',
                          fontStyle: 'italic',
                          fontWeight: 900,
                          textTransform: 'uppercase',
                        }}
                      >
                        {cat.name}
                      </h3>
                      {cat.productCount > 0 && (
                        <p className="text-white/50 text-[10px] font-semibold tracking-widest uppercase mt-1">
                          {cat.productCount}+ items
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </>
      )}
    </section>
  );
}
