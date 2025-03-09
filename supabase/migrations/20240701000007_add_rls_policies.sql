-- Add RLS policies after ensuring tables and columns exist

-- Enable RLS on all tables
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_participants ENABLE ROW LEVEL SECURITY;

-- Create RLS policies for institutions
-- Admin can do anything with institutions
DROP POLICY IF EXISTS "Admins can manage institutions" ON institutions;
CREATE POLICY "Admins can manage institutions"
  ON institutions
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution users can view their own institution
DROP POLICY IF EXISTS "Institution users can view their own institution" ON institutions;
CREATE POLICY "Institution users can view their own institution"
  ON institutions FOR SELECT
  USING (id IN (SELECT institution_id FROM users WHERE users.id = auth.uid()));

-- Create RLS policies for cases
-- Admin can do anything with cases
DROP POLICY IF EXISTS "Admins can manage cases" ON cases;
CREATE POLICY "Admins can manage cases"
  ON cases
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution users can manage cases for their institution
DROP POLICY IF EXISTS "Institution users can manage their cases" ON cases;
CREATE POLICY "Institution users can manage their cases"
  ON cases
  USING (institution_id IN (SELECT institution_id FROM users WHERE users.id = auth.uid() AND users.role = 'institution'));

-- Arbitrators and clients can view cases they are participants in
DROP POLICY IF EXISTS "Users can view cases they participate in" ON cases;
CREATE POLICY "Users can view cases they participate in"
  ON cases FOR SELECT
  USING (id IN (SELECT case_id FROM case_participants WHERE user_id = auth.uid()));

-- Create RLS policies for case_participants
-- Admin can do anything with case participants
DROP POLICY IF EXISTS "Admins can manage case participants" ON case_participants;
CREATE POLICY "Admins can manage case participants"
  ON case_participants
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution users can manage participants for their institution's cases
DROP POLICY IF EXISTS "Institution users can manage case participants" ON case_participants;
CREATE POLICY "Institution users can manage case participants"
  ON case_participants
  USING (case_id IN (
    SELECT id FROM cases WHERE institution_id IN (
      SELECT institution_id FROM users WHERE users.id = auth.uid() AND users.role = 'institution'
    )
  ));

-- Users can view their own participation
DROP POLICY IF EXISTS "Users can view their own participation" ON case_participants;
CREATE POLICY "Users can view their own participation"
  ON case_participants FOR SELECT
  USING (user_id = auth.uid());

-- Update RLS policies for documents
-- Admin can do anything with documents
DROP POLICY IF EXISTS "Admins can manage documents" ON documents;
CREATE POLICY "Admins can manage documents"
  ON documents
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution users can manage documents for their institution
DROP POLICY IF EXISTS "Institution users can manage their documents" ON documents;
CREATE POLICY "Institution users can manage their documents"
  ON documents
  USING (institution_id IN (SELECT institution_id FROM users WHERE users.id = auth.uid() AND users.role = 'institution'));

-- Users can view documents for cases they participate in
DROP POLICY IF EXISTS "Users can view documents for their cases" ON documents;
CREATE POLICY "Users can view documents for their cases"
  ON documents FOR SELECT
  USING (case_id IN (SELECT case_id FROM case_participants WHERE user_id = auth.uid()));

-- Users can upload documents for cases they participate in
DROP POLICY IF EXISTS "Users can upload documents for their cases" ON documents;
CREATE POLICY "Users can upload documents for their cases"
  ON documents FOR INSERT
  WITH CHECK (case_id IN (SELECT case_id FROM case_participants WHERE user_id = auth.uid()));

-- Allow all users to upload documents (temporary for development)
DROP POLICY IF EXISTS "Allow all users to upload documents" ON documents;
CREATE POLICY "Allow all users to upload documents"
  ON documents FOR INSERT
  WITH CHECK (auth.role() = 'authenticated');

-- Allow all users to view documents (temporary for development)
DROP POLICY IF EXISTS "Allow all users to view documents" ON documents;
CREATE POLICY "Allow all users to view documents"
  ON documents FOR SELECT
  USING (true);
