'use client';

import Link from 'next/link';
import { Instagram, Facebook, Youtube } from 'lucide-react';
import { useState } from 'react';

export function Footer() {
  const year = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleNewsletter = (e: React.FormEvent) => {
    e.preventDefault();
    if (email.trim()) { setSubmitted(true); }
  };

  return (
    <footer className="bg-white border-t border-gray-100">

      {/* ── NEWSLETTER ── */}
      <div className="bg-gray-50 border-b border-gray-100 py-12">
        <div className="max-w-6xl mx-auto px-5 md:px-10 flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-base font-semibold text-black mb-1">Stay in the know</h3>
            <p className="text-sm text-gray-400">New arrivals, exclusive deals and style inspiration.</p>
          </div>
          {submitted ? (
            <p className="text-sm text-green-600 font-medium">Thank you for subscribing!</p>
          ) : (
            <form onSubmit={handleNewsletter} className="flex w-full max-w-sm">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                className="flex-1 border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-400 focus:outline-none focus:border-black transition-colors bg-white"
              />
              <button
                type="submit"
                className="bg-black text-white px-6 py-3 text-[11px] font-semibold tracking-[0.15em] uppercase hover:bg-gray-900 transition-colors whitespace-nowrap"
              >
                Subscribe
              </button>
            </form>
          )}
        </div>
      </div>

      {/* ── MAIN LINKS ── */}
      <div className="max-w-6xl mx-auto px-5 md:px-10 py-14">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/">
              <span
                className="font-black italic text-black text-xl leading-none block mb-4"
                style={{ fontFamily: 'var(--font-bc), Impact, sans-serif' }}
              >
                RAAV<span className="opacity-40 ml-1">FASHION</span>
              </span>
            </Link>
            <p className="text-xs text-gray-400 leading-relaxed mb-5">
              Sri Lanka&apos;s premier fashion destination. Premium styles from verified sellers.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: '#', label: 'Instagram' },
                { Icon: Facebook,  href: '#', label: 'Facebook'  },
                { Icon: Youtube,   href: '#', label: 'YouTube'   },
              ].map(({ Icon, href, label }) => (
                <Link
                  key={label}
                  href={href}
                  aria-label={label}
                  className="w-8 h-8 flex items-center justify-center border border-gray-200 text-gray-400 hover:text-black hover:border-black transition-colors"
                >
                  <Icon className="h-3.5 w-3.5" />
                </Link>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Shop',
              links: [
                { name: "Women's Fashion",    href: '/categories/womens-fashion'    },
                { name: "Men's Fashion",      href: '/categories/mens-fashion'      },
                { name: 'Accessories',        href: '/categories/accessories'       },
                { name: 'Shoes & Footwear',   href: '/categories/shoes-footwear'    },
                { name: 'Traditional Wear',   href: '/categories/traditional-ethnic'},
                { name: 'Sportswear',         href: '/categories/sportswear'        },
              ],
            },
            {
              title: 'Support',
              links: [
                { name: 'Help Center',  href: '/help'            },
                { name: 'Track Order',  href: '/account/orders'  },
                { name: 'Returns',      href: '/help'            },
                { name: 'Size Guide',   href: '/help'            },
                { name: 'Contact Us',   href: '/help'            },
              ],
            },
            {
              title: 'Sellers',
              links: [
                { name: 'Become a Seller',    href: '/seller/register'   },
                { name: 'Seller Dashboard',   href: '/seller/dashboard'  },
                { name: 'Seller Guidelines',  href: '/help'              },
                { name: 'Commission Rates',   href: '/help'              },
              ],
            },
            {
              title: 'Company',
              links: [
                { name: 'About Us',          href: '#' },
                { name: 'Careers',           href: '#' },
                { name: 'Privacy Policy',    href: '#' },
                { name: 'Terms & Conditions',href: '#' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[11px] font-semibold text-black tracking-widest uppercase mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-xs text-gray-400 hover:text-black transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* ── BOTTOM BAR ── */}
      <div className="border-t border-gray-100">
        <div className="max-w-6xl mx-auto px-5 md:px-10 py-4 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-gray-400">&copy; {year} RAAV FASHION. All rights reserved.</p>
          <div className="flex gap-5">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <Link key={item} href="#" className="text-[11px] text-gray-400 hover:text-black transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
