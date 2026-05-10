'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Mail, Lock, Eye, EyeOff, CircleAlert as AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { AuthManager } from '@/lib/auth';

export default function SignInPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [needsVerification, setNeedsVerification] = useState(false);
  const router = useRouter();
  const { signIn } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');
    setNeedsVerification(false);

    try {
      const result = await signIn(email, password);

      if (!result.success) {
        setError(result.error || 'Sign in failed');
        if (result.needsVerification) setNeedsVerification(true);
        toast.error(result.error || 'Sign in failed');
      } else {
        const role = result.user?.role || 'user';
        const dashboardPath = role === 'admin' ? '/admin' : '/';
        toast.success('Welcome back!');
        setTimeout(() => { router.push(dashboardPath); router.refresh(); }, 500);
      }
    } catch {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    if (!email) { toast.error('Please enter your email address'); return; }
    setIsLoading(true);
    try {
      const result = await AuthManager.resendVerificationEmail(email);
      if (result.success) toast.success('Verification email sent!');
      else toast.error(result.error || 'Failed to send verification email');
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex">
      {/* Left panel — decorative */}
      <div className="hidden lg:flex lg:w-1/2 bg-black flex-col justify-between p-12 relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('https://images.pexels.com/photos/5632399/pexels-photo-5632399.jpeg?auto=compress&cs=tinysrgb&w=1260')] bg-cover bg-center opacity-30" />
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="w-10 h-10 bg-white rounded-sm flex items-center justify-center">
              <span className="text-black font-black text-sm tracking-tighter">RF</span>
            </div>
            <span className="text-white font-bold text-lg tracking-widest uppercase">RAAV FASHION</span>
          </Link>
        </div>
        <div className="relative z-10">
          <blockquote className="text-white">
            <p className="text-3xl font-light leading-snug mb-4">"Style is a way to say who you are without having to speak."</p>
            <footer className="text-white/50 text-sm">— Rachel Zoe</footer>
          </blockquote>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm">
          {/* Mobile logo */}
          <div className="lg:hidden mb-10 text-center">
            <Link href="/" className="inline-flex items-center gap-3">
              <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center">
                <span className="text-white font-black text-sm tracking-tighter">RF</span>
              </div>
              <span className="text-black font-bold text-lg tracking-widest uppercase">RAAV FASHION</span>
            </Link>
          </div>

          <h2 className="text-3xl font-bold text-gray-900 mb-1">Welcome back</h2>
          <p className="text-gray-500 mb-8 text-sm">Sign in to your account to continue</p>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          {needsVerification && (
            <div className="mb-4 bg-amber-50 border border-amber-200 rounded-lg p-4">
              <p className="text-sm text-amber-800 mb-3">Your email is not verified. Check your inbox for the verification link.</p>
              <Button type="button" onClick={handleResendVerification} disabled={isLoading} variant="outline" size="sm" className="w-full">
                {isLoading ? 'Sending...' : 'Resend Verification Email'}
              </Button>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="email"
                  type="email"
                  placeholder="your.email@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-10 h-11 border-gray-200 focus:border-black focus:ring-black rounded-lg"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input
                  id="password"
                  type={showPassword ? 'text' : 'password'}
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="pl-10 pr-10 h-11 border-gray-200 focus:border-black focus:ring-black rounded-lg"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-11 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg tracking-wide transition-all"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : 'Sign In'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Don't have an account?{' '}
              <Link href="/auth/signup" className="font-semibold text-black hover:underline underline-offset-4 transition-colors">
                Create one
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
