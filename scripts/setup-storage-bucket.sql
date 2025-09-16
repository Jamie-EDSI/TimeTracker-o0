-- Create the client_files storage bucket if it doesn't exist
-- Run this in Supabase SQL Editor

-- First, check if the bucket exists
DO $$
BEGIN
  -- Create the client_files bucket
  INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
  VALUES (
    'client_files',
    'client_files', 
    true,
    52428800, -- 50MB limit
    ARRAY['image/*', 'application/pdf', 'text/*', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document']
  )
  ON CONFLICT (id) DO NOTHING;
  
  RAISE NOTICE 'client_files bucket created or already exists';
END $$;

-- Set up RLS policies for the client_files bucket
-- Allow authenticated users to upload files
CREATE POLICY IF NOT EXISTS "Allow authenticated uploads to client_files"
ON storage.objects
FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'client_files');

-- Allow authenticated users to view files
CREATE POLICY IF NOT EXISTS "Allow authenticated reads from client_files"
ON storage.objects
FOR SELECT
TO authenticated
USING (bucket_id = 'client_files');

-- Allow authenticated users to update files
CREATE POLICY IF NOT EXISTS "Allow authenticated updates to client_files"
ON storage.objects
FOR UPDATE
TO authenticated
USING (bucket_id = 'client_files');

-- Allow authenticated users to delete files
CREATE POLICY IF NOT EXISTS "Allow authenticated deletes from client_files"
ON storage.objects
FOR DELETE
TO authenticated
USING (bucket_id = 'client_files');

-- Also allow public access for easier file sharing (optional)
CREATE POLICY IF NOT EXISTS "Allow public reads from client_files"
ON storage.objects
FOR SELECT
TO public
USING (bucket_id = 'client_files');

-- Enable RLS on storage.objects if not already enabled
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Grant necessary permissions
GRANT ALL ON storage.buckets TO authenticated;
GRANT ALL ON storage.objects TO authenticated;

-- Verify the bucket was created
SELECT 
  id,
  name,
  public,
  file_size_limit,
  allowed_mime_types,
  created_at
FROM storage.buckets 
WHERE name = 'client_files';
