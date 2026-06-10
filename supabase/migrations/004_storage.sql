-- Create storage bucket for product images
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'products',
  'products',
  true,
  10485760,
  ARRAY['image/jpeg', 'image/png', 'image/webp', 'image/gif']
) ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public read product images" ON storage.objects
  FOR SELECT USING (bucket_id = 'products');

CREATE POLICY "Admins upload product images" ON storage.objects
  FOR INSERT WITH CHECK (
    bucket_id = 'products' AND public.is_admin()
  );

CREATE POLICY "Admins update product images" ON storage.objects
  FOR UPDATE USING (
    bucket_id = 'products' AND public.is_admin()
  );

CREATE POLICY "Admins delete product images" ON storage.objects
  FOR DELETE USING (
    bucket_id = 'products' AND public.is_admin()
  );
