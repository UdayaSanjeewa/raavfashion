'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';

const SLIDES = [
  {
    id: 1,
    eyebrow: 'New Collection — SS 2024',
    headline: ['Wear The', 'New Standard'],
    sub: "Precision-crafted fashion for those who don't settle.",
    cta: 'Shop New Arrivals',
    href: '/search',
  },
  {
    id: 2,
    eyebrow: "Men's Edit",
    headline: ['Dress With', 'Intention'],
    sub: 'Sharp, versatile pieces built for modern living.',
    cta: "Shop Men's",
    href: '/categories/mens-fashion',
  },
  {
    id: 3,
    eyebrow: 'Heritage Collection',
    headline: ['Rooted In', 'Craft'],
    sub: 'Handwoven silks and ethnic wear from Sri Lankan artisans.',
    cta: 'Explore Heritage',
    href: '/categories/traditional-ethnic',
  },
];

/*
  Free-to-use fashion runway videos from Pexels
  These URLs are valid Pexels video embed links
*/
const VIDEO_SRCS = [
  'https://videos.pexels.com/video-files/3066741/3066741-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_25fps.mp4',
  'https://videos.pexels.com/video-files/3249518/3249518-uhd_2560_1440_25fps.mp4',
];

export function HeroSection() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setLoaded(true);
  }, []);

  // Auto-advance every 8s
  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent((p) => (p + 1) % SLIDES.length);
    }, 8000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrent(i);
  };

  const slide = SLIDES[current];

  return (
    <section className="relative h-screen min-h-[600px] max-h-[900px] bg-black overflow-hidden select-none">

      {/* VIDEO BACKGROUND */}
      <div className="absolute inset-0 z-0">
        {VIDEO_SRCS.map((src, i) => (
          <video
            key={src}
            src={src}
            autoPlay
            muted
            loop
            playsInline
            className={`hero-video transition-opacity duration-1000 ${i === current ? 'opacity-100' : 'opacity-0'}`}
            style={{ zIndex: i === current ? 1 : 0, position: 'absolute', inset: 0 }}
          />
        ))}
        {/* Dark overlay — gradient from bottom + left side darken */}
        <div className="absolute inset-0 z-10 bg-gradient-to-r from-black/70 via-black/40 to-transparent" />
        <div className="absolute inset-0 z-10 bg-gradient-to-t from-black/60 via-transparent to-black/20" />
      </div>

      {/* CONTENT */}
      <div className="relative z-20 h-full flex flex-col justify-end pb-20 md:pb-28">
        <div className="max-w-7xl mx-auto px-6 md:px-10 lg:px-16 w-full">
          <div className="max-w-2xl">

            {/* Eyebrow */}
            <p
              key={`eyebrow-${current}`}
              className="fade-up fade-up-1 text-xs md:text-sm font-semibold tracking-[0.2em] uppercase text-white/60 mb-5"
            >
              {slide.eyebrow}
            </p>

            {/* Headline */}
            <h1
              key={`head-${current}`}
              className="fade-up fade-up-2 text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black text-white leading-none tracking-tight mb-6"
            >
              {slide.headline.map((line, i) => (
                <span key={i} className="block">{line}</span>
              ))}
            </h1>

            {/* Sub */}
            <p
              key={`sub-${current}`}
              className="fade-up fade-up-3 text-base md:text-lg text-white/70 mb-10 max-w-md leading-relaxed"
            >
              {slide.sub}
            </p>

            {/* CTA */}
            <div
              key={`cta-${current}`}
              className="fade-up fade-up-3 flex items-center gap-6"
            >
              <Link
                href={slide.href}
                className="group inline-flex items-center gap-3 bg-white text-black px-7 py-4 text-sm font-bold tracking-wider uppercase hover:bg-gray-100 transition-colors duration-200"
              >
                {slide.cta}
                <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform duration-200" />
              </Link>
              <Link
                href="/categories"
                className="text-sm font-semibold tracking-wider uppercase text-white/70 hover:text-white transition-colors hover-underline"
              >
                All Categories
              </Link>
            </div>
          </div>

          {/* Slide indicators */}
          <div className="flex items-center gap-3 mt-12">
            {SLIDES.map((_, i) => (
              <button
                key={i}
                onClick={() => goTo(i)}
                aria-label={`Go to slide ${i + 1}`}
                className="relative h-[2px] bg-white/20 overflow-hidden transition-all duration-300"
                style={{ width: i === current ? '48px' : '24px' }}
              >
                {i === current && (
                  <span
                    className="absolute inset-y-0 left-0 bg-white"
                    style={{ width: '100%', animation: 'progress 8s linear forwards' }}
                  />
                )}
              </button>
            ))}
            <span className="ml-2 text-xs text-white/40 tabular-nums">
              {String(current + 1).padStart(2, '0')} / {String(SLIDES.length).padStart(2, '0')}
            </span>
          </div>
        </div>
      </div>

      {/* TICKER — scrolling text bar at bottom */}
      <div className="absolute bottom-0 left-0 right-0 z-30 bg-white py-3 overflow-hidden">
        <div className="flex animate-marquee whitespace-nowrap">
          {Array.from({ length: 4 }).map((_, i) => (
            <span key={i} className="flex items-center text-xs font-bold tracking-[0.25em] uppercase text-black mx-0">
              <span>New Arrivals</span>
              <span className="mx-8 text-gray-300">—</span>
              <span>Free Delivery Over Rs. 3,000</span>
              <span className="mx-8 text-gray-300">—</span>
              <span>Women's Fashion</span>
              <span className="mx-8 text-gray-300">—</span>
              <span>Men's Collection</span>
              <span className="mx-8 text-gray-300">—</span>
              <span>Traditional & Ethnic Wear</span>
              <span className="mx-8 text-gray-300">—</span>
              <span>30-Day Returns</span>
              <span className="mx-8 text-gray-300">—</span>
            </span>
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes progress {
          from { transform: scaleX(0); transform-origin: left; }
          to   { transform: scaleX(1); transform-origin: left; }
        }
      `}</style>
    </section>
  );
}
