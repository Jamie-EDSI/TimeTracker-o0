-- Create client_files table for storing file metadata
CREATE TABLE IF NOT EXISTS client_files (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
    file_name TEXT NOT NULL,
    file_size BIGINT NOT NULL,
    file_type TEXT NOT NULL,
    file_category TEXT NOT NULL CHECK (file_category IN ('certification', 'education', 'general')),
    storage_path TEXT NOT NULL,
    public_url TEXT,
    upload_date TIMESTAMPTZ DEFAULT NOW(),
    uploaded_by TEXT NOT NULL,
    description TEXT,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW(),
    deleted_at TIMESTAMPTZ,
    deleted_by TEXT
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_files_client_id ON client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_client_files_category ON client_files(file_category);
CREATE INDEX IF NOT EXISTS idx_client_files_active ON client_files(is_active);
CREATE INDEX IF NOT EXISTS idx_client_files_deleted ON client_files(deleted_at);

-- Enable Row Level Security
ALTER TABLE client_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
CREATE POLICY "Enable read access for all users" ON client_files FOR SELECT USING (true);
CREATE POLICY "Enable insert for all users" ON client_files FOR INSERT WITH CHECK (true);
CREATE POLICY "Enable update for all users" ON client_files FOR UPDATE USING (true);
CREATE POLICY "Enable delete for all users" ON client_files FOR DELETE USING (true);

-- Create trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_client_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER update_client_files_updated_at
    BEFORE UPDATE ON client_files
    FOR EACH ROW
    EXECUTE FUNCTION update_client_files_updated_at();
