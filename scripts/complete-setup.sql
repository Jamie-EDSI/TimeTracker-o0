-- Complete setup script for the Time Tracker application
-- This script creates all necessary tables, storage buckets, and policies

-- Enable necessary extensions
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    participant_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    date_of_birth DATE,
    phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(50),
    zip_code VARCHAR(20),
    emergency_contact_name VARCHAR(200),
    emergency_contact_phone VARCHAR(20),
    program VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    enrollment_date DATE DEFAULT CURRENT_DATE,
    case_manager VARCHAR(200),
    notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create case_notes table
CREATE TABLE IF NOT EXISTS case_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    note_date DATE NOT NULL DEFAULT CURRENT_DATE,
    note_type VARCHAR(100),
    content TEXT NOT NULL,
    created_by VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create client_files table
CREATE TABLE IF NOT EXISTS client_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    file_size INTEGER,
    file_type VARCHAR(100),
    uploaded_by VARCHAR(200),
    uploaded_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    deleted_at TIMESTAMP WITH TIME ZONE NULL,
    is_deleted BOOLEAN DEFAULT FALSE
);

-- Create storage bucket for client files (using client_files with underscore)
INSERT INTO storage.buckets (id, name, public)
VALUES ('client_files', 'client_files', true)
ON CONFLICT (id) DO NOTHING;

-- Set up storage policies for client_files bucket
CREATE POLICY IF NOT EXISTS "Public Access" ON storage.objects FOR SELECT USING (bucket_id = 'client_files');
CREATE POLICY IF NOT EXISTS "Public Upload" ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'client_files');
CREATE POLICY IF NOT EXISTS "Public Update" ON storage.objects FOR UPDATE USING (bucket_id = 'client_files');
CREATE POLICY IF NOT EXISTS "Public Delete" ON storage.objects FOR DELETE USING (bucket_id = 'client_files');

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_participant_id ON clients(participant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_deleted ON clients(is_deleted);
CREATE INDEX IF NOT EXISTS idx_case_notes_client_id ON case_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_date ON case_notes(note_date);
CREATE INDEX IF NOT EXISTS idx_case_notes_deleted ON case_notes(is_deleted);
CREATE INDEX IF NOT EXISTS idx_client_files_client_id ON client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_client_files_deleted ON client_files(is_deleted);

-- Insert sample data (optional)
INSERT INTO clients (
    participant_id, first_name, last_name, date_of_birth, phone, email, 
    address, city, state, zip_code, program, case_manager
) VALUES 
(
    'PID-001', 'John', 'Doe', '1990-05-15', '555-0123', 'john.doe@email.com',
    '123 Main St', 'Anytown', 'CA', '12345', 'Job Training', 'Sarah Johnson'
),
(
    'PID-002', 'Jane', 'Smith', '1985-08-22', '555-0456', 'jane.smith@email.com',
    '456 Oak Ave', 'Somewhere', 'CA', '67890', 'Education Support', 'Mike Wilson'
)
ON CONFLICT (participant_id) DO NOTHING;

-- Create a function to update the updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create triggers to automatically update the updated_at column
DROP TRIGGER IF EXISTS update_clients_updated_at ON clients;
CREATE TRIGGER update_clients_updated_at
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

DROP TRIGGER IF EXISTS update_case_notes_updated_at ON case_notes;
CREATE TRIGGER update_case_notes_updated_at
    BEFORE UPDATE ON case_notes
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Success message
DO $$
BEGIN
    RAISE NOTICE 'Setup completed successfully! All tables, storage bucket (client_files), and policies have been created.';
END $$;
