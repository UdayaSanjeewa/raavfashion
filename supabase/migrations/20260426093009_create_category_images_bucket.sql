/*
  # Create category-images storage bucket

  Creates a public storage bucket for category images and sets up
  RLS policies so admins can upload/delete and anyone can view.
*/

INSERT INTO storage.buckets (id, name, public)
VALUES ('category-images', 'category-images', true)
ON CONFLICT (id) DO NOTHING;

CREATE POLICY "Anyone can view category images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'category-images');

CREATE POLICY "Admins can upload category images"
  ON storage.objects FOR INSERT
  TO authenticated
  WITH CHECK (
    bucket_id = 'category-images'
    AND get_my_role() = 'admin'
  );

CREATE POLICY "Admins can update category images"
  ON storage.objects FOR UPDATE
  TO authenticated
  USING (
    bucket_id = 'category-images'
    AND get_my_role() = 'admin'
  );

CREATE POLICY "Admins can delete category images"
  ON storage.objects FOR DELETE
  TO authenticated
  USING (
    bucket_id = 'category-images'
    AND get_my_role() = 'admin'
  );
