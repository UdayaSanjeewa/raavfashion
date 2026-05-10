'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Phone, Lock, Eye, EyeOff, User, Mail, MailCheck, CircleAlert as AlertCircle } from 'lucide-react';
import { toast } from 'sonner';
import { useAuth } from '@/hooks/useAuth';
import { AuthManager } from '@/lib/auth';

export default function SignUpPage() {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [mobile, setMobile] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [showVerificationMessage, setShowVerificationMessage] = useState(false);
  const [userEmail, setUserEmail] = useState('');
  const router = useRouter();
  const { signUp } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    try {
      const result = await signUp(name, email, password, mobile);

      if (!result.success) {
        setError(result.error || 'Sign up failed');
        toast.error(result.error || 'Sign up failed');
      } else if (result.needsVerification) {
        setUserEmail(email);
        setShowVerificationMessage(true);
        toast.success('Account created! Check your email to verify.');
      } else {
        toast.success('Welcome to RAAV FASHION!');
        setTimeout(() => { router.push('/'); router.refresh(); }, 500);
      }
    } catch {
      setError('An unexpected error occurred');
      toast.error('An unexpected error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendVerification = async () => {
    setIsLoading(true);
    try {
      const result = await AuthManager.resendVerificationEmail(userEmail);
      if (result.success) toast.success('Verification email sent!');
      else toast.error(result.error || 'Failed to send verification email');
    } catch {
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  // Verification sent screen
  if (showVerificationMessage) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white px-6 py-12">
        <div className="w-full max-w-sm text-center">
          <Link href="/" className="inline-flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-black rounded-sm flex items-center justify-center">
              <span className="text-white font-black text-sm tracking-tighter">RF</span>
            </div>
            <span className="text-black font-bold text-lg tracking-widest uppercase">RAAV FASHION</span>
          </Link>

          <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <MailCheck className="w-8 h-8 text-gray-900" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Check your email</h2>
          <p className="text-gray-500 text-sm mb-6">We sent a verification link to <span className="font-semibold text-gray-900">{userEmail}</span></p>

          <div className="bg-gray-50 rounded-xl p-5 text-left mb-6">
            <p className="text-sm font-semibold text-gray-900 mb-3">Next steps:</p>
            <ol className="list-decimal list-inside space-y-1.5 text-sm text-gray-600 ml-1">
              <li>Open your email inbox</li>
              <li>Look for an email from RAAV FASHION</li>
              <li>Click the verification link</li>
              <li>Sign in to your account</li>
            </ol>
          </div>

          <div className="space-y-3">
            <Button onClick={handleResendVerification} disabled={isLoading} variant="outline" className="w-full h-11 border-gray-200 hover:border-gray-900 hover:bg-gray-900 hover:text-white transition-all rounded-lg">
              {isLoading ? 'Sending...' : 'Resend Verification Email'}
            </Button>
            <Link href="/auth/signin">
              <Button className="w-full h-11 bg-black hover:bg-gray-900 text-white rounded-lg">
                Go to Sign In
              </Button>
            </Link>
            <Link href="/" className="block text-xs text-gray-400 hover:text-gray-600 transition-colors pt-1">
              ← Back to Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

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
          <p className="text-white/60 text-sm uppercase tracking-widest mb-3">New arrivals every week</p>
          <h2 className="text-3xl font-light text-white leading-snug">Discover fashion that defines your unique style.</h2>
        </div>
      </div>

      {/* Right panel — form */}
      <div className="flex-1 flex items-center justify-center bg-white px-6 py-12 overflow-y-auto">
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

          <h2 className="text-3xl font-bold text-gray-900 mb-1">Create account</h2>
          <p className="text-gray-500 mb-8 text-sm">Join RAAV FASHION and explore the latest styles</p>

          {error && (
            <Alert className="mb-4 border-red-200 bg-red-50">
              <AlertCircle className="h-4 w-4 text-red-600" />
              <AlertDescription className="text-red-700">{error}</AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <Label htmlFor="name" className="text-sm font-medium text-gray-900">Full Name</Label>
              <div className="relative">
                <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="name" type="text" placeholder="Enter your full name" value={name} onChange={(e) => setName(e.target.value)} className="pl-10 h-11 border-gray-200 focus:border-black focus:ring-black rounded-lg" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="email" className="text-sm font-medium text-gray-900">Email Address</Label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="email" type="email" placeholder="your.email@example.com" value={email} onChange={(e) => setEmail(e.target.value)} className="pl-10 h-11 border-gray-200 focus:border-black focus:ring-black rounded-lg" required />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="mobile" className="text-sm font-medium text-gray-900">Mobile Number <span className="text-gray-400 font-normal">(Optional)</span></Label>
              <div className="relative">
                <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="mobile" type="tel" placeholder="+94771234567" value={mobile} onChange={(e) => setMobile(e.target.value)} className="pl-10 h-11 border-gray-200 focus:border-black focus:ring-black rounded-lg" />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="password" className="text-sm font-medium text-gray-900">Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="password" type={showPassword ? 'text' : 'password'} placeholder="Create a strong password" value={password} onChange={(e) => setPassword(e.target.value)} className="pl-10 pr-10 h-11 border-gray-200 focus:border-black focus:ring-black rounded-lg" required />
                <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="confirmPassword" className="text-sm font-medium text-gray-900">Confirm Password</Label>
              <div className="relative">
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                <Input id="confirmPassword" type={showConfirmPassword ? 'text' : 'password'} placeholder="Confirm your password" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} className="pl-10 pr-10 h-11 border-gray-200 focus:border-black focus:ring-black rounded-lg" required />
                <button type="button" onClick={() => setShowConfirmPassword(!showConfirmPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-700 transition-colors">
                  {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button type="submit" className="w-full h-11 bg-black hover:bg-gray-900 text-white font-semibold rounded-lg tracking-wide transition-all" disabled={isLoading}>
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </Button>
          </form>

          <div className="mt-6 text-center">
            <p className="text-sm text-gray-500">
              Already have an account?{' '}
              <Link href="/auth/signin" className="font-semibold text-black hover:underline underline-offset-4 transition-colors">
                Sign in
              </Link>
            </p>
          </div>

          <div className="mt-4 text-center">
            <Link href="/" className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
              ← Back to Home
            </Link>
          </div>

          <p className="mt-6 text-xs text-gray-400 text-center">
            By creating an account you agree to our{' '}
            <Link href="/terms" className="text-gray-700 hover:underline">Terms</Link>{' '}and{' '}
            <Link href="/privacy" className="text-gray-700 hover:underline">Privacy Policy</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
