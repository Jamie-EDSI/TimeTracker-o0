-- Setup storage bucket for client files
-- This script creates the client-files bucket and sets up the necessary policies

-- Create the client-files storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-files', 'client-files', true)
ON CONFLICT (id) DO NOTHING;

-- Enable RLS on storage.objects
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create policies for the client-files bucket
CREATE POLICY IF NOT EXISTS "Public Access" ON storage.objects 
FOR SELECT USING (bucket_id = 'client-files');

CREATE POLICY IF NOT EXISTS "Public Upload" ON storage.objects 
FOR INSERT WITH CHECK (bucket_id = 'client-files');

CREATE POLICY IF NOT EXISTS "Public Update" ON storage.objects 
FOR UPDATE USING (bucket_id = 'client-files');

CREATE POLICY IF NOT EXISTS "Public Delete" ON storage.objects 
FOR DELETE USING (bucket_id = 'client-files');

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Storage bucket "client-files" has been created successfully with public access policies.';
END $$;
