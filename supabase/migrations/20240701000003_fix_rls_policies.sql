-- Fix RLS policies for documents table

-- First, make sure RLS is enabled on the documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policies for the documents table
-- Allow authenticated users to insert their own documents
DROP POLICY IF EXISTS "Users can insert their own documents" ON documents;
CREATE POLICY "Users can insert their own documents" 
  ON documents FOR INSERT 
  WITH CHECK (auth.uid() = uploaded_by);

-- Allow users to select their own documents
DROP POLICY IF EXISTS "Users can select their own documents" ON documents;
CREATE POLICY "Users can select their own documents" 
  ON documents FOR SELECT 
  USING (auth.uid() = uploaded_by);

-- Allow users to update their own documents
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
CREATE POLICY "Users can update their own documents" 
  ON documents FOR UPDATE 
  USING (auth.uid() = uploaded_by);

-- Allow users to delete their own documents
DROP POLICY IF EXISTS "Users can delete their own documents" ON documents;
CREATE POLICY "Users can delete their own documents" 
  ON documents FOR DELETE 
  USING (auth.uid() = uploaded_by);

-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'user';
  END IF;
END $$;

-- Create a policy for the storage bucket
BEGIN;
  -- Enable RLS on the storage.objects table
  ALTER TABLE storage.objects ENABLE ROW LEVEL SECURITY;

  -- Allow authenticated users to upload files to the documents bucket
  DROP POLICY IF EXISTS "Allow authenticated uploads" ON storage.objects;
  CREATE POLICY "Allow authenticated uploads"
    ON storage.objects FOR INSERT
    WITH CHECK (bucket_id = 'documents' AND auth.role() = 'authenticated');

  -- Allow users to read files from the documents bucket
  DROP POLICY IF EXISTS "Allow authenticated reads" ON storage.objects;
  CREATE POLICY "Allow authenticated reads"
    ON storage.objects FOR SELECT
    USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

  -- Allow users to update their own files
  DROP POLICY IF EXISTS "Allow authenticated updates" ON storage.objects;
  CREATE POLICY "Allow authenticated updates"
    ON storage.objects FOR UPDATE
    USING (bucket_id = 'documents' AND auth.role() = 'authenticated');

  -- Allow users to delete their own files
  DROP POLICY IF EXISTS "Allow authenticated deletes" ON storage.objects;
  CREATE POLICY "Allow authenticated deletes"
    ON storage.objects FOR DELETE
    USING (bucket_id = 'documents' AND auth.role() = 'authenticated');
END;
