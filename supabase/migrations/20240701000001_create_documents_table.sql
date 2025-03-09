-- Create documents table
CREATE TABLE IF NOT EXISTS documents (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  case_id TEXT NOT NULL,
  file_type TEXT NOT NULL,
  uploaded_by UUID NOT NULL,
  upload_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  file_size INTEGER NOT NULL,
  storage_path TEXT NOT NULL,
  version TEXT DEFAULT '1.0',
  status TEXT DEFAULT 'Active'
);

-- Enable row level security
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Create policy for all users to view documents
DROP POLICY IF EXISTS "Users can view documents" ON documents;
CREATE POLICY "Users can view documents"
  ON documents FOR SELECT
  USING (true);

-- Create policy for authenticated users to insert documents
DROP POLICY IF EXISTS "Authenticated users can insert documents" ON documents;
CREATE POLICY "Authenticated users can insert documents"
  ON documents FOR INSERT
  WITH CHECK (auth.uid() IS NOT NULL);

-- Create policy for users to update their own documents
DROP POLICY IF EXISTS "Users can update their own documents" ON documents;
CREATE POLICY "Users can update their own documents"
  ON documents FOR UPDATE
  USING (auth.uid() = uploaded_by);

-- Add to realtime publication
alter publication supabase_realtime add table documents;
