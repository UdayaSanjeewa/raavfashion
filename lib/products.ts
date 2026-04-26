import { supabase } from './supabase';
import type { Product, Category } from '@/types';

function mapProduct(p: Record<string, unknown>, category: Category): Product {
  return {
    id: p.id as string,
    title: p.title as string,
    description: (p.description as string) || '',
    price: p.price as number,
    originalPrice: p.original_price as number | undefined,
    images: (p.images as string[]) || [],
    category,
    condition: (p.condition as 'new' | 'used' | 'refurbished') || 'new',
    location: (p.location as string) || 'Sri Lanka',
    seller_id: (p.seller_id as string) || '',
    seller: {
      id: (p.seller_id as string) || 'admin',
      name: (p.seller_name as string) || 'Vendor',
      avatar: (p.seller_avatar as string) || '',
      rating: (p.seller_rating as number) || 5
    },
    sizes: (p.sizes as string[]) || [],
    colors: (p.colors as string[]) || [],
    gender: (p.gender as 'men' | 'women' | 'kids' | 'unisex') || 'unisex',
    material: (p.material as string) || '',
    brand: (p.brand as string) || '',
    style: (p.style as string) || '',
    stockQuantity: (p.stock_quantity as number) || 0,
    features: (p.features as string[]) || [],
    tags: (p.tags as string[]) || [],
    createdAt: p.created_at as string,
    updatedAt: p.updated_at as string,
    isNew: p.is_new as boolean,
    isFeatured: p.is_featured as boolean
  };
}

function mapCategory(c: Record<string, unknown>): Category {
  return {
    id: c.id as string,
    name: c.name as string,
    slug: c.slug as string,
    image: (c.image_url as string) || (c.image as string) || '',
    description: (c.description as string) || '',
    productCount: (c.product_count as number) || 0
  };
}

export async function getFeaturedProducts(): Promise<Product[]> {
  const { data: categoriesData } = await supabase.from('categories').select('*');
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('is_featured', true)
    .order('created_at', { ascending: false })
    .limit(6);

  if (!productsData || !categoriesData) return [];

  const categoryMap = new Map(categoriesData.map(c => [c.id, mapCategory(c)]));
  const fallbackCategory: Category = { id: '', name: 'Uncategorized', slug: 'uncategorized', image: '', productCount: 0 };

  return productsData.map(p =>
    mapProduct(p, categoryMap.get(p.category_id) || fallbackCategory)
  );
}

export async function getAllProducts(): Promise<Product[]> {
  const { data: categoriesData } = await supabase.from('categories').select('*');
  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .order('created_at', { ascending: false });

  if (!productsData || !categoriesData) return [];

  const categoryMap = new Map(categoriesData.map(c => [c.id, mapCategory(c)]));
  const fallbackCategory: Category = { id: '', name: 'Uncategorized', slug: 'uncategorized', image: '', productCount: 0 };

  return productsData.map(p =>
    mapProduct(p, categoryMap.get(p.category_id) || fallbackCategory)
  );
}

export async function getProductById(id: string): Promise<Product | null> {
  const { data: categoriesData } = await supabase.from('categories').select('*');
  const { data: productData } = await supabase
    .from('products')
    .select('*')
    .eq('id', id)
    .maybeSingle();

  if (!productData || !categoriesData) return null;

  const categoryMap = new Map(categoriesData.map(c => [c.id, mapCategory(c)]));
  const fallbackCategory: Category = { id: '', name: 'Uncategorized', slug: 'uncategorized', image: '', productCount: 0 };

  return mapProduct(productData, categoryMap.get(productData.category_id) || fallbackCategory);
}

export async function getCategories(): Promise<Category[]> {
  const { data: categoriesData } = await supabase
    .from('categories')
    .select('*')
    .order('sort_order', { ascending: true });

  if (!categoriesData) return [];

  const categoriesWithCounts = await Promise.all(
    categoriesData.map(async (category) => {
      const { count } = await supabase
        .from('products')
        .select('*', { count: 'exact', head: true })
        .eq('category_id', category.id);

      return {
        id: category.id,
        name: category.name,
        slug: category.slug,
        image: category.image_url || category.image || '',
        description: category.description || '',
        productCount: count || 0
      };
    })
  );

  return categoriesWithCounts;
}

export async function getProductsByCategory(categorySlug: string): Promise<Product[]> {
  const { data: categoriesData } = await supabase.from('categories').select('*');
  if (!categoriesData) return [];

  const categoryData = categoriesData.find(c => c.slug === categorySlug);
  if (!categoryData) return [];

  const { data: productsData } = await supabase
    .from('products')
    .select('*')
    .eq('category_id', categoryData.id)
    .order('created_at', { ascending: false });

  if (!productsData || productsData.length === 0) return [];

  const category = mapCategory({ ...categoryData, product_count: productsData.length });

  return productsData.map(p => mapProduct(p, category));
}
