-- Create storage bucket for client files
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-files', 'client-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for client files bucket
CREATE POLICY "Anyone can view client files" ON storage.objects
  FOR SELECT USING (bucket_id = 'client-files');

CREATE POLICY "Anyone can upload client files" ON storage.objects
  FOR INSERT WITH CHECK (bucket_id = 'client-files');

CREATE POLICY "Anyone can update client files" ON storage.objects
  FOR UPDATE USING (bucket_id = 'client-files');

CREATE POLICY "Anyone can delete client files" ON storage.objects
  FOR DELETE USING (bucket_id = 'client-files');
