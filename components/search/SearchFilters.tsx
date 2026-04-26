'use client';

import { useState } from 'react';
import { categories } from '@/lib/data';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Slider } from '@/components/ui/slider';
import { X, DollarSign, Tag, Grid3x3, Package, Shirt, Users } from 'lucide-react';

interface SearchFiltersProps {
  onFilterChange: (filters: Record<string, string | null>) => void;
  onClearFilters: () => void;
  activeFiltersCount: number;
  currentFilters: {
    query: string;
    category: string;
    minPrice: number;
    maxPrice: number;
    condition: string;
    location: string;
    brand: string;
  };
}

const SIZES = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const GENDERS = ['men', 'women', 'kids', 'unisex'];
const FASHION_BRANDS = [
  'Nike', 'Adidas', 'Puma', 'H&M', 'Zara', 'Mango',
  'LuxeFashion', 'MenStyle', 'Heritage Textiles', 'Elite Formals',
  'LeatherCraft', 'SportZone LK', 'DenimCo'
];

export function SearchFilters({
  onFilterChange,
  onClearFilters,
  activeFiltersCount,
  currentFilters
}: SearchFiltersProps) {
  const [priceRange, setPriceRange] = useState([
    currentFilters.minPrice,
    currentFilters.maxPrice
  ]);

  const conditions = ['new', 'used', 'refurbished'];

  const handlePriceChange = (value: number[]) => {
    setPriceRange(value);
    onFilterChange({
      minPrice: value[0] > 0 ? value[0].toString() : null,
      maxPrice: value[1] < 200000 ? value[1].toString() : null
    });
  };

  const handleConditionChange = (condition: string, checked: boolean) => {
    const current = currentFilters.condition ? currentFilters.condition.split(',') : [];
    const updated = checked ? [...current, condition] : current.filter(c => c !== condition);
    onFilterChange({ condition: updated.length > 0 ? updated.join(',') : null });
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-5 space-y-5">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-gray-900">Filters</h3>
        {activeFiltersCount > 0 && (
          <Badge className="bg-rose-100 text-rose-700 border-0 text-xs">
            {activeFiltersCount} active
          </Badge>
        )}
      </div>

      {/* Category */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Grid3x3 className="h-3.5 w-3.5" />
          Category
        </Label>
        <select
          value={currentFilters.category}
          onChange={(e) => onFilterChange({ category: e.target.value || null })}
          className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 focus:border-transparent bg-white"
        >
          <option value="">All Categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.slug}>{c.name}</option>
          ))}
        </select>
      </div>

      {/* Gender */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Users className="h-3.5 w-3.5" />
          Gender
        </Label>
        <div className="flex flex-wrap gap-2">
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => onFilterChange({ gender: currentFilters.location === g ? null : g })}
              className={`px-3 py-1.5 rounded-lg text-xs font-medium border transition-colors capitalize ${
                currentFilters.location === g
                  ? 'bg-rose-500 text-white border-rose-500'
                  : 'border-gray-200 text-gray-600 hover:border-rose-300 hover:text-rose-600'
              }`}
            >
              {g}
            </button>
          ))}
        </div>
      </div>

      {/* Size */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Shirt className="h-3.5 w-3.5" />
          Size
        </Label>
        <div className="flex flex-wrap gap-1.5">
          {SIZES.map((size) => (
            <button
              key={size}
              onClick={() => onFilterChange({ size: null })}
              className="px-2.5 py-1 border border-gray-200 rounded-lg text-xs font-medium text-gray-600 hover:border-rose-300 hover:text-rose-600 transition-colors"
            >
              {size}
            </button>
          ))}
        </div>
      </div>

      {/* Price Range */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <DollarSign className="h-3.5 w-3.5" />
          Price Range
        </Label>
        <div className="px-1">
          <Slider
            value={priceRange}
            onValueChange={handlePriceChange}
            max={200000}
            step={500}
            className="w-full"
          />
          <div className="flex justify-between text-xs text-gray-500 mt-1.5">
            <span>Rs. {priceRange[0].toLocaleString()}</span>
            <span>Rs. {priceRange[1].toLocaleString()}</span>
          </div>
        </div>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <Label className="text-xs text-gray-500">Min</Label>
            <Input
              type="number"
              value={priceRange[0]}
              onChange={(e) => handlePriceChange([parseInt(e.target.value) || 0, priceRange[1]])}
              className="text-sm h-8"
            />
          </div>
          <div>
            <Label className="text-xs text-gray-500">Max</Label>
            <Input
              type="number"
              value={priceRange[1]}
              onChange={(e) => handlePriceChange([priceRange[0], parseInt(e.target.value) || 200000])}
              className="text-sm h-8"
            />
          </div>
        </div>
        <div className="space-y-1">
          {[
            ['Under Rs. 2,000', 0, 2000],
            ['Rs. 2,000 - Rs. 10,000', 2000, 10000],
            ['Rs. 10,000 - Rs. 50,000', 10000, 50000],
            ['Above Rs. 50,000', 50000, 200000]
          ].map(([label, min, max]) => (
            <Button
              key={label as string}
              variant="outline"
              size="sm"
              onClick={() => handlePriceChange([min as number, max as number])}
              className="w-full justify-start text-xs h-8 font-normal"
            >
              {label}
            </Button>
          ))}
        </div>
      </div>

      {/* Condition */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Tag className="h-3.5 w-3.5" />
          Condition
        </Label>
        <div className="space-y-2">
          {conditions.map((cond) => (
            <div key={cond} className="flex items-center gap-2">
              <Checkbox
                id={cond}
                checked={currentFilters.condition.split(',').includes(cond)}
                onCheckedChange={(checked) => handleConditionChange(cond, checked as boolean)}
              />
              <Label htmlFor={cond} className="text-sm font-normal capitalize cursor-pointer">
                {cond}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Brand */}
      <div className="space-y-2">
        <Label className="text-sm font-semibold text-gray-900 flex items-center gap-2">
          <Package className="h-3.5 w-3.5" />
          Brand
        </Label>
        <select
          value={currentFilters.brand}
          onChange={(e) => onFilterChange({ brand: e.target.value || null })}
          className="w-full p-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-rose-400 bg-white"
        >
          <option value="">All Brands</option>
          {FASHION_BRANDS.map((brand) => (
            <option key={brand} value={brand}>{brand}</option>
          ))}
        </select>
      </div>

      {/* Clear Filters */}
      {activeFiltersCount > 0 && (
        <div className="pt-3 border-t border-gray-100">
          <Button
            variant="outline"
            onClick={onClearFilters}
            className="w-full flex items-center justify-center gap-2 text-rose-600 border-rose-200 hover:bg-rose-50 text-sm"
          >
            <X className="h-4 w-4" />
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
}
