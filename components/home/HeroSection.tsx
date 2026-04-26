'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

/*
  RAAV FASHION – Hero Section
  ────────────────────────────
  Inspired by incarnage.com:
  • Full-viewport autoplay video background
  • Text anchored to BOTTOM-LEFT, not center
  • Massive bold-italic headline (all-caps)
  • Small tagline below headline
  • Two solid CTA buttons: "SHOP WOMENS" and "SHOP MENS"
  • Very minimal overlay — let the video breathe
  • Slide dots bottom-right
*/

const SLIDES = [
  {
    videoSrc: 'https://videos.pexels.com/video-files/3066741/3066741-uhd_2560_1440_25fps.mp4',
    headline: 'BE BETTER EVERYDAY',
    tagline: 'Explore our collection',
  },
  {
    videoSrc: 'https://videos.pexels.com/video-files/4763824/4763824-uhd_2560_1440_25fps.mp4',
    headline: 'WEAR THE DIFFERENCE',
    tagline: "New season arrivals",
  },
  {
    videoSrc: 'https://videos.pexels.com/video-files/3249518/3249518-uhd_2560_1440_25fps.mp4',
    headline: 'CRAFTED FOR YOU',
    tagline: 'Traditional & contemporary wear',
  },
];

export function HeroSection() {
  const [current, setCurrent]   = useState(0);
  const timerRef                = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    timerRef.current = setTimeout(() => {
      setCurrent((p) => (p + 1) % SLIDES.length);
    }, 7000);
    return () => { if (timerRef.current) clearTimeout(timerRef.current); };
  }, [current]);

  const goTo = (i: number) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setCurrent(i);
  };

  const slide = SLIDES[current];

  return (
    <section className="relative w-full overflow-hidden bg-black" style={{ height: '100svh', minHeight: 560 }}>

      {/* ── VIDEOS ── */}
      {SLIDES.map((s, i) => (
        <video
          key={s.videoSrc}
          src={s.videoSrc}
          autoPlay
          muted
          loop
          playsInline
          className={`absolute inset-0 w-full h-full object-cover transition-opacity duration-1000 ${
            i === current ? 'opacity-100' : 'opacity-0'
          }`}
          style={{ zIndex: 1 }}
        />
      ))}

      {/* ── OVERLAY — subtle gradient from bottom only ── */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: 'linear-gradient(to top, rgba(0,0,0,0.75) 0%, rgba(0,0,0,0.15) 40%, rgba(0,0,0,0) 70%)',
        }}
      />
      {/* left edge fade so text is readable */}
      <div
        className="absolute inset-0 z-[2]"
        style={{
          background: 'linear-gradient(to right, rgba(0,0,0,0.45) 0%, rgba(0,0,0,0) 55%)',
        }}
      />

      {/* ── CONTENT — bottom left ── */}
      <div className="absolute inset-0 z-[3] flex flex-col justify-end px-8 md:px-14 lg:px-20 pb-20 md:pb-28">
        <div key={current} className="raav-fade-in">
          {/* Tagline */}
          <p className="text-white/70 text-sm md:text-base font-semibold tracking-[0.2em] uppercase mb-4 raav-line-1">
            {slide.tagline}
          </p>

          {/* HEADLINE — massive bold italic, exactly like Carnage */}
          <h1
            className="text-white font-black italic leading-none mb-8 raav-line-2"
            style={{
              fontSize: 'clamp(3rem, 8vw, 8rem)',
              letterSpacing: '-0.02em',
              textTransform: 'uppercase',
              lineHeight: 0.92,
            }}
          >
            {slide.headline}
          </h1>

          {/* CTA BUTTONS — side by side, solid fills */}
          <div className="flex flex-wrap items-center gap-3 raav-line-3">
            <Link
              href="/categories/womens-fashion"
              className="inline-block bg-white text-black text-xs md:text-sm font-black tracking-[0.18em] uppercase px-7 py-4 hover:bg-gray-100 transition-colors duration-200"
            >
              SHOP WOMENS
            </Link>
            <Link
              href="/categories/mens-fashion"
              className="inline-block bg-black text-white text-xs md:text-sm font-black tracking-[0.18em] uppercase px-7 py-4 border border-white/40 hover:bg-white/10 transition-colors duration-200"
            >
              SHOP MENS
            </Link>
          </div>
        </div>

        {/* ── SLIDE DOTS — bottom right ── */}
        <div className="absolute bottom-8 right-8 md:right-14 flex items-center gap-3">
          {SLIDES.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Slide ${i + 1}`}
              className={`transition-all duration-300 rounded-full ${
                i === current
                  ? 'w-8 h-2 bg-white'
                  : 'w-2 h-2 bg-white/40 hover:bg-white/70'
              }`}
            />
          ))}
        </div>
      </div>

      <style jsx global>{`
        @keyframes raavFadeUp {
          from { opacity: 0; transform: translateY(28px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .raav-fade-in .raav-line-1 { animation: raavFadeUp 0.6s cubic-bezier(0.16,1,0.3,1) 0.05s both; }
        .raav-fade-in .raav-line-2 { animation: raavFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.15s both; }
        .raav-fade-in .raav-line-3 { animation: raavFadeUp 0.7s cubic-bezier(0.16,1,0.3,1) 0.3s  both; }
      `}</style>
    </section>
  );
}
