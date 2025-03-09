-- Fix role-based permissions and implement proper data isolation

-- First, ensure users table has the necessary columns
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'users') THEN
    CREATE TABLE users (
      id UUID PRIMARY KEY REFERENCES auth.users(id),
      name TEXT,
      full_name TEXT,
      email TEXT,
      user_id TEXT,
      token_identifier TEXT,
      created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
      role TEXT DEFAULT 'client',
      institution_id UUID
    );
  END IF;
END $$;

-- Add role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'client';
  END IF;
END $$;

-- Add institution_id column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'institution_id') THEN
    ALTER TABLE users ADD COLUMN institution_id UUID REFERENCES institutions(id);
  END IF;
END $$;

-- Create arbitrator_client_assignments table to manage assignments
CREATE TABLE IF NOT EXISTS arbitrator_client_assignments (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  arbitrator_id UUID REFERENCES auth.users(id),
  client_id UUID REFERENCES auth.users(id),
  institution_id UUID REFERENCES institutions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  UNIQUE(arbitrator_id, client_id, institution_id)
);

-- Enable RLS on all tables
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;
ALTER TABLE cases ENABLE ROW LEVEL SECURITY;
ALTER TABLE case_participants ENABLE ROW LEVEL SECURITY;
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE arbitrator_client_assignments ENABLE ROW LEVEL SECURITY;

-- Clear existing policies
DROP POLICY IF EXISTS "Authenticated users can view institutions" ON institutions;
DROP POLICY IF EXISTS "Authenticated users can manage institutions" ON institutions;
DROP POLICY IF EXISTS "Authenticated users can view cases" ON cases;
DROP POLICY IF EXISTS "Authenticated users can manage cases" ON cases;
DROP POLICY IF EXISTS "Authenticated users can view case participants" ON case_participants;
DROP POLICY IF EXISTS "Authenticated users can manage case participants" ON case_participants;
DROP POLICY IF EXISTS "Authenticated users can view documents" ON documents;
DROP POLICY IF EXISTS "Authenticated users can manage documents" ON documents;

-- Create RLS policies for users table
-- Admin can view all users
CREATE POLICY "Admin can view all users"
  ON users FOR SELECT
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Admin can create and update users
CREATE POLICY "Admin can create and update users"
  ON users FOR INSERT
  WITH CHECK (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

CREATE POLICY "Admin can update users"
  ON users FOR UPDATE
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution can view their own users
CREATE POLICY "Institution can view their own users"
  ON users FOR SELECT
  USING (
    (users.institution_id IN (SELECT institution_id FROM users WHERE users.id = auth.uid() AND users.role = 'institution')) OR
    (users.id = auth.uid())
  );

-- Institution can create and update their own users
CREATE POLICY "Institution can create their own users"
  ON users FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'institution' AND 
      NEW.institution_id = users.institution_id
    )
  );

CREATE POLICY "Institution can update their own users"
  ON users FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'institution' AND 
      users.institution_id = OLD.institution_id
    )
  );

-- Users can view their own profile
CREATE POLICY "Users can view their own profile"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Create RLS policies for institutions table
-- Admin can manage all institutions
CREATE POLICY "Admin can manage institutions"
  ON institutions
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution users can view their own institution
CREATE POLICY "Institution users can view their own institution"
  ON institutions FOR SELECT
  USING (id IN (SELECT institution_id FROM users WHERE users.id = auth.uid()));

-- Create RLS policies for cases table
-- Admin can manage all cases
CREATE POLICY "Admin can manage all cases"
  ON cases
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution can manage their own cases
CREATE POLICY "Institution can manage their own cases"
  ON cases
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'institution' AND 
      users.institution_id = cases.institution_id
    )
  );

-- Arbitrators can view cases they are assigned to
CREATE POLICY "Arbitrators can view their assigned cases"
  ON cases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM case_participants 
      WHERE case_participants.case_id = cases.id AND 
      case_participants.user_id = auth.uid() AND 
      case_participants.role = 'arbitrator'
    )
  );

-- Clients can view their own cases
CREATE POLICY "Clients can view their own cases"
  ON cases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM case_participants 
      WHERE case_participants.case_id = cases.id AND 
      case_participants.user_id = auth.uid() AND 
      case_participants.role = 'client'
    )
  );

-- Create RLS policies for case_participants table
-- Admin can manage all case participants
CREATE POLICY "Admin can manage all case participants"
  ON case_participants
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution can manage their own case participants
CREATE POLICY "Institution can manage their own case participants"
  ON case_participants
  USING (
    EXISTS (
      SELECT 1 FROM users 
      JOIN cases ON cases.institution_id = users.institution_id
      WHERE users.id = auth.uid() AND users.role = 'institution' AND 
      cases.id = case_participants.case_id
    )
  );

-- Users can view their own participation
CREATE POLICY "Users can view their own participation"
  ON case_participants FOR SELECT
  USING (user_id = auth.uid());

-- Create RLS policies for documents table
-- Admin can manage all documents
CREATE POLICY "Admin can manage all documents"
  ON documents
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution can manage their own documents
CREATE POLICY "Institution can manage their own documents"
  ON documents
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'institution' AND 
      users.institution_id = documents.institution_id
    )
  );

-- Arbitrators and clients can view documents for cases they participate in
CREATE POLICY "Users can view documents for their cases"
  ON documents FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM case_participants 
      WHERE case_participants.case_id = documents.case_id AND 
      case_participants.user_id = auth.uid()
    )
  );

-- Arbitrators and clients can upload documents for cases they participate in
CREATE POLICY "Users can upload documents for their cases"
  ON documents FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM case_participants 
      WHERE case_participants.case_id = NEW.case_id AND 
      case_participants.user_id = auth.uid()
    )
  );

-- Create RLS policies for arbitrator_client_assignments table
-- Admin can manage all assignments
CREATE POLICY "Admin can manage all assignments"
  ON arbitrator_client_assignments
  USING (EXISTS (SELECT 1 FROM users WHERE users.id = auth.uid() AND users.role = 'admin'));

-- Institution can manage their own assignments
CREATE POLICY "Institution can manage their own assignments"
  ON arbitrator_client_assignments
  USING (
    EXISTS (
      SELECT 1 FROM users 
      WHERE users.id = auth.uid() AND users.role = 'institution' AND 
      users.institution_id = arbitrator_client_assignments.institution_id
    )
  );

-- Arbitrators can view their own assignments
CREATE POLICY "Arbitrators can view their own assignments"
  ON arbitrator_client_assignments FOR SELECT
  USING (arbitrator_id = auth.uid());

-- Clients can view their own assignments
CREATE POLICY "Clients can view their own assignments"
  ON arbitrator_client_assignments FOR SELECT
  USING (client_id = auth.uid());
