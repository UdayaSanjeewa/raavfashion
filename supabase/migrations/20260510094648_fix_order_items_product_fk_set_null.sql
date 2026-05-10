/*
  # Fix order_items product_id FK to allow product deletion

  ## Problem
  order_items.product_id has ON DELETE NO ACTION, which blocks admin from
  deleting any product that has ever been ordered.

  ## Change
  - Drop the existing FK constraint on order_items.product_id
  - Re-add it with ON DELETE SET NULL so deleting a product nullifies the
    reference in historical order items (product_title / product_image are
    stored directly on the row, so order history is preserved).
*/

ALTER TABLE order_items
  DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

ALTER TABLE order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE SET NULL;
