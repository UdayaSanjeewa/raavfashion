/*
  # Fix RLS policies to use profiles.role instead of JWT metadata

  Problem: All role-based RLS policies check auth.jwt()->'user_metadata'->>'role'
  but the role is stored in the profiles table, not in JWT metadata.
  This means admin/seller policies never match.

  Fix: Create a SECURITY DEFINER function get_my_role() that reads the current
  user's role from the profiles table (bypassing RLS to avoid recursion), then
  rewrite every policy that checks roles to use this function.
*/

-- ── Role helper function ─────────────────────────────────────────────────────
CREATE OR REPLACE FUNCTION get_my_role()
RETURNS text
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT role FROM profiles WHERE id = auth.uid(); $$;

-- ── orders ───────────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can view all orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;
DROP POLICY IF EXISTS "Sellers can view orders with their products" ON orders;

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT TO authenticated
  USING (get_my_role() = 'admin');

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE TO authenticated
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Sellers can view orders with their products"
  ON orders FOR SELECT TO authenticated
  USING (
    get_my_role() = 'seller'
    AND order_has_seller_item(id, auth.uid())
  );

-- ── order_items ──────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Sellers can view own order items" ON order_items;

CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    get_order_user_id(order_id) = auth.uid()
    OR get_my_role() = 'admin'
  );

CREATE POLICY "Sellers can view own order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    get_my_role() = 'seller'
    AND seller_id = auth.uid()
  );

-- ── products ─────────────────────────────────────────────────────────────────
-- Fix any product admin policies that also use JWT metadata
DROP POLICY IF EXISTS "Admins can manage products" ON products;
DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Recreate using get_my_role() if they existed
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can insert products'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can insert products"
        ON products FOR INSERT TO authenticated
        WITH CHECK (get_my_role() = 'admin' OR get_my_role() = 'seller')
    $policy$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can update products'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can update products"
        ON products FOR UPDATE TO authenticated
        USING (get_my_role() = 'admin' OR (get_my_role() = 'seller' AND seller_id = auth.uid()))
        WITH CHECK (get_my_role() = 'admin' OR (get_my_role() = 'seller' AND seller_id = auth.uid()))
    $policy$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'products' AND policyname = 'Admins can delete products'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can delete products"
        ON products FOR DELETE TO authenticated
        USING (get_my_role() = 'admin' OR (get_my_role() = 'seller' AND seller_id = auth.uid()))
    $policy$;
  END IF;
END $$;

-- ── categories ───────────────────────────────────────────────────────────────
DROP POLICY IF EXISTS "Admins can manage categories" ON categories;
DROP POLICY IF EXISTS "Admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Admins can update categories" ON categories;
DROP POLICY IF EXISTS "Admins can delete categories" ON categories;

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admins can insert categories'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can insert categories"
        ON categories FOR INSERT TO authenticated
        WITH CHECK (get_my_role() = 'admin')
    $policy$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admins can update categories'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can update categories"
        ON categories FOR UPDATE TO authenticated
        USING (get_my_role() = 'admin')
        WITH CHECK (get_my_role() = 'admin')
    $policy$;
  END IF;
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies WHERE tablename = 'categories' AND policyname = 'Admins can delete categories'
  ) THEN
    EXECUTE $policy$
      CREATE POLICY "Admins can delete categories"
        ON categories FOR DELETE TO authenticated
        USING (get_my_role() = 'admin')
    $policy$;
  END IF;
END $$;

-- ── profiles ─────────────────────────────────────────────────────────────────
-- Admin needs to read all profiles to load customer names on orders page
DROP POLICY IF EXISTS "Admins can view all profiles" ON profiles;

CREATE POLICY "Admins can view all profiles"
  ON profiles FOR SELECT TO authenticated
  USING (id = auth.uid() OR get_my_role() = 'admin');
