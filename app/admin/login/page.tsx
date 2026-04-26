'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, ShieldCheck, AlertCircle } from 'lucide-react';
import { AuthManager } from '@/lib/auth';

export default function AdminLogin() {
  const router = useRouter();
  const [email, setEmail]         = useState('');
  const [password, setPassword]   = useState('');
  const [showPass, setShowPass]   = useState(false);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [checking, setChecking]   = useState(true);

  // If already an admin, redirect immediately
  useEffect(() => {
    AuthManager.isAdmin().then((isAdmin) => {
      if (isAdmin) router.replace('/admin');
      else setChecking(false);
    });
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    const result = await AuthManager.signIn(email.trim(), password);

    if (!result.success) {
      setError(result.error || 'Invalid credentials');
      setLoading(false);
      return;
    }

    if (result.user?.role !== 'admin') {
      await AuthManager.signOut();
      setError('Access denied. This portal is for administrators only.');
      setLoading(false);
      return;
    }

    router.replace('/admin');
  };

  if (checking) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-black border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">

      {/* Top bar */}
      <div className="bg-black px-8 py-4 flex items-center justify-between">
        <span
          className="text-white font-black italic text-xl leading-none"
          style={{ fontFamily: 'var(--font-bc), Impact, sans-serif', letterSpacing: '-0.02em' }}
        >
          RAAV<span className="opacity-40 ml-1.5">FASHION</span>
        </span>
        <span className="text-white/40 text-[11px] tracking-widest uppercase font-medium">
          Admin Portal
        </span>
      </div>

      {/* Main */}
      <div className="flex-1 flex items-center justify-center px-4 py-16">
        <div className="w-full max-w-md">

          {/* Card */}
          <div className="bg-white border border-gray-100 shadow-sm">

            {/* Header */}
            <div className="px-8 pt-10 pb-8 border-b border-gray-50 text-center">
              <div className="inline-flex items-center justify-center w-12 h-12 bg-black mb-5">
                <ShieldCheck className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold text-black mb-1.5">Admin Sign In</h1>
              <p className="text-sm text-gray-400">Access the RAAV FASHION admin dashboard</p>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="px-8 py-8 space-y-5">

              {/* Error */}
              {error && (
                <div className="flex items-start gap-3 bg-red-50 border border-red-100 px-4 py-3.5">
                  <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-red-600 leading-snug">{error}</p>
                </div>
              )}

              {/* Email */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2">
                  Email Address
                </label>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="admin@raavfashion.lk"
                  required
                  autoFocus
                  className="w-full border border-gray-200 px-4 py-3 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                />
              </div>

              {/* Password */}
              <div>
                <label className="block text-[11px] font-semibold text-gray-500 tracking-wider uppercase mb-2">
                  Password
                </label>
                <div className="relative">
                  <input
                    type={showPass ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="••••••••"
                    required
                    className="w-full border border-gray-200 px-4 py-3 pr-11 text-sm text-black placeholder-gray-300 focus:outline-none focus:border-black transition-colors bg-white"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPass(!showPass)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-black transition-colors p-1"
                    tabIndex={-1}
                  >
                    {showPass ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Submit */}
              <button
                type="submit"
                disabled={loading || !email || !password}
                className="w-full bg-black text-white py-3.5 text-[11px] font-semibold tracking-[0.2em] uppercase hover:bg-gray-900 transition-colors duration-200 disabled:opacity-40 disabled:cursor-not-allowed flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    Signing in...
                  </>
                ) : (
                  'Sign In to Dashboard'
                )}
              </button>
            </form>

            {/* Footer note */}
            <div className="px-8 pb-8">
              <p className="text-center text-[11px] text-gray-400">
                This portal is restricted to authorized administrators only.
              </p>
            </div>
          </div>

          {/* Back link */}
          <div className="mt-6 text-center">
            <a href="/" className="text-[11px] text-gray-400 hover:text-black transition-colors tracking-wide">
              &larr; Back to store
            </a>
          </div>
        </div>
      </div>
    </div>
  );
}
