'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';
import { Product } from '@/types';
import { Clock, ShoppingCart, Play } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

interface ProductGridProps {
  products: Product[];
  viewMode?: 'grid' | 'list';
}

export function ProductGrid({ products, viewMode = 'grid' }: ProductGridProps) {
  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  if (products.length === 0) {
    return (
      <div className="text-center py-12 bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="bg-gray-100 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-4">
          <ShoppingCart className="h-12 w-12 text-gray-400" />
        </div>
        <h3 className="text-xl font-semibold text-gray-900 mb-2">No products found</h3>
        <p className="text-gray-600">Try adjusting your filters or search terms</p>
      </div>
    );
  }

  return (
    <div
      className={
        viewMode === 'grid'
          ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6'
          : 'space-y-4'
      }
    >
      {products.map((product) => (
        <ProductCard key={product.id} product={product} viewMode={viewMode} formatPrice={formatPrice} formatTimeAgo={formatTimeAgo} />
      ))}
    </div>
  );
}

function ProductCard({
  product,
  viewMode,
  formatPrice,
  formatTimeAgo,
}: {
  product: Product;
  viewMode: 'grid' | 'list';
  formatPrice: (p: number) => string;
  formatTimeAgo: (d: string) => string;
}) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isHoveringMedia, setIsHoveringMedia] = useState(false);

  const discount = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  const handleMouseEnter = () => {
    if (!product.videoUrl) return;
    setIsHoveringMedia(true);
    videoRef.current?.play();
  };

  const handleMouseLeave = () => {
    if (!product.videoUrl) return;
    setIsHoveringMedia(false);
    if (videoRef.current) {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  };

  return (
    <Link
      href={`/product/${product.id}`}
      className={
        viewMode === 'grid'
          ? 'group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-300'
          : 'group bg-white rounded-xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 hover:border-gray-300 flex'
      }
    >
      {/* Product Media */}
      <div
        className={
          viewMode === 'grid'
            ? 'relative aspect-[4/3] overflow-hidden'
            : 'relative w-48 h-36 overflow-hidden flex-shrink-0'
        }
        onMouseEnter={handleMouseEnter}
        onMouseLeave={handleMouseLeave}
      >
        {/* Static image — always rendered, fades out when video plays */}
        {product.images && product.images.length > 0 && product.images[0] ? (
          <img
            src={product.images[0]}
            alt={product.title}
            className={`absolute inset-0 w-full h-full object-cover transition-all duration-500 ${
              isHoveringMedia && product.videoUrl ? 'opacity-0' : 'opacity-100 group-hover:scale-105'
            }`}
          />
        ) : (
          <div className="absolute inset-0 w-full h-full bg-gray-200 flex items-center justify-center">
            <span className="text-gray-400">No image</span>
          </div>
        )}

        {/* Video — hidden until hover */}
        {product.videoUrl && (
          <video
            ref={videoRef}
            src={product.videoUrl}
            className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-300 ${
              isHoveringMedia ? 'opacity-100' : 'opacity-0'
            }`}
            muted
            loop
            playsInline
            preload="metadata"
          />
        )}

        {/* Video indicator badge */}
        {product.videoUrl && !isHoveringMedia && (
          <div className="absolute bottom-2 right-2 bg-black/60 text-white text-[9px] font-semibold tracking-wide px-1.5 py-0.5 rounded flex items-center gap-0.5 z-10">
            <Play className="w-2.5 h-2.5 fill-white" />
            Video
          </div>
        )}

        {/* Badges — top-left */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10">
          {product.isFeatured && (
            <span className="bg-black text-white text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 rounded-sm">
              Featured
            </span>
          )}
          {product.isNew && (
            <span className="bg-white text-black text-[9px] font-semibold tracking-[0.1em] uppercase px-2 py-0.5 border border-black rounded-sm">
              New
            </span>
          )}
          {product.condition !== 'new' && (
            <span className="bg-black/70 text-white text-[9px] font-semibold tracking-[0.08em] uppercase px-2 py-0.5 rounded-sm">
              {product.condition}
            </span>
          )}
        </div>
      </div>

      {/* Product Info */}
      <div className="p-5 flex-1">
        <h3
          className={
            viewMode === 'grid'
              ? 'font-bold text-lg text-gray-900 line-clamp-2 group-hover:text-black transition-colors mb-2'
              : 'font-bold text-xl text-gray-900 line-clamp-1 group-hover:text-black transition-colors mb-2'
          }
        >
          {product.title}
        </h3>

        {/* Price row */}
        <div className="flex items-center gap-2 mb-3">
          <span
            className={
              viewMode === 'grid'
                ? 'text-2xl font-bold text-gray-900'
                : 'text-3xl font-bold text-gray-900'
            }
          >
            {formatPrice(product.price)}
          </span>
          {product.originalPrice && (
            <>
              <span className="text-sm text-gray-400 line-through">
                {formatPrice(product.originalPrice)}
              </span>
              <Badge variant="destructive" className="text-xs">
                -{discount}%
              </Badge>
            </>
          )}
        </div>

        <p
          className={
            viewMode === 'grid'
              ? 'text-gray-600 text-sm line-clamp-2 mb-3'
              : 'text-gray-600 text-base line-clamp-3 mb-4'
          }
        >
          {product.description}
        </p>

        {/* Time */}
        <div className="flex items-center justify-end text-sm text-gray-500 pt-3 border-t border-gray-100">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{formatTimeAgo(product.createdAt)}</span>
          </div>
        </div>
      </div>
    </Link>
  );
}
