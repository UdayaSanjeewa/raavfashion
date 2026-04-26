import Link from 'next/link';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, Shirt } from 'lucide-react';

export function Footer() {
  const currentYear = new Date().getFullYear();

  const footerSections = [
    {
      title: 'Shop by Category',
      links: [
        { name: "Women's Fashion", href: '/categories/womens-fashion' },
        { name: "Men's Fashion", href: '/categories/mens-fashion' },
        { name: 'Kids & Baby', href: '/categories/kids-baby' },
        { name: 'Accessories', href: '/categories/accessories' },
        { name: 'Shoes & Footwear', href: '/categories/shoes-footwear' },
        { name: 'Traditional & Ethnic', href: '/categories/traditional-ethnic' }
      ]
    },
    {
      title: 'Customer Support',
      links: [
        { name: 'Help Center', href: '/help' },
        { name: 'Track Your Order', href: '/account/orders' },
        { name: 'Returns & Refunds', href: '/help' },
        { name: 'Size Guide', href: '/help' },
        { name: 'Contact Us', href: '/help' },
        { name: 'Privacy Policy', href: '/privacy' }
      ]
    },
    {
      title: 'For Sellers',
      links: [
        { name: 'Become a Seller', href: '/seller/register' },
        { name: 'Seller Dashboard', href: '/seller/dashboard' },
        { name: 'Seller Guidelines', href: '/help' },
        { name: 'Upload Products', href: '/seller/products/new' },
        { name: 'Seller Support', href: '/help' },
        { name: 'Commission Rates', href: '/help' }
      ]
    },
    {
      title: 'About StyleHub LK',
      links: [
        { name: 'About Us', href: '/about' },
        { name: 'Careers', href: '/careers' },
        { name: 'Press', href: '/press' },
        { name: 'Blog', href: '/blog' },
        { name: 'Sustainability', href: '/sustainability' },
        { name: 'Terms & Conditions', href: '/terms' }
      ]
    }
  ];

  return (
    <footer className="bg-gray-900 text-white">
      {/* Newsletter Section */}
      <div className="bg-gradient-to-r from-rose-600 to-pink-600">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-2">Stay in Style</h3>
            <p className="text-rose-100 mb-6 text-sm">Get the latest fashion drops, exclusive deals, and style inspiration delivered to your inbox</p>
            <div className="max-w-md mx-auto flex gap-2">
              <input
                type="email"
                placeholder="Enter your email address"
                className="flex-1 px-4 py-3 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-white text-sm"
              />
              <button className="bg-gray-900 text-white px-6 py-3 rounded-lg font-semibold hover:bg-gray-800 transition-colors text-sm whitespace-nowrap">
                Subscribe
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8">
          {/* Company Info */}
          <div className="lg:col-span-1">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-rose-600 rounded-lg flex items-center justify-center">
                <Shirt className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight">StyleHub LK</span>
            </div>
            <p className="text-gray-400 mb-6 text-sm leading-relaxed">
              Sri Lanka's premier online fashion marketplace. Discover the latest trends from verified sellers across the island.
            </p>

            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2">
                <Phone className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <span className="text-gray-400">+94 11 234 5678</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <span className="text-gray-400">hello@stylehublk.com</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="h-4 w-4 text-rose-400 flex-shrink-0" />
                <span className="text-gray-400">Colombo, Sri Lanka</span>
              </div>
            </div>

            <div className="flex space-x-2 mt-6">
              {[
                { Icon: Facebook, hover: 'hover:bg-blue-600' },
                { Icon: Twitter, hover: 'hover:bg-sky-500' },
                { Icon: Instagram, hover: 'hover:bg-pink-600' },
                { Icon: Youtube, hover: 'hover:bg-red-600' }
              ].map(({ Icon, hover }, i) => (
                <Link key={i} href="#" className={`bg-gray-800 p-2 rounded-lg ${hover} transition-colors`}>
                  <Icon className="h-4 w-4" />
                </Link>
              ))}
            </div>
          </div>

          {/* Footer Sections */}
          {footerSections.map((section) => (
            <div key={section.title}>
              <h4 className="font-semibold text-white mb-4 text-sm">{section.title}</h4>
              <ul className="space-y-2.5">
                {section.links.map((link) => (
                  <li key={link.name}>
                    <Link href={link.href} className="text-gray-400 hover:text-rose-400 transition-colors text-sm">
                      {link.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-gray-500 text-sm">
              &copy; {currentYear} StyleHub LK. All rights reserved.
            </div>
            <div className="flex flex-wrap justify-center gap-5 text-sm">
              {['Terms of Service', 'Privacy Policy', 'Cookie Policy', 'Accessibility'].map((item) => (
                <Link key={item} href="#" className="text-gray-500 hover:text-white transition-colors">
                  {item}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
