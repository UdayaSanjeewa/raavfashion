'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { WatchlistButton } from '@/components/watchlist/WatchlistButton';
import type { Product } from '@/types';

/*
  RAAV FASHION – Featured Products
  ──────────────────────────────────
  Grid of product cards with:
  • No border/shadow — clean white background
  • Bold italic product title
  • Price in black
  • Hover: quick-add slides up from bottom
  • Section header in italic condensed bold uppercase (Carnage-style)
*/

export function FeaturedProducts() {
  const [products, setProducts]   = useState<Product[]>([]);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState<'all' | 'women' | 'men' | 'new'>('all');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const { data: cats } = await supabase.from('categories').select('*');
    const { data: rows } = await supabase
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(16);

    if (!rows || !cats) { setLoading(false); return; }

    const catMap = new Map(cats.map((c: Record<string, unknown>) => [c.id, c]));
    const fallback = { id: '', name: 'Uncategorized', slug: 'uncategorized', image: '', productCount: 0 };

    const formatted: Product[] = rows.map((p: Record<string, unknown>) => {
      const c = (catMap.get(p.category_id as string) || {}) as Record<string, unknown>;
      return {
        id: p.id as string,
        title: p.title as string,
        description: (p.description as string) || '',
        price: p.price as number,
        originalPrice: p.original_price as number | undefined,
        images: (p.images as string[]) || [],
        category: c.id
          ? { id: c.id as string, name: c.name as string, slug: c.slug as string, image: (c.image_url || c.image) as string, productCount: 0 }
          : fallback,
        condition: (p.condition as 'new' | 'used' | 'refurbished') || 'new',
        location: (p.location as string) || '',
        seller_id: (p.seller_id as string) || '',
        seller: { id: (p.seller_id as string) || '', name: (p.seller_name as string) || 'Vendor', avatar: p.seller_avatar as string, rating: (p.seller_rating as number) || 5 },
        sizes: (p.sizes as string[]) || [],
        colors: (p.colors as string[]) || [],
        gender: (p.gender as 'men' | 'women' | 'kids' | 'unisex') || 'unisex',
        material: (p.material as string) || '',
        brand: (p.brand as string) || '',
        style: (p.style as string) || '',
        stockQuantity: (p.stock_quantity as number) || 0,
        features: (p.features as string[]) || [],
        tags: (p.tags as string[]) || [],
        createdAt: p.created_at as string,
        updatedAt: p.updated_at as string,
        isNew: p.is_new as boolean,
        isFeatured: p.is_featured as boolean,
      };
    });

    setProducts(formatted);
    setLoading(false);
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(n);

  const FILTERS: { key: typeof filter; label: string }[] = [
    { key: 'all',   label: 'ALL'    },
    { key: 'women', label: 'WOMEN'  },
    { key: 'men',   label: 'MEN'    },
    { key: 'new',   label: 'NEW IN' },
  ];

  const visible = products.filter((p) => {
    if (filter === 'all')   return true;
    if (filter === 'new')   return !!p.isNew;
    if (filter === 'women') return p.gender === 'women' || p.gender === 'unisex';
    if (filter === 'men')   return p.gender === 'men'   || p.gender === 'unisex';
    return true;
  });

  return (
    <section className="bg-white pt-20 pb-24">
      <div className="px-8 md:px-14">

        {/* ── HEADER ── */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10">
          <div>
            <p className="text-[10px] font-bold tracking-[0.3em] uppercase text-gray-400 mb-2">
              Handpicked
            </p>
            <h2
              style={{
                fontFamily: 'var(--font-bc), Impact, sans-serif',
                fontStyle: 'italic',
                fontWeight: 900,
                fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
                lineHeight: 0.92,
                letterSpacing: '-0.01em',
                textTransform: 'uppercase',
              }}
            >
              FEATURED STYLES
            </h2>
          </div>

          {/* Filter tabs */}
          <div className="flex items-center gap-0 border border-black">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-5 py-2.5 text-[10px] font-black tracking-[0.18em] transition-colors duration-150 ${
                  filter === f.key
                    ? 'bg-black text-white'
                    : 'bg-white text-black hover:bg-gray-50'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="aspect-[3/4] bg-gray-100 animate-pulse" />
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm tracking-widest uppercase">No products yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-1">
            {visible.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              return (
                <div key={product.id} className="group bg-white">
                  {/* ── IMAGE ── */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover img-zoom"
                      />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="bg-black text-white text-[9px] font-black tracking-[0.15em] uppercase px-2.5 py-1">
                          NEW
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="bg-white text-black text-[9px] font-black tracking-[0.12em] uppercase px-2.5 py-1 border border-black">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist — appears on hover */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <WatchlistButton product={product} className="bg-white h-8 w-8 rounded-none shadow-none border border-gray-200" />
                    </div>

                    {/* Quick add — slides up on hover */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
                      <AddToCartButton
                        product={product}
                        size="sm"
                        className="w-full rounded-none h-11 text-[10px] tracking-[0.2em] font-black uppercase bg-black text-white hover:bg-gray-900 border-0"
                      />
                    </div>
                  </div>

                  {/* ── INFO ── */}
                  <Link href={`/product/${product.id}`} className="block pt-3 pb-1 px-0.5">
                    {product.brand && (
                      <p className="text-[10px] font-bold tracking-[0.2em] uppercase text-gray-400 mb-0.5">
                        {product.brand}
                      </p>
                    )}
                    <h3
                      className="text-sm font-semibold text-gray-900 leading-snug line-clamp-1 group-hover:text-black"
                    >
                      {product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1.5">
                      <span className="text-sm font-black text-black">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    {/* Size preview */}
                    {product.sizes && product.sizes.length > 0 && (
                      <p className="text-[10px] text-gray-400 mt-1 tracking-wide">
                        {product.sizes.slice(0, 5).join('  ·  ')}
                      </p>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* ── VIEW ALL ── */}
        {!loading && (
          <div className="mt-14 text-center">
            <Link
              href="/search"
              className="inline-block border-2 border-black text-black text-xs font-black tracking-[0.25em] uppercase px-12 py-4 hover:bg-black hover:text-white transition-colors duration-200"
            >
              VIEW ALL PRODUCTS
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
