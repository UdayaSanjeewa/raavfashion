'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { useCart } from '@/hooks/useCart';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Sheet, 
  SheetContent, 
  SheetHeader, 
  SheetTitle, 
  SheetTrigger,
  SheetFooter 
} from '@/components/ui/sheet';
import {
  ShoppingCart,
  Plus,
  Minus,
  Trash2,
  ShoppingBag
} from 'lucide-react';

const COLOR_HEX_MAP: Record<string, string> = {
  'Black':    '#000000',
  'White':    '#FFFFFF',
  'Grey':     '#9CA3AF',
  'Navy':     '#1E3A5F',
  'Blue':     '#3B82F6',
  'Sky Blue': '#7DD3FC',
  'Red':      '#EF4444',
  'Maroon':   '#7F1D1D',
  'Pink':     '#F472B6',
  'Peach':    '#FBBF8A',
  'Orange':   '#F97316',
  'Yellow':   '#FACC15',
  'Green':    '#22C55E',
  'Olive':    '#6B7280',
  'Khaki':    '#C3B091',
  'Beige':    '#F5F0E8',
  'Brown':    '#92400E',
  'Camel':    '#C19A6B',
  'Cream':    '#FFFDD0',
  'Gold':     '#D4AF37',
  'Silver':   '#C0C0C0',
};
import { toast } from 'sonner';

interface CartDrawerProps {
  children: React.ReactNode;
}

export function CartDrawer({ children }: CartDrawerProps) {
  const { 
    cart, 
    updateQuantity, 
    removeFromCart, 
    clearCart, 
    cartTotal, 
    itemCount 
  } = useCart();
  const [isOpen, setIsOpen] = useState(false);

  // Debug log to see cart state
  useEffect(() => {
    console.log('CartDrawer cart state:', cart, 'itemCount:', itemCount);
  }, [cart, itemCount]);
  useEffect(() => {
    const handleOpenCart = () => setIsOpen(true);
    document.addEventListener('openCart', handleOpenCart);
    return () => document.removeEventListener('openCart', handleOpenCart);
  }, []);

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat('en-LK', {
      style: 'currency',
      currency: 'LKR',
      minimumFractionDigits: 0,
    }).format(price);
  };

  const handleQuantityChange = (cartItemId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(cartItemId);
      toast.success('Item removed from cart');
    } else {
      updateQuantity(cartItemId, newQuantity);
    }
  };

  const handleClearCart = () => {
    clearCart();
    toast.success('Cart cleared');
  };

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        {children}
      </SheetTrigger>
      <SheetContent className="w-full sm:max-w-lg">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            <ShoppingCart className="h-5 w-5" />
            Shopping Cart
            {itemCount > 0 && (
              <Badge variant="secondary" className="ml-2">
                {itemCount} {itemCount === 1 ? 'item' : 'items'}
              </Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        <div className="flex flex-col h-full">
          {!cart || cart.length === 0 ? (
            <div className="flex-1 flex flex-col items-center justify-center text-center py-8">
              <ShoppingBag className="h-16 w-16 text-gray-300 mb-4" />
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                Your cart is empty
              </h3>
              <p className="text-gray-500 mb-6">
                Add some products to get started
              </p>
              <Button onClick={() => setIsOpen(false)}>
                Continue Shopping
              </Button>
            </div>
          ) : (
            <>
              {/* Cart Items */}
              <div className="flex-1 overflow-y-auto py-4">
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={item.id}
                      className="flex gap-3 p-3 bg-gray-50 rounded-lg border border-gray-100"
                    >
                      <div className="w-16 h-16 flex-shrink-0">
                        <img
                          src={item.product.images[0]}
                          alt={item.product.title}
                          className="w-full h-full object-cover rounded-md"
                        />
                      </div>

                      <div className="flex-1 min-w-0">
                        <Link
                          href={`/product/${item.product.id}`}
                          onClick={() => setIsOpen(false)}
                          className="font-semibold text-sm text-gray-900 hover:text-gray-600 line-clamp-1 leading-tight"
                        >
                          {item.product.title}
                        </Link>

                        {/* Size & Color chips */}
                        {(item.selectedSize || item.selectedColor) && (
                          <div className="flex flex-wrap gap-1 mt-1">
                            {item.selectedSize && (
                              <span className="inline-flex items-center text-[11px] font-bold bg-black text-white px-2 py-0.5 rounded-full leading-none">
                                {item.selectedSize}
                              </span>
                            )}
                            {item.selectedColor && (
                              <span className="inline-flex items-center gap-1 text-[11px] font-semibold bg-white border border-gray-200 text-gray-700 px-2 py-0.5 rounded-full leading-none">
                                <span
                                  className="w-2.5 h-2.5 rounded-full border border-gray-200 flex-shrink-0"
                                  style={{ backgroundColor: COLOR_HEX_MAP[item.selectedColor] || '#ccc' }}
                                />
                                {item.selectedColor}
                              </span>
                            )}
                          </div>
                        )}

                        <div className="flex items-center justify-between mt-2">
                          <span className="font-bold text-sm text-gray-900">
                            {formatPrice(item.product.price)}
                          </span>
                          <div className="flex items-center gap-1">
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              className="h-6 w-6"
                            >
                              <Minus className="h-3 w-3" />
                            </Button>
                            <span className="min-w-[1.5rem] text-center text-sm font-semibold">
                              {item.quantity}
                            </span>
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              className="h-6 w-6"
                            >
                              <Plus className="h-3 w-3" />
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => removeFromCart(item.id)}
                              className="h-6 w-6 text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-3 w-3" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Cart Footer */}
              <SheetFooter className="border-t pt-4">
                <div className="w-full space-y-4">
                  {/* Total */}
                  <div className="flex justify-between items-center text-lg font-bold">
                    <span>Total:</span>
                    <span className="text-blue-600">
                      {formatPrice(cartTotal)}
                    </span>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={handleClearCart}
                      className="flex-1"
                    >
                      Clear Cart
                    </Button>
                    <Link href="/checkout" className="flex-1">
                      <Button
                        className="w-full bg-black hover:bg-gray-900 text-white"
                        onClick={() => setIsOpen(false)}
                      >
                        Checkout
                      </Button>
                    </Link>
                  </div>

                  <Button
                    variant="ghost"
                    onClick={() => setIsOpen(false)}
                    className="w-full"
                  >
                    Continue Shopping
                  </Button>
                </div>
              </SheetFooter>
            </>
          )}
        </div>
      </SheetContent>
    </Sheet>
  );
}