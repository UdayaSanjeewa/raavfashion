/*
  # Add selected_size and selected_color to order_items

  1. Changes
    - Add `selected_size` (text, nullable) to order_items
    - Add `selected_color` (text, nullable) to order_items

  These store the size and color the customer chose at the time of checkout.
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'selected_size'
  ) THEN
    ALTER TABLE order_items ADD COLUMN selected_size text;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'order_items' AND column_name = 'selected_color'
  ) THEN
    ALTER TABLE order_items ADD COLUMN selected_color text;
  END IF;
END $$;
