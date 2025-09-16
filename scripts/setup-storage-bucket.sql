-- Create the client-files storage bucket for client file uploads
-- This script should be run in the Supabase SQL Editor

-- Create the storage bucket for client files
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'client-files',
  'client-files',
  true,
  52428800, -- 50MB limit
  ARRAY[
    'image/*',
    'application/pdf',
    'text/*',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
  ]
) ON CONFLICT (id) DO NOTHING;

-- Set up RLS policies for the client-files bucket
-- Allow authenticated users to upload files
CREATE POLICY "Allow authenticated uploads to client-files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'client-files' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to view files
CREATE POLICY "Allow authenticated access to client-files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'client-files' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to update files
CREATE POLICY "Allow authenticated updates to client-files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'client-files' AND
  auth.role() = 'authenticated'
);

-- Allow authenticated users to delete files
CREATE POLICY "Allow authenticated deletes from client-files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'client-files' AND
  auth.role() = 'authenticated'
);

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Verify the bucket was created
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE name = 'client-files';
