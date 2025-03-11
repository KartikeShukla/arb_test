-- First add the role column to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS role TEXT DEFAULT 'client';

-- Now create the policies
-- Admin can view all users
DROP POLICY IF EXISTS "Admin can view all users" ON users;
CREATE POLICY "Admin can view all users"
  ON users FOR SELECT
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

-- Admin can create institutions
DROP POLICY IF EXISTS "Admin can create institutions" ON institutions;
CREATE POLICY "Admin can create institutions"
  ON institutions FOR INSERT
  WITH CHECK (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Admin can update institutions
DROP POLICY IF EXISTS "Admin can update institutions" ON institutions;
CREATE POLICY "Admin can update institutions"
  ON institutions FOR UPDATE
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Admin can delete institutions
DROP POLICY IF EXISTS "Admin can delete institutions" ON institutions;
CREATE POLICY "Admin can delete institutions"
  ON institutions FOR DELETE
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));

-- Institution admins can view their institution
DROP POLICY IF EXISTS "Institution admins can view their institution" ON institutions;
CREATE POLICY "Institution admins can view their institution"
  ON institutions FOR SELECT
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'institution' AND institution_id = institutions.id));

-- Admin can view all institutions
DROP POLICY IF EXISTS "Admin can view all institutions" ON institutions;
CREATE POLICY "Admin can view all institutions"
  ON institutions FOR SELECT
  USING (auth.uid() IN (SELECT id FROM users WHERE role = 'admin'));
