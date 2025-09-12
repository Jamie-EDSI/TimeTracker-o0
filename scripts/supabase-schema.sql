-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Create clients table
CREATE TABLE IF NOT EXISTS clients (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    participant_id VARCHAR(50) UNIQUE NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email VARCHAR(255),
    phone VARCHAR(20),
    cell_phone VARCHAR(20),
    address TEXT,
    city VARCHAR(100),
    state VARCHAR(2),
    zip_code VARCHAR(10),
    date_of_birth DATE,
    emergency_contact VARCHAR(200),
    emergency_phone VARCHAR(20),
    program VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Active',
    enrollment_date DATE,
    case_manager VARCHAR(200),
    responsible_ec VARCHAR(200),
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
    last_contact DATE,
    last_modified TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    modified_by VARCHAR(200),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create case_notes table
CREATE TABLE IF NOT EXISTS case_notes (
    id UUID DEFAULT uuid_generate_v4() PRIMARY KEY,
    client_id UUID REFERENCES clients(id) ON DELETE CASCADE,
    note TEXT NOT NULL,
    author VARCHAR(200) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_clients_participant_id ON clients(participant_id);
CREATE INDEX IF NOT EXISTS idx_clients_status ON clients(status);
CREATE INDEX IF NOT EXISTS idx_clients_program ON clients(program);
CREATE INDEX IF NOT EXISTS idx_clients_case_manager ON clients(case_manager);
CREATE INDEX IF NOT EXISTS idx_case_notes_client_id ON case_notes(client_id);
CREATE INDEX IF NOT EXISTS idx_case_notes_created_at ON case_notes(created_at);

-- Enable Row Level Security (RLS)
ALTER TABLE clients ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_notes ENABLE ROW LEVEL SECURITY;

-- Create policies for public access (adjust as needed for your security requirements)
CREATE POLICY "Enable read access for all users" ON clients FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON clients FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON clients FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON clients FOR DELETE USING (true);

CREATE POLICY "Enable read access for all users" ON case_notes FOR SELECT USING (true);
CREATE POLICY "Enable insert access for all users" ON case_notes FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update access for all users" ON case_notes FOR UPDATE USING (true);
CREATE POLICY "Enable delete access for all users" ON case_notes FOR DELETE USING (true);

-- Insert sample data
INSERT INTO clients (
    participant_id, first_name, last_name, email, phone, program, status, 
    enrollment_date, case_manager, address, city, state, zip_code, date_of_birth
) VALUES 
(
    'SAMPLE001', 'John', 'Doe', 'john.doe@example.com', '(555) 123-4567',
    'WIOA Adult', 'Active', '2024-01-15', 'Sarah Johnson',
    '123 Main St', 'Philadelphia', 'PA', '19101', '1985-03-20'
),
(
    'SAMPLE002', 'Jane', 'Smith', 'jane.smith@example.com', '(555) 987-6543',
    'WIOA Youth', 'Active', '2024-02-01', 'Mike Wilson',
    '456 Oak Ave', 'Philadelphia', 'PA', '19102', '2000-07-15'
);

-- Insert sample case notes
INSERT INTO case_notes (client_id, note, author) 
SELECT 
    c.id,
    'Initial intake completed. Client is motivated and ready to begin job search activities.',
    'Sarah Johnson'
FROM clients c WHERE c.participant_id = 'SAMPLE001';

INSERT INTO case_notes (client_id, note, author) 
SELECT 
    c.id,
    'Completed skills assessment. Recommended for computer training program.',
    'Mike Wilson'
FROM clients c WHERE c.participant_id = 'SAMPLE002';
