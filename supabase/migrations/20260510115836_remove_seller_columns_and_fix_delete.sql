/*
  # Remove seller columns from products & fix delete

  1. Drop seller-referencing triggers on products
     - update_seller_product_count (fires on INSERT/UPDATE/DELETE, references dropped seller_profiles table)

  2. Drop the now-orphaned function
     - update_seller_product_count()

  3. Fix RLS policies on products
     - DROP old DELETE policy that still referenced seller role
     - DROP old INSERT policies that referenced seller role  
     - DROP old UPDATE policies that referenced seller role
     - CREATE clean admin-only DELETE, INSERT, UPDATE policies

  4. Remove seller columns from products table
     - seller_id
     - seller_name
     - seller_avatar
     - seller_rating
*/

-- 1. Drop seller product count triggers
DROP TRIGGER IF EXISTS update_seller_product_count ON products;

-- 2. Drop orphaned function
DROP FUNCTION IF EXISTS update_seller_product_count();

-- 3. Fix RLS policies — drop all old ones and replace with clean admin-only versions
DROP POLICY IF EXISTS "Admin or seller can delete product" ON products;
DROP POLICY IF EXISTS "Sellers can insert own products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Sellers can update own products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (is_admin());

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (is_admin());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());

-- 4. Remove seller columns
ALTER TABLE products
  DROP COLUMN IF EXISTS seller_id,
  DROP COLUMN IF EXISTS seller_name,
  DROP COLUMN IF EXISTS seller_avatar,
  DROP COLUMN IF EXISTS seller_rating;
