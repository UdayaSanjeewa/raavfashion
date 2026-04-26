'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { Heart } from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { WatchlistButton } from '@/components/watchlist/WatchlistButton';
import type { Product } from '@/types';

/*
  RAAV FASHION – Featured Products
  ──────────────────────────────────
  Kelly Felder-inspired product cards:
  • Clean white cards, subtle hover shadow
  • Size pills shown below image
  • Color dot swatches
  • "Quick View" on hover
  • Filter tabs above grid
*/

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading]   = useState(true);
  const [filter, setFilter]     = useState<'all' | 'women' | 'men' | 'new'>('all');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const { data: cats } = await supabase.from('categories').select('*');
    const { data: rows } = await supabase
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(20);

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

  const FILTERS = [
    { key: 'all'   as const, label: 'All'       },
    { key: 'women' as const, label: 'Women'     },
    { key: 'men'   as const, label: 'Men'       },
    { key: 'new'   as const, label: 'New In'    },
  ];

  const visible = products.filter((p) => {
    if (filter === 'all')   return true;
    if (filter === 'new')   return !!p.isNew;
    if (filter === 'women') return p.gender === 'women' || p.gender === 'unisex';
    if (filter === 'men')   return p.gender === 'men'   || p.gender === 'unisex';
    return true;
  });

  // Color name → approximate hex for swatches
  const colorHex: Record<string, string> = {
    black: '#111', white: '#fff', red: '#e53', blue: '#3b82f6', navy: '#1e3a5f',
    green: '#16a34a', pink: '#f472b6', beige: '#e8d5b7', brown: '#92400e',
    grey: '#9ca3af', gray: '#9ca3af', yellow: '#fbbf24', orange: '#f97316',
    purple: '#a855f7', cream: '#fef3c7', khaki: '#a3854a',
  };

  const getColorHex = (name: string) =>
    colorHex[name.toLowerCase()] || '#ccc';

  return (
    <section className="bg-white py-14">
      <div className="px-5 md:px-10">

        {/* ── HEADER ── */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-5 mb-8">
          <h2 className="text-xl font-semibold text-black tracking-tight">Featured Styles</h2>

          {/* Filter tabs */}
          <div className="flex items-center gap-1">
            {FILTERS.map((f) => (
              <button
                key={f.key}
                onClick={() => setFilter(f.key)}
                className={`px-4 py-1.5 text-[11px] font-medium rounded-full transition-all duration-150 ${
                  filter === f.key
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:text-black hover:bg-gray-100'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {/* ── GRID ── */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-5">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i}>
                <div className="aspect-[3/4] bg-gray-100 animate-pulse mb-3" />
                <div className="h-3 bg-gray-100 animate-pulse w-2/3 mb-2" />
                <div className="h-3 bg-gray-100 animate-pulse w-1/3" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No products found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-x-4 gap-y-8 md:gap-x-5 md:gap-y-10">
            {visible.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;

              return (
                <div key={product.id} className="group">
                  {/* Image */}
                  <Link href={`/product/${product.id}`} className="block relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover transition-transform duration-700 group-hover:scale-[1.04]"
                      />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1">
                      {product.isNew && (
                        <span className="bg-black text-white text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5">
                          New
                        </span>
                      )}
                      {discount > 0 && (
                        <span className="bg-red-600 text-white text-[9px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5">
                          -{discount}%
                        </span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200" onClick={(e) => e.preventDefault()}>
                      <WatchlistButton
                        product={product}
                        className="bg-white h-8 w-8 rounded-full shadow-sm border border-gray-100"
                      />
                    </div>

                    {/* Quick add */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" onClick={(e) => e.preventDefault()}>
                      <AddToCartButton
                        product={product}
                        size="sm"
                        className="w-full rounded-none h-10 text-[10px] tracking-[0.15em] font-semibold uppercase bg-black text-white hover:bg-gray-900 border-0"
                      />
                    </div>
                  </Link>

                  {/* Info */}
                  <Link href={`/product/${product.id}`} className="block">
                    {product.brand && (
                      <p className="text-[10px] font-medium tracking-widest uppercase text-gray-400 mb-0.5">
                        {product.brand}
                      </p>
                    )}
                    <h3 className="text-sm text-gray-900 font-medium leading-snug line-clamp-1 group-hover:text-black transition-colors">
                      {product.title}
                    </h3>

                    {/* Price */}
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-semibold text-black">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>

                    {/* Color swatches */}
                    {product.colors && product.colors.length > 0 && (
                      <div className="flex items-center gap-1 mt-2">
                        {product.colors.slice(0, 5).map((color) => (
                          <span
                            key={color}
                            title={color}
                            className="inline-block w-3.5 h-3.5 rounded-full border border-gray-200 flex-shrink-0"
                            style={{ backgroundColor: getColorHex(color) }}
                          />
                        ))}
                        {product.colors.length > 5 && (
                          <span className="text-[10px] text-gray-400">+{product.colors.length - 5}</span>
                        )}
                      </div>
                    )}

                    {/* Size pills */}
                    {product.sizes && product.sizes.length > 0 && (
                      <div className="flex items-center flex-wrap gap-1 mt-2">
                        {product.sizes.slice(0, 5).map((size) => (
                          <span
                            key={size}
                            className="text-[9px] font-medium text-gray-500 border border-gray-200 px-1.5 py-0.5 leading-none"
                          >
                            {size}
                          </span>
                        ))}
                        {product.sizes.length > 5 && (
                          <span className="text-[9px] text-gray-400">+{product.sizes.length - 5}</span>
                        )}
                      </div>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* ── VIEW ALL ── */}
        {!loading && (
          <div className="mt-12 text-center">
            <Link
              href="/search"
              className="inline-block border border-black text-black text-[11px] font-semibold tracking-[0.2em] uppercase px-10 py-3.5 hover:bg-black hover:text-white transition-colors duration-200"
            >
              View All Products
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
