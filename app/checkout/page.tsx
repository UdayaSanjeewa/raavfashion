'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/hooks/useAuth';
import { useCart } from '@/hooks/useCart';
import { supabase } from '@/lib/supabase';
import { paymentGateway } from '@/lib/payment-gateway';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { ArrowLeft, CreditCard, Truck, Package, MapPin, Wallet, Plus, Star } from 'lucide-react';
import { toast } from 'sonner';
import Link from 'next/link';

interface SavedAddress {
  id: string;
  name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state?: string;
  postal_code?: string;
  country: string;
  is_default: boolean;
}

export default function CheckoutPage() {
  const { user, isLoading: authLoading } = useAuth();
  const { cart, cartTotal, clearCart } = useCart();
  const router = useRouter();
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);
  const [savedAddresses, setSavedAddresses] = useState<SavedAddress[]>([]);
  const [selectedAddressId, setSelectedAddressId] = useState<string>('new');
  const [saveAddressToProfile, setSaveAddressToProfile] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    address: '',
    city: '',
    postal_code: '',
    notes: '',
    payment_method: 'cash_on_delivery'
  });

  useEffect(() => {
    if (!authLoading && !user) router.push('/auth/signin');
  }, [user, authLoading, router]);

  useEffect(() => {
    if (cart.length === 0 && !authLoading) router.push('/');
  }, [cart, authLoading, router]);

  useEffect(() => {
    if (user) {
      loadUserProfile();
      loadSavedAddresses();
    }
  }, [user]);

  const loadUserProfile = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_profiles')
      .select('*')
      .eq('id', user.id)
      .maybeSingle();

    setFormData(prev => ({
      ...prev,
      name: data?.name || (user as any).name || '',
      email: data?.email || (user as any).email || '',
      mobile: data?.mobile || (user as any).mobile || '',
    }));
  };

  const loadSavedAddresses = async () => {
    if (!user) return;
    const { data } = await supabase
      .from('user_addresses')
      .select('*')
      .eq('user_id', user.id)
      .order('is_default', { ascending: false })
      .order('created_at', { ascending: false });

    if (data && data.length > 0) {
      setSavedAddresses(data);
      const def = data.find(a => a.is_default) || data[0];
      setSelectedAddressId(def.id);
      applyAddressToForm(def);
    }
  };

  const applyAddressToForm = (addr: SavedAddress) => {
    setFormData(prev => ({
      ...prev,
      name: addr.name || prev.name,
      mobile: addr.phone || prev.mobile,
      address: [addr.address_line1, addr.address_line2].filter(Boolean).join(', '),
      city: addr.city || '',
      postal_code: addr.postal_code || '',
    }));
  };

  const handleAddressSelect = (addressId: string) => {
    setSelectedAddressId(addressId);
    if (addressId === 'new') return;
    const addr = savedAddresses.find(a => a.id === addressId);
    if (addr) applyAddressToForm(addr);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handlePlaceOrder = async () => {
    if (!user) return;

    if (!formData.name || !formData.email || !formData.mobile || !formData.address || !formData.city) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIsPlacingOrder(true);

    try {
      // Optionally save address to profile
      if (saveAddressToProfile && selectedAddressId === 'new') {
        const hasAddresses = savedAddresses.length > 0;
        await supabase.from('user_addresses').insert({
          user_id: user.id,
          label: 'Home',
          name: formData.name,
          phone: formData.mobile,
          address_line1: formData.address,
          city: formData.city,
          postal_code: formData.postal_code || null,
          country: 'Sri Lanka',
          is_default: !hasAddresses,
        });
      }

      const orderNumberResult = await supabase.rpc('generate_order_number');
      if (orderNumberResult.error) throw orderNumberResult.error;

      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          order_number: orderNumberResult.data,
          status: 'pending',
          total_amount: cartTotal,
          shipping_address: formData.address,
          shipping_city: formData.city,
          shipping_postal_code: formData.postal_code,
          customer_name: formData.name,
          customer_email: formData.email,
          customer_mobile: formData.mobile,
          payment_method: formData.payment_method,
          payment_status: 'pending',
          notes: formData.notes,
        })
        .select()
        .single();

      if (orderError) throw orderError;

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        product_title: item.product.title,
        product_image: item.product.images?.[0] || '',
        quantity: item.quantity,
        price: item.product.price,
        subtotal: item.product.price * item.quantity,
        seller_id: item.product.seller_id || null,
      }));

      const { error: itemsError } = await supabase.from('order_items').insert(orderItems);
      if (itemsError) throw itemsError;

      if (formData.payment_method === 'card_payment') {
        const paymentResult = await paymentGateway.initiatePayment({
          orderId: order.id,
          orderNumber: order.order_number,
          amount: cartTotal,
          currency: 'LKR',
          customerName: formData.name,
          customerEmail: formData.email,
          customerMobile: formData.mobile,
          description: `Order ${order.order_number}`,
        });
        if (paymentResult.success && paymentResult.paymentUrl) {
          clearCart();
          window.location.href = paymentResult.paymentUrl;
          return;
        } else {
          throw new Error(paymentResult.error || 'Failed to initiate payment');
        }
      }

      clearCart();
      toast.success('Order placed successfully!');
      router.push('/account/orders');
    } catch (error: any) {
      console.error('Error placing order:', error);
      toast.error(error.message || 'Failed to place order. Please try again.');
    } finally {
      setIsPlacingOrder(false);
    }
  };

  const formatPrice = (price: number) =>
    new Intl.NumberFormat('en-LK', { style: 'currency', currency: 'LKR', minimumFractionDigits: 0 }).format(price);

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-rose-500" />
      </div>
    );
  }

  if (!user || cart.length === 0) return null;

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center gap-4 mb-8">
          <Link href="/">
            <Button variant="outline" size="icon">
              <ArrowLeft className="h-4 w-4" />
            </Button>
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Checkout</h1>
            <p className="text-gray-600">Complete your order</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-6">

            {/* Saved Addresses */}
            {savedAddresses.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-base">
                    <MapPin className="h-5 w-5 text-rose-500" />
                    Saved Addresses
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-3">
                    {savedAddresses.map((addr) => (
                      <div
                        key={addr.id}
                        onClick={() => handleAddressSelect(addr.id)}
                        className={`border rounded-xl p-4 cursor-pointer transition-all ${
                          selectedAddressId === addr.id
                            ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-300'
                            : 'border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-1.5 mb-0.5">
                              <p className="font-semibold text-sm text-gray-900 truncate">{addr.name}</p>
                              {addr.is_default && (
                                <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 flex-shrink-0" />
                              )}
                            </div>
                            <p className="text-xs text-gray-500">{addr.phone}</p>
                            <p className="text-xs text-gray-600 mt-1 line-clamp-2">
                              {addr.address_line1}{addr.address_line2 ? `, ${addr.address_line2}` : ''}, {addr.city}
                              {addr.postal_code ? ` ${addr.postal_code}` : ''}
                            </p>
                          </div>
                          <div className={`h-4 w-4 rounded-full border-2 flex-shrink-0 mt-0.5 ${
                            selectedAddressId === addr.id ? 'border-rose-500 bg-rose-500' : 'border-gray-300'
                          }`}>
                            {selectedAddressId === addr.id && (
                              <div className="h-full w-full rounded-full flex items-center justify-center">
                                <div className="h-1.5 w-1.5 rounded-full bg-white" />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    ))}

                    {/* Use a different / new address */}
                    <div
                      onClick={() => handleAddressSelect('new')}
                      className={`border rounded-xl p-4 cursor-pointer transition-all flex items-center gap-3 ${
                        selectedAddressId === 'new'
                          ? 'border-rose-500 bg-rose-50 ring-1 ring-rose-300'
                          : 'border-dashed border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <Plus className="h-5 w-5 text-gray-400 flex-shrink-0" />
                      <span className="text-sm text-gray-600 font-medium">Use a different address</span>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Shipping form */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Truck className="h-5 w-5" />
                  Shipping Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name">Full Name *</Label>
                    <Input id="name" name="name" value={formData.name} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email *</Label>
                    <Input id="email" name="email" type="email" value={formData.email} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="mobile">Mobile Number *</Label>
                  <Input id="mobile" name="mobile" value={formData.mobile} onChange={handleInputChange} placeholder="+94771234567" required />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Shipping Address *</Label>
                  <Textarea id="address" name="address" value={formData.address} onChange={handleInputChange} rows={3} required />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">City *</Label>
                    <Input id="city" name="city" value={formData.city} onChange={handleInputChange} required />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postal_code">Postal Code</Label>
                    <Input id="postal_code" name="postal_code" value={formData.postal_code} onChange={handleInputChange} />
                  </div>
                </div>

                {/* Save to profile option — only show when entering a new address */}
                {selectedAddressId === 'new' && (
                  <div className="flex items-center gap-2 pt-1">
                    <input
                      type="checkbox"
                      id="save_address"
                      checked={saveAddressToProfile}
                      onChange={(e) => setSaveAddressToProfile(e.target.checked)}
                      className="h-4 w-4 rounded border-gray-300"
                    />
                    <Label htmlFor="save_address" className="cursor-pointer text-sm text-gray-700">
                      Save this address to my profile
                    </Label>
                  </div>
                )}

                <div className="space-y-2">
                  <Label htmlFor="notes">Order Notes (Optional)</Label>
                  <Textarea id="notes" name="notes" value={formData.notes} onChange={handleInputChange} rows={3} placeholder="Any special instructions for delivery..." />
                </div>
              </CardContent>
            </Card>

            {/* Payment Method */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <CreditCard className="h-5 w-5" />
                  Payment Method
                </CardTitle>
              </CardHeader>
              <CardContent>
                <RadioGroup
                  value={formData.payment_method}
                  onValueChange={(value) => setFormData(prev => ({ ...prev, payment_method: value }))}
                  className="space-y-3"
                >
                  <div className={`flex items-center space-x-3 border rounded-xl p-4 cursor-pointer transition-all ${formData.payment_method === 'card_payment' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <RadioGroupItem value="card_payment" id="card" />
                    <Label htmlFor="card" className="flex-1 cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium flex items-center gap-2">
                            <CreditCard className="h-4 w-4" /> Card Payment
                          </p>
                          <p className="text-sm text-gray-500">Pay securely with your credit/debit card</p>
                        </div>
                        {paymentGateway.isConfigured() && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">Secure</span>
                        )}
                      </div>
                    </Label>
                  </div>

                  <div className={`flex items-center space-x-3 border rounded-xl p-4 cursor-pointer transition-all ${formData.payment_method === 'cash_on_delivery' ? 'border-rose-500 bg-rose-50' : 'border-gray-200 hover:border-gray-300'}`}>
                    <RadioGroupItem value="cash_on_delivery" id="cod" />
                    <Label htmlFor="cod" className="flex-1 cursor-pointer">
                      <p className="font-medium flex items-center gap-2">
                        <Wallet className="h-4 w-4" /> Cash on Delivery
                      </p>
                      <p className="text-sm text-gray-500">Pay when you receive your order</p>
                    </Label>
                  </div>
                </RadioGroup>

                {!paymentGateway.isConfigured() && formData.payment_method === 'card_payment' && (
                  <div className="mt-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg">
                    <p className="text-sm text-yellow-800">Card payment is not configured. Please contact support.</p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Order Summary */}
          <div>
            <Card className="sticky top-8">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-base">
                  <Package className="h-5 w-5" />
                  Order Summary
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.product.id} className="flex gap-3">
                      <img
                        src={item.product.images[0]}
                        alt={item.product.title}
                        className="w-14 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium line-clamp-2 text-gray-900">{item.product.title}</p>
                        <p className="text-xs text-gray-500 mt-0.5">Qty: {item.quantity}</p>
                      </div>
                      <p className="text-sm font-semibold text-gray-900 flex-shrink-0">
                        {formatPrice(item.product.price * item.quantity)}
                      </p>
                    </div>
                  ))}
                </div>

                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Subtotal</span>
                    <span className="font-medium">{formatPrice(cartTotal)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Shipping</span>
                    <span className="font-medium text-green-600">FREE</span>
                  </div>
                  <div className="flex justify-between text-lg font-bold border-t pt-3">
                    <span>Total</span>
                    <span className="text-rose-600">{formatPrice(cartTotal)}</span>
                  </div>
                </div>

                <Button
                  onClick={handlePlaceOrder}
                  disabled={isPlacingOrder}
                  className="w-full bg-black hover:bg-gray-900 text-white"
                  size="lg"
                >
                  {isPlacingOrder ? 'Placing Order...' : 'Place Order'}
                </Button>

                <p className="text-xs text-center text-gray-400">
                  By placing this order, you agree to our Terms of Service
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
