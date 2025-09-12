-- TimeTracker Database Schema
-- This script sets up the complete database structure with sample data

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    participant_id VARCHAR(50) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Active',
    enrollment_date DATE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    cell_phone VARCHAR(20),
    email VARCHAR(255) NOT NULL,
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(10),
    zip_code VARCHAR(10),
    date_of_birth DATE,
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(20),
    case_manager VARCHAR(100) NOT NULL,
    responsible_ec VARCHAR(100),
    required_hours INTEGER,
    cao_number VARCHAR(50),
    education_level VARCHAR(100),
    graduation_year INTEGER,
    school_name VARCHAR(200),
    field_of_study VARCHAR(200),
    education_notes TEXT,
    currently_enrolled VARCHAR(10) DEFAULT 'No',
    gpa DECIMAL(3,2),
    certifications TEXT,
    licenses TEXT,
    industry_certifications TEXT,
    certification_status VARCHAR(50),
    certification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact DATE,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_by VARCHAR(100)
);

-- Create case_notes table
CREATE TABLE IF NOT EXISTS case_notes (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author VARCHAR(100) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_participant_id ON clients(participant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_program ON clients(program);
CREATE INDEX IF NOT EXISTS idx_clients_case_manager ON clients(case_manager);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON clients(created_at);
CREATE INDEX IF NOT EXISTS idx_case_notes_client_id ON case_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_at ON case_notes(created_at);

-- Create trigger to automatically update last_modified timestamp
CREATE OR REPLACE FUNCTION update_last_modified()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Apply trigger to clients table
DROP TRIGGER IF EXISTS trigger_update_clients_last_modified ON clients;
CREATE TRIGGER trigger_update_clients_last_modified
    BEFORE UPDATE ON clients
    FOR EACH ROW
    EXECUTE FUNCTION update_last_modified();

-- Insert sample clients data
INSERT INTO clients (
    first_name, last_name, participant_id, program, status, enrollment_date,
    phone, cell_phone, email, address, city, state, zip_code, date_of_birth,
    emergency_contact, emergency_phone, case_manager, responsible_ec, required_hours,
    cao_number, education_level, graduation_year, school_name, field_of_study,
    education_notes, currently_enrolled, gpa, certifications, licenses,
    industry_certifications, certification_status, certification_notes,
    last_contact, modified_by
) VALUES 
(
    'Sarah', 'Johnson', '2965145', 'EARN', 'Active', '2023-02-20',
    '484-555-0201', '484-555-0202', 'sarah.johnson@email.com', '456 Oak Ave',
    'Philadelphia', 'PA', '19102', '1990-07-15', 'Mike Johnson', '484-555-0203',
    'Brown, Lisa', 'Wilson, John', 40, 'CAO-001', 'High School Diploma/GED',
    2008, 'Philadelphia High School', 'General Studies', 'Graduated with honors',
    'No', 3.5, 'CPR Certified', 'Driver''s License', 'OSHA 10', 'Current',
    'All certifications up to date', '2023-12-15', 'Brown, Lisa'
),
(
    'Michael', 'Davis', '2965146', 'Job Readiness', 'Active', '2023-03-15',
    '215-555-0102', NULL, 'michael.davis@email.com', '789 Pine St',
    'Philadelphia', 'PA', '19103', '1985-12-03', 'Jennifer Davis', '215-555-0104',
    'Smith, John', NULL, NULL, NULL, 'Bachelor''s Degree', 2007,
    'Temple University', 'Business Administration', NULL, 'No', NULL,
    'Microsoft Office Specialist', 'Driver''s License', NULL, 'Current',
    NULL, '2023-12-10', 'Smith, John'
),
(
    'Emily', 'Rodriguez', '2965147', 'YOUTH', 'Pending', '2023-04-01',
    '267-555-0301', NULL, 'emily.rodriguez@email.com', '321 Maple Dr',
    'Philadelphia', 'PA', '19104', '2001-09-22', 'Carlos Rodriguez', '267-555-0302',
    'Johnson, Mary', NULL, 20, NULL, 'High School Diploma/GED', 2019,
    'South Philadelphia High School', NULL, 'Honor Roll student', 'Yes',
    3.8, NULL, 'Driver''s License', NULL, 'Current', NULL, '2023-12-05', 'Johnson, Mary'
),
(
    'David', 'Wilson', '2965148', 'EARN', 'Active', '2023-05-10',
    '610-555-0401', NULL, 'david.wilson@email.com', '654 Cedar Ln',
    'Philadelphia', 'PA', '19105', '1988-03-14', 'Susan Wilson', '610-555-0402',
    'Brown, Lisa', NULL, 40, 'CAO-002', 'Associate Degree', 2010,
    'Community College of Philadelphia', 'Information Technology',
    'Dean''s List graduate', 'No', 3.7, 'CompTIA A+, Network+',
    'Driver''s License', 'CompTIA Security+', 'Current',
    'IT certifications current through 2025', '2023-12-01', 'Brown, Lisa'
),
(
    'Jessica', 'Martinez', '2965149', 'Job Readiness', 'Inactive', '2023-01-15',
    '215-555-0501', NULL, 'jessica.martinez@email.com', '987 Birch St',
    'Philadelphia', 'PA', '19106', '1992-11-08', 'Roberto Martinez', '215-555-0502',
    'Johnson, Mary', NULL, NULL, NULL, 'Some College', NULL,
    'Philadelphia Community College', 'Healthcare Administration',
    'Completed 2 years', 'No', 3.2, 'CPR/AED Certified', 'Driver''s License',
    'Medical Assistant Certification', 'Expired', 'Needs to renew medical certification',
    '2023-11-20', 'Johnson, Mary'
);

-- Insert sample case notes
INSERT INTO case_notes (client_id, note, author, created_at) VALUES 
(
    (SELECT id FROM clients WHERE participant_id = '2965145'),
    'Initial assessment completed. Client shows strong motivation for job placement and has excellent communication skills.',
    'Brown, Lisa',
    '2023-02-20 10:30:00-05'
),
(
    (SELECT id FROM clients WHERE participant_id = '2965145'),
    'Enrolled in Job Readiness program. Scheduled for skills assessment next week. Client is eager to begin training.',
    'Brown, Lisa',
    '2023-03-01 14:00:00-05'
),
(
    (SELECT id FROM clients WHERE participant_id = '2965146'),
    'Client completed job readiness workshop. Showing excellent progress in interview skills and resume writing.',
    'Smith, John',
    '2023-03-20 11:15:00-05'
),
(
    (SELECT id FROM clients WHERE participant_id = '2965147'),
    'Initial intake meeting completed. Client needs career guidance and support with job search strategies.',
    'Johnson, Mary',
    '2023-04-02 09:30:00-05'
),
(
    (SELECT id FROM clients WHERE participant_id = '2965148'),
    'Client has excellent technical skills. Recommended for advanced placement program in IT sector.',
    'Brown, Lisa',
    '2023-05-12 11:00:00-05'
);

-- Create a view for client summary statistics
CREATE OR REPLACE VIEW client_statistics AS
SELECT 
    COUNT(*) as total_clients,
    COUNT(CASE WHEN status = 'Active' THEN 1 END) as active_clients,
    COUNT(CASE WHEN status = 'Pending' THEN 1 END) as pending_clients,
    COUNT(CASE WHEN status = 'Inactive' THEN 1 END) as inactive_clients,
    COUNT(DISTINCT program) as total_programs,
    COUNT(DISTINCT case_manager) as total_case_managers
FROM clients;

-- Enable Row Level Security (RLS) for production use
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (you can customize these based on your needs)
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON clients FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON case_notes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON case_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON case_notes FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON case_notes FOR DELETE USING (true);

-- Verify the setup
DO $$
DECLARE
    client_count INTEGER;
    case_notes_count INTEGER;
BEGIN
    SELECT COUNT(*) INTO client_count FROM clients;
    SELECT COUNT(*) INTO case_notes_count FROM case_notes;
    
    RAISE NOTICE 'Database setup completed successfully!';
    RAISE NOTICE 'client_count: %', client_count;
    RAISE NOTICE 'case_notes_count: %', case_notes_count;
    
    IF client_count = 0 THEN
        RAISE EXCEPTION 'No clients were inserted. Check the INSERT statements.';
    END IF;
    
    IF case_notes_count = 0 THEN
        RAISE EXCEPTION 'No case notes were inserted. Check the INSERT statements.';
    END IF;
END $$;
