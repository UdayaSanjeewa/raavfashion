'use client';

import Link from 'next/link';
import { Truck, RefreshCw, ShieldCheck, Award } from 'lucide-react';

const PERKS = [
  {
    icon: Truck,
    title: 'Free Island-Wide Delivery',
    desc: 'On all orders over Rs. 3,000',
  },
  {
    icon: RefreshCw,
    title: '30-Day Easy Returns',
    desc: 'No questions asked',
  },
  {
    icon: ShieldCheck,
    title: 'Verified Sellers Only',
    desc: 'Every product is authenticated',
  },
  {
    icon: Award,
    title: 'Premium Quality',
    desc: 'Curated for those who care',
  },
];

const STATS = [
  { value: '15,000+', label: 'Styles Available' },
  { value: '8,000+', label: 'Happy Customers' },
  { value: '200+', label: 'Verified Sellers' },
  { value: '4.9★', label: 'Average Rating' },
];

export function StatsSection() {
  return (
    <>
      {/* PERKS BAR */}
      <section className="bg-black py-16">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-6">
            {PERKS.map(({ icon: Icon, title, desc }) => (
              <div key={title} className="flex flex-col items-center text-center group">
                <div className="mb-4 p-3 border border-white/10 group-hover:border-white/30 transition-colors">
                  <Icon className="h-5 w-5 text-white" />
                </div>
                <h3 className="text-xs font-bold tracking-[0.12em] uppercase text-white mb-1.5">{title}</h3>
                <p className="text-xs text-white/40">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* STATS BANNER */}
      <section className="bg-white py-20 border-b border-gray-100">
        <div className="max-w-7xl mx-auto px-6 md:px-10">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 divide-x divide-gray-100">
            {STATS.map(({ value, label }) => (
              <div key={label} className="text-center px-4 first:pl-0 last:pr-0">
                <p className="text-4xl md:text-5xl font-black text-black mb-2 tracking-tight">{value}</p>
                <p className="text-xs font-medium tracking-[0.15em] uppercase text-gray-400">{label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* EDITORIAL BANNER — full-width dark callout */}
      <section className="relative bg-gray-950 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: 'url(https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=1200)',
            backgroundSize: 'cover',
            backgroundPosition: 'center 30%',
          }}
        />
        <div className="relative z-10 max-w-7xl mx-auto px-6 md:px-10 py-28 text-center">
          <p className="text-xs font-bold tracking-[0.3em] uppercase text-white/40 mb-6">Become a Seller</p>
          <h2 className="text-4xl md:text-6xl font-black text-white leading-none tracking-tight mb-8 max-w-3xl mx-auto">
            Share Your Style<br />With Sri Lanka
          </h2>
          <p className="text-white/50 max-w-md mx-auto text-sm leading-relaxed mb-10">
            Join hundreds of fashion sellers on RAAV FASHION. List your products, reach thousands of buyers, and grow your brand.
          </p>
          <Link
            href="/seller/register"
            className="inline-flex items-center gap-3 border border-white text-white px-10 py-4 text-xs font-bold tracking-[0.2em] uppercase hover:bg-white hover:text-black transition-colors duration-200"
          >
            Start Selling Today
          </Link>
        </div>
      </section>
    </>
  );
}
