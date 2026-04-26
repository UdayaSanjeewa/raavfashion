'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';

const SLIDES = [
  {
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1600',
    eyebrow: 'New Arrivals',
    headline: 'Effortless\nElegance',
    sub: 'Discover the new season collection',
    cta: { label: 'Shop Women', href: '/categories/womens-fashion' },
    ctaSecondary: { label: 'Shop Men', href: '/categories/mens-fashion' },
    align: 'left' as const,
  },
  {
    image: 'https://images.pexels.com/photos/842811/pexels-photo-842811.jpeg?auto=compress&cs=tinysrgb&w=1600',
    eyebrow: "Men's Collection",
    headline: 'Dressed for\nEvery Moment',
    sub: 'Premium menswear, curated for you',
    cta: { label: 'Shop Collection', href: '/categories/mens-fashion' },
    ctaSecondary: null,
    align: 'right' as const,
  },
  {
    image: 'https://images.pexels.com/photos/1040945/pexels-photo-1040945.jpeg?auto=compress&cs=tinysrgb&w=1600',
    eyebrow: 'Traditional Wear',
    headline: 'Heritage\nMeets Modern',
    sub: 'Authentic ethnic wear for every occasion',
    cta: { label: 'Explore Now', href: '/categories/traditional-ethnic' },
    ctaSecondary: null,
    align: 'center' as const,
  },
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [fading, setFading]   = useState(false);
  const timerRef              = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => advance(), 6500);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  const advance = () => {
    setFading(true);
    setTimeout(() => {
      setCurrent((p) => (p + 1) % SLIDES.length);
      setFading(false);
    }, 500);
  };

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    if (i === current) return;
    setFading(true);
    setTimeout(() => { setCurrent(i); setFading(false); }, 500);
  };

  const slide = SLIDES[current];

  const contentAlign =
    slide.align === 'left'
      ? 'items-start text-left pl-10 md:pl-20'
      : slide.align === 'right'
      ? 'items-end text-right pr-10 md:pr-20'
      : 'items-center text-center px-10';

  const overlayStyle =
    slide.align === 'right'
      ? 'linear-gradient(to left, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)'
      : slide.align === 'center'
      ? 'rgba(0,0,0,0.38)'
      : 'linear-gradient(to right, rgba(0,0,0,0.6) 0%, rgba(0,0,0,0.05) 60%, transparent 100%)';

  return (
    <section
      className="relative w-full overflow-hidden bg-gray-200"
      style={{ height: '88vh', minHeight: 500, maxHeight: 860 }}
    >
      {/* Images */}
      {SLIDES.map((s, i) => (
        <Image
          key={s.image}
          src={s.image}
          alt=""
          fill
          priority={i === 0}
          className={`object-cover transition-opacity duration-700 ${i === current && !fading ? 'opacity-100' : 'opacity-0'}`}
          style={{ zIndex: 1 }}
        />
      ))}

      {/* Overlay */}
      <div className="absolute inset-0 z-[2]" style={{ background: overlayStyle }} />

      {/* Content */}
      <div className={`absolute inset-0 z-[3] flex flex-col justify-end pb-20 md:pb-28 ${contentAlign}`}>
        <div
          className={`max-w-lg transition-all duration-600 ${fading ? 'opacity-0 translate-y-3' : 'opacity-100 translate-y-0'}`}
          style={{ transitionDuration: '600ms' }}
        >
          <p className="text-white/65 text-[11px] font-semibold tracking-[0.35em] uppercase mb-4">
            {slide.eyebrow}
          </p>
          <h1
            className="text-white leading-tight mb-5 whitespace-pre-line"
            style={{
              fontFamily: 'var(--font-bc), Impact, sans-serif',
              fontStyle: 'italic',
              fontWeight: 800,
              fontSize: 'clamp(3rem, 7vw, 6.5rem)',
              lineHeight: 1.0,
              letterSpacing: '-0.02em',
            }}
          >
            {slide.headline}
          </h1>
          <p className="text-white/65 text-sm md:text-base mb-8 font-light">
            {slide.sub}
          </p>
          <div className={`flex gap-3 flex-wrap ${slide.align === 'center' ? 'justify-center' : slide.align === 'right' ? 'justify-end' : ''}`}>
            <Link
              href={slide.cta.href}
              className="inline-block bg-white text-black text-[11px] font-semibold tracking-[0.18em] uppercase px-8 py-3.5 hover:bg-gray-50 transition-colors duration-200"
            >
              {slide.cta.label}
            </Link>
            {slide.ctaSecondary && (
              <Link
                href={slide.ctaSecondary.href}
                className="inline-block border border-white/80 text-white text-[11px] font-semibold tracking-[0.18em] uppercase px-8 py-3.5 hover:bg-white/10 transition-colors duration-200"
              >
                {slide.ctaSecondary.label}
              </Link>
            )}
          </div>
        </div>
      </div>

      {/* Dot indicators */}
      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 z-[4] flex items-center gap-2">
        {SLIDES.map((_, i) => (
          <button
            key={i}
            onClick={() => goTo(i)}
            aria-label={`Slide ${i + 1}`}
            className={`transition-all duration-300 rounded-full ${
              i === current ? 'w-6 h-1.5 bg-white' : 'w-1.5 h-1.5 bg-white/40 hover:bg-white/70'
            }`}
          />
        ))}
      </div>
    </section>
  );
}
