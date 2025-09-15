-- Create storage bucket for client files
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-files', 'client-files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies
CREATE POLICY "Give users access to client files" ON storage.objects
FOR ALL USING (bucket_id = 'client-files');

-- Allow public access to client files
CREATE POLICY "Public Access" ON storage.objects
FOR SELECT USING (bucket_id = 'client-files');

-- Allow authenticated users to upload files
CREATE POLICY "Authenticated users can upload files" ON storage.objects
FOR INSERT WITH CHECK (bucket_id = 'client-files');

-- Allow authenticated users to update files
CREATE POLICY "Authenticated users can update files" ON storage.objects
FOR UPDATE USING (bucket_id = 'client-files');

-- Allow authenticated users to delete files
CREATE POLICY "Authenticated users can delete files" ON storage.objects
FOR DELETE USING (bucket_id = 'client-files');
