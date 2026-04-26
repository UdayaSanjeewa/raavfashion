/*
  # Fix products RLS policies to use profiles table for role checks

  The existing policies checked auth.jwt() user_metadata for role, but role
  is stored in the profiles table. This migration drops the old policies and
  creates new ones that correctly look up role from profiles.
*/

-- Drop old policies
DROP POLICY IF EXISTS "Admins and sellers can insert products" ON products;
DROP POLICY IF EXISTS "Admins and sellers can update own products" ON products;
DROP POLICY IF EXISTS "Admins and sellers can delete own products" ON products;

-- Admins (from profiles table) can insert any product
CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sellers can insert their own products
CREATE POLICY "Sellers can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'seller'
    )
    AND seller_id = auth.uid()
  );

-- Admins can update any product
CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sellers can update their own products
CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (
    seller_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'seller'
    )
  )
  WITH CHECK (
    seller_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'seller'
    )
  );

-- Admins can delete any product
CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'admin'
    )
  );

-- Sellers can delete their own products
CREATE POLICY "Sellers can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (
    seller_id = auth.uid()
    AND EXISTS (
      SELECT 1 FROM profiles WHERE id = auth.uid() AND role = 'seller'
    )
  );
