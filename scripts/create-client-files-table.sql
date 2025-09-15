-- Create client_files table for storing file metadata and associations
CREATE TABLE IF NOT EXISTS client_files (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  client_id UUID NOT NULL REFERENCES clients(id) ON DELETE CASCADE,
  file_name VARCHAR(255) NOT NULL,
  file_size BIGINT NOT NULL,
  file_type VARCHAR(100) NOT NULL,
  file_category VARCHAR(50) NOT NULL DEFAULT 'certification', -- certification, education, general, etc.
  storage_path TEXT NOT NULL, -- Path to file in storage bucket
  public_url TEXT, -- Public URL for file access
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  uploaded_by VARCHAR(100) DEFAULT 'System',
  description TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  deleted_at TIMESTAMP WITH TIME ZONE,
  deleted_by VARCHAR(100)
);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_client_files_client_id ON client_files(client_id);
CREATE INDEX IF NOT EXISTS idx_client_files_category ON client_files(file_category);
CREATE INDEX IF NOT EXISTS idx_client_files_active ON client_files(is_active);
CREATE INDEX IF NOT EXISTS idx_client_files_deleted ON client_files(deleted_at);

-- Enable Row Level Security
ALTER TABLE client_files ENABLE ROW LEVEL SECURITY;

-- Create RLS policies (adjust based on your authentication setup)
CREATE POLICY "Users can view client files" ON client_files
  FOR SELECT USING (true);

CREATE POLICY "Users can insert client files" ON client_files
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update client files" ON client_files
  FOR UPDATE USING (true);

CREATE POLICY "Users can delete client files" ON client_files
  FOR DELETE USING (true);

-- Add trigger to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_client_files_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trigger_update_client_files_updated_at
  BEFORE UPDATE ON client_files
  FOR EACH ROW
  EXECUTE FUNCTION update_client_files_updated_at();
