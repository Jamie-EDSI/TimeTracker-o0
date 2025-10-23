-- Add soft delete columns to clients table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='deleted_at') THEN
        ALTER TABLE clients ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
        CREATE INDEX idx_clients_deleted_at ON clients(deleted_at);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='clients' AND column_name='deleted_by') THEN
        ALTER TABLE clients ADD COLUMN deleted_by TEXT;
    END IF;
END $$;

-- Add soft delete columns to case_notes table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='case_notes' AND column_name='deleted_at') THEN
        ALTER TABLE case_notes ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
        CREATE INDEX idx_case_notes_deleted_at ON case_notes(deleted_at);
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='case_notes' AND column_name='deleted_by') THEN
        ALTER TABLE case_notes ADD COLUMN deleted_by TEXT;
    END IF;
END $$;

-- Add soft delete columns to client_files table if they don't exist
DO $$ 
BEGIN
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='client_files' AND column_name='deleted_at') THEN
        ALTER TABLE client_files ADD COLUMN deleted_at TIMESTAMP WITH TIME ZONE;
    END IF;
    
    IF NOT EXISTS (SELECT 1 FROM information_schema.columns 
                   WHERE table_name='client_files' AND column_name='deleted_by') THEN
        ALTER TABLE client_files ADD COLUMN deleted_by TEXT;
    END IF;
END $$;
