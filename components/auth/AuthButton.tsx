'use client';

import Link from 'next/link';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { User, LogOut, Settings, ShoppingBag, Heart } from 'lucide-react';
import { useAuth } from '@/hooks/useAuth';
import { toast } from 'sonner';

export function AuthButton() {
  const { user, isLoading, signOut } = useAuth();

  const handleSignOut = () => {
    signOut();
    toast.success('Signed out successfully');
  };

  const getDashboardLink = () => {
    if (!user) return '/account';
    return user.role === 'admin' ? '/admin' : '/account';
  };

  if (isLoading) {
    return (
      <div className="flex items-center space-x-2">
        <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center gap-1.5">
        <Link href="/auth/signin">
          <span className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase text-gray-600 hover:text-black px-3 py-1.5 transition-colors duration-150">
            Sign In
          </span>
        </Link>
        <Link href="/auth/signup">
          <span className="inline-block text-[11px] font-semibold tracking-[0.12em] uppercase bg-black text-white px-4 py-1.5 hover:bg-gray-800 transition-colors duration-150">
            Sign Up
          </span>
        </Link>
      </div>
    );
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center space-x-2 p-2">
          <div className="w-8 h-8 bg-black rounded-full flex items-center justify-center text-white text-sm font-semibold">
            {user.name[0]?.toUpperCase() || 'U'}
          </div>
          <div className="hidden sm:block text-left">
            <div className="text-sm font-medium text-gray-900">{user.name}</div>
            <div className="text-xs text-gray-500">{user.email}</div>
          </div>
        </Button>
      </DropdownMenuTrigger>

      <DropdownMenuContent align="end" className="w-56">
        <DropdownMenuLabel>My Account</DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href={getDashboardLink()} className="flex items-center cursor-pointer">
            <User className="mr-2 h-4 w-4" />
            <span>{user.role === 'admin' ? 'Admin Dashboard' : 'Account Dashboard'}</span>
          </Link>
        </DropdownMenuItem>

        {user.role === 'admin' && (
          <DropdownMenuItem asChild>
            <Link href="/admin/orders" className="flex items-center cursor-pointer">
              <ShoppingBag className="mr-2 h-4 w-4" />
              <span>Order Management</span>
            </Link>
          </DropdownMenuItem>
        )}

        {user.role !== 'admin' && (
          <>
            <DropdownMenuItem asChild>
              <Link href="/account/profile" className="flex items-center cursor-pointer">
                <User className="mr-2 h-4 w-4" />
                <span>Profile</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/orders" className="flex items-center cursor-pointer">
                <ShoppingBag className="mr-2 h-4 w-4" />
                <span>My Orders</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/watchlist" className="flex items-center cursor-pointer">
                <Heart className="mr-2 h-4 w-4" />
                <span>Watchlist</span>
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link href="/account/settings" className="flex items-center cursor-pointer">
                <Settings className="mr-2 h-4 w-4" />
                <span>Settings</span>
              </Link>
            </DropdownMenuItem>
          </>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem
          onClick={handleSignOut}
          className="text-red-600 focus:text-red-600 cursor-pointer"
        >
          <LogOut className="mr-2 h-4 w-4" />
          <span>Sign Out</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
