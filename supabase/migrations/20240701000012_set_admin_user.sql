-- First check if the user exists in auth.users
DO $$
DECLARE
  user_id_var UUID;
BEGIN
  -- Get the user ID from auth.users
  SELECT id INTO user_id_var FROM auth.users WHERE email = 'kartikeshukla@gmail.com';
  
  IF user_id_var IS NULL THEN
    -- User doesn't exist in auth.users, so we can't set them as admin
    RAISE NOTICE 'User with email kartikeshukla@gmail.com not found in auth.users';
  ELSE
    -- Check if user exists in public.users
    IF EXISTS (SELECT 1 FROM public.users WHERE id = user_id_var) THEN
      -- Update existing user to admin role
      UPDATE public.users
      SET role = 'admin'
      WHERE id = user_id_var;
      
      RAISE NOTICE 'User kartikeshukla@gmail.com updated to admin role';
    ELSE
      -- Insert new record in public.users with admin role
      INSERT INTO public.users (id, email, role, token_identifier, created_at)
      VALUES (user_id_var, 'kartikeshukla@gmail.com', 'admin', user_id_var, NOW());
      
      RAISE NOTICE 'User kartikeshukla@gmail.com added as admin';
    END IF;
  END IF;
END $$;