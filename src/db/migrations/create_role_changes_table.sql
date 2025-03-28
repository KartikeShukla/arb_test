-- Create role_changes table for tracking role change events
CREATE TABLE IF NOT EXISTS public.role_changes (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid NOT NULL,
  email text,
  new_role text NOT NULL,
  updated_by uuid NOT NULL,
  created_at timestamp with time zone DEFAULT now(),
  processed boolean DEFAULT false
);

-- Add comment for documentation
COMMENT ON TABLE public.role_changes IS 'Table to track role change events for users';

-- Create index for faster lookups by user_id
CREATE INDEX IF NOT EXISTS idx_role_changes_user_id ON public.role_changes(user_id);

-- Enable RLS on the table
ALTER TABLE public.role_changes ENABLE ROW LEVEL SECURITY;

-- Create policy to allow anyone to select from role_changes
CREATE POLICY role_changes_select_policy ON public.role_changes
  FOR SELECT USING (true);

-- Create policy to allow authenticated users to insert into role_changes
CREATE POLICY role_changes_insert_policy ON public.role_changes
  FOR INSERT WITH CHECK (auth.role() = 'authenticated'); 