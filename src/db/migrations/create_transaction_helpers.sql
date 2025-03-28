-- Create transaction helper functions for use with Supabase client
-- These allow us to manage transactions from the API

-- Function to begin a transaction
CREATE OR REPLACE FUNCTION public.begin_transaction()
RETURNS void AS $$
BEGIN
  -- Start transaction
  BEGIN;
END;
$$ LANGUAGE plpgsql;

-- Function to commit a transaction
CREATE OR REPLACE FUNCTION public.commit_transaction()
RETURNS void AS $$
BEGIN
  -- Commit transaction
  COMMIT;
END;
$$ LANGUAGE plpgsql;

-- Function to rollback a transaction
CREATE OR REPLACE FUNCTION public.rollback_transaction()
RETURNS void AS $$
BEGIN
  -- Rollback transaction
  ROLLBACK;
END;
$$ LANGUAGE plpgsql; 