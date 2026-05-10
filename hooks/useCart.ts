'use client';

import { useState, useEffect } from 'react';
import { CartItem, Product } from '@/types';
import { CartManager } from '@/lib/cart';

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const initialCart = CartManager.getCart();
    setCart(initialCart);
    setIsLoading(false);
    
    // Listen for storage changes to sync cart across tabs
    const handleStorageChange = () => {
      setCart(CartManager.getCart());
    };

    const handleCartUpdate = () => {
      setCart(CartManager.getCart());
    };
    
    window.addEventListener('storage', handleStorageChange);
    window.addEventListener('cartUpdated', handleCartUpdate);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('cartUpdated', handleCartUpdate);
    };
  }, []);

  const addToCart = (product: Product, quantity: number = 1, selectedSize?: string, selectedColor?: string) => {
    const updatedCart = CartManager.addToCart(product, quantity, selectedSize, selectedColor);
    setCart(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const removeFromCart = (cartItemId: string) => {
    const updatedCart = CartManager.removeFromCart(cartItemId);
    setCart(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const updateQuantity = (cartItemId: string, quantity: number) => {
    const updatedCart = CartManager.updateQuantity(cartItemId, quantity);
    setCart(updatedCart);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const clearCart = () => {
    CartManager.clearCart();
    setCart([]);
    window.dispatchEvent(new CustomEvent('cartUpdated'));
  };

  const isInCart = (productId: string) => {
    return cart.some(item => item.product.id === productId);
  };

  const getItemQuantity = (productId: string) => {
    const item = cart.find(item => item.product.id === productId);
    return item ? item.quantity : 0;
  };

  const cartTotal = CartManager.getCartTotal(cart);
  const itemCount = CartManager.getCartItemCount(cart);

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    isInCart,
    getItemQuantity,
    cartTotal,
    itemCount,
    isLoading
  };
}