'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthManager } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ArrowLeft, Package, Eye, RefreshCw, Search, CircleCheck as CheckCircle, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface OrderItem {
  id: string;
  product_id: string;
  quantity: number;
  price: number;
  status: string;
}

interface ProductDetails {
  id: string;
  title: string;
  images: string[];
}

interface Order {
  id: string;
  user_id: string;
  order_number: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  shipping_address: string;
  shipping_city: string;
  shipping_postal_code: string;
  customer_name: string;
  customer_email: string;
  customer_mobile: string;
  notes: string;
  created_at: string;
  updated_at: string;
}

interface OrderWithDetails extends Order {
  items?: (OrderItem & { product?: ProductDetails })[];
}

const statusOptions = [
  { value: 'pending', label: 'Pending', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'processing', label: 'Processing', color: 'bg-cyan-100 text-cyan-800' },
  { value: 'shipped', label: 'Shipped', color: 'bg-purple-100 text-purple-800' },
  { value: 'delivered', label: 'Delivered', color: 'bg-green-100 text-green-800' },
  { value: 'cancelled', label: 'Cancelled', color: 'bg-red-100 text-red-800' },
];

const paymentStatusOptions = [
  { value: 'pending', label: 'Pending' },
  { value: 'paid', label: 'Paid' },
  { value: 'failed', label: 'Failed' },
  { value: 'refunded', label: 'Refunded' },
];

export default function AdminOrderManagement() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(true);
  const [orders, setOrders] = useState<OrderWithDetails[]>([]);
  const [selectedOrder, setSelectedOrder] = useState<OrderWithDetails | null>(null);
  const [isDialogOpen, setIsDialogOpen] = useState(false);
  const [filterStatus, setFilterStatus] = useState<string>('all');
  const [filterPaymentStatus, setFilterPaymentStatus] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showPaymentDialog, setShowPaymentDialog] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [newPaymentStatus, setNewPaymentStatus] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  useEffect(() => {
    checkAdminAndLoadData();
  }, []);

  const checkAdminAndLoadData = async () => {
    const admin = await AuthManager.isAdmin();
    if (!admin) {
      router.push('/admin/login');
      return;
    }
    await loadOrders();
  };

  const loadOrders = async () => {
    setIsLoading(true);
    try {
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (ordersError) throw ordersError;

      const ordersWithDetails = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*')
            .eq('order_id', order.id);

          const itemsWithProducts = await Promise.all(
            (items || []).map(async (item) => {
              const { data: product } = await supabase
                .from('products')
                .select('id, title, images')
                .eq('id', item.product_id)
                .maybeSingle();

              return {
                ...item,
                product: product || undefined,
              };
            })
          );

          return {
            ...order,
            items: itemsWithProducts,
          };
        })
      );

      setOrders(ordersWithDetails);
    } catch (error: any) {
      console.error('Error loading orders:', error);
      toast.error('Failed to load orders');
    } finally {
      setIsLoading(false);
    }
  };

  const loadOrderDetails = async (orderId: string) => {
    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      setSelectedOrder(order);
      setIsDialogOpen(true);
    } catch (error) {
      console.error('Error loading order details:', error);
    }
  };

  const handleStatusChange = (order: OrderWithDetails, status: string) => {
    setSelectedOrder(order);
    setNewStatus(status);
    setShowStatusDialog(true);
  };

  const handlePaymentStatusChange = (order: OrderWithDetails, status: string) => {
    setSelectedOrder(order);
    setNewPaymentStatus(status);
    setShowPaymentDialog(true);
  };

  const confirmStatusChange = async () => {
    if (!selectedOrder || !newStatus) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          status: newStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      toast.success(`Order status updated to ${newStatus}`);
      setShowStatusDialog(false);
      await loadOrders();
    } catch (error: any) {
      console.error('Error updating order status:', error);
      toast.error(error.message || 'Failed to update order status');
    } finally {
      setIsUpdating(false);
    }
  };

  const confirmPaymentStatusChange = async () => {
    if (!selectedOrder || !newPaymentStatus) return;

    setIsUpdating(true);
    try {
      const { error } = await supabase
        .from('orders')
        .update({
          payment_status: newPaymentStatus,
          updated_at: new Date().toISOString()
        })
        .eq('id', selectedOrder.id);

      if (error) throw error;

      toast.success(`Payment status updated to ${newPaymentStatus}`);
      setShowPaymentDialog(false);
      await loadOrders();
    } catch (error: any) {
      console.error('Error updating payment status:', error);
      toast.error(error.message || 'Failed to update payment status');
    } finally {
      setIsUpdating(false);
    }
  };

  const getStatusBadge = (status: string) => {
    const statusConfig = statusOptions.find(s => s.value === status);
    return (
      <Badge className={statusConfig?.color || 'bg-gray-100 text-gray-800'}>
        {statusConfig?.label || status}
      </Badge>
    );
  };

  const getPaymentStatusBadge = (status: string) => {
    const colors: Record<string, string> = {
      pending: 'bg-yellow-100 text-yellow-800',
      paid: 'bg-green-100 text-green-800',
      failed: 'bg-red-100 text-red-800',
      refunded: 'bg-gray-100 text-gray-800',
    };
    return (
      <Badge className={colors[status] || 'bg-gray-100 text-gray-800'}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </Badge>
    );
  };

  const getPaymentMethodBadge = (method: string) => {
    if (method === 'cash_on_delivery') {
      return <Badge className="bg-orange-100 text-orange-800">Cash on Delivery</Badge>;
    }
    if (method === 'card_payment') {
      return <Badge className="bg-blue-100 text-blue-800">Card Payment</Badge>;
    }
    return <Badge className="bg-gray-100 text-gray-800">{method || 'N/A'}</Badge>;
  };

  const filteredOrders = orders.filter((order) => {
    const matchesStatus = filterStatus === 'all' || order.status === filterStatus;
    const matchesPayment = filterPaymentStatus === 'all' || order.payment_status === filterPaymentStatus;
    const matchesSearch =
      order.customer_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.order_number?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      order.id.toLowerCase().includes(searchQuery.toLowerCase());

    return matchesStatus && matchesPayment && matchesSearch;
  });

  const stats = {
    total: orders.length,
    totalRevenue: orders.reduce((sum, o) => sum + Number(o.total_amount), 0),
    pending: orders.filter(o => o.status === 'pending').length,
    processing: orders.filter(o => o.status === 'processing').length,
    shipped: orders.filter(o => o.status === 'shipped').length,
    delivered: orders.filter(o => o.status === 'delivered').length,
    cancelled: orders.filter(o => o.status === 'cancelled').length,
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold flex items-center">
                  <Package className="w-6 h-6 mr-2" />
                  Order Management
                </h1>
                <p className="text-sm text-gray-600">Manage and track all customer orders</p>
              </div>
            </div>
            <Button onClick={loadOrders} variant="outline" size="sm">
              <RefreshCw className="w-4 h-4 mr-2" />
              Refresh
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Orders</p>
                  <p className="text-3xl font-bold text-gray-900">{stats.total}</p>
                </div>
                <Package className="w-10 h-10 text-blue-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Total Revenue</p>
                  <p className="text-3xl font-bold text-green-600">
                    Rs. {stats.totalRevenue.toLocaleString()}
                  </p>
                </div>
                <DollarSign className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Pending</p>
                  <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
                </div>
                <Clock className="w-10 h-10 text-yellow-500 opacity-50" />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-gray-600">Delivered</p>
                  <p className="text-3xl font-bold text-green-600">{stats.delivered}</p>
                </div>
                <CheckCircle className="w-10 h-10 text-green-500 opacity-50" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Filters</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                <Input
                  placeholder="Search by customer or order ID..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Select value={filterStatus} onValueChange={setFilterStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by order status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Statuses</SelectItem>
                  {statusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Select value={filterPaymentStatus} onValueChange={setFilterPaymentStatus}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by payment status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Payment Statuses</SelectItem>
                  {paymentStatusOptions.map(status => (
                    <SelectItem key={status.value} value={status.value}>
                      {status.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Orders ({filteredOrders.length})</CardTitle>
            <CardDescription>View and manage all customer orders</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Order</TableHead>
                    <TableHead>Customer</TableHead>
                    <TableHead>Items</TableHead>
                    <TableHead>Total Amount</TableHead>
                    <TableHead>Payment Method</TableHead>
                    <TableHead>Order Status</TableHead>
                    <TableHead>Payment Status</TableHead>
                    <TableHead>Date</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredOrders.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={9} className="text-center py-8 text-gray-500">
                        No orders found
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredOrders.map((order) => (
                      <TableRow key={order.id}>
                        <TableCell className="font-mono text-sm">
                          <div className="font-semibold text-gray-900">#{order.order_number}</div>
                          <div className="text-xs text-gray-400">{order.id.substring(0, 8)}...</div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">{order.customer_name || 'N/A'}</div>
                            <div className="text-sm text-gray-500">{order.customer_email || 'N/A'}</div>
                            {order.customer_mobile && (
                              <div className="text-xs text-gray-400">{order.customer_mobile}</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>{order.items?.length || 0} items</TableCell>
                        <TableCell className="font-semibold">
                          Rs. {Number(order.total_amount).toLocaleString()}
                        </TableCell>
                        <TableCell>
                          {getPaymentMethodBadge(order.payment_method)}
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {getStatusBadge(order.status)}
                            <Select
                              value={order.status}
                              onValueChange={(value) => handleStatusChange(order, value)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {statusOptions.map(status => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="space-y-2">
                            {getPaymentStatusBadge(order.payment_status)}
                            <Select
                              value={order.payment_status}
                              onValueChange={(value) => handlePaymentStatusChange(order, value)}
                            >
                              <SelectTrigger className="h-7 text-xs">
                                <SelectValue />
                              </SelectTrigger>
                              <SelectContent>
                                {paymentStatusOptions.map(status => (
                                  <SelectItem key={status.value} value={status.value}>
                                    {status.label}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </TableCell>
                        <TableCell>
                          {format(new Date(order.created_at), 'MMM dd, yyyy')}
                        </TableCell>
                        <TableCell>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => loadOrderDetails(order.id)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))
                  )}
                </TableBody>
              </Table>
            </div>
          </CardContent>
        </Card>
      </main>

      <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
        <DialogContent className="max-w-2xl max-h-[92vh] overflow-y-auto p-0">
          {selectedOrder && (
            <>
              {/* Header */}
              <div className="sticky top-0 bg-white border-b px-6 py-4 z-10">
                <DialogHeader>
                  <div className="flex items-start justify-between">
                    <div>
                      <DialogTitle className="text-lg font-bold text-gray-900">
                        Order #{selectedOrder.order_number || selectedOrder.id.substring(0, 8).toUpperCase()}
                      </DialogTitle>
                      <p className="text-xs text-gray-400 mt-0.5">
                        Placed on {format(new Date(selectedOrder.created_at), 'PPP · p')}
                      </p>
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {getStatusBadge(selectedOrder.status)}
                    </div>
                  </div>
                </DialogHeader>
              </div>

              <div className="px-6 py-5 space-y-6">

                {/* Status management row */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Order Status</p>
                    <Select
                      value={selectedOrder.status}
                      onValueChange={(value) => {
                        handleStatusChange(selectedOrder, value);
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {statusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg p-3 space-y-2">
                    <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Payment Status</p>
                    <Select
                      value={selectedOrder.payment_status}
                      onValueChange={(value) => {
                        handlePaymentStatusChange(selectedOrder, value);
                      }}
                    >
                      <SelectTrigger className="h-8 text-xs bg-white">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {paymentStatusOptions.map(s => (
                          <SelectItem key={s.value} value={s.value}>{s.label}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Info grid */}
                <div className="grid grid-cols-2 gap-6">
                  {/* Customer */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Customer</h4>
                    <div className="space-y-2.5">
                      <div>
                        <p className="text-[11px] text-gray-400">Name</p>
                        <p className="text-sm font-semibold text-gray-900">{selectedOrder.customer_name || '—'}</p>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400">Email</p>
                        <p className="text-sm font-medium text-gray-700 break-all">{selectedOrder.customer_email || '—'}</p>
                      </div>
                      {selectedOrder.customer_mobile && (
                        <div>
                          <p className="text-[11px] text-gray-400">Mobile</p>
                          <p className="text-sm font-medium text-gray-700">{selectedOrder.customer_mobile}</p>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Payment */}
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Payment</h4>
                    <div className="space-y-2.5">
                      <div>
                        <p className="text-[11px] text-gray-400">Method</p>
                        <div className="mt-0.5">{getPaymentMethodBadge(selectedOrder.payment_method)}</div>
                      </div>
                      <div>
                        <p className="text-[11px] text-gray-400">Status</p>
                        <div className="mt-0.5">{getPaymentStatusBadge(selectedOrder.payment_status)}</div>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Shipping Address */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Shipping Address</h4>
                  <div className="bg-gray-50 border border-gray-100 rounded-lg px-4 py-3 text-sm text-gray-700 space-y-0.5">
                    {selectedOrder.shipping_address
                      ? <p>{selectedOrder.shipping_address}</p>
                      : <p className="text-gray-400 italic">No address provided</p>
                    }
                    {selectedOrder.shipping_city && (
                      <p className="text-gray-500">
                        {selectedOrder.shipping_city}
                        {selectedOrder.shipping_postal_code ? `, ${selectedOrder.shipping_postal_code}` : ''}
                      </p>
                    )}
                  </div>
                </div>

                {/* Notes */}
                {selectedOrder.notes && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-2">Order Notes</h4>
                    <div className="bg-amber-50 border border-amber-100 rounded-lg px-4 py-3 text-sm text-amber-800">
                      {selectedOrder.notes}
                    </div>
                  </div>
                )}

                {/* Order Items */}
                <div>
                  <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">
                    Order Items ({selectedOrder.items?.length || 0})
                  </h4>
                  <div className="space-y-2">
                    {selectedOrder.items?.length === 0 && (
                      <p className="text-sm text-gray-400 italic">No items found.</p>
                    )}
                    {selectedOrder.items?.map((item) => (
                      <div key={item.id} className="flex items-center gap-3 bg-gray-50 border border-gray-100 rounded-lg p-3">
                        {item.product?.images?.[0] ? (
                          <img
                            src={item.product.images[0]}
                            alt={item.product?.title}
                            className="w-14 h-14 object-cover rounded-md border border-gray-200 flex-shrink-0"
                          />
                        ) : (
                          <div className="w-14 h-14 rounded-md bg-gray-200 flex items-center justify-center flex-shrink-0">
                            <Package className="w-5 h-5 text-gray-400" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-semibold text-gray-900 truncate">
                            {item.product?.title || <span className="text-gray-400 italic">Product deleted</span>}
                          </p>
                          <p className="text-xs text-gray-500 mt-0.5">
                            Qty {item.quantity} &times; Rs.&nbsp;{Number(item.price).toLocaleString()}
                          </p>
                          {/* Size / Color chips if present */}
                          {((item as any).selected_size || (item as any).selected_color) && (
                            <div className="flex gap-1.5 mt-1.5">
                              {(item as any).selected_size && (
                                <span className="inline-block text-[10px] font-semibold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                  Size: {(item as any).selected_size}
                                </span>
                              )}
                              {(item as any).selected_color && (
                                <span className="inline-flex items-center gap-1 text-[10px] font-semibold bg-white border border-gray-200 text-gray-600 px-2 py-0.5 rounded">
                                  Color: {(item as any).selected_color}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                        <p className="text-sm font-bold text-gray-800 flex-shrink-0">
                          Rs.&nbsp;{(Number(item.price) * item.quantity).toLocaleString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer totals */}
                <div className="border-t pt-4 space-y-2">
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Subtotal</span>
                    <span>Rs.&nbsp;{Number(selectedOrder.total_amount).toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between text-sm text-gray-500">
                    <span>Shipping</span>
                    <span className="text-green-600 font-medium">Free</span>
                  </div>
                  <div className="flex justify-between items-center pt-2 border-t">
                    <span className="font-bold text-gray-900">Total</span>
                    <span className="text-xl font-bold text-gray-900">
                      Rs.&nbsp;{Number(selectedOrder.total_amount).toLocaleString()}
                    </span>
                  </div>
                </div>

              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <AlertDialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Order Status</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedOrder && newStatus && (
                <p>
                  Change order status from{' '}
                  <strong className="capitalize">{selectedOrder.status}</strong> to{' '}
                  <strong className="capitalize">{newStatus}</strong>?
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmStatusChange}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      <AlertDialog open={showPaymentDialog} onOpenChange={setShowPaymentDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Update Payment Status</AlertDialogTitle>
            <AlertDialogDescription>
              {selectedOrder && newPaymentStatus && (
                <p>
                  Change payment status from{' '}
                  <strong className="capitalize">{selectedOrder.payment_status}</strong> to{' '}
                  <strong className="capitalize">{newPaymentStatus}</strong>?
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isUpdating}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={confirmPaymentStatusChange}
              disabled={isUpdating}
              className="bg-blue-600 hover:bg-blue-700"
            >
              {isUpdating ? 'Updating...' : 'Confirm'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
