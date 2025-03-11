-- Add RLS policies for users table
ALTER TABLE users ENABLE ROW LEVEL SECURITY;

-- Admin can do anything
DROP POLICY IF EXISTS "Admin can do anything" ON users;
CREATE POLICY "Admin can do anything"
  ON users
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Institution admins can view users in their institution
DROP POLICY IF EXISTS "Institution admins can view their users" ON users;
CREATE POLICY "Institution admins can view their users"
  ON users FOR SELECT
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'institution' AND institution_id = users.institution_id));

-- Users can view their own data
DROP POLICY IF EXISTS "Users can view own data" ON users;
CREATE POLICY "Users can view own data"
  ON users FOR SELECT
  USING (auth.uid() = id);

-- Add RLS policies for institutions table
ALTER TABLE institutions ENABLE ROW LEVEL SECURITY;

-- Admin can do anything with institutions
DROP POLICY IF EXISTS "Admin can do anything with institutions" ON institutions;
CREATE POLICY "Admin can do anything with institutions"
  ON institutions
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Institution admins can view their institution
DROP POLICY IF EXISTS "Institution admins can view their institution" ON institutions;
CREATE POLICY "Institution admins can view their institution"
  ON institutions FOR SELECT
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'institution' AND institution_id = institutions.id));

-- Add RLS policies for documents table
ALTER TABLE documents ENABLE ROW LEVEL SECURITY;

-- Admin can do anything with documents
DROP POLICY IF EXISTS "Admin can do anything with documents" ON documents;
CREATE POLICY "Admin can do anything with documents"
  ON documents
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Institution users can access documents for their institution
DROP POLICY IF EXISTS "Institution users can access their documents" ON documents;
CREATE POLICY "Institution users can access their documents"
  ON documents
  USING (
    auth.uid() IN (
      SELECT id FROM users 
      WHERE institution_id = documents.institution_id
    )
  );

-- Users can access documents they uploaded
DROP POLICY IF EXISTS "Users can access documents they uploaded" ON documents;
CREATE POLICY "Users can access documents they uploaded"
  ON documents
  USING (auth.uid() = uploaded_by);
