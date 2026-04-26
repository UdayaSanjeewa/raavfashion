'use client';

import { TrendingUp, Users, Package, Shield, Truck, RefreshCw, Tag } from 'lucide-react';

const stats = [
  {
    id: 1,
    name: 'Styles Available',
    value: '15,000+',
    icon: Package,
    description: 'Curated fashion pieces',
    color: 'from-rose-500 to-pink-500'
  },
  {
    id: 2,
    name: 'Happy Customers',
    value: '8,000+',
    icon: Users,
    description: 'Satisfied shoppers',
    color: 'from-emerald-500 to-teal-500'
  },
  {
    id: 3,
    name: 'Verified Sellers',
    value: '200+',
    icon: TrendingUp,
    description: 'Trusted fashion brands',
    color: 'from-amber-500 to-orange-500'
  },
  {
    id: 4,
    name: 'Avg. Rating',
    value: '4.9/5',
    icon: Shield,
    description: 'Customer satisfaction',
    color: 'from-sky-500 to-blue-500'
  }
];

const features = [
  {
    icon: Truck,
    title: 'Free Island-Wide Delivery',
    description: 'Free shipping on all orders above Rs. 3,000 across Sri Lanka',
    iconColor: 'text-rose-600',
    bgColor: 'bg-rose-50'
  },
  {
    icon: RefreshCw,
    title: 'Easy 30-Day Returns',
    description: 'Changed your mind? Return any item within 30 days, no questions asked',
    iconColor: 'text-emerald-600',
    bgColor: 'bg-emerald-50'
  },
  {
    icon: Tag,
    title: 'Authentic Products',
    description: 'Every seller is verified. Only genuine, quality-checked products listed',
    iconColor: 'text-amber-600',
    bgColor: 'bg-amber-50'
  }
];

export function StatsSection() {
  return (
    <section className="py-20 bg-white relative overflow-hidden">
      <div className="absolute inset-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-rose-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob" />
        <div className="absolute top-0 right-1/4 w-96 h-96 bg-pink-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-2000" />
        <div className="absolute bottom-0 left-1/2 w-96 h-96 bg-amber-100 rounded-full mix-blend-multiply filter blur-3xl opacity-40 animate-blob animation-delay-4000" />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-14">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-rose-50 rounded-full mb-4 border border-rose-100">
            <Shield className="h-4 w-4 text-rose-600" />
            <span className="text-sm font-semibold text-rose-600">Trusted Fashion Marketplace</span>
          </div>
          <h2 className="text-4xl md:text-5xl font-extrabold text-gray-900 mb-4">
            Sri Lanka's Fashion Hub
          </h2>
          <p className="text-lg text-gray-500 max-w-2xl mx-auto">
            Join thousands of fashion lovers shopping the latest styles from verified sellers across the island
          </p>
        </div>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {stats.map((stat, index) => (
            <div
              key={stat.id}
              className="relative group"
              style={{ animation: `fadeInScale 0.6s ease-out ${index * 0.1}s both` }}
            >
              <div className="absolute -inset-0.5 bg-gradient-to-r from-rose-400 to-pink-400 rounded-2xl opacity-0 group-hover:opacity-20 blur-lg transition-all duration-500" />
              <div className="relative bg-white rounded-2xl p-6 shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 hover:border-rose-100 transform hover:-translate-y-1">
                <div className={`inline-flex p-3 rounded-xl bg-gradient-to-r ${stat.color} mb-4 transform group-hover:scale-110 group-hover:rotate-3 transition-all duration-300`}>
                  <stat.icon className="h-5 w-5 text-white" />
                </div>
                <p className="text-3xl font-extrabold text-gray-900 mb-1">{stat.value}</p>
                <h3 className="text-sm font-bold text-gray-800 mb-1">{stat.name}</h3>
                <p className="text-xs text-gray-500">{stat.description}</p>
                <div className={`absolute bottom-0 left-0 right-0 h-0.5 bg-gradient-to-r ${stat.color} transform scale-x-0 group-hover:scale-x-100 transition-transform duration-500 rounded-b-2xl`} />
              </div>
            </div>
          ))}
        </div>

        <div className="bg-gradient-to-r from-rose-500 via-pink-500 to-rose-600 rounded-3xl p-0.5 shadow-xl">
          <div className="bg-white rounded-3xl p-8 md:p-12">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {features.map((feature, index) => (
                <div
                  key={index}
                  className="text-center group cursor-pointer"
                  style={{ animation: `fadeInUp 0.6s ease-out ${(index + 0.5) * 0.2}s both` }}
                >
                  <div className={`inline-flex p-5 rounded-2xl ${feature.bgColor} mb-4 transform group-hover:scale-110 group-hover:-rotate-3 transition-all duration-300`}>
                    <feature.icon className={`h-7 w-7 ${feature.iconColor}`} />
                  </div>
                  <h3 className="text-lg font-bold text-gray-900 mb-2 group-hover:text-rose-600 transition-colors duration-300">
                    {feature.title}
                  </h3>
                  <p className="text-gray-500 text-sm leading-relaxed">
                    {feature.description}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }
        @keyframes fadeInScale {
          from { opacity: 0; transform: scale(0.85) translateY(24px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        @keyframes fadeInUp {
          from { opacity: 0; transform: translateY(32px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .animate-blob { animation: blob 7s infinite; }
        .animation-delay-2000 { animation-delay: 2s; }
        .animation-delay-4000 { animation-delay: 4s; }
      `}</style>
    </section>
  );
}
