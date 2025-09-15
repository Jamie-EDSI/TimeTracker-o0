-- Add soft delete functionality to clients table
ALTER TABLE clients ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE clients ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add soft delete functionality to case_notes table  
ALTER TABLE case_notes ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE;
ALTER TABLE case_notes ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Create index for better performance on deleted records
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at);
CREATE INDEX IF NOT EXISTS idx_case_notes_deleted_at ON case_notes(deleted_at);

-- Update existing queries to exclude deleted records by default
-- This will be handled in the application layer
