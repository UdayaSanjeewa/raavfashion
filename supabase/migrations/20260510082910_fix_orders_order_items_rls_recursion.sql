/*
  # Fix infinite recursion in orders / order_items RLS

  The previous policies caused a cycle:
  - order_items INSERT policy queried orders (triggering orders SELECT policy)
  - orders SELECT policy (seller variant) queried order_items (triggering order_items SELECT)

  Fix:
  1. Replace the order_items INSERT policy with a direct user_id join that avoids
     re-entering the orders SELECT policy by using a security-definer function.
  2. Keep everything else intact.

  Strategy: use a SECURITY DEFINER function `get_order_user_id` that bypasses RLS
  to look up the user_id on an order. The INSERT policy calls this function instead
  of a plain subquery, breaking the recursion chain.
*/

-- Helper function: returns the user_id of an order, bypassing RLS
CREATE OR REPLACE FUNCTION get_order_user_id(p_order_id uuid)
RETURNS uuid
LANGUAGE sql
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT user_id FROM orders WHERE id = p_order_id;
$$;

-- Drop the recursive INSERT policy on order_items
DROP POLICY IF EXISTS "Users can insert own order items" ON order_items;

-- Recreate it using the security-definer function (no recursion)
CREATE POLICY "Users can insert own order items"
  ON order_items
  FOR INSERT
  TO authenticated
  WITH CHECK (get_order_user_id(order_id) = auth.uid());
