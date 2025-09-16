-- Complete Database Setup Script
-- Run this entire script in your Supabase SQL Editor

-- =============================================
-- 1. CREATE MAIN TABLES
-- =============================================

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    first_name TEXT NOT NULL,
    last_name TEXT NOT NULL,
    participant_id TEXT UNIQUE NOT NULL,
    program TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Active',
    enrollment_date DATE NOT NULL,
    phone TEXT NOT NULL,
    cell_phone TEXT,
    email TEXT NOT NULL,
    address TEXT NOT NULL,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    zip_code TEXT NOT NULL,
    date_of_birth DATE NOT NULL,
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
    last_contact DATE,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_by TEXT,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by TEXT
);

-- Create case_notes table
CREATE TABLE IF NOT EXISTS case_notes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author TEXT NOT NULL,
    deleted_at TIMESTAMP WITH TIME ZONE,
    deleted_by TEXT
);

-- Create client_files table
CREATE TABLE IF NOT EXISTS client_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    file_category TEXT NOT NULL CHECK (file_category IN ('certification', 'education', 'general')),
    storage_path TEXT,
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

-- =============================================
-- 2. CREATE INDEXES FOR PERFORMANCE
-- =============================================

-- Clients indexes
CREATE INDEX IF NOT EXISTS idx_clients_participant_id ON clients(participant_id);
CREATE INDEX IF NOT EXISTS idx_clients_program ON clients(program);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_case_manager ON clients(case_manager);
CREATE INDEX IF NOT EXISTS idx_clients_deleted ON clients(deleted_at);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);

-- Case notes indexes
CREATE INDEX IF NOT EXISTS idx_case_notes_client_id ON case_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_at ON case_notes(created_at);
CREATE INDEX IF NOT EXISTS idx_case_notes_deleted ON case_notes(deleted_at);

-- Client files indexes
CREATE INDEX IF NOT EXISTS idx_client_files_client_id ON client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_client_files_category ON client_files(file_category);
CREATE INDEX IF NOT EXISTS idx_client_files_active ON client_files(is_active);
CREATE INDEX IF NOT EXISTS idx_client_files_deleted ON client_files(deleted_at);

-- =============================================
-- 3. CREATE TRIGGERS FOR AUTO-UPDATES
-- =============================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Function to update last_modified timestamp for clients
CREATE OR REPLACE FUNCTION update_last_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers
CREATE TRIGGER update_clients_last_modified 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_last_modified_column();

CREATE TRIGGER update_client_files_updated_at 
    BEFORE UPDATE ON client_files 
    FOR EACH ROW 
    EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- 4. ENABLE ROW LEVEL SECURITY
-- =============================================

-- Enable RLS on all tables
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;
ALTER TABLE client_files ENABLE ROW LEVEL SECURITY;

-- Create permissive policies for development (adjust for production)
CREATE POLICY "Enable all operations for all users" ON clients FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON case_notes FOR ALL USING (true);
CREATE POLICY "Enable all operations for all users" ON client_files FOR ALL USING (true);

-- =============================================
-- 5. CREATE STORAGE BUCKET AND POLICIES
-- =============================================

-- Create storage bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('client-files', 'client-files', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'client-files');
CREATE POLICY "Authenticated users can upload files" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'client-files');
CREATE POLICY "Authenticated users can update files" ON storage.objects FOR UPDATE USING (bucket_id = 'client-files');
CREATE POLICY "Authenticated users can delete files" ON storage.objects FOR DELETE USING (bucket_id = 'client-files');

-- =============================================
-- 6. INSERT SAMPLE DATA (OPTIONAL)
-- =============================================

-- Insert sample clients for testing
INSERT INTO clients (
    first_name, last_name, participant_id, program, status, enrollment_date,
    phone, email, address, city, state, zip_code, date_of_birth, case_manager
) VALUES 
(
    'Sarah', 'Johnson', '2965145', 'EARN', 'Active', '2023-02-20',
    '484-555-0201', 'sarah.johnson@email.com', '456 Oak Ave', 
    'Philadelphia', 'PA', '19102', '1990-07-15', 'Brown, Lisa'
),
(
    'Michael', 'Davis', '2965146', 'Job Readiness', 'Active', '2023-03-15',
    '215-555-0102', 'michael.davis@email.com', '789 Pine St',
    'Philadelphia', 'PA', '19103', '1985-12-03', 'Smith, John'
),
(
    'Emily', 'Rodriguez', '2965147', 'YOUTH', 'Pending', '2023-04-01',
    '267-555-0301', 'emily.rodriguez@email.com', '321 Maple Dr',
    'Philadelphia', 'PA', '19104', '2001-09-22', 'Johnson, Mary'
)
ON CONFLICT (participant_id) DO NOTHING;

-- Insert sample case notes
INSERT INTO case_notes (client_id, note, author) 
SELECT 
    c.id,
    'Initial assessment completed. Client shows strong motivation for job placement.',
    'Brown, Lisa'
FROM clients c 
WHERE c.participant_id = '2965145'
ON CONFLICT DO NOTHING;

-- =============================================
-- 7. VERIFICATION QUERIES
-- =============================================

-- Check if tables were created successfully
SELECT 
    schemaname,
    tablename,
    tableowner
FROM pg_tables 
WHERE tablename IN ('clients', 'case_notes', 'client_files')
ORDER BY tablename;

-- Check if indexes were created
SELECT 
    indexname,
    tablename
FROM pg_indexes 
WHERE tablename IN ('clients', 'case_notes', 'client_files')
ORDER BY tablename, indexname;

-- Check sample data
SELECT 
    'clients' as table_name,
    count(*) as record_count
FROM clients
UNION ALL
SELECT 
    'case_notes' as table_name,
    count(*) as record_count
FROM case_notes
UNION ALL
SELECT 
    'client_files' as table_name,
    count(*) as record_count
FROM client_files;

-- Check storage bucket
SELECT * FROM storage.buckets WHERE id = 'client-files';

-- =============================================
-- SETUP COMPLETE!
-- =============================================

-- If you see results from the verification queries above,
-- your database is set up correctly!
-- 
-- Next steps:
-- 1. Update your .env.local file with Supabase credentials
-- 2. Restart your development server
-- 3. Test the connection using the diagnostic functions
-- 4. Start using the application!
