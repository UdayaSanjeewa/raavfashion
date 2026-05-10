/*
  # Add is_available column to products

  ## Changes
  - Adds `is_available` boolean column to products (default true)
  - All existing products default to available
  - Admins and sellers can update this column via existing UPDATE policies
*/

ALTER TABLE products ADD COLUMN IF NOT EXISTS is_available boolean NOT NULL DEFAULT true;
