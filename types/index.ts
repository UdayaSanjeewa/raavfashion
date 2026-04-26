export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  role: 'customer' | 'seller' | 'admin';
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  image: string;
  description?: string;
  productCount: number;
}

export interface Product {
  id: string;
  title: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: Category;
  condition: 'new' | 'used' | 'refurbished';
  location: string;
  seller_id: string;
  seller: {
    id: string;
    name: string;
    avatar?: string;
    rating: number;
  };
  // Fashion-specific
  sizes: string[];
  colors: string[];
  gender: 'men' | 'women' | 'kids' | 'unisex';
  material?: string;
  brand?: string;
  style?: string;
  stockQuantity?: number;
  features: string[];
  tags: string[];
  createdAt: string;
  updatedAt: string;
  isNew?: boolean;
  isFeatured?: boolean;
  videoUrl?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export interface WatchlistItem {
  id: string;
  product: Product;
  addedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: Address;
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface Address {
  id?: string;
  label?: string;
  fullName?: string;
  phone?: string;
  street: string;
  city: string;
  state: string;
  zipCode?: string;
  postalCode?: string;
  country: string;
  isDefault?: boolean;
}

export interface FilterOptions {
  category?: string;
  priceRange?: [number, number];
  sizes?: string[];
  colors?: string[];
  gender?: string;
  brand?: string;
  condition?: string[];
  sortBy?: 'newest' | 'price-low' | 'price-high' | 'popular';
}
