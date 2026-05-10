'use client';

import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import {
  ShoppingCart,
  DollarSign,
  Users,
  Package,
  Clock,
  CheckCircle,
  XCircle,
  TruckIcon,
  RefreshCw,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import Link from 'next/link';
import { format } from 'date-fns';

interface DashboardStats {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  pendingOrders: number;
  processingOrders: number;
  shippedOrders: number;
  deliveredOrders: number;
  cancelledOrders: number;
  paidOrders: number;
  ordersToday: number;
  revenueToday: number;
}

interface TopCustomer {
  customer_name: string;
  customer_email: string;
  order_count: number;
  total_spent: number;
}

interface TopProduct {
  id: string;
  title: string;
  price: number;
  images: string[];
  order_count: number;
}

interface MonthlyData {
  month: number;
  order_count: number;
  revenue: number;
}

interface RecentOrder {
  id: string;
  order_number: string;
  customer_name: string;
  total_amount: number;
  status: string;
  payment_status: string;
  payment_method: string;
  created_at: string;
}

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  processing: 'bg-cyan-100 text-cyan-800',
  shipped: 'bg-blue-100 text-blue-800',
  delivered: 'bg-green-100 text-green-800',
  cancelled: 'bg-red-100 text-red-800',
};

const paymentStatusColors: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  paid: 'bg-green-100 text-green-800',
  failed: 'bg-red-100 text-red-800',
  refunded: 'bg-gray-100 text-gray-800',
};

export default function AdminDashboard() {
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [topCustomers, setTopCustomers] = useState<TopCustomer[]>([]);
  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [monthlyData, setMonthlyData] = useState<MonthlyData[]>([]);
  const [recentOrders, setRecentOrders] = useState<RecentOrder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      const [
        { count: totalOrders },
        { data: revenueData },
        { count: totalProducts },
        { count: totalCustomers },
        { count: pendingOrders },
        { count: processingOrders },
        { count: shippedOrders },
        { count: deliveredOrders },
        { count: cancelledOrders },
        { count: paidOrders },
        { data: todayData },
        { data: topCustomerRows },
        { data: topProductRows },
        { data: monthlyRows },
        { data: recentOrderRows },
      ] = await Promise.all([
        supabase.from('orders').select('*', { count: 'exact', head: true }),
        supabase.from('orders').select('total_amount'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('profiles').select('*', { count: 'exact', head: true }).neq('role', 'admin'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'pending'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'processing'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'shipped'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'delivered'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('status', 'cancelled'),
        supabase.from('orders').select('*', { count: 'exact', head: true }).eq('payment_status', 'paid'),
        supabase.from('orders').select('total_amount').gte('created_at', new Date().toISOString().split('T')[0]),
        Promise.resolve({ data: null }),
        supabase.from('products').select('id, title, price, images').limit(5),
        supabase.from('orders').select('total_amount, created_at').gte('created_at', new Date(new Date().getFullYear(), 0, 1).toISOString()),
        supabase.from('orders').select('id, order_number, customer_name, total_amount, status, payment_status, payment_method, created_at').order('created_at', { ascending: false }).limit(5),
      ]);

      const totalRevenue = (revenueData as any[])?.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0) ?? 0;
      const revenueToday = (todayData as any[])?.reduce((sum: number, o: any) => sum + Number(o.total_amount || 0), 0) ?? 0;
      const ordersToday = todayData?.length ?? 0;

      // Build monthly data from orders
      const monthMap: Record<number, { order_count: number; revenue: number }> = {};
      monthlyRows?.forEach((o: any) => {
        const m = new Date(o.created_at).getMonth() + 1;
        if (!monthMap[m]) monthMap[m] = { order_count: 0, revenue: 0 };
        monthMap[m].order_count += 1;
        monthMap[m].revenue += Number(o.total_amount || 0);
      });
      const builtMonthly = Object.entries(monthMap).map(([month, d]) => ({
        month: Number(month),
        order_count: d.order_count,
        revenue: d.revenue,
      }));

      // Build top customers from order data
      const { data: customerOrderRows } = await supabase
        .from('orders')
        .select('customer_name, customer_email, total_amount')
        .not('customer_name', 'is', null);

      const customerMap = new Map<string, TopCustomer>();
      customerOrderRows?.forEach((o: any) => {
        const key = o.customer_email || o.customer_name;
        if (!key) return;
        if (!customerMap.has(key)) {
          customerMap.set(key, {
            customer_name: o.customer_name || 'Unknown',
            customer_email: o.customer_email || '',
            order_count: 0,
            total_spent: 0,
          });
        }
        const c = customerMap.get(key)!;
        c.order_count += 1;
        c.total_spent += Number(o.total_amount || 0);
      });
      const sortedCustomers = Array.from(customerMap.values())
        .sort((a, b) => b.total_spent - a.total_spent)
        .slice(0, 5);

      setStats({
        totalOrders: totalOrders ?? 0,
        totalRevenue,
        totalProducts: totalProducts ?? 0,
        totalCustomers: totalCustomers ?? 0,
        pendingOrders: pendingOrders ?? 0,
        processingOrders: processingOrders ?? 0,
        shippedOrders: shippedOrders ?? 0,
        deliveredOrders: deliveredOrders ?? 0,
        cancelledOrders: cancelledOrders ?? 0,
        paidOrders: paidOrders ?? 0,
        ordersToday,
        revenueToday,
      });
      setTopCustomers(sortedCustomers);
      setTopProducts((topProductRows || []) as TopProduct[]);
      setMonthlyData(builtMonthly);
      setRecentOrders((recentOrderRows || []) as RecentOrder[]);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const maxMonthlyRevenue = Math.max(...monthlyData.map(m => m.revenue), 1);

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <p className="text-gray-500 text-sm mt-0.5">Store overview — {format(new Date(), 'MMMM d, yyyy')}</p>
        </div>
        <Button onClick={loadDashboardData} variant="outline" size="sm">
          <RefreshCw className="w-4 h-4 mr-2" />
          Refresh
        </Button>
      </div>

      {/* Primary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Orders</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalOrders ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">{stats?.ordersToday ?? 0} today</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <ShoppingCart className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">
                  Rs. {(stats?.totalRevenue ?? 0).toLocaleString()}
                </p>
                <p className="text-xs text-gray-400 mt-1">Rs. {(stats?.revenueToday ?? 0).toLocaleString()} today</p>
              </div>
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center flex-shrink-0">
                <DollarSign className="w-5 h-5 text-green-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Total Products</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalProducts ?? 0}</p>
                <Link href="/admin/products/new">
                  <p className="text-xs text-blue-500 mt-1 hover:underline cursor-pointer">+ Add product</p>
                </Link>
              </div>
              <div className="w-12 h-12 bg-orange-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Package className="w-5 h-5 text-orange-600" />
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardContent className="p-5">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-500">Customers</p>
                <p className="text-3xl font-bold text-gray-900 mt-1">{stats?.totalCustomers ?? 0}</p>
                <p className="text-xs text-gray-400 mt-1">Registered users</p>
              </div>
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-blue-600" />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Order Status Breakdown */}
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
        {[
          { label: 'Pending', count: stats?.pendingOrders, icon: Clock, color: 'text-yellow-600', bg: 'bg-yellow-50' },
          { label: 'Processing', count: stats?.processingOrders, icon: RefreshCw, color: 'text-cyan-600', bg: 'bg-cyan-50' },
          { label: 'Shipped', count: stats?.shippedOrders, icon: TruckIcon, color: 'text-blue-600', bg: 'bg-blue-50' },
          { label: 'Delivered', count: stats?.deliveredOrders, icon: CheckCircle, color: 'text-green-600', bg: 'bg-green-50' },
          { label: 'Cancelled', count: stats?.cancelledOrders, icon: XCircle, color: 'text-red-600', bg: 'bg-red-50' },
        ].map(({ label, count, icon: Icon, color, bg }) => (
          <Card key={label} className="border-0 shadow-sm">
            <CardContent className="p-4 flex items-center gap-3">
              <div className={`w-10 h-10 ${bg} rounded-full flex items-center justify-center flex-shrink-0`}>
                <Icon className={`w-4 h-4 ${color}`} />
              </div>
              <div>
                <p className="text-xs text-gray-500">{label}</p>
                <p className={`text-xl font-bold ${color}`}>{count ?? 0}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Top Customers & Top Products */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Top Customers</CardTitle>
              <Link href="/admin/users">
                <Button variant="ghost" size="sm" className="text-blue-600 text-xs h-7">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {topCustomers.length > 0 ? (
              <div className="space-y-3">
                {topCustomers.map((c, i) => (
                  <div key={i} className="flex items-center justify-between p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="flex items-center gap-3">
                      <Avatar className="h-9 w-9">
                        <AvatarFallback className="bg-blue-100 text-blue-700 text-sm font-semibold">
                          {c.customer_name.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase()}
                        </AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="text-sm font-medium text-gray-900 leading-tight">{c.customer_name}</p>
                        <p className="text-xs text-gray-500 truncate max-w-[160px]">{c.customer_email}</p>
                      </div>
                    </div>
                    <div className="text-right">
                      <p className="text-sm font-semibold text-gray-900">Rs. {Number(c.total_spent).toLocaleString()}</p>
                      <p className="text-xs text-gray-400">{c.order_count} {c.order_count === 1 ? 'order' : 'orders'}</p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">No customer data available</p>
            )}
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Products</CardTitle>
              <Link href="/admin/products">
                <Button variant="ghost" size="sm" className="text-blue-600 text-xs h-7">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {topProducts.length > 0 ? (
              <div className="space-y-3">
                {topProducts.map((p) => (
                  <div key={p.id} className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-gray-50 transition-colors">
                    <div className="w-11 h-11 rounded-lg overflow-hidden bg-gray-100 flex-shrink-0">
                      {p.images?.[0] ? (
                        <img src={p.images[0]} alt={p.title} className="w-full h-full object-cover" />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <Package className="w-5 h-5 text-gray-400" />
                        </div>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-gray-900 truncate">{p.title}</p>
                      <p className="text-xs text-gray-500">Rs. {Number(p.price).toLocaleString()}</p>
                    </div>
                    <Link href={`/admin/products/${p.id}/edit`}>
                      <Button variant="ghost" size="sm" className="text-xs h-7 text-gray-500">Edit</Button>
                    </Link>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">No products available</p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Monthly Revenue Chart + Recent Orders */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        <Card className="border-0 shadow-sm lg:col-span-3">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Monthly Revenue ({new Date().getFullYear()})</CardTitle>
            </div>
          </CardHeader>
          <CardContent>
            <div className="flex items-end gap-1.5 h-48 mt-2">
              {MONTHS.map((month, index) => {
                const monthNum = index + 1;
                const data = monthlyData.find(m => m.month === monthNum);
                const height = data ? Math.max((data.revenue / maxMonthlyRevenue) * 100, 4) : 0;
                const isCurrentMonth = monthNum === new Date().getMonth() + 1;
                return (
                  <div key={month} className="flex-1 flex flex-col items-center gap-1 group relative">
                    {data && (
                      <div className="absolute -top-8 left-1/2 -translate-x-1/2 bg-gray-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap z-10 pointer-events-none">
                        Rs. {data.revenue.toLocaleString()}
                      </div>
                    )}
                    <div className="w-full flex items-end h-40">
                      <div
                        className={`w-full rounded-t transition-all ${isCurrentMonth ? 'bg-blue-600' : data ? 'bg-blue-300 hover:bg-blue-400' : 'bg-gray-100'}`}
                        style={{ height: `${height}%` }}
                      />
                    </div>
                    <span className="text-xs text-gray-400">{month}</span>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>

        <Card className="border-0 shadow-sm lg:col-span-2">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-semibold">Recent Orders</CardTitle>
              <Link href="/admin/orders">
                <Button variant="ghost" size="sm" className="text-blue-600 text-xs h-7">View All</Button>
              </Link>
            </div>
          </CardHeader>
          <CardContent>
            {recentOrders.length > 0 ? (
              <div className="space-y-3">
                {recentOrders.map((order) => (
                  <div key={order.id} className="p-2.5 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-xs font-mono font-semibold text-gray-700">#{order.order_number}</span>
                      <span className="text-sm font-semibold text-gray-900">Rs. {Number(order.total_amount).toLocaleString()}</span>
                    </div>
                    <p className="text-xs text-gray-600 mb-1.5 truncate">{order.customer_name || 'N/A'}</p>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.status}
                      </span>
                      <span className={`text-xs px-1.5 py-0.5 rounded font-medium ${paymentStatusColors[order.payment_status] || 'bg-gray-100 text-gray-700'}`}>
                        {order.payment_status}
                      </span>
                      {order.payment_method === 'cash_on_delivery' && (
                        <span className="text-xs px-1.5 py-0.5 rounded font-medium bg-orange-100 text-orange-700">COD</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-center text-gray-400 py-8 text-sm">No orders yet</p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
