-- TimeTracker Application Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS public.clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    participant_id VARCHAR(50) UNIQUE NOT NULL,
    program VARCHAR(100) NOT NULL,
    status VARCHAR(50) DEFAULT 'Active',
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
    case_manager VARCHAR(200),
    responsible_ec VARCHAR(200),
    required_hours INTEGER,
    cao_number VARCHAR(50),
    education_level VARCHAR(100),
    graduation_year INTEGER,
    school_name VARCHAR(200),
    field_of_study VARCHAR(200),
    education_notes TEXT,
    currently_enrolled VARCHAR(10),
    gpa DECIMAL(3,2),
    certifications TEXT,
    licenses TEXT,
    industry_certifications TEXT,
    certification_status VARCHAR(50),
    certification_notes TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    last_contact DATE,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_by VARCHAR(200)
);

-- Create case_notes table
CREATE TABLE IF NOT EXISTS public.case_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES public.clients(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    author VARCHAR(200) NOT NULL
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_participant_id ON public.clients(participant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON public.clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_program ON public.clients(program);
CREATE INDEX IF NOT EXISTS idx_clients_case_manager ON public.clients(case_manager);
CREATE INDEX IF NOT EXISTS idx_clients_created_at ON public.clients(created_at);
CREATE INDEX IF NOT EXISTS idx_case_notes_client_id ON public.case_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_at ON public.case_notes(created_at);

-- Create trigger to automatically update last_modified timestamp
CREATE OR REPLACE FUNCTION update_modified_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.last_modified = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_clients_modtime 
    BEFORE UPDATE ON public.clients 
    FOR EACH ROW 
    EXECUTE FUNCTION update_modified_column();

-- Insert sample data
INSERT INTO public.clients (
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
    40, 'CAO-001', 'High School Diploma/GED', 2008,
    'Philadelphia High School', 'General Studies', 'Graduated with honors', 'No',
    3.5, 'CPR Certified', 'Driver''s License', 'OSHA 10',
    'Current', 'All certifications up to date', '2023-12-15', 'Brown, Lisa'
),
(
    'Michael', 'Davis', '2965146', 'Job Readiness', 'Active', '2023-03-15',
    '215-555-0102', NULL, 'michael.davis@email.com',
    '789 Pine St', 'Philadelphia', 'PA', '19103', '1985-12-03',
    'Jennifer Davis', '215-555-0104', 'Smith, John', NULL,
    NULL, NULL, 'Bachelor''s Degree', 2007,
    'Temple University', 'Business Administration', NULL, 'No',
    3.2, NULL, 'Driver''s License', NULL,
    NULL, NULL, '2023-12-10', 'Smith, John'
),
(
    'Emily', 'Rodriguez', '2965147', 'YOUTH', 'Pending', '2023-04-01',
    '267-555-0301', NULL, 'emily.rodriguez@email.com',
    '321 Maple Dr', 'Philadelphia', 'PA', '19104', '2001-09-22',
    'Carlos Rodriguez', '267-555-0302', 'Johnson, Mary', NULL,
    NULL, NULL, 'High School Student', NULL,
    'Central High School', NULL, 'Currently enrolled in senior year', 'Yes',
    3.8, NULL, NULL, NULL,
    NULL, NULL, '2023-12-05', 'Johnson, Mary'
),
(
    'David', 'Wilson', '2965148', 'EARN', 'Active', '2023-05-10',
    '610-555-0401', NULL, 'david.wilson@email.com',
    '654 Cedar Ln', 'Philadelphia', 'PA', '19105', '1988-03-14',
    'Susan Wilson', '610-555-0402', 'Brown, Lisa', NULL,
    40, 'CAO-002', 'Associate Degree', 2010,
    'Community College of Philadelphia', 'Information Technology', NULL, 'No',
    3.6, 'CompTIA A+', 'Driver''s License', 'Microsoft Certified',
    'Current', 'IT certifications current', '2023-12-01', 'Brown, Lisa'
),
(
    'Jessica', 'Martinez', '2965149', 'Job Readiness', 'Inactive', '2023-01-15',
    '215-555-0501', NULL, 'jessica.martinez@email.com',
    '987 Birch St', 'Philadelphia', 'PA', '19106', '1992-11-08',
    'Roberto Martinez', '215-555-0502', 'Johnson, Mary', NULL,
    NULL, NULL, 'High School Diploma/GED', 2010,
    'South Philadelphia High School', NULL, NULL, 'No',
    NULL, 'First Aid Certified', 'Driver''s License', NULL,
    'Current', NULL, '2023-11-20', 'Johnson, Mary'
);

-- Insert sample case notes
INSERT INTO public.case_notes (client_id, note, author, created_at) 
SELECT 
    c.id,
    notes.note,
    notes.author,
    notes.created_at::timestamp with time zone
FROM public.clients c
CROSS JOIN (
    VALUES 
    ('2965145', 'Initial assessment completed. Client shows strong motivation for job placement.', 'Brown, Lisa', '2023-02-20 10:30:00'),
    ('2965145', 'Enrolled in Job Readiness program. Scheduled for skills assessment next week.', 'Brown, Lisa', '2023-03-01 14:00:00'),
    ('2965146', 'Client completed job readiness workshop. Showing excellent progress in interview skills.', 'Smith, John', '2023-03-20 11:15:00'),
    ('2965147', 'Initial intake meeting scheduled. Client needs career guidance and support.', 'Johnson, Mary', '2023-04-02 09:30:00'),
    ('2965148', 'Client has excellent technical skills. Recommended for advanced placement program.', 'Brown, Lisa', '2023-05-12 11:00:00')
) AS notes(participant_id, note, author, created_at)
WHERE c.participant_id = notes.participant_id;

-- Set up Row Level Security (RLS) - Optional but recommended for production
-- ALTER TABLE public.clients ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE public.case_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for authenticated users (uncomment for production)
-- CREATE POLICY "Users can view all clients" ON public.clients FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Users can insert clients" ON public.clients FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Users can update clients" ON public.clients FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Users can delete clients" ON public.clients FOR DELETE USING (auth.role() = 'authenticated');

-- CREATE POLICY "Users can view all case notes" ON public.case_notes FOR SELECT USING (auth.role() = 'authenticated');
-- CREATE POLICY "Users can insert case notes" ON public.case_notes FOR INSERT WITH CHECK (auth.role() = 'authenticated');
-- CREATE POLICY "Users can update case notes" ON public.case_notes FOR UPDATE USING (auth.role() = 'authenticated');
-- CREATE POLICY "Users can delete case notes" ON public.case_notes FOR DELETE USING (auth.role() = 'authenticated');

-- Verify the setup
SELECT 'Database setup completed successfully!' as status;
SELECT COUNT(*) as client_count FROM public.clients;
SELECT COUNT(*) as case_notes_count FROM public.case_notes;
