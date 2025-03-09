-- Add user roles and institutions tables

-- Create institutions table if it doesn't exist
CREATE TABLE IF NOT EXISTS institutions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  email TEXT,
  phone TEXT,
  address TEXT,
  logo_url TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id),
  status TEXT DEFAULT 'active'
);

-- Add institution_id column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'institution_id') THEN
    ALTER TABLE users ADD COLUMN institution_id UUID REFERENCES institutions(id);
  END IF;
END $$;

-- Add role column to users table if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'client';
  END IF;
END $$;

-- Create cases table if it doesn't exist
CREATE TABLE IF NOT EXISTS cases (
  id TEXT PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT,
  status TEXT DEFAULT 'filed',
  type TEXT,
  filing_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  institution_id UUID REFERENCES institutions(id),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  created_by UUID REFERENCES auth.users(id)
);

-- Create case_participants table to link users to cases
CREATE TABLE IF NOT EXISTS case_participants (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  case_id TEXT REFERENCES cases(id),
  user_id UUID REFERENCES auth.users(id),
  role TEXT NOT NULL, -- 'arbitrator', 'client', 'legal_representative', etc.
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(case_id, user_id, role)
);

-- Update documents table to link to cases
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'documents' AND column_name = 'institution_id') THEN
    ALTER TABLE documents ADD COLUMN institution_id UUID REFERENCES institutions(id);
  END IF;
END $$;

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
