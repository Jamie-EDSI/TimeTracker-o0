-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    participant_id VARCHAR(50) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending',
    enrollment_date DATE NOT NULL,
    phone VARCHAR(20),
    cell_phone VARCHAR(20),
    email VARCHAR(255),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    date_of_birth DATE,
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(20),
    case_manager VARCHAR(100),
    responsible_ec VARCHAR(100),
    required_hours VARCHAR(10),
    cao_number VARCHAR(50),
    education_level VARCHAR(100),
    graduation_year VARCHAR(4),
    school_name VARCHAR(200),
    field_of_study VARCHAR(200),
    education_notes TEXT,
    currently_enrolled VARCHAR(10),
    gpa VARCHAR(10),
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
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_program ON clients(program);
CREATE INDEX IF NOT EXISTS idx_clients_case_manager ON clients(case_manager);
CREATE INDEX IF NOT EXISTS idx_clients_enrollment_date ON clients(enrollment_date);
CREATE INDEX IF NOT EXISTS idx_case_notes_client_id ON case_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_at ON case_notes(created_at);

-- Insert sample data
INSERT INTO clients (
    first_name, last_name, participant_id, program, status, enrollment_date,
    phone, cell_phone, email, address, city, state, zip_code, date_of_birth,
    emergency_contact, emergency_phone, case_manager, responsible_ec,
    required_hours, cao_number, education_level, graduation_year,
    school_name, field_of_study, education_notes, currently_enrolled,
    gpa, certifications, licenses, industry_certifications,
    certification_status, certification_notes, last_contact, modified_by
) VALUES 
(
    'Sarah', 'Johnson', '2965145', 'EARN', 'Active', '2023-02-20',
    '484-555-0201', '484-555-0202', 'sarah.johnson@email.com',
    '456 Oak Ave', 'Philadelphia', 'PA', '19102', '1990-07-15',
    'Mike Johnson', '484-555-0203', 'Brown, Lisa', 'Wilson, John',
    '40', 'CAO-001', 'High School Diploma/GED', '2008',
    'Philadelphia High School', 'General Studies', 'Graduated with honors', 'No',
    '3.5', 'CPR Certified', 'Driver''s License', 'OSHA 10',
    'Current', 'All certifications up to date', '2023-12-15', 'Brown, Lisa'
),
(
    'Michael', 'Davis', '2965146', 'Job Readiness', 'Active', '2023-03-15',
    '215-555-0102', NULL, 'michael.davis@email.com',
    '789 Pine St', 'Philadelphia', 'PA', '19103', '1985-12-03',
    'Jennifer Davis', '215-555-0104', 'Smith, John', NULL,
    NULL, NULL, 'Bachelor''s Degree', '2007',
    'Temple University', 'Business Administration', NULL, 'No',
    '3.2', NULL, 'Driver''s License', 'PMP Certification',
    'Pending', NULL, '2023-12-10', 'Smith, John'
),
(
    'Emily', 'Rodriguez', '2965147', 'YOUTH', 'Pending', '2023-04-01',
    '267-555-0301', NULL, 'emily.rodriguez@email.com',
    '321 Maple Dr', 'Philadelphia', 'PA', '19104', '2001-09-22',
    'Carlos Rodriguez', '267-555-0302', 'Johnson, Mary', NULL,
    NULL, NULL, 'High School', '2019',
    'Northeast High School', 'General Studies', 'Honor Roll student', 'Yes',
    '3.8', NULL, 'Driver''s License', NULL,
    'Current', NULL, '2023-12-05', 'Johnson, Mary'
);

-- Insert sample case notes
INSERT INTO case_notes (client_id, note, author) VALUES 
(
    (SELECT id FROM clients WHERE participant_id = '2965145'),
    'Initial assessment completed. Client shows strong motivation for job placement.',
    'Brown, Lisa'
),
(
    (SELECT id FROM clients WHERE participant_id = '2965145'),
    'Enrolled in Job Readiness program. Scheduled for skills assessment next week.',
    'Brown, Lisa'
),
(
    (SELECT id FROM clients WHERE participant_id = '2965146'),
    'Client completed job readiness workshop. Showing excellent progress in interview skills.',
    'Smith, John'
),
(
    (SELECT id FROM clients WHERE participant_id = '2965147'),
    'Initial intake meeting scheduled. Client needs career guidance and support.',
    'Johnson, Mary'
);

-- Create a function to automatically update last_modified timestamp
CREATE OR REPLACE FUNCTION update_last_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Create trigger to automatically update last_modified
CREATE TRIGGER update_clients_last_modified 
    BEFORE UPDATE ON clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_last_modified_column();
