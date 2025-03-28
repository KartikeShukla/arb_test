-- Create a function to create the user_roles table if it doesn't exist
CREATE OR REPLACE FUNCTION public.create_user_roles_table()
RETURNS void AS $$
BEGIN
  -- Check if the table exists first
  IF NOT EXISTS (
    SELECT FROM information_schema.tables 
    WHERE table_schema = 'public'
    AND table_name = 'user_roles'
  ) THEN
    -- Create the table
    CREATE TABLE public.user_roles (
      id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
      user_id uuid NOT NULL UNIQUE,
      role text NOT NULL,
      created_at timestamp with time zone DEFAULT now(),
      updated_at timestamp with time zone DEFAULT now()
    );
    
    -- Add comment for documentation
    COMMENT ON TABLE public.user_roles IS 'Table to store user roles';
    
    -- Create index for faster lookups by user_id
    CREATE INDEX idx_user_roles_user_id ON public.user_roles(user_id);
    
    -- Enable RLS on the table
    ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
    
    -- Create policy to allow anyone to select from user_roles
    CREATE POLICY user_roles_select_policy ON public.user_roles
      FOR SELECT USING (true);
    
    -- Create policy to allow authenticated users to insert into user_roles
    CREATE POLICY user_roles_insert_policy ON public.user_roles
      FOR INSERT WITH CHECK (auth.role() = 'authenticated');
    
    -- Create policy to allow service role to update any role
    CREATE POLICY user_roles_service_update_policy ON public.user_roles
      FOR UPDATE USING (auth.jwt() ? 'service_role');
      
    RAISE NOTICE 'Created user_roles table and RLS policies';
  ELSE
    RAISE NOTICE 'user_roles table already exists, skipping creation';
  END IF;
END;
$$ LANGUAGE plpgsql; 