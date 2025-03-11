-- Clear all users to allow fresh signup
-- First, delete all users from public.users
DELETE FROM public.users;

-- Then delete all users from auth.users
DELETE FROM auth.users;

-- Reset the auto-increment counter for users if needed
ALTER SEQUENCE IF EXISTS auth.users_id_seq RESTART WITH 1;

-- Create or replace the function to always create admin users
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  -- Insert into public.users table - always as admin
  INSERT INTO public.users (
    id,
    email,
    full_name,
    role,
    token_identifier,
    created_at
  ) VALUES (
    NEW.id,
    NEW.email,
    COALESCE(NEW.raw_user_meta_data->>'full_name', 'User'),
    'admin', -- Always set as admin
    NEW.id,
    NOW()
  );
  
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Create or replace the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW
  EXECUTE FUNCTION public.handle_new_user();
