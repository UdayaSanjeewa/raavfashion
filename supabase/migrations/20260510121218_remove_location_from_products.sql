/*
  # Remove location column from products table

  The platform is a single-store admin-managed shop — location is not relevant per product.

  1. Changes
    - Drop `location` column from `products` table
*/

ALTER TABLE products DROP COLUMN IF EXISTS location;
