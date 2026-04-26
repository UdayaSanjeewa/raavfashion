'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ChevronRight, Sparkles, Star, Truck, RefreshCw } from 'lucide-react';

const heroSlides = [
  {
    id: 1,
    title: "New Season Arrivals",
    subtitle: "Spring / Summer 2024 Collection",
    description: "Discover the latest trends in fashion. Curated styles for every occasion, delivered to your doorstep.",
    image: "https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Shop New Arrivals",
    ctaLink: "/search",
    gradient: "from-rose-600/70 via-pink-600/60 to-rose-800/80"
  },
  {
    id: 2,
    title: "Men's Collection",
    subtitle: "Elevate Your Everyday Style",
    description: "From smart casuals to sharp formals — explore our premium men's fashion range.",
    image: "https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Shop Men's",
    ctaLink: "/categories/mens-fashion",
    gradient: "from-slate-700/80 via-gray-700/70 to-slate-900/80"
  },
  {
    id: 3,
    title: "Traditional Elegance",
    subtitle: "Handcrafted Heritage Wear",
    description: "Celebrate Sri Lankan craftsmanship with our exclusive collection of handwoven sarees and ethnic wear.",
    image: "https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=1200",
    cta: "Explore Collection",
    ctaLink: "/categories/traditional-ethnic",
    gradient: "from-amber-700/70 via-orange-600/60 to-amber-900/80"
  }
];

export function HeroSection() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % heroSlides.length);
    }, 6000);
    return () => clearInterval(interval);
  }, [isAutoPlaying]);

  return (
    <section className="relative min-h-[600px] md:min-h-[680px] lg:min-h-[720px] overflow-hidden bg-gray-900">
      {heroSlides.map((slide, index) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-1000 ${
            index === currentSlide ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          <Image
            src={slide.image}
            alt={slide.title}
            fill
            className="object-cover object-top"
            priority={index === 0}
          />
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.gradient}`} />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black/40" />
        </div>
      ))}

      <div className="relative z-20 h-full min-h-[600px] md:min-h-[680px] lg:min-h-[720px] flex items-center">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div className="text-white space-y-8">
              <div key={currentSlide} className="space-y-6 animate-fadeInUp">
                <div className="inline-flex items-center gap-2 px-4 py-2 bg-white/15 backdrop-blur-md rounded-full border border-white/25">
                  <Sparkles className="h-4 w-4 text-yellow-300" />
                  <span className="text-sm font-semibold tracking-wide">New Collection Available</span>
                </div>

                <h1 className="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-tight tracking-tight">
                  {heroSlides[currentSlide].title.split(' ').map((word, i) => (
                    <span
                      key={i}
                      className="inline-block animate-fadeInUp"
                      style={{ animationDelay: `${i * 0.08}s` }}
                    >
                      {word}{' '}
                    </span>
                  ))}
                </h1>

                <p className="text-2xl md:text-2xl font-semibold text-white/90 tracking-wide">
                  {heroSlides[currentSlide].subtitle}
                </p>

                <p className="text-lg text-white/80 max-w-xl leading-relaxed">
                  {heroSlides[currentSlide].description}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href={heroSlides[currentSlide].ctaLink}>
                  <Button
                    size="lg"
                    className="bg-white text-gray-900 hover:bg-gray-100 px-8 py-6 text-base font-bold rounded-xl shadow-2xl hover:shadow-white/25 transition-all duration-300 transform hover:scale-105 group"
                  >
                    {heroSlides[currentSlide].cta}
                    <ChevronRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </Link>
                <Link href="/categories">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-2 border-white/80 text-white hover:bg-white hover:text-gray-900 px-8 py-6 text-base font-bold rounded-xl bg-transparent backdrop-blur-sm transition-all duration-300"
                  >
                    Browse All
                  </Button>
                </Link>
              </div>

              <div className="grid grid-cols-3 gap-3 pt-2">
                {[['15K+', 'Styles'], ['500+', 'Brands'], ['4.9★', 'Rating']].map(([value, label]) => (
                  <div key={label} className="text-center p-3 bg-white/10 backdrop-blur-md rounded-xl border border-white/20">
                    <div className="text-xl font-bold">{value}</div>
                    <div className="text-xs text-white/75 mt-0.5">{label}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className="hidden lg:block">
              <div className="relative">
                <div className="absolute -inset-4 bg-white/10 rounded-3xl blur-2xl" />
                <div className="relative bg-white/95 backdrop-blur-xl rounded-3xl p-8 shadow-2xl border border-white/20">
                  <h3 className="text-xl font-bold text-gray-900 mb-6">Why Shop With Us</h3>
                  <div className="space-y-4">
                    {[
                      { icon: Truck, title: 'Free Island-Wide Delivery', desc: 'On orders above Rs. 3,000', color: 'bg-rose-100', iconColor: 'text-rose-600' },
                      { icon: RefreshCw, title: 'Easy 30-Day Returns', desc: 'Hassle-free return policy', color: 'bg-emerald-100', iconColor: 'text-emerald-600' },
                      { icon: Star, title: 'Authentic Products Only', desc: 'All sellers are verified', color: 'bg-amber-100', iconColor: 'text-amber-600' }
                    ].map((item) => (
                      <div key={item.title} className={`flex items-start gap-4 p-4 ${item.color} rounded-xl hover:scale-105 transition-transform duration-300`}>
                        <div className={`${item.iconColor} mt-0.5`}>
                          <item.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="font-bold text-gray-900 text-sm">{item.title}</h4>
                          <p className="text-xs text-gray-600 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex gap-3 z-30">
        {heroSlides.map((_, index) => (
          <button
            key={index}
            onClick={() => { setCurrentSlide(index); setIsAutoPlaying(false); }}
            className={`transition-all duration-300 rounded-full ${
              index === currentSlide ? 'w-10 h-3 bg-white' : 'w-3 h-3 bg-white/50 hover:bg-white/80'
            }`}
          />
        ))}
      </div>

      <style jsx global>{`
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(24px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-fadeInUp {
          animation: fadeInUp 0.7s ease-out forwards;
        }
      `}</style>
    </section>
  );
}
