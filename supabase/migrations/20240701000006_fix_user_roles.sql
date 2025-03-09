-- Fix the user roles issue by first checking if the column exists

-- First, check if the users table exists
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
      role TEXT DEFAULT 'client'
    );
  END IF;
END $$;

-- Then add the role column if it doesn't exist
DO $$ 
BEGIN
  IF NOT EXISTS (SELECT 1 FROM information_schema.columns WHERE table_name = 'users' AND column_name = 'role') THEN
    ALTER TABLE users ADD COLUMN role TEXT DEFAULT 'client';
  END IF;
END $$;

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
