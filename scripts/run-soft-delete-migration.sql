-- Soft Delete Migration Script for TimeTracker Application
-- This script safely adds soft delete functionality to the clients table

-- Check if the deleted_at column already exists
DO $$
BEGIN
    -- Add deleted_at column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'deleted_at'
    ) THEN
        ALTER TABLE clients ADD COLUMN deleted_at TIMESTAMPTZ;
        RAISE NOTICE 'Added deleted_at column to clients table';
    ELSE
        RAISE NOTICE 'deleted_at column already exists in clients table';
    END IF;

    -- Add deleted_by column if it doesn't exist
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'deleted_by'
    ) THEN
        ALTER TABLE clients ADD COLUMN deleted_by TEXT;
        RAISE NOTICE 'Added deleted_by column to clients table';
    ELSE
        RAISE NOTICE 'deleted_by column already exists in clients table';
    END IF;
END $$;

-- Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_clients_deleted_at ON clients(deleted_at);
CREATE INDEX IF NOT EXISTS idx_clients_active ON clients(id) WHERE deleted_at IS NULL;

-- Create a view for active clients (not deleted)
CREATE OR REPLACE VIEW active_clients AS
SELECT * FROM clients WHERE deleted_at IS NULL;

-- Create a view for deleted clients
CREATE OR REPLACE VIEW deleted_clients AS
SELECT * FROM clients WHERE deleted_at IS NOT NULL;

-- Create a function to soft delete a client
CREATE OR REPLACE FUNCTION soft_delete_client(client_id UUID, deleted_by_user TEXT DEFAULT NULL)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE clients 
    SET 
        deleted_at = NOW(),
        deleted_by = COALESCE(deleted_by_user, 'system')
    WHERE id = client_id AND deleted_at IS NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create a function to restore a client
CREATE OR REPLACE FUNCTION restore_client(client_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    UPDATE clients 
    SET 
        deleted_at = NULL,
        deleted_by = NULL
    WHERE id = client_id AND deleted_at IS NOT NULL;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Create a function to permanently delete a client
CREATE OR REPLACE FUNCTION permanent_delete_client(client_id UUID)
RETURNS BOOLEAN AS $$
BEGIN
    -- First delete related case notes
    DELETE FROM case_notes WHERE client_id = client_id;
    
    -- Then delete the client
    DELETE FROM clients WHERE id = client_id;
    
    RETURN FOUND;
END;
$$ LANGUAGE plpgsql;

-- Update RLS policies to handle soft delete
-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view active clients" ON clients;
DROP POLICY IF EXISTS "Users can insert clients" ON clients;
DROP POLICY IF EXISTS "Users can update clients" ON clients;
DROP POLICY IF EXISTS "Users can soft delete clients" ON clients;

-- Create new policies that handle soft delete
CREATE POLICY "Users can view all clients" ON clients
    FOR SELECT USING (true);

CREATE POLICY "Users can insert clients" ON clients
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Users can update clients" ON clients
    FOR UPDATE USING (true);

-- Create a function to clean up old deleted records (optional)
CREATE OR REPLACE FUNCTION cleanup_old_deleted_clients(days_old INTEGER DEFAULT 30)
RETURNS INTEGER AS $$
DECLARE
    deleted_count INTEGER;
BEGIN
    -- Permanently delete clients that have been soft-deleted for more than specified days
    WITH deleted_clients AS (
        DELETE FROM clients 
        WHERE deleted_at IS NOT NULL 
        AND deleted_at < NOW() - INTERVAL '1 day' * days_old
        RETURNING id
    )
    SELECT COUNT(*) INTO deleted_count FROM deleted_clients;
    
    RETURN deleted_count;
END;
$$ LANGUAGE plpgsql;

-- Verification queries
DO $$
DECLARE
    deleted_at_exists BOOLEAN;
    deleted_by_exists BOOLEAN;
    active_view_exists BOOLEAN;
    deleted_view_exists BOOLEAN;
BEGIN
    -- Check if columns exist
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'deleted_at'
    ) INTO deleted_at_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_name = 'clients' AND column_name = 'deleted_by'
    ) INTO deleted_by_exists;
    
    -- Check if views exist
    SELECT EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_name = 'active_clients'
    ) INTO active_view_exists;
    
    SELECT EXISTS (
        SELECT 1 FROM information_schema.views 
        WHERE table_name = 'deleted_clients'
    ) INTO deleted_view_exists;
    
    -- Report results
    RAISE NOTICE '=== Soft Delete Migration Results ===';
    RAISE NOTICE 'deleted_at column: %', CASE WHEN deleted_at_exists THEN '✓ EXISTS' ELSE '✗ MISSING' END;
    RAISE NOTICE 'deleted_by column: %', CASE WHEN deleted_by_exists THEN '✓ EXISTS' ELSE '✗ MISSING' END;
    RAISE NOTICE 'active_clients view: %', CASE WHEN active_view_exists THEN '✓ EXISTS' ELSE '✗ MISSING' END;
    RAISE NOTICE 'deleted_clients view: %', CASE WHEN deleted_view_exists THEN '✓ EXISTS' ELSE '✗ MISSING' END;
    RAISE NOTICE '=====================================';
    
    IF deleted_at_exists AND deleted_by_exists AND active_view_exists AND deleted_view_exists THEN
        RAISE NOTICE '🎉 Soft delete migration completed successfully!';
        RAISE NOTICE 'You can now use the recycle bin feature in your application.';
    ELSE
        RAISE NOTICE '⚠️  Migration incomplete. Please check the errors above.';
    END IF;
END $$;

-- Test the functions (optional - comment out if not needed)
/*
-- Test soft delete function
SELECT soft_delete_client('00000000-0000-0000-0000-000000000000'::UUID, 'test_user');

-- Test restore function  
SELECT restore_client('00000000-0000-0000-0000-000000000000'::UUID);

-- Test views
SELECT COUNT(*) as active_count FROM active_clients;
SELECT COUNT(*) as deleted_count FROM deleted_clients;
*/

COMMIT;
