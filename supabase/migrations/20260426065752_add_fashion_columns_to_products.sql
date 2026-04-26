/*
  # Add Fashion-Specific Columns to Products Table

  ## Changes
  1. products table - Add fashion-specific columns:
     - sizes (jsonb): Available sizes ["XS","S","M","L","XL","XXL"]
     - colors (jsonb): Available colors ["Red","Blue","Black"]
     - gender (text): men/women/kids/unisex
     - material (text): Fabric material
     - brand (text): Brand name
     - style (text): casual/formal/sportswear etc.
     - stock_quantity (integer): Total stock

  2. categories table - Add image_url alias and sort_order
     - image_url (text): Same as image but matches new schema naming
     - sort_order (integer): For ordering categories

  ## Notes
  - All new columns are nullable or have defaults to avoid breaking existing data
  - The `image` column in categories is kept; image_url is added as alternative
*/

-- Add fashion columns to products
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'sizes'
  ) THEN
    ALTER TABLE products ADD COLUMN sizes jsonb DEFAULT '[]';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'colors'
  ) THEN
    ALTER TABLE products ADD COLUMN colors jsonb DEFAULT '[]';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'gender'
  ) THEN
    ALTER TABLE products ADD COLUMN gender text DEFAULT 'unisex';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'material'
  ) THEN
    ALTER TABLE products ADD COLUMN material text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'brand'
  ) THEN
    ALTER TABLE products ADD COLUMN brand text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'style'
  ) THEN
    ALTER TABLE products ADD COLUMN style text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'stock_quantity'
  ) THEN
    ALTER TABLE products ADD COLUMN stock_quantity integer DEFAULT 0;
  END IF;
END $$;

-- Add image_url alias to categories (maps to existing image column logic)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'image_url'
  ) THEN
    ALTER TABLE categories ADD COLUMN image_url text DEFAULT '';
  END IF;
END $$;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'categories' AND column_name = 'sort_order'
  ) THEN
    ALTER TABLE categories ADD COLUMN sort_order integer DEFAULT 0;
  END IF;
END $$;

-- Sync image_url from existing image column
UPDATE categories SET image_url = image WHERE image_url = '' AND image IS NOT NULL AND image != '';
