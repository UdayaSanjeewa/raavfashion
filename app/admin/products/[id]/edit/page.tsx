'use client';

import { useEffect, useState } from 'react';
import { useRouter, useParams } from 'next/navigation';
import { AuthManager } from '@/lib/auth';
import { supabase } from '@/lib/supabase';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ArrowLeft, Plus, X, Video, Shirt, Palette, Package } from 'lucide-react';
import Link from 'next/link';
import { useToast } from '@/hooks/use-toast';
import { ImageUpload } from '@/components/admin/ImageUpload';

interface Category {
  id: string;
  name: string;
}

const APPAREL_SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL', 'XXXL'];
const NUMERIC_SIZES = ['28', '30', '32', '34', '36', '38', '40', '42', '44'];
const SHOE_SIZES = ['36', '37', '38', '39', '40', '41', '42', '43', '44', '45'];

const FASHION_COLORS: { name: string; hex: string }[] = [
  { name: 'Black',     hex: '#000000' },
  { name: 'White',     hex: '#FFFFFF' },
  { name: 'Grey',      hex: '#9CA3AF' },
  { name: 'Navy',      hex: '#1E3A5F' },
  { name: 'Blue',      hex: '#3B82F6' },
  { name: 'Sky Blue',  hex: '#7DD3FC' },
  { name: 'Red',       hex: '#EF4444' },
  { name: 'Maroon',    hex: '#7F1D1D' },
  { name: 'Pink',      hex: '#F472B6' },
  { name: 'Peach',     hex: '#FBBF8A' },
  { name: 'Orange',    hex: '#F97316' },
  { name: 'Yellow',    hex: '#FACC15' },
  { name: 'Green',     hex: '#22C55E' },
  { name: 'Olive',     hex: '#6B7280' },
  { name: 'Khaki',     hex: '#C3B091' },
  { name: 'Beige',     hex: '#F5F0E8' },
  { name: 'Brown',     hex: '#92400E' },
  { name: 'Camel',     hex: '#C19A6B' },
  { name: 'Cream',     hex: '#FFFDD0' },
  { name: 'Gold',      hex: '#D4AF37' },
  { name: 'Silver',    hex: '#C0C0C0' },
  { name: 'Multi',     hex: 'linear-gradient(135deg,#f00,#0f0,#00f)' },
];

type SizeGroup = 'apparel' | 'numeric' | 'shoe';

export default function EditProduct() {
  const router = useRouter();
  const params = useParams();
  const { toast } = useToast();
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [categories, setCategories] = useState<Category[]>([]);

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    original_price: '',
    category_id: '',
    condition: 'new',
    is_featured: false,
    is_new: false,
    gender: 'unisex',
    brand: '',
    material: '',
    style: '',
    stock_quantity: '',
  });

  const [images, setImages] = useState<string[]>([]);
  const [videoUrl, setVideoUrl] = useState('');
  const [features, setFeatures] = useState<string[]>(['']);
  const [tags, setTags] = useState<string[]>(['']);
  const [selectedSizes, setSelectedSizes] = useState<string[]>([]);
  const [selectedColors, setSelectedColors] = useState<string[]>([]);
  const [sizeGroup, setSizeGroup] = useState<SizeGroup>('apparel');

  useEffect(() => {
    const init = async () => {
      const admin = await AuthManager.isAdmin();
      if (!admin) { router.push('/auth/signin'); return; }
      await loadCategories();
      await loadProduct();
      setIsLoading(false);
    };
    init();
  }, [router, params.id]);

  const loadCategories = async () => {
    const { data } = await supabase.from('categories').select('id, name').order('name');
    if (data) setCategories(data);
  };

  const loadProduct = async () => {
    const { data, error } = await supabase.from('products').select('*').eq('id', params.id).single();

    if (error || !data) {
      toast({ title: 'Error', description: 'Product not found', variant: 'destructive' });
      router.push('/admin/products');
      return;
    }

    setFormData({
      title: data.title,
      description: data.description,
      price: data.price.toString(),
      original_price: data.original_price?.toString() || '',
      category_id: data.category_id || '',
      condition: data.condition,
      is_featured: data.is_featured,
      is_new: data.is_new,
      gender: data.gender || 'unisex',
      brand: data.brand || '',
      material: data.material || '',
      style: data.style || '',
      stock_quantity: data.stock_quantity?.toString() || '',
    });

    setImages(data.images?.length > 0 ? data.images : []);
    setVideoUrl(data.video_url || '');
    setFeatures(data.features?.length > 0 ? data.features : ['']);
    setTags(data.tags?.length > 0 ? data.tags : ['']);

    // Load sizes — stored as jsonb array of strings
    const sizes: string[] = Array.isArray(data.sizes) ? data.sizes : [];
    setSelectedSizes(sizes);

    // Auto-detect size group from existing sizes
    if (sizes.some((s: string) => SHOE_SIZES.includes(s) && !APPAREL_SIZES.includes(s))) {
      setSizeGroup('shoe');
    } else if (sizes.some((s: string) => NUMERIC_SIZES.includes(s) && !APPAREL_SIZES.includes(s))) {
      setSizeGroup('numeric');
    }

    // Load colors — stored as jsonb array of strings
    const colors: string[] = Array.isArray(data.colors) ? data.colors : [];
    setSelectedColors(colors);
  };

  const toggleSize = (s: string) =>
    setSelectedSizes(prev => prev.includes(s) ? prev.filter(x => x !== s) : [...prev, s]);

  const toggleColor = (name: string) =>
    setSelectedColors(prev => prev.includes(name) ? prev.filter(x => x !== name) : [...prev, name]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const filteredImages = images.filter(img => img.trim() !== '');
      const filteredFeatures = features.filter(f => f.trim() !== '');
      const filteredTags = tags.filter(t => t.trim() !== '');

      if (filteredImages.length === 0) {
        toast({ title: 'Error', description: 'Please add at least one image', variant: 'destructive' });
        setIsSaving(false);
        return;
      }

      const { error } = await supabase
        .from('products')
        .update({
          title: formData.title,
          description: formData.description,
          price: parseFloat(formData.price),
          original_price: formData.original_price ? parseFloat(formData.original_price) : null,
          images: filteredImages,
          category_id: formData.category_id || null,
          condition: formData.condition as 'new' | 'used' | 'refurbished',
          features: filteredFeatures,
          tags: filteredTags,
          is_featured: formData.is_featured,
          is_new: formData.is_new,
          stock_quantity: formData.stock_quantity ? parseInt(formData.stock_quantity) : 0,
          video_url: videoUrl.trim() || null,
          sizes: selectedSizes,
          colors: selectedColors,
          gender: formData.gender,
          brand: formData.brand || null,
          material: formData.material || null,
          style: formData.style || null,
        })
        .eq('id', params.id);

      if (error) throw error;

      toast({ title: 'Product updated', description: 'Changes have been saved.' });
      router.push('/admin/products');
    } catch (error: any) {
      toast({ title: 'Error', description: error.message || 'Failed to update product', variant: 'destructive' });
    } finally {
      setIsSaving(false);
    }
  };

  const addArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>) =>
    setter(prev => [...prev, '']);

  const removeArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number) =>
    setter(prev => prev.filter((_, i) => i !== index));

  const updateArrayItem = (setter: React.Dispatch<React.SetStateAction<string[]>>, index: number, value: string) =>
    setter(prev => prev.map((item, i) => i === index ? value : item));

  const activeSizes = sizeGroup === 'apparel' ? APPAREL_SIZES : sizeGroup === 'numeric' ? NUMERIC_SIZES : SHOE_SIZES;

  if (isLoading) return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50">
      <div className="animate-spin rounded-full h-10 w-10 border-2 border-black border-t-transparent" />
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white border-b border-gray-200 sticky top-0 z-10">
        <div className="container mx-auto px-4 py-4 flex items-center gap-4">
          <Link href="/admin/products">
            <Button variant="ghost" size="icon"><ArrowLeft className="w-5 h-5" /></Button>
          </Link>
          <div>
            <h1 className="text-xl font-bold text-gray-900">Edit Product</h1>
            <p className="text-xs text-gray-500">Update product details, variants and inventory</p>
          </div>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">

          {/* Basic Info */}
          <Card>
            <CardHeader><CardTitle className="text-base">Basic Information</CardTitle></CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Product Title *</Label>
                <Input id="title" value={formData.title}
                  onChange={e => setFormData({...formData, title: e.target.value})} required />
              </div>
              <div>
                <Label htmlFor="description">Description *</Label>
                <Textarea id="description" value={formData.description} rows={4}
                  onChange={e => setFormData({...formData, description: e.target.value})} required />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="price">Price (Rs.) *</Label>
                  <Input id="price" type="number" min="0" value={formData.price}
                    onChange={e => setFormData({...formData, price: e.target.value})} required />
                </div>
                <div>
                  <Label htmlFor="original_price">Original / MRP (Rs.)</Label>
                  <Input id="original_price" type="number" min="0" value={formData.original_price}
                    onChange={e => setFormData({...formData, original_price: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Category</Label>
                  <Select value={formData.category_id}
                    onValueChange={v => setFormData({...formData, category_id: v})}>
                    <SelectTrigger><SelectValue placeholder="Select category" /></SelectTrigger>
                    <SelectContent>
                      {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label>Condition *</Label>
                  <Select value={formData.condition}
                    onValueChange={v => setFormData({...formData, condition: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="new">New</SelectItem>
                      <SelectItem value="used">Used</SelectItem>
                      <SelectItem value="refurbished">Refurbished</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Fashion Details */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shirt className="w-4 h-4" /> Fashion Details
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Gender</Label>
                  <Select value={formData.gender}
                    onValueChange={v => setFormData({...formData, gender: v})}>
                    <SelectTrigger><SelectValue /></SelectTrigger>
                    <SelectContent>
                      <SelectItem value="women">Women</SelectItem>
                      <SelectItem value="men">Men</SelectItem>
                      <SelectItem value="kids">Kids</SelectItem>
                      <SelectItem value="unisex">Unisex</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="brand">Brand</Label>
                  <Input id="brand" placeholder="e.g. Zara, H&M, Local" value={formData.brand}
                    onChange={e => setFormData({...formData, brand: e.target.value})} />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="material">Material / Fabric</Label>
                  <Input id="material" placeholder="e.g. 100% Cotton, Silk Blend" value={formData.material}
                    onChange={e => setFormData({...formData, material: e.target.value})} />
                </div>
                <div>
                  <Label htmlFor="style">Style / Fit</Label>
                  <Input id="style" placeholder="e.g. Slim Fit, Oversized, Regular" value={formData.style}
                    onChange={e => setFormData({...formData, style: e.target.value})} />
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Sizes */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Shirt className="w-4 h-4" /> Available Sizes
                {selectedSizes.length > 0 && (
                  <span className="ml-auto text-xs font-normal text-gray-500">{selectedSizes.length} selected</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex gap-2 flex-wrap">
                {(['apparel', 'numeric', 'shoe'] as SizeGroup[]).map(g => (
                  <button key={g} type="button"
                    onClick={() => setSizeGroup(g)}
                    className={`text-xs px-3 py-1.5 border font-medium transition-colors ${
                      sizeGroup === g
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-600 border-gray-200 hover:border-gray-400'
                    }`}
                  >
                    {g === 'apparel' ? 'Apparel (XS–XXXL)' : g === 'numeric' ? 'Bottoms (28–44)' : 'Shoes (36–45)'}
                  </button>
                ))}
              </div>

              <div className="flex flex-wrap gap-2">
                {activeSizes.map(s => (
                  <button key={s} type="button" onClick={() => toggleSize(s)}
                    className={`min-w-[48px] h-10 px-3 text-sm font-semibold border transition-all ${
                      selectedSizes.includes(s)
                        ? 'bg-black text-white border-black'
                        : 'bg-white text-gray-700 border-gray-200 hover:border-gray-900'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>

              {selectedSizes.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedSizes.map(s => (
                    <span key={s} className="inline-flex items-center gap-1 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 font-medium">
                      {s}
                      <button type="button" onClick={() => toggleSize(s)} className="hover:text-black">
                        <X className="w-3 h-3" />
                      </button>
                    </span>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Colors */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Palette className="w-4 h-4" /> Available Colors
                {selectedColors.length > 0 && (
                  <span className="ml-auto text-xs font-normal text-gray-500">{selectedColors.length} selected</span>
                )}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-6 sm:grid-cols-8 gap-3">
                {FASHION_COLORS.map(c => {
                  const active = selectedColors.includes(c.name);
                  return (
                    <button key={c.name} type="button" onClick={() => toggleColor(c.name)}
                      title={c.name}
                      className={`group flex flex-col items-center gap-1.5 ${active ? 'opacity-100' : 'opacity-70 hover:opacity-100'}`}
                    >
                      <span
                        className={`w-9 h-9 rounded-full border-2 transition-all ${
                          active ? 'border-black ring-2 ring-black ring-offset-1 scale-110' : 'border-gray-200 group-hover:border-gray-400'
                        }`}
                        style={
                          c.hex.startsWith('linear')
                            ? { background: c.hex }
                            : { backgroundColor: c.hex }
                        }
                      />
                      <span className={`text-[10px] leading-tight text-center ${active ? 'text-black font-semibold' : 'text-gray-500'}`}>
                        {c.name}
                      </span>
                    </button>
                  );
                })}
              </div>

              {selectedColors.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  {selectedColors.map(name => {
                    const color = FASHION_COLORS.find(c => c.name === name);
                    return (
                      <span key={name} className="inline-flex items-center gap-1.5 bg-gray-100 text-gray-700 text-xs px-2.5 py-1 font-medium">
                        <span className="w-3 h-3 rounded-full border border-gray-300"
                          style={color?.hex.startsWith('linear') ? { background: color.hex } : { backgroundColor: color?.hex }} />
                        {name}
                        <button type="button" onClick={() => toggleColor(name)} className="hover:text-black">
                          <X className="w-3 h-3" />
                        </button>
                      </span>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Inventory */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Package className="w-4 h-4" /> Inventory
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="max-w-xs">
                <Label htmlFor="stock_quantity">Total Stock Quantity</Label>
                <Input id="stock_quantity" type="number" min="0" placeholder="0"
                  value={formData.stock_quantity}
                  onChange={e => setFormData({...formData, stock_quantity: e.target.value})} />
                <p className="text-xs text-gray-400 mt-1">Total units available across all sizes and colors.</p>
              </div>
            </CardContent>
          </Card>

          {/* Images */}
          <Card>
            <CardHeader><CardTitle className="text-base">Product Images *</CardTitle></CardHeader>
            <CardContent>
              <ImageUpload images={images} onImagesChange={setImages} maxImages={5} />
            </CardContent>
          </Card>

          {/* Video */}
          <Card>
            <CardHeader>
              <CardTitle className="text-base flex items-center gap-2">
                <Video className="w-4 h-4 text-gray-400" /> Product Video
                <span className="text-xs font-normal text-gray-400">(optional)</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Label htmlFor="video_url">Video URL</Label>
              <Input id="video_url" type="url" value={videoUrl}
                onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://example.com/product-video.mp4" />
              <p className="text-xs text-gray-400">Direct MP4 link — auto-plays (muted) on the product page.</p>
              {videoUrl.trim() && (
                <video src={videoUrl} className="mt-2 w-full max-w-xs rounded border border-gray-200" controls muted preload="metadata" />
              )}
            </CardContent>
          </Card>

          {/* Features & Tags */}
          <Card>
            <CardHeader><CardTitle className="text-base">Features & Tags</CardTitle></CardHeader>
            <CardContent className="space-y-5">
              <div className="space-y-3">
                <Label>Features</Label>
                {features.map((feature, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="e.g. Machine washable" value={feature}
                      onChange={e => updateArrayItem(setFeatures, i, e.target.value)} />
                    {features.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(setFeatures, i)}>
                        <X className="w-4 h-4 text-gray-400" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(setFeatures)}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Feature
                </Button>
              </div>

              <div className="space-y-3">
                <Label>Tags</Label>
                {tags.map((tag, i) => (
                  <div key={i} className="flex gap-2">
                    <Input placeholder="e.g. summer, casual" value={tag}
                      onChange={e => updateArrayItem(setTags, i, e.target.value)} />
                    {tags.length > 1 && (
                      <Button type="button" variant="ghost" size="icon" onClick={() => removeArrayItem(setTags, i)}>
                        <X className="w-4 h-4 text-gray-400" />
                      </Button>
                    )}
                  </div>
                ))}
                <Button type="button" variant="outline" size="sm" onClick={() => addArrayItem(setTags)}>
                  <Plus className="w-3.5 h-3.5 mr-1.5" /> Add Tag
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Options */}
          <Card>
            <CardHeader><CardTitle className="text-base">Listing Options</CardTitle></CardHeader>
            <CardContent className="space-y-3">
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox id="is_featured" checked={formData.is_featured}
                  onCheckedChange={v => setFormData({...formData, is_featured: v as boolean})} />
                <div>
                  <span className="text-sm font-medium">Featured Product</span>
                  <p className="text-xs text-gray-400">Shown in the featured section on the homepage.</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer">
                <Checkbox id="is_new" checked={formData.is_new}
                  onCheckedChange={v => setFormData({...formData, is_new: v as boolean})} />
                <div>
                  <span className="text-sm font-medium">New Arrival</span>
                  <p className="text-xs text-gray-400">Displays a "New" badge on the product card.</p>
                </div>
              </label>
            </CardContent>
          </Card>

          <div className="flex gap-3 pb-8">
            <Button type="submit" className="flex-1 bg-black hover:bg-gray-800 text-white" disabled={isSaving}>
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
            <Link href="/admin/products" className="flex-1">
              <Button type="button" variant="outline" className="w-full">Cancel</Button>
            </Link>
          </div>
        </form>
      </main>
    </div>
  );
}
