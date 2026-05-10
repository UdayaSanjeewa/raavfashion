'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getProductById } from '@/lib/products';
import { AddToCartButton } from '@/components/cart/AddToCartButton';
import { WatchlistButton } from '@/components/watchlist/WatchlistButton';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import {
  Share2, Clock,
  ChevronLeft, ChevronRight, X, Maximize2,
  Ruler, Palette, Tag, Shirt, Play, ArrowLeft, Check
} from 'lucide-react';

const COLOR_MAP: Record<string, string> = {
  'Black':    '#000000',
  'White':    '#FFFFFF',
  'Grey':     '#9CA3AF',
  'Navy':     '#1E3A5F',
  'Blue':     '#3B82F6',
  'Sky Blue': '#7DD3FC',
  'Red':      '#EF4444',
  'Maroon':   '#7F1D1D',
  'Pink':     '#F472B6',
  'Peach':    '#FBBF8A',
  'Orange':   '#F97316',
  'Yellow':   '#FACC15',
  'Green':    '#22C55E',
  'Olive':    '#6B7280',
  'Khaki':    '#C3B091',
  'Beige':    '#F5F0E8',
  'Brown':    '#92400E',
  'Camel':    '#C19A6B',
  'Cream':    '#FFFDD0',
  'Gold':     '#D4AF37',
  'Silver':   '#C0C0C0',
  'Multi':    'linear-gradient(135deg,#f00,#0f0,#00f)',
};
import type { Product } from '@/types';

export default function ProductPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [product, setProduct] = useState<Product | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedImage, setSelectedImage] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    loadProduct();
  }, [id]);

  const loadProduct = async () => {
    const data = await getProductById(id);
    setProduct(data);
    if (data?.sizes?.length) setSelectedSize(data.sizes[0]);
    if (data?.colors?.length) setSelectedColor(data.colors[0]);
    // If product has a video, show it first
    if (data?.videoUrl) setShowVideo(true);
    setIsLoading(false);
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(price);

  const formatTimeAgo = (dateString: string) => {
    const diffInHours = Math.floor((Date.now() - new Date(dateString).getTime()) / (1000 * 60 * 60));
    return diffInHours < 24 ? `${diffInHours}h ago` : `${Math.floor(diffInHours / 24)}d ago`;
  };

  // Video is first slot; images follow
  const nextImage = () => {
    if (!product) return;
    if (showVideo) { setShowVideo(false); setSelectedImage(0); return; }
    const next = selectedImage + 1;
    if (next >= product.images.length) {
      if (product.videoUrl) { setShowVideo(true); } else { setSelectedImage(0); }
    } else {
      setSelectedImage(next);
    }
  };
  const prevImage = () => {
    if (!product) return;
    if (showVideo) { setShowVideo(false); setSelectedImage(product.images.length - 1); return; }
    if (selectedImage === 0) {
      if (product.videoUrl) { setShowVideo(true); } else { setSelectedImage(product.images.length - 1); }
    } else {
      setSelectedImage(selectedImage - 1);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-gray-500">The product you&apos;re looking for doesn&apos;t exist.</p>
        </div>
      </div>
    );
  }

  const discountPct = product.originalPrice
    ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
    : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Back button */}
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors mb-5 group"
        >
          <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
          <span className="text-sm font-medium">Back</span>
        </button>

        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-0 lg:gap-8 p-6 lg:p-8">

            {/* Images / Video */}
            <div>
              <div className="relative aspect-[3/4] rounded-xl overflow-hidden mb-3 bg-gray-100 group">
                {showVideo && product.videoUrl ? (
                  <video
                    key={product.videoUrl}
                    src={product.videoUrl}
                    className="w-full h-full object-cover"
                    autoPlay
                    muted
                    loop
                    playsInline
                    controls
                  />
                ) : (
                  <>
                    <img
                      src={product.images[selectedImage]}
                      alt={product.title}
                      className="w-full h-full object-cover cursor-zoom-in"
                      onClick={() => setIsModalOpen(true)}
                    />
                    <button onClick={() => setIsModalOpen(true)} className="absolute top-3 right-3 bg-white/90 hover:bg-white rounded-lg p-1.5 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <Maximize2 className="w-4 h-4" />
                    </button>
                  </>
                )}

                {(product.images.length > 1 || product.videoUrl) && (
                  <>
                    <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronLeft className="w-4 h-4" />
                    </button>
                    <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 hover:bg-white rounded-full p-2 shadow-md opacity-0 group-hover:opacity-100 transition-opacity">
                      <ChevronRight className="w-4 h-4" />
                    </button>
                  </>
                )}

                <div className="absolute bottom-3 right-3 bg-black/60 text-white px-2 py-0.5 rounded-full text-xs">
                  {showVideo ? (
                    <span className="flex items-center gap-1"><Play className="w-3 h-3" /> Video</span>
                  ) : (
                    `${selectedImage + 1}/${product.images.length}${product.videoUrl ? '+' : ''}`
                  )}
                </div>

                {discountPct > 0 && !showVideo && (
                  <div className="absolute top-3 left-3 bg-rose-600 text-white text-sm font-bold px-3 py-1 rounded-full">
                    -{discountPct}%
                  </div>
                )}
              </div>

              {/* Thumbnails — video first, then images */}
              {(product.images.length > 1 || product.videoUrl) && (
                <div className="flex gap-2 overflow-x-auto pb-1">
                  {product.videoUrl && (
                    <button
                      onClick={() => setShowVideo(true)}
                      className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 relative bg-black ${showVideo ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-200'}`}
                    >
                      <video src={product.videoUrl} className="w-full h-full object-cover opacity-70" muted preload="metadata" />
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="bg-white/90 rounded-full p-1.5">
                          <Play className="w-3 h-3 text-black fill-black" />
                        </div>
                      </div>
                    </button>
                  )}
                  {product.images.map((img, i) => (
                    <button
                      key={i}
                      onClick={() => { setShowVideo(false); setSelectedImage(i); }}
                      className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all hover:scale-105 ${!showVideo && selectedImage === i ? 'border-rose-500 ring-2 ring-rose-200' : 'border-gray-200'}`}
                    >
                      <img src={img} alt="" className="w-full h-full object-cover" />
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Product Info */}
            <div className="mt-6 lg:mt-0">
              <div className="flex items-start justify-between mb-3">
                <div className="flex flex-wrap gap-2">
                  <Badge className="bg-rose-50 text-rose-700 border-rose-200 text-xs">
                    {product.category.name}
                  </Badge>
                  {product.brand && (
                    <Badge variant="outline" className="text-xs">{product.brand}</Badge>
                  )}
                  {product.isNew && (
                    <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200 text-xs">New Arrival</Badge>
                  )}
                  {product.isFeatured && (
                    <Badge className="bg-amber-50 text-amber-700 border-amber-200 text-xs">Featured</Badge>
                  )}
                </div>
                <div className="flex gap-1.5 ml-2 flex-shrink-0">
                  <WatchlistButton product={product} />
                  <Button variant="outline" size="icon" className="h-9 w-9">
                    <Share2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3 leading-tight">
                {product.title}
              </h1>

              {/* Price */}
              <div className="flex items-baseline gap-3 mb-5">
                <span className="text-3xl font-bold text-black">{formatPrice(product.price)}</span>
                {product.originalPrice && (
                  <span className="text-lg text-gray-400 line-through">{formatPrice(product.originalPrice)}</span>
                )}
              </div>

              {/* Sizes */}
              {product.sizes && product.sizes.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Ruler className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Size</span>
                    </div>
                    {selectedSize && (
                      <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {selectedSize}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {product.sizes.map((size) => {
                      const active = selectedSize === size;
                      return (
                        <button
                          key={size}
                          onClick={() => setSelectedSize(size)}
                          className={`relative min-w-[48px] h-11 px-3 text-sm font-bold border-2 transition-all duration-150 rounded-md
                            ${active
                              ? 'border-black bg-black text-white shadow-md scale-105'
                              : 'border-gray-200 bg-white text-gray-700 hover:border-gray-800 hover:text-black hover:shadow-sm'
                            }`}
                        >
                          {size}
                          {active && (
                            <span className="absolute -top-1.5 -right-1.5 w-4 h-4 bg-black rounded-full flex items-center justify-center">
                              <Check className="w-2.5 h-2.5 text-white" strokeWidth={3} />
                            </span>
                          )}
                        </button>
                      );
                    })}
                  </div>
                  {!selectedSize && (
                    <p className="text-xs text-rose-500 mt-2 font-medium">Please select a size</p>
                  )}
                </div>
              )}

              {/* Colors */}
              {product.colors && product.colors.length > 0 && (
                <div className="mb-6">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                      <Palette className="h-4 w-4 text-gray-400" />
                      <span className="text-sm font-bold text-gray-900 uppercase tracking-wide">Color</span>
                    </div>
                    {selectedColor && (
                      <span className="text-sm font-semibold text-gray-700 bg-gray-100 px-2.5 py-0.5 rounded-full">
                        {selectedColor}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-3">
                    {product.colors.map((color) => {
                      const active = selectedColor === color;
                      const hex = COLOR_MAP[color];
                      const isLight = ['White', 'Cream', 'Beige', 'Yellow', 'Silver', 'Gold'].includes(color);
                      return (
                        <button
                          key={color}
                          onClick={() => setSelectedColor(color)}
                          title={color}
                          className="flex flex-col items-center gap-1.5 group"
                        >
                          <span
                            className={`w-10 h-10 rounded-full border-2 transition-all duration-150 flex items-center justify-center
                              ${active
                                ? 'border-black ring-2 ring-black ring-offset-2 scale-110 shadow-md'
                                : 'border-gray-200 hover:border-gray-500 hover:scale-105 hover:shadow-sm'
                              }`}
                            style={hex?.startsWith('linear') ? { background: hex } : { backgroundColor: hex || '#ccc' }}
                          >
                            {active && (
                              <Check
                                className={`w-4 h-4 ${isLight ? 'text-black' : 'text-white'}`}
                                strokeWidth={3}
                              />
                            )}
                          </span>
                          <span className={`text-[11px] font-medium leading-tight text-center max-w-[48px] truncate
                            ${active ? 'text-black font-bold' : 'text-gray-500 group-hover:text-gray-800'}`}>
                            {color}
                          </span>
                        </button>
                      );
                    })}
                  </div>
                  {!selectedColor && (
                    <p className="text-xs text-rose-500 mt-2 font-medium">Please select a color</p>
                  )}
                </div>
              )}

              {/* Product Details */}
              <div className="bg-gray-50 rounded-xl p-4 mb-5 grid grid-cols-2 gap-3 text-sm">
                {product.material && (
                  <div>
                    <span className="text-gray-500">Material</span>
                    <p className="font-medium text-gray-900">{product.material}</p>
                  </div>
                )}
                {product.style && (
                  <div>
                    <span className="text-gray-500">Style</span>
                    <p className="font-medium text-gray-900">{product.style}</p>
                  </div>
                )}
                <div>
                  <span className="text-gray-500">Gender</span>
                  <p className="font-medium text-gray-900 capitalize">{product.gender}</p>
                </div>
                <div>
                  <span className="text-gray-500">Condition</span>
                  <p className="font-medium text-gray-900 capitalize">{product.condition}</p>
                </div>
                <div className="col-span-2 flex items-center gap-1 text-gray-500">
                  <Clock className="h-3.5 w-3.5" />
                  <span>{formatTimeAgo(product.createdAt)}</span>
                </div>
              </div>

              {/* Add to Cart */}
              <AddToCartButton
                product={{ ...product, selectedSize, selectedColor } as Product}
                className="w-full"
                size="lg"
              />

              {/* Description */}
              <div className="border-t border-gray-100 pt-6 mt-6">
                <h2 className="text-lg font-bold text-gray-900 mb-3">Description</h2>
                <p className="text-gray-600 text-sm leading-relaxed whitespace-pre-line">{product.description}</p>
              </div>

              {product.features.length > 0 && (
                <div className="border-t border-gray-100 pt-5 mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Shirt className="h-4 w-4 text-rose-500" />
                    <h2 className="text-lg font-bold text-gray-900">Features</h2>
                  </div>
                  <ul className="space-y-2">
                    {product.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm">
                        <span className="text-black font-bold mt-0.5">✓</span>
                        <span className="text-gray-700">{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {product.tags.length > 0 && (
                <div className="border-t border-gray-100 pt-5 mt-5">
                  <div className="flex items-center gap-2 mb-3">
                    <Tag className="h-4 w-4 text-gray-400" />
                    <h2 className="text-sm font-semibold text-gray-700">Tags</h2>
                  </div>
                  <div className="flex flex-wrap gap-1.5">
                    {product.tags.map((tag, i) => (
                      <Badge key={i} variant="outline" className="text-xs text-gray-500 border-gray-200">
                        #{tag}
                      </Badge>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Image Modal */}
      <Dialog open={isModalOpen} onOpenChange={setIsModalOpen}>
        <DialogContent className="max-w-4xl w-full p-0">
          <div className="relative bg-black">
            <button
              onClick={() => setIsModalOpen(false)}
              className="absolute top-3 right-3 z-10 bg-white/20 hover:bg-white/30 text-white rounded-full p-1.5 backdrop-blur-sm transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <div className="relative aspect-[3/4] max-h-[80vh]">
              <img src={product.images[selectedImage]} alt={product.title} className="w-full h-full object-contain" />
              {product.images.length > 1 && (
                <>
                  <button onClick={prevImage} className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2.5 transition-colors">
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <button onClick={nextImage} className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-full p-2.5 transition-colors">
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
            {product.images.length > 1 && (
              <div className="bg-black/80 p-3 flex gap-2 overflow-x-auto">
                {product.images.map((img, i) => (
                  <button key={i} onClick={() => setSelectedImage(i)} className={`flex-shrink-0 w-16 h-20 rounded-lg overflow-hidden border-2 transition-all ${selectedImage === i ? 'border-rose-400' : 'border-white/20 hover:border-white/50'}`}>
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
