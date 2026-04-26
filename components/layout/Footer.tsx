import Link from 'next/link';
import { Instagram, Facebook, Twitter, Youtube } from 'lucide-react';

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-black text-white">

      {/* Newsletter */}
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-16 flex flex-col md:flex-row items-center justify-between gap-8">
          <div>
            <h3 className="text-2xl md:text-3xl font-black tracking-tight mb-2">Stay in the Loop</h3>
            <p className="text-white/40 text-sm">New drops, exclusive deals and style inspiration — straight to your inbox.</p>
          </div>
          <form className="flex w-full max-w-sm" onSubmit={(e) => e.preventDefault()}>
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 bg-white/5 border border-white/20 px-4 py-3 text-sm text-white placeholder-white/30 focus:outline-none focus:border-white/50 transition-colors"
            />
            <button
              type="submit"
              className="bg-white text-black px-6 py-3 text-xs font-bold tracking-[0.15em] uppercase hover:bg-gray-100 transition-colors whitespace-nowrap"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main links */}
      <div className="max-w-7xl mx-auto px-6 md:px-10 py-16">
        <div className="grid grid-cols-2 md:grid-cols-5 gap-10">

          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <p
              className="text-xl font-black tracking-[0.05em] uppercase mb-4"
              style={{ fontFamily: 'var(--font-bc), Impact, sans-serif', fontStyle: 'italic' }}
            >
              RAAV FASHION
            </p>
            <p className="text-white/40 text-xs leading-relaxed mb-6">
              Sri Lanka&apos;s premier fashion destination. Connecting style-conscious shoppers with verified sellers.
            </p>
            <div className="flex gap-3">
              {[
                { Icon: Instagram, href: '#' },
                { Icon: Facebook, href: '#' },
                { Icon: Twitter, href: '#' },
                { Icon: Youtube, href: '#' },
              ].map(({ Icon, href }, i) => (
                <Link key={i} href={href} className="text-white/30 hover:text-white transition-colors">
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {[
            {
              title: 'Shop',
              links: [
                { name: "Women's Fashion", href: '/categories/womens-fashion' },
                { name: "Men's Fashion", href: '/categories/mens-fashion' },
                { name: 'Accessories', href: '/categories/accessories' },
                { name: 'Shoes & Footwear', href: '/categories/shoes-footwear' },
                { name: 'Traditional & Ethnic', href: '/categories/traditional-ethnic' },
                { name: 'Sportswear', href: '/categories/sportswear' },
              ],
            },
            {
              title: 'Support',
              links: [
                { name: 'Help Center', href: '/help' },
                { name: 'Track Order', href: '/account/orders' },
                { name: 'Returns', href: '/help' },
                { name: 'Size Guide', href: '/help' },
                { name: 'Contact Us', href: '/help' },
              ],
            },
            {
              title: 'Sellers',
              links: [
                { name: 'Become a Seller', href: '/seller/register' },
                { name: 'Seller Dashboard', href: '/seller/dashboard' },
                { name: 'Seller Guidelines', href: '/help' },
                { name: 'Commission Rates', href: '/help' },
              ],
            },
            {
              title: 'Company',
              links: [
                { name: 'About Us', href: '/about' },
                { name: 'Careers', href: '/careers' },
                { name: 'Press', href: '/press' },
                { name: 'Blog', href: '/blog' },
                { name: 'Privacy Policy', href: '/privacy' },
                { name: 'Terms & Conditions', href: '/terms' },
              ],
            },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-[10px] font-bold tracking-[0.2em] uppercase text-white/30 mb-5">{col.title}</h4>
              <ul className="space-y-3">
                {col.links.map((l) => (
                  <li key={l.name}>
                    <Link href={l.href} className="text-xs text-white/60 hover:text-white transition-colors">
                      {l.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom bar */}
      <div className="border-t border-white/10">
        <div className="max-w-7xl mx-auto px-6 md:px-10 py-5 flex flex-col md:flex-row items-center justify-between gap-3">
          <p className="text-[11px] text-white/30">&copy; {year} RAAV FASHION. All rights reserved.</p>
          <div className="flex gap-6">
            {['Privacy', 'Terms', 'Cookies'].map((item) => (
              <Link key={item} href="#" className="text-[11px] text-white/30 hover:text-white/60 transition-colors">
                {item}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
