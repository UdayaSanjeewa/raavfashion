'use client';

import { useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';
import { Star, ArrowRight, BadgeCheck } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { WatchlistButton } from '@/components/watchlist/WatchlistButton';
import type { Product } from '@/types';

export function FeaturedProducts() {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'women' | 'men'>('all');

  useEffect(() => { loadProducts(); }, []);

  const loadProducts = async () => {
    const { data: cats } = await supabase.from('categories').select('*');
    const { data: rows } = await supabase
      .from('products')
      .select('*')
      .order('is_featured', { ascending: false })
      .order('created_at', { ascending: false })
      .limit(12);

    if (!rows || !cats) { setIsLoading(false); return; }

    const catMap = new Map(cats.map((c: Record<string, unknown>) => [c.id, c]));
    const fallback = { id: '', name: 'Uncategorized', slug: 'uncategorized', image: '', productCount: 0 };

    const formatted: Product[] = rows.map((p: Record<string, unknown>) => {
      const cat = (catMap.get(p.category_id as string) || {}) as Record<string, unknown>;
      return {
        id: p.id as string,
        title: p.title as string,
        description: (p.description as string) || '',
        price: p.price as number,
        originalPrice: p.original_price as number | undefined,
        images: (p.images as string[]) || [],
        category: cat.id ? { id: cat.id as string, name: cat.name as string, slug: cat.slug as string, image: (cat.image_url || cat.image) as string, productCount: 0 } : fallback,
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
    setIsLoading(false);
  };

  const formatPrice = (n: number) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(n);

  const tabs: { key: typeof activeTab; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'women', label: "Women's" },
    { key: 'men', label: "Men's" },
  ];

  const visible = products.filter((p) => {
    if (activeTab === 'all') return true;
    return p.gender === activeTab || p.gender === 'unisex';
  });

  return (
    <section className="py-24 bg-gray-50">
      <div className="max-w-7xl mx-auto px-6 md:px-10">

        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <p className="text-xs font-bold tracking-[0.2em] uppercase text-gray-400 mb-3">Handpicked</p>
            <h2 className="text-4xl md:text-5xl font-black text-black tracking-tight leading-none">
              Featured Styles
            </h2>
          </div>
          {/* Tabs */}
          <div className="flex items-center gap-1 bg-white border border-gray-200 p-1">
            {tabs.map((t) => (
              <button
                key={t.key}
                onClick={() => setActiveTab(t.key)}
                className={`px-5 py-2 text-xs font-bold tracking-[0.12em] uppercase transition-colors ${
                  activeTab === t.key
                    ? 'bg-black text-white'
                    : 'text-gray-500 hover:text-black'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>
        </div>

        {isLoading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="space-y-3">
                <div className="aspect-[3/4] bg-gray-200 animate-pulse" />
                <div className="h-3 bg-gray-200 animate-pulse w-3/4" />
                <div className="h-3 bg-gray-200 animate-pulse w-1/2" />
              </div>
            ))}
          </div>
        ) : visible.length === 0 ? (
          <div className="text-center py-20">
            <p className="text-gray-400 text-sm">No products yet — check back soon.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
            {visible.map((product) => {
              const discount = product.originalPrice
                ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
                : 0;
              return (
                <div key={product.id} className="group flex flex-col">
                  {/* Image */}
                  <div className="relative aspect-[3/4] overflow-hidden bg-gray-100 mb-3">
                    {product.images[0] && (
                      <Image
                        src={product.images[0]}
                        alt={product.title}
                        fill
                        className="object-cover img-zoom"
                      />
                    )}

                    {/* Badges */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                      {discount > 0 && (
                        <span className="bg-black text-white text-[9px] font-bold tracking-wider uppercase px-2 py-1">
                          -{discount}%
                        </span>
                      )}
                      {product.isNew && (
                        <span className="bg-white text-black text-[9px] font-bold tracking-wider uppercase px-2 py-1">
                          New
                        </span>
                      )}
                    </div>

                    {/* Wishlist */}
                    <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <WatchlistButton
                        product={product}
                        className="bg-white shadow-sm h-8 w-8"
                      />
                    </div>

                    {/* Quick add — appears on hover */}
                    <div className="absolute bottom-0 left-0 right-0 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                      <AddToCartButton product={product} size="sm" className="w-full rounded-none bg-black text-white border-0 h-10 text-[10px] tracking-[0.15em] font-bold uppercase hover:bg-gray-900" />
                    </div>
                  </div>

                  {/* Info */}
                  <Link href={`/product/${product.id}`} className="flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        {product.brand && (
                          <p className="text-[10px] font-bold tracking-[0.15em] uppercase text-gray-400 mb-0.5">
                            {product.brand}
                          </p>
                        )}
                        <h3 className="text-sm font-semibold text-gray-900 leading-snug line-clamp-2 hover:text-black">
                          {product.title}
                        </h3>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 mt-2">
                      <span className="text-sm font-bold text-black">{formatPrice(product.price)}</span>
                      {product.originalPrice && (
                        <span className="text-xs text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                      )}
                    </div>
                    {/* Colors preview */}
                    {product.colors && product.colors.length > 0 && (
                      <p className="text-[10px] text-gray-400 mt-1.5">
                        {product.colors.slice(0, 3).join(' · ')}
                        {product.colors.length > 3 && ` +${product.colors.length - 3}`}
                      </p>
                    )}
                  </Link>
                </div>
              );
            })}
          </div>
        )}

        {/* View All CTA */}
        {!isLoading && (
          <div className="text-center mt-16">
            <Link
              href="/search"
              className="inline-flex items-center gap-3 border border-black text-black px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-black hover:text-white transition-colors duration-200 group"
            >
              View All Products
              <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
            </Link>
          </div>
        )}
      </div>
    </section>
  );
}
