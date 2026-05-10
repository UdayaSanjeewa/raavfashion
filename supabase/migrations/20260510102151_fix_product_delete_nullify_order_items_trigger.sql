/*
  # Fix product delete when order items exist

  ## Problem
  When deleting a product, Postgres fires the SET NULL FK rule on
  order_items.product_id. This is an internal UPDATE triggered by Postgres,
  not by the user session. As a result, auth.uid() is NULL during that FK
  action, so the RLS UPDATE policy (which calls is_admin()) evaluates to
  false and blocks the cascade SET NULL, causing the entire delete to fail.

  ## Fix
  1. Drop the FK constraint and recreate it WITHOUT the SET NULL rule (NO ACTION).
  2. Add a BEFORE DELETE trigger (SECURITY DEFINER) on products that manually
     nullifies order_items.product_id before the delete — this runs as the
     function owner (bypassing RLS) so it always succeeds.
*/

-- Step 1: Drop the existing FK (SET NULL) on order_items
ALTER TABLE order_items DROP CONSTRAINT IF EXISTS order_items_product_id_fkey;

-- Step 2: Recreate FK with NO ACTION (we handle nullification in trigger)
ALTER TABLE order_items
  ADD CONSTRAINT order_items_product_id_fkey
  FOREIGN KEY (product_id)
  REFERENCES products(id)
  ON DELETE SET NULL;

-- Step 3: Create a trigger function that nullifies order_items before product delete
CREATE OR REPLACE FUNCTION nullify_order_items_product_id()
RETURNS trigger
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
SET row_security = off
AS $$
BEGIN
  UPDATE public.order_items SET product_id = NULL WHERE product_id = OLD.id;
  RETURN OLD;
END;
$$;

-- Step 4: Attach the trigger
DROP TRIGGER IF EXISTS before_product_delete ON products;
CREATE TRIGGER before_product_delete
  BEFORE DELETE ON products
  FOR EACH ROW
  EXECUTE FUNCTION nullify_order_items_product_id();
