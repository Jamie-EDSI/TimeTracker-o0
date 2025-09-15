-- Add soft delete columns to clients table
ALTER TABLE clients 
ADD COLUMN IF NOT EXISTS deleted_at TIMESTAMPTZ,
ADD COLUMN IF NOT EXISTS deleted_by TEXT;

-- Create index for better performance on deleted records queries
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at);

-- Create view for active (non-deleted) clients
CREATE OR REPLACE VIEW active_clients AS
SELECT * FROM clients WHERE deleted_at IS NULL;

-- Create view for deleted clients
CREATE OR REPLACE VIEW deleted_clients AS
SELECT * FROM clients WHERE deleted_at IS NOT NULL;
