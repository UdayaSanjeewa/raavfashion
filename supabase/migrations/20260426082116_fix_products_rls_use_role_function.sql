/*
  # Fix products RLS policies to use get_my_role() security definer function

  Replace subquery-based role checks with the get_my_role() function which
  uses SECURITY DEFINER to bypass RLS on profiles table, ensuring role checks
  always work correctly.
*/

DROP POLICY IF EXISTS "Admins can insert products" ON products;
DROP POLICY IF EXISTS "Sellers can insert own products" ON products;
DROP POLICY IF EXISTS "Admins can update products" ON products;
DROP POLICY IF EXISTS "Sellers can update own products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;
DROP POLICY IF EXISTS "Sellers can delete own products" ON products;

CREATE POLICY "Admins can insert products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Sellers can insert own products"
  ON products FOR INSERT
  TO authenticated
  WITH CHECK (get_my_role() = 'seller' AND seller_id = auth.uid());

CREATE POLICY "Admins can update products"
  ON products FOR UPDATE
  TO authenticated
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Sellers can update own products"
  ON products FOR UPDATE
  TO authenticated
  USING (get_my_role() = 'seller' AND seller_id = auth.uid())
  WITH CHECK (get_my_role() = 'seller' AND seller_id = auth.uid());

CREATE POLICY "Admins can delete products"
  ON products FOR DELETE
  TO authenticated
  USING (get_my_role() = 'admin');

CREATE POLICY "Sellers can delete own products"
  ON products FOR DELETE
  TO authenticated
  USING (get_my_role() = 'seller' AND seller_id = auth.uid());
