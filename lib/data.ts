import { Category, Product } from '@/types';

export const categories: Category[] = [
  {
    id: '1',
    name: "Women's Fashion",
    slug: 'womens-fashion',
    image: 'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Dresses, tops, bottoms and more for women',
    productCount: 3421
  },
  {
    id: '2',
    name: "Men's Fashion",
    slug: 'mens-fashion',
    image: 'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Shirts, pants, suits and more for men',
    productCount: 2156
  },
  {
    id: '3',
    name: 'Kids & Baby',
    slug: 'kids-baby',
    image: 'https://images.pexels.com/photos/35537/child-children-girl-happy.jpg?auto=compress&cs=tinysrgb&w=600',
    description: 'Clothing and accessories for children',
    productCount: 1234
  },
  {
    id: '4',
    name: 'Accessories',
    slug: 'accessories',
    image: 'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Bags, jewelry, belts, scarves and more',
    productCount: 1876
  },
  {
    id: '5',
    name: 'Shoes & Footwear',
    slug: 'shoes-footwear',
    image: 'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Sneakers, heels, boots, sandals and more',
    productCount: 965
  },
  {
    id: '6',
    name: 'Sportswear',
    slug: 'sportswear',
    image: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Athletic wear, activewear and gym clothing',
    productCount: 743
  },
  {
    id: '7',
    name: 'Traditional & Ethnic',
    slug: 'traditional-ethnic',
    image: 'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Sarees, kurtas, salwar kameez and ethnic wear',
    productCount: 856
  },
  {
    id: '8',
    name: 'Formal Wear',
    slug: 'formal-wear',
    image: 'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
    description: 'Business suits, formal dresses and office wear',
    productCount: 542
  }
];

export const featuredProducts: Product[] = [
  {
    id: '1',
    title: 'Floral Wrap Midi Dress',
    description: 'Elegant floral wrap midi dress perfect for summer outings. Features a flattering wrap silhouette with adjustable tie.',
    price: 4500,
    originalPrice: 6500,
    images: [
      'https://images.pexels.com/photos/1536619/pexels-photo-1536619.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: categories[0],
    condition: 'new',
    location: 'Colombo',
    seller_id: 'admin',
    seller: { id: 'seller1', name: 'LuxeFashion LK', avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.8 },
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    colors: ['Floral Blue', 'Floral Pink', 'Floral Red'],
    gender: 'women',
    material: '100% Rayon',
    brand: 'LuxeFashion',
    style: 'Casual',
    stockQuantity: 45,
    features: ['Wrap Silhouette', 'Adjustable Tie', 'V-Neckline', 'Midi Length'],
    tags: ['dress', 'floral', 'summer', 'wrap'],
    createdAt: '2024-01-15T10:00:00Z',
    updatedAt: '2024-01-15T10:00:00Z',
    isFeatured: true,
    isNew: true
  },
  {
    id: '2',
    title: 'Classic Oxford Button-Down Shirt',
    description: 'Premium cotton Oxford shirt, perfect for both casual and semi-formal occasions. Wrinkle-resistant fabric.',
    price: 3200,
    originalPrice: 4500,
    images: [
      'https://images.pexels.com/photos/1043474/pexels-photo-1043474.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
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
    id: '3',
    title: 'Handcrafted Leather Tote Bag',
    description: 'Genuine leather tote bag with spacious interior, perfect for everyday use. Features multiple compartments.',
    price: 8900,
    originalPrice: 12000,
    images: [
      'https://images.pexels.com/photos/1152077/pexels-photo-1152077.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2584269/pexels-photo-2584269.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
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
    id: '4',
    title: 'Nike Air Max Running Shoes',
    description: 'Lightweight and breathable running shoes with superior cushioning. Ideal for daily runs and gym workouts.',
    price: 15500,
    originalPrice: 19000,
    images: [
      'https://images.pexels.com/photos/2529148/pexels-photo-2529148.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/1598505/pexels-photo-1598505.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
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
    id: '5',
    title: 'Silk Saree - Kandy Handwoven',
    description: 'Beautiful handwoven silk saree from Kandy artisans. Features intricate gold zari border work.',
    price: 22000,
    originalPrice: 28000,
    images: [
      'https://images.pexels.com/photos/3622608/pexels-photo-3622608.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2220316/pexels-photo-2220316.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
    category: categories[6],
    condition: 'new',
    location: 'Kandy',
    seller_id: 'admin',
    seller: { id: 'seller5', name: 'Heritage Textiles', avatar: 'https://images.pexels.com/photos/1212984/pexels-photo-1212984.jpeg?auto=compress&cs=tinysrgb&w=150', rating: 4.6 },
    sizes: ['One Size'],
    colors: ['Royal Blue', 'Deep Red', 'Emerald Green', 'Gold'],
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
  },
  {
    id: '6',
    title: 'Premium Slim-Fit Suit Set',
    description: 'Italian-cut slim fit suit in premium wool-blend fabric. Complete set with jacket and trousers.',
    price: 35000,
    originalPrice: 45000,
    images: [
      'https://images.pexels.com/photos/1043471/pexels-photo-1043471.jpeg?auto=compress&cs=tinysrgb&w=600',
      'https://images.pexels.com/photos/2897531/pexels-photo-2897531.jpeg?auto=compress&cs=tinysrgb&w=600'
    ],
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
