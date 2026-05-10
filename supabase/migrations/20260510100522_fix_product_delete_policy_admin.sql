/*
  # Fix admin product delete by replacing all delete policies

  ## Problem
  The existing delete policies rely on get_my_role() which may still fail
  for admin users when products have seller_id = NULL.

  ## Fix
  - Drop all existing product DELETE policies
  - Create one clean policy: admin can delete any product, seller can delete their own
  - Use is_admin() (SECURITY DEFINER, bypasses RLS) for the admin check
*/

-- Drop all existing product delete policies
DROP POLICY IF EXISTS "Sellers can delete own products" ON products;
DROP POLICY IF EXISTS "Admins can delete products" ON products;

-- Single clean delete policy
CREATE POLICY "Admin or seller can delete product"
  ON products
  FOR DELETE
  TO authenticated
  USING (
    is_admin()
    OR (get_my_role() = 'seller' AND seller_id = auth.uid())
  );
