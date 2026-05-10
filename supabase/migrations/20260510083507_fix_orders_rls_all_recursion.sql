/*
  # Fix all infinite recursion in orders / order_items RLS

  Root cause: cross-referencing subqueries between orders and order_items policies.
  - order_items SELECT queries orders  → orders SELECT (seller policy) queries order_items → loop
  - order_items INSERT queries orders  → same loop

  Strategy:
  1. Create SECURITY DEFINER helper functions that bypass RLS to break the cycle.
  2. Rewrite every policy that cross-references the other table to use these helpers.
*/

-- ─── Helper functions (SECURITY DEFINER = bypass RLS) ────────────────────────

CREATE OR REPLACE FUNCTION get_order_user_id(p_order_id uuid)
RETURNS uuid
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT user_id FROM orders WHERE id = p_order_id; $$;

-- Returns true when the given order contains at least one item belonging to
-- the given seller. Used by the orders SELECT seller policy.
CREATE OR REPLACE FUNCTION order_has_seller_item(p_order_id uuid, p_seller_id uuid)
RETURNS boolean
LANGUAGE sql STABLE SECURITY DEFINER SET search_path = public
AS $$ SELECT EXISTS (SELECT 1 FROM order_items WHERE order_id = p_order_id AND seller_id = p_seller_id); $$;

-- ─── orders policies ─────────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Sellers can view orders with their products" ON orders;
DROP POLICY IF EXISTS "Users can view own orders" ON orders;
DROP POLICY IF EXISTS "Users can create own orders" ON orders;
DROP POLICY IF EXISTS "Users can update own orders" ON orders;
DROP POLICY IF EXISTS "Admins can update all orders" ON orders;

CREATE POLICY "Users can view own orders"
  ON orders FOR SELECT TO authenticated
  USING (auth.uid() = user_id);

CREATE POLICY "Admins can view all orders"
  ON orders FOR SELECT TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

CREATE POLICY "Sellers can view orders with their products"
  ON orders FOR SELECT TO authenticated
  USING (
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'seller')
    AND order_has_seller_item(id, auth.uid())
  );

CREATE POLICY "Users can create own orders"
  ON orders FOR INSERT TO authenticated
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own orders"
  ON orders FOR UPDATE TO authenticated
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Admins can update all orders"
  ON orders FOR UPDATE TO authenticated
  USING ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  WITH CHECK ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin');

-- ─── order_items policies ────────────────────────────────────────────────────

DROP POLICY IF EXISTS "Users can view own order items" ON order_items;
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;
DROP POLICY IF EXISTS "Sellers can view own order items" ON order_items;

-- SELECT: uses helper to look up order owner without re-triggering orders SELECT
CREATE POLICY "Users can view own order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    get_order_user_id(order_id) = auth.uid()
    OR ((auth.jwt() -> 'user_metadata' ->> 'role') = 'admin')
  );

CREATE POLICY "Sellers can view own order items"
  ON order_items FOR SELECT TO authenticated
  USING (
    ((auth.jwt() -> 'user_metadata' ->> 'role') = 'seller')
    AND seller_id = auth.uid()
  );

-- INSERT: uses helper to verify order ownership without recursion
CREATE POLICY "Users can insert own order items"
  ON order_items FOR INSERT TO authenticated
  WITH CHECK (get_order_user_id(order_id) = auth.uid());
