/*
  # Allow admin to update order_items (needed for product delete SET NULL)

  ## Problem
  When an admin deletes a product, Postgres executes SET NULL on
  order_items.product_id (FK rule). This is an UPDATE operation on
  order_items. There is no UPDATE policy on order_items, so RLS blocks
  it and the product delete fails with a foreign key violation.

  ## Fix
  Add an UPDATE policy on order_items that allows admins to update any row.
*/

CREATE POLICY "Admins can update order items"
  ON order_items
  FOR UPDATE
  TO authenticated
  USING (is_admin())
  WITH CHECK (is_admin());
