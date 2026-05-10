'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { AuthManager } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Plus, CreditCard as Edit, Trash2, ArrowLeft, Star, Eye, EyeOff } from 'lucide-react';
import Link from 'next/link';
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
import { useToast } from '@/hooks/use-toast';

interface Product {
  id: string;
  title: string;
  price: number;
  images: string[];
  condition: string;
  is_featured: boolean;
  is_new: boolean;
  is_available: boolean;
  created_at: string;
  category_id: string;
}

interface Category {
  id: string;
  name: string;
}

export default function AdminProducts() {
  const router = useRouter();
  const { toast } = useToast();
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);

  useEffect(() => {
    const checkAdminAndLoadData = async () => {
      const admin = await AuthManager.isAdmin();
      if (!admin) {
        router.push('/auth/signin');
        return;
      }
      await loadProducts();
      await loadCategories();
      setIsLoading(false);
    };
    checkAdminAndLoadData();
  }, [router]);

  const loadProducts = async () => {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({ title: 'Error', description: 'Failed to load products', variant: 'destructive' });
    } else if (data) {
      setProducts(data);
    }
  };

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('name');
    if (data) setCategories(data);
  };

  const handleToggleAvailability = async (product: Product) => {
    setTogglingId(product.id);
    const newValue = !product.is_available;

    const { error } = await supabase
      .from('products')
      .update({ is_available: newValue })
      .eq('id', product.id);

    if (error) {
      toast({ title: 'Error', description: 'Failed to update availability', variant: 'destructive' });
    } else {
      setProducts(prev =>
        prev.map(p => p.id === product.id ? { ...p, is_available: newValue } : p)
      );
      toast({
        title: newValue ? 'Product is now available' : 'Product hidden from store',
        description: newValue
          ? `"${product.title}" is now visible on the website.`
          : `"${product.title}" has been hidden from the website.`,
      });
    }
    setTogglingId(null);
  };

  const handleDelete = async () => {
    if (!deleteId) return;

    const { error } = await supabase.from('products').delete().eq('id', deleteId);

    if (error) {
      console.error('Delete error:', error);
      toast({ title: 'Error', description: error.message || 'Failed to delete product', variant: 'destructive' });
    } else {
      toast({ title: 'Success', description: 'Product deleted successfully' });
      await loadProducts();
    }
    setDeleteId(null);
  };

  const getCategoryName = (categoryId: string) => {
    const category = categories.find(c => c.id === categoryId);
    return category?.name || 'N/A';
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-gray-800"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/admin">
                <Button variant="ghost" size="icon">
                  <ArrowLeft className="w-5 h-5" />
                </Button>
              </Link>
              <div>
                <h1 className="text-2xl font-bold">Manage Products</h1>
                <p className="text-sm text-gray-500 mt-0.5">
                  {products.filter(p => p.is_available).length} available &middot; {products.filter(p => !p.is_available).length} hidden
                </p>
              </div>
            </div>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Product
              </Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        {products.length === 0 ? (
          <Card className="p-12 text-center">
            <p className="text-gray-500 mb-4">No products found</p>
            <Link href="/admin/products/new">
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </Link>
          </Card>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {products.map((product) => (
              <Card
                key={product.id}
                className={`p-4 transition-opacity duration-200 ${!product.is_available ? 'opacity-60' : ''}`}
              >
                <div className="flex items-start space-x-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <img
                      src={product.images[0] || '/placeholder.png'}
                      alt={product.title}
                      className="w-24 h-24 object-cover rounded"
                    />
                    {!product.is_available && (
                      <div className="absolute inset-0 bg-gray-900/50 rounded flex items-center justify-center">
                        <EyeOff className="w-5 h-5 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-3">
                      <div className="min-w-0">
                        <div className="flex items-center gap-2 flex-wrap">
                          <h3 className="font-semibold text-lg truncate">{product.title}</h3>
                          {!product.is_available && (
                            <span className="text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 bg-gray-200 text-gray-600 rounded-full flex-shrink-0">
                              Hidden
                            </span>
                          )}
                        </div>
                        <p className="text-sm text-gray-600">
                          {getCategoryName(product.category_id)}
                        </p>
                        <p className="text-lg font-bold text-gray-900 mt-1">
                          Rs. {product.price.toLocaleString()}
                        </p>
                        <div className="flex items-center space-x-2 mt-2 flex-wrap gap-y-1">
                          <span className="text-xs px-2 py-1 bg-gray-100 rounded">
                            {product.condition}
                          </span>
                          {product.is_featured && (
                            <span className="text-xs px-2 py-1 bg-yellow-100 text-yellow-800 rounded flex items-center">
                              <Star className="w-3 h-3 mr-1" />
                              Featured
                            </span>
                          )}
                          {product.is_new && (
                            <span className="text-xs px-2 py-1 bg-green-100 text-green-800 rounded">
                              New
                            </span>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 flex-shrink-0">
                        {/* Availability toggle */}
                        <button
                          onClick={() => handleToggleAvailability(product)}
                          disabled={togglingId === product.id}
                          title={product.is_available ? 'Hide from store' : 'Show on store'}
                          className={`
                            relative inline-flex h-7 w-13 items-center rounded-full transition-colors duration-200 focus:outline-none focus-visible:ring-2 focus-visible:ring-offset-1 focus-visible:ring-gray-400 disabled:opacity-50
                            ${product.is_available ? 'bg-emerald-500' : 'bg-gray-300'}
                          `}
                          style={{ width: '52px' }}
                        >
                          <span
                            className={`
                              inline-block h-5 w-5 rounded-full bg-white shadow-sm transform transition-transform duration-200
                              ${product.is_available ? 'translate-x-7' : 'translate-x-1'}
                            `}
                          />
                        </button>
                        <span className={`text-xs font-medium w-20 ${product.is_available ? 'text-emerald-600' : 'text-gray-400'}`}>
                          {togglingId === product.id ? 'Updating...' : product.is_available ? 'Available' : 'Unavailable'}
                        </span>

                        <Link href={`/admin/products/${product.id}/edit`}>
                          <Button variant="outline" size="sm">
                            <Edit className="w-4 h-4" />
                          </Button>
                        </Link>
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => setDeleteId(product.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        )}
      </main>

      <AlertDialog open={!!deleteId} onOpenChange={() => setDeleteId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Product</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this product? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
