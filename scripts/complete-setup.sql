-- Complete setup script for the Time Tracker application
-- This script creates all necessary tables, storage buckets, and policies
-- Run this in the Supabase SQL Editor

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  first_name TEXT NOT NULL,
  last_name TEXT NOT NULL,
  participant_id TEXT UNIQUE NOT NULL,
  program TEXT NOT NULL,
  status TEXT NOT NULL DEFAULT 'Active',
  enrollment_date DATE NOT NULL,
  phone TEXT,
  cell_phone TEXT,
  email TEXT,
  address TEXT,
  city TEXT,
  state TEXT,
  zip_code TEXT,
  date_of_birth DATE,
  emergency_contact TEXT,
  emergency_phone TEXT,
  case_manager TEXT NOT NULL,
  responsible_ec TEXT,
  required_hours INTEGER,
  cao_number TEXT,
  education_level TEXT,
  graduation_year INTEGER,
  school_name TEXT,
  field_of_study TEXT,
  education_notes TEXT,
  currently_enrolled TEXT,
  gpa DECIMAL(3,2),
  certifications TEXT,
  licenses TEXT,
  industry_certifications TEXT,
  certification_status TEXT,
  certification_notes TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  last_contact TIMESTAMP WITH TIME ZONE,
  last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  modified_by TEXT,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by TEXT
);

-- Create case_notes table
CREATE TABLE IF NOT EXISTS case_notes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  note TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  author TEXT NOT NULL,
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by TEXT
);

-- Create client_files table
CREATE TABLE IF NOT EXISTS client_files (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  file_name TEXT NOT NULL,
  file_size BIGINT NOT NULL,
  file_type TEXT NOT NULL,
  file_category TEXT NOT NULL CHECK (file_category IN ('certification', 'education', 'general')),
  storage_path TEXT NOT NULL,
  public_url TEXT,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by TEXT NOT NULL,
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_participant_id ON clients(participant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_program ON clients(program);
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at);
CREATE INDEX IF NOT EXISTS idx_case_notes_client_id ON case_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_at ON case_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_case_notes_deleted_at ON case_notes(deleted_at);
CREATE INDEX IF NOT EXISTS idx_client_files_client_id ON client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_client_files_category ON client_files(file_category);
CREATE INDEX IF NOT EXISTS idx_client_files_active ON client_files(is_active);
CREATE INDEX IF NOT EXISTS idx_client_files_deleted_at ON client_files(deleted_at);

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

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_files ENABLE ROW LEVEL SECURITY;
ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for clients table
CREATE POLICY "Allow all operations on clients" ON clients
FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for case_notes table
CREATE POLICY "Allow all operations on case_notes" ON case_notes
FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for client_files table
CREATE POLICY "Allow all operations on client_files" ON client_files
FOR ALL USING (true) WITH CHECK (true);

-- Create RLS policies for storage bucket
CREATE POLICY "Allow authenticated uploads to client-files" ON storage.objects
FOR INSERT WITH CHECK (
  bucket_id = 'client-files' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated access to client-files" ON storage.objects
FOR SELECT USING (
  bucket_id = 'client-files' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated updates to client-files" ON storage.objects
FOR UPDATE USING (
  bucket_id = 'client-files' AND
  auth.role() = 'authenticated'
);

CREATE POLICY "Allow authenticated deletes from client-files" ON storage.objects
FOR DELETE USING (
  bucket_id = 'client-files' AND
  auth.role() = 'authenticated'
);

-- Insert sample data for testing
INSERT INTO clients (
  first_name, last_name, participant_id, program, status, enrollment_date,
  phone, email, address, city, state, zip_code, date_of_birth,
  case_manager, created_at
) VALUES 
(
  'Sarah', 'Johnson', '2965145', 'EARN', 'Active', '2023-02-20',
  '484-555-0201', 'sarah.johnson@email.com', '456 Oak Ave', 'Philadelphia', 'PA', '19102', '1990-07-15',
  'Brown, Lisa', NOW()
),
(
  'Michael', 'Davis', '2965146', 'Job Readiness', 'Active', '2023-03-15',
  '215-555-0102', 'michael.davis@email.com', '789 Pine St', 'Philadelphia', 'PA', '19103', '1985-12-03',
  'Smith, John', NOW()
),
(
  'Emily', 'Rodriguez', '2965147', 'YOUTH', 'Pending', '2023-04-01',
  '267-555-0301', 'emily.rodriguez@email.com', '321 Maple Dr', 'Philadelphia', 'PA', '19104', '2001-09-22',
  'Johnson, Mary', NOW()
) ON CONFLICT (participant_id) DO NOTHING;

-- Verify the setup
SELECT 'Tables created:' as status;
SELECT table_name FROM information_schema.tables 
WHERE table_schema = 'public' AND table_name IN ('clients', 'case_notes', 'client_files');

SELECT 'Storage bucket created:' as status;
SELECT id, name, public, file_size_limit FROM storage.buckets WHERE name = 'client-files';

SELECT 'Sample clients inserted:' as status;
SELECT COUNT(*) as client_count FROM clients WHERE deleted_at IS NULL;

SELECT '✅ Setup completed successfully!' as final_status;
