'use client';

import Link from 'next/link';
import { Truck, RefreshCw, ShieldCheck, CreditCard } from 'lucide-react';

const PERKS = [
  { icon: Truck,        title: 'Free Island-Wide Delivery', desc: 'On orders over Rs. 3,000' },
  { icon: RefreshCw,    title: '30-Day Easy Returns',       desc: 'Hassle-free returns' },
  { icon: ShieldCheck,  title: 'Verified Sellers',          desc: 'Every product authenticated' },
  { icon: CreditCard,   title: 'Secure Payments',           desc: 'Multiple payment options' },
];

const STATS = [
  { value: '15,000+', label: 'Styles Available' },
  { value: '8,000+',  label: 'Happy Customers'  },
  { value: '200+',    label: 'Verified Sellers'  },
  { value: '4.9★',    label: 'Average Rating'    },
];

export function StatsSection() {
  return (
    <>
      {/* ── PERKS STRIP ── */}
      <section className="border-t border-b border-gray-100 bg-white py-8">
        <div className="max-w-6xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex items-start gap-3">
                <div className="flex-shrink-0 w-9 h-9 flex items-center justify-center bg-gray-50 rounded-full">
                  <Icon className="w-4 h-4 text-black" />
                </div>
                <div>
                  <p className="text-xs font-semibold text-black leading-tight mb-0.5">{title}</p>
                  <p className="text-[11px] text-gray-400">{desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="bg-gray-50 py-16">
        <div className="max-w-4xl mx-auto px-5 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {STATS.map(({ value, label }) => (
              <div key={label}>
                <p className="text-3xl md:text-4xl font-bold text-black mb-1.5">{value}</p>
                <p className="text-[11px] font-medium text-gray-400 tracking-widest uppercase">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── SELLER BANNER ── */}
      <section className="relative bg-black overflow-hidden py-24">
        <div
          className="absolute inset-0 opacity-15"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1884584/pexels-photo-1884584.jpeg?auto=compress&cs=tinysrgb&w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center',
          }}
        />
        <div className="relative z-10 max-w-2xl mx-auto px-5 md:px-10 text-center">
          <p className="text-[10px] font-semibold tracking-[0.35em] uppercase text-white/40 mb-5">
            Become a Seller
          </p>
          <h2
            className="text-white mb-6 leading-tight"
            style={{
              fontFamily: 'var(--font-bc), Impact, sans-serif',
              fontStyle: 'italic',
              fontWeight: 800,
              fontSize: 'clamp(2.5rem, 5vw, 4.5rem)',
              letterSpacing: '-0.02em',
            }}
          >
            Share Your Style With Sri Lanka
          </h2>
          <p className="text-white/45 max-w-sm mx-auto text-sm leading-relaxed mb-10">
            Join hundreds of fashion sellers on RAAV FASHION. Reach thousands of buyers and grow your brand.
          </p>
          <Link
            href="/seller/register"
            className="inline-block border border-white text-white text-[11px] font-semibold tracking-[0.2em] uppercase px-10 py-4 hover:bg-white hover:text-black transition-colors duration-200"
          >
            Start Selling Today
          </Link>
        </div>
      </section>
    </>
  );
}
