-- Fix RLS policies by using auth.uid() directly instead of referencing users.role

-- Enable RLS on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for institutions
-- Allow all authenticated users to view institutions
DROP POLICY IF EXISTS "Authenticated users can view institutions" ON institutions;
CREATE POLICY "Authenticated users can view institutions"
  ON institutions FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow all authenticated users to manage institutions (temporary for development)
DROP POLICY IF EXISTS "Authenticated users can manage institutions" ON institutions;
CREATE POLICY "Authenticated users can manage institutions"
  ON institutions
  USING (auth.role() = 'authenticated');

-- Create RLS policies for cases
-- Allow all authenticated users to view cases
DROP POLICY IF EXISTS "Authenticated users can view cases" ON cases;
CREATE POLICY "Authenticated users can view cases"
  ON cases FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow all authenticated users to manage cases (temporary for development)
DROP POLICY IF EXISTS "Authenticated users can manage cases" ON cases;
CREATE POLICY "Authenticated users can manage cases"
  ON cases
  USING (auth.role() = 'authenticated');

-- Create RLS policies for case_participants
-- Allow all authenticated users to view case participants
DROP POLICY IF EXISTS "Authenticated users can view case participants" ON case_participants;
CREATE POLICY "Authenticated users can view case participants"
  ON case_participants FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow all authenticated users to manage case participants (temporary for development)
DROP POLICY IF EXISTS "Authenticated users can manage case participants" ON case_participants;
CREATE POLICY "Authenticated users can manage case participants"
  ON case_participants
  USING (auth.role() = 'authenticated');

-- Update RLS policies for documents
-- Allow all authenticated users to view documents
DROP POLICY IF EXISTS "Authenticated users can view documents" ON documents;
CREATE POLICY "Authenticated users can view documents"
  ON documents FOR SELECT
  USING (auth.role() = 'authenticated');

-- Allow all authenticated users to manage documents (temporary for development)
DROP POLICY IF EXISTS "Authenticated users can manage documents" ON documents;
CREATE POLICY "Authenticated users can manage documents"
  ON documents
  USING (auth.role() = 'authenticated');
