/*
  # Add video_url to products table

  Adds an optional video_url column to products so sellers/admins
  can attach a short product video. When present, the video auto-plays
  (muted, looped) on the product detail page media area.

  1. Changes
    - `products.video_url` (text, nullable) — URL of the product video
*/

DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM information_schema.columns
    WHERE table_name = 'products' AND column_name = 'video_url'
  ) THEN
    ALTER TABLE products ADD COLUMN video_url text DEFAULT NULL;
  END IF;
END $$;
