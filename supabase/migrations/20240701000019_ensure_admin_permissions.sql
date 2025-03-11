-- Ensure the admin user with email kartikeshukla@gmail.com has the correct role and permissions

-- First, check if the user exists in auth.users
DO $$
DECLARE
  user_id UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_id FROM auth.users WHERE email = 'kartikeshukla@gmail.com';
  
  IF user_id IS NOT NULL THEN
    -- Update the user's role in public.users to 'admin' if it exists
    UPDATE public.users
    SET role = 'admin'
    WHERE id = user_id;
    
    -- If the user doesn't exist in public.users, insert them
    IF NOT FOUND THEN
      INSERT INTO public.users (id, email, role, full_name, created_at)
      VALUES (
        user_id,
        'kartikeshukla@gmail.com',
        'admin',
        'Admin User',
        NOW()
      );
    END IF;
    
    RAISE NOTICE 'Admin permissions set for user with email kartikeshukla@gmail.com';
  ELSE
    RAISE NOTICE 'User with email kartikeshukla@gmail.com not found in auth.users';
  END IF;
END;
$$;
