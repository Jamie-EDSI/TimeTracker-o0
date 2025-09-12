-- Update existing tables to support soft delete functionality
-- This script adds the necessary columns for the recycle bin feature

-- Add soft delete columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Add soft delete columns to case_notes table
ALTER TABLE case_notes 
ADD COLUMN IF NOT EXISTS is_deleted BOOLEAN DEFAULT FALSE,
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMP WITH TIME ZONE,
ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Create indexes for better performance on soft delete queries
CREATE INDEX IF NOT EXISTS idx_clients_is_deleted ON clients(is_deleted);
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at) WHERE is_deleted = TRUE;
CREATE INDEX IF NOT EXISTS idx_case_notes_is_deleted ON case_notes(is_deleted);
CREATE INDEX IF NOT EXISTS idx_case_notes_deleted_at ON case_notes(deleted_at) WHERE is_deleted = TRUE;

-- Update existing records to have is_deleted = FALSE if NULL
UPDATE clients SET is_deleted = FALSE WHERE is_deleted IS NULL;
UPDATE case_notes SET is_deleted = FALSE WHERE is_deleted IS NULL;

-- Add comments to document the soft delete functionality
COMMENT ON COLUMN clients.is_deleted IS 'Soft delete flag - TRUE means record is in recycle bin';
COMMENT ON COLUMN clients.deleted_at IS 'Timestamp when record was moved to recycle bin';
COMMENT ON COLUMN clients.deleted_by IS 'User who moved the record to recycle bin';
COMMENT ON COLUMN case_notes.is_deleted IS 'Soft delete flag - TRUE means record is in recycle bin';
COMMENT ON COLUMN case_notes.deleted_at IS 'Timestamp when record was moved to recycle bin';
COMMENT ON COLUMN case_notes.deleted_by IS 'User who moved the record to recycle bin';
