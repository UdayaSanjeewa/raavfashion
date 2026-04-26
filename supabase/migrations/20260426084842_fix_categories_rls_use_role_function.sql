/*
  # Fix categories RLS policies to use get_my_role() security definer function

  Old policies checked auth.jwt() user_metadata for role, which doesn't work
  because role is stored in profiles table, not in JWT claims.
  Replace with get_my_role() which reads from profiles via SECURITY DEFINER.
*/

DROP POLICY IF EXISTS "Only admins can insert categories" ON categories;
DROP POLICY IF EXISTS "Only admins can update categories" ON categories;
DROP POLICY IF EXISTS "Only admins can delete categories" ON categories;

CREATE POLICY "Admins can insert categories"
  ON categories FOR INSERT
  TO authenticated
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Admins can update categories"
  ON categories FOR UPDATE
  TO authenticated
  USING (get_my_role() = 'admin')
  WITH CHECK (get_my_role() = 'admin');

CREATE POLICY "Admins can delete categories"
  ON categories FOR DELETE
  TO authenticated
  USING (get_my_role() = 'admin');
