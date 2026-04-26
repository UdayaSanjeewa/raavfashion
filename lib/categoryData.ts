import { Product, Category } from '@/types';
import { categories, featuredProducts } from './data';

export const womensFashionProducts: Product[] = [
  {
    id: 'w1',
    title: 'Floral Wrap Midi Dress',
    description: 'Elegant floral wrap midi dress perfect for summer outings.',
    price: 4500,
    originalPrice: 6500,
    images: ['https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[0],
    condition: 'new',
    location: 'Colombo',
    seller_id: 'admin',
    seller: { id: 'seller1', name: 'LuxeFashion LK', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.8 },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Blue', 'Floral Pink'],
    gender: 'women',
    material: '100% Rayon',
    brand: 'LuxeFashion',
    style: 'Casual',
    stockQuantity: 45,
    features: ['Wrap Silhouette', 'Adjustable Tie', 'V-Neckline', 'Midi Length'],
    tags: ['dress', 'floral', 'summer'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isFeatured: true,
    isNew: true
  },
  {
    id: 'w2',
    title: 'High-Waist Skinny Jeans',
    description: 'Stretchy high-waist skinny jeans that hug your curves perfectly. All-day comfort.',
    price: 3800,
    originalPrice: 5200,
    images: ['https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[0],
    condition: 'new',
    location: 'Colombo',
    seller_id: 'admin',
    seller: { id: 'seller1', name: 'LuxeFashion LK', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.8 },
    sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
    colors: ['Dark Blue', 'Black', 'Light Blue'],
    gender: 'women',
    material: '97% Cotton, 3% Elastane',
    brand: 'DenimCo',
    style: 'Casual',
    stockQuantity: 60,
    features: ['High Waist', 'Skinny Fit', 'Stretch Fabric', '5-Pocket Design'],
    tags: ['jeans', 'denim', 'skinny', 'highwaist'],
    createdAt: '2024-01-14T10:00:00Z',
    updatedAt: '2024-01-14T10:00:00Z'
  },
  {
    id: 'w3',
    title: 'Linen Co-ord Set',
    description: 'Breathable linen co-ord set including top and wide-leg trousers. Perfect for warm weather.',
    price: 5600,
    images: ['https://images.pexels.com/photos/985635/pexels-photo-985635.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[0],
    condition: 'new',
    location: 'Galle',
    seller_id: 'admin',
    seller: { id: 'seller11', name: 'BeachVibes LK', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.6 },
    sizes: ['S', 'M', 'L', 'XL'],
    colors: ['Beige', 'Sage Green', 'White'],
    gender: 'women',
    material: '100% Linen',
    brand: 'BeachVibes',
    style: 'Resort',
    stockQuantity: 30,
    features: ['2-Piece Set', 'Wide-Leg Trousers', 'Breathable Linen', 'Relaxed Fit'],
    tags: ['co-ord', 'linen', 'summer', 'set'],
    createdAt: '2024-01-12T10:00:00Z',
    updatedAt: '2024-01-12T10:00:00Z',
    isNew: true
  }
];

export const mensFashionProducts: Product[] = [
  {
    id: 'm1',
    title: 'Classic Oxford Button-Down Shirt',
    description: 'Premium cotton Oxford shirt, perfect for both casual and semi-formal occasions.',
    price: 3200,
    originalPrice: 4500,
    images: ['https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[1],
    condition: 'new',
    location: 'Kandy',
    seller_id: 'admin',
    seller: { id: 'seller2', name: 'MenStyle Pro', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.9 },
    sizes: ['S', 'M', 'L', 'XL', 'XXL'],
    colors: ['White', 'Light Blue', 'Pale Pink'],
    gender: 'men',
    material: '100% Cotton',
    brand: 'MenStyle',
    style: 'Smart Casual',
    stockQuantity: 80,
    features: ['Wrinkle Resistant', 'Button-Down Collar', 'Regular Fit', 'Machine Washable'],
    tags: ['shirt', 'oxford', 'cotton', 'mens'],
    createdAt: '2024-01-14T15:30:00Z',
    updatedAt: '2024-01-14T15:30:00Z',
    isFeatured: true
  },
  {
    id: 'm2',
    title: 'Slim Fit Chino Trousers',
    description: 'Versatile slim fit chino trousers that transition seamlessly from office to weekend.',
    price: 4200,
    images: ['https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[1],
    condition: 'new',
    location: 'Colombo 05',
    seller_id: 'admin',
    seller: { id: 'seller2', name: 'MenStyle Pro', avatar: 'https://images.pexels.com/photos/220453/pexels-photo-220453.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.9 },
    sizes: ['28', '30', '32', '34', '36', '38'],
    colors: ['Khaki', 'Navy', 'Olive', 'Stone'],
    gender: 'men',
    material: '98% Cotton, 2% Elastane',
    brand: 'MenStyle',
    style: 'Smart Casual',
    stockQuantity: 55,
    features: ['Slim Fit', 'Flat Front', 'Side Pockets', 'Belt Loops'],
    tags: ['chinos', 'trousers', 'mens', 'slim'],
    createdAt: '2024-01-13T10:00:00Z',
    updatedAt: '2024-01-13T10:00:00Z'
  }
];

export const accessoriesProducts: Product[] = [
  {
    id: 'a1',
    title: 'Handcrafted Leather Tote Bag',
    description: 'Genuine leather tote bag with spacious interior and multiple compartments.',
    price: 8900,
    originalPrice: 12000,
    images: ['https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[3],
    condition: 'new',
    location: 'Colombo 03',
    seller_id: 'admin',
    seller: { id: 'seller3', name: 'LeatherCraft LK', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.7 },
    sizes: ['One Size'],
    colors: ['Tan', 'Black', 'Brown'],
    gender: 'women',
    material: 'Genuine Leather',
    brand: 'LeatherCraft',
    style: 'Classic',
    stockQuantity: 20,
    features: ['Genuine Leather', 'Multiple Compartments', 'Zip Closure', 'Shoulder Strap'],
    tags: ['bag', 'leather', 'tote', 'handbag'],
    createdAt: '2024-01-13T09:15:00Z',
    updatedAt: '2024-01-13T09:15:00Z',
    isFeatured: true
  },
  {
    id: 'a2',
    title: 'Pearl Drop Earrings Set',
    description: 'Elegant freshwater pearl drop earrings set. Perfect for formal and bridal occasions.',
    price: 2800,
    originalPrice: 3500,
    images: ['https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[3],
    condition: 'new',
    location: 'Colombo',
    seller_id: 'admin',
    seller: { id: 'seller3', name: 'LeatherCraft LK', avatar: 'https://images.pexels.com/photos/1681010/pexels-photo-1681010.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.7 },
    sizes: ['One Size'],
    colors: ['White Pearl', 'Pink Pearl'],
    gender: 'women',
    material: 'Freshwater Pearl, Sterling Silver',
    brand: 'PearlGrace',
    style: 'Formal',
    stockQuantity: 40,
    features: ['Freshwater Pearl', 'Sterling Silver', 'Hypoallergenic', 'Gift Box Included'],
    tags: ['earrings', 'pearl', 'jewelry', 'bridal'],
    createdAt: '2024-01-11T09:15:00Z',
    updatedAt: '2024-01-11T09:15:00Z'
  }
];

export const shoesProducts: Product[] = [
  {
    id: 's1',
    title: 'Nike Air Max Running Shoes',
    description: 'Lightweight and breathable running shoes with superior cushioning.',
    price: 15500,
    originalPrice: 19000,
    images: ['https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[4],
    condition: 'new',
    location: 'Colombo 05',
    seller_id: 'admin',
    seller: { id: 'seller4', name: 'SportZone LK', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.9 },
    sizes: ['UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11'],
    colors: ['Black/White', 'Blue/Grey', 'Red/Black'],
    gender: 'unisex',
    material: 'Mesh Upper',
    brand: 'Nike',
    style: 'Athletic',
    stockQuantity: 35,
    features: ['Air Max Cushioning', 'Breathable Mesh', 'Rubber Outsole', 'Lightweight'],
    tags: ['shoes', 'nike', 'running', 'sneakers'],
    createdAt: '2024-01-12T14:20:00Z',
    updatedAt: '2024-01-12T14:20:00Z',
    isFeatured: true,
    isNew: true
  },
  {
    id: 's2',
    title: 'Block Heel Ankle Boots',
    description: 'Stylish block heel ankle boots in genuine leather. Perfect for autumn and winter.',
    price: 9800,
    images: ['https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[4],
    condition: 'new',
    location: 'Colombo',
    seller_id: 'admin',
    seller: { id: 'seller4', name: 'SportZone LK', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.9 },
    sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8'],
    colors: ['Black', 'Tan', 'Burgundy'],
    gender: 'women',
    material: 'Genuine Leather',
    brand: 'StrideStyle',
    style: 'Casual',
    stockQuantity: 25,
    features: ['Block Heel', 'Ankle Height', 'Side Zip', 'Genuine Leather'],
    tags: ['boots', 'heels', 'ankle', 'leather'],
    createdAt: '2024-01-10T16:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z'
  }
];

export const traditionalProducts: Product[] = [
  {
    id: 't1',
    title: 'Silk Saree - Kandy Handwoven',
    description: 'Beautiful handwoven silk saree from Kandy artisans with intricate gold zari border work.',
    price: 22000,
    originalPrice: 28000,
    images: ['https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[6],
    condition: 'new',
    location: 'Kandy',
    seller_id: 'admin',
    seller: { id: 'seller5', name: 'Heritage Textiles', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.6 },
    sizes: ['One Size'],
    colors: ['Royal Blue', 'Deep Red', 'Emerald Green'],
    gender: 'women',
    material: 'Pure Silk',
    brand: 'Heritage Textiles',
    style: 'Traditional',
    stockQuantity: 15,
    features: ['Handwoven', 'Gold Zari Border', 'Pure Silk', '6 Yards'],
    tags: ['saree', 'silk', 'traditional', 'handwoven'],
    createdAt: '2024-01-11T11:45:00Z',
    updatedAt: '2024-01-11T11:45:00Z',
    isFeatured: true
  }
];

export const sportwearProducts: Product[] = [
  {
    id: 'sp1',
    title: 'Women\'s Yoga Leggings',
    description: 'High-performance yoga leggings with moisture-wicking fabric. 4-way stretch for full range of motion.',
    price: 4200,
    originalPrice: 5500,
    images: ['https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[5],
    condition: 'new',
    location: 'Colombo',
    seller_id: 'admin',
    seller: { id: 'seller4', name: 'SportZone LK', avatar: 'https://images.pexels.com/photos/1516680/pexels-photo-1516680.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.9 },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Black', 'Navy', 'Burgundy', 'Teal'],
    gender: 'women',
    material: '75% Nylon, 25% Spandex',
    brand: 'ActiveCore',
    style: 'Athletic',
    stockQuantity: 50,
    features: ['Moisture-Wicking', '4-Way Stretch', 'High Waist', 'Hidden Pocket'],
    tags: ['yoga', 'leggings', 'activewear', 'gym'],
    createdAt: '2024-01-09T12:30:00Z',
    updatedAt: '2024-01-09T12:30:00Z'
  }
];

export const formalWearProducts: Product[] = [
  {
    id: 'fo1',
    title: 'Premium Slim-Fit Suit Set',
    description: 'Italian-cut slim fit suit in premium wool-blend fabric. Complete set with jacket and trousers.',
    price: 35000,
    originalPrice: 45000,
    images: ['https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600'],
    category: categories[7],
    condition: 'new',
    location: 'Colombo 07',
    seller_id: 'admin',
    seller: { id: 'seller6', name: 'Elite Formals', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.8 },
    sizes: ['36', '38', '40', '42', '44'],
    colors: ['Charcoal Grey', 'Navy Blue', 'Black'],
    gender: 'men',
    material: 'Wool Blend',
    brand: 'Elite Formals',
    style: 'Formal',
    stockQuantity: 25,
    features: ['Slim Fit Cut', 'Wool Blend Fabric', 'Jacket + Trousers', 'Dry Clean Only'],
    tags: ['suit', 'formal', 'wool', 'mens'],
    createdAt: '2024-01-10T16:00:00Z',
    updatedAt: '2024-01-10T16:00:00Z',
    isFeatured: true
  }
];

export function getProductsByCategory(
  categorySlug: string,
  searchParams?: { [key: string]: string | string[] | undefined }
): Product[] {
  let categoryProducts: Product[] = [];

  switch (categorySlug) {
    case 'womens-fashion':
      categoryProducts = womensFashionProducts;
      break;
    case 'mens-fashion':
      categoryProducts = mensFashionProducts;
      break;
    case 'accessories':
      categoryProducts = accessoriesProducts;
      break;
    case 'shoes-footwear':
      categoryProducts = shoesProducts;
      break;
    case 'traditional-ethnic':
      categoryProducts = traditionalProducts;
      break;
    case 'sportswear':
      categoryProducts = sportwearProducts;
      break;
    case 'formal-wear':
      categoryProducts = formalWearProducts;
      break;
    default:
      categoryProducts = [];
  }

  if (!searchParams) return categoryProducts;

  let filtered = [...categoryProducts];

  const search = searchParams.search as string;
  if (search) {
    filtered = filtered.filter(p =>
      p.title.toLowerCase().includes(search.toLowerCase()) ||
      p.description.toLowerCase().includes(search.toLowerCase()) ||
      (p.brand || '').toLowerCase().includes(search.toLowerCase())
    );
  }

  const sizes = searchParams.sizes as string;
  if (sizes) {
    const sizeArr = sizes.split(',');
    filtered = filtered.filter(p => p.sizes.some(s => sizeArr.includes(s)));
  }

  const gender = searchParams.gender as string;
  if (gender) {
    filtered = filtered.filter(p => p.gender === gender || p.gender === 'unisex');
  }

  const brand = searchParams.brand as string;
  if (brand) {
    filtered = filtered.filter(p => (p.brand || '').toLowerCase() === brand.toLowerCase());
  }

  const conditions = searchParams.conditions as string;
  if (conditions) {
    const condArr = conditions.split(',');
    filtered = filtered.filter(p => condArr.includes(p.condition));
  }

  const minPrice = parseInt(searchParams.minPrice as string) || 0;
  const maxPrice = parseInt(searchParams.maxPrice as string) || 1000000;
  filtered = filtered.filter(p => p.price >= minPrice && p.price <= maxPrice);

  return filtered;
}

export function getAllProducts(): Product[] {
  return [
    ...featuredProducts,
    ...womensFashionProducts,
    ...mensFashionProducts,
    ...accessoriesProducts,
    ...shoesProducts,
    ...traditionalProducts,
    ...sportwearProducts,
    ...formalWearProducts
  ].filter((p, i, self) => i === self.findIndex(x => x.id === p.id));
}

export function getCategoryFilters(categorySlug: string) {
  const baseFilters = {
    condition: ['new', 'used', 'refurbished'],
    priceRanges: [
      { label: 'Under Rs. 2,000', min: 0, max: 2000 },
      { label: 'Rs. 2,000 - Rs. 5,000', min: 2000, max: 5000 },
      { label: 'Rs. 5,000 - Rs. 10,000', min: 5000, max: 10000 },
      { label: 'Rs. 10,000 - Rs. 25,000', min: 10000, max: 25000 },
      { label: 'Above Rs. 25,000', min: 25000, max: Infinity }
    ]
  };

  switch (categorySlug) {
    case 'womens-fashion':
      return {
        ...baseFilters,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        styles: ['Casual', 'Formal', 'Evening', 'Resort', 'Streetwear'],
        brands: ['LuxeFashion', 'DenimCo', 'BeachVibes']
      };
    case 'mens-fashion':
      return {
        ...baseFilters,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        trouserSizes: ['28', '30', '32', '34', '36', '38', '40'],
        styles: ['Casual', 'Smart Casual', 'Formal', 'Streetwear'],
        brands: ['MenStyle', 'Elite Formals']
      };
    case 'shoes-footwear':
      return {
        ...baseFilters,
        sizes: ['UK 4', 'UK 5', 'UK 6', 'UK 7', 'UK 8', 'UK 9', 'UK 10', 'UK 11', 'UK 12'],
        gender: ['Men', 'Women', 'Unisex'],
        styles: ['Sneakers', 'Boots', 'Heels', 'Sandals', 'Loafers', 'Athletic'],
        brands: ['Nike', 'Adidas', 'StrideStyle', 'Puma']
      };
    case 'accessories':
      return {
        ...baseFilters,
        types: ['Bags', 'Jewelry', 'Belts', 'Scarves', 'Sunglasses', 'Watches'],
        materials: ['Leather', 'Gold', 'Silver', 'Fabric']
      };
    case 'sportswear':
      return {
        ...baseFilters,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        gender: ['Men', 'Women', 'Unisex'],
        types: ['Leggings', 'Shorts', 'Tops', 'Jackets', 'Swimwear'],
        brands: ['Nike', 'Adidas', 'Puma', 'ActiveCore']
      };
    case 'traditional-ethnic':
      return {
        ...baseFilters,
        types: ['Sarees', 'Kurtas', 'Salwar Kameez', 'Lehengas', 'Sherwanis'],
        materials: ['Silk', 'Cotton', 'Georgette', 'Chiffon'],
        occasions: ['Wedding', 'Festival', 'Daily Wear', 'Formal']
      };
    case 'formal-wear':
      return {
        ...baseFilters,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        suitSizes: ['34', '36', '38', '40', '42', '44', '46'],
        gender: ['Men', 'Women'],
        styles: ['Business', 'Cocktail', 'Black Tie', 'Business Casual'],
        brands: ['Elite Formals']
      };
    case 'kids-baby':
      return {
        ...baseFilters,
        ages: ['0-6 months', '6-12 months', '1-2 years', '3-4 years', '5-6 years', '7-9 years', '10-12 years'],
        gender: ['Boys', 'Girls', 'Unisex']
      };
    default:
      return {
        ...baseFilters,
        sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
        gender: ['Men', 'Women', 'Unisex', 'Kids']
      };
  }
}
