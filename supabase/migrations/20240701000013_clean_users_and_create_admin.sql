-- First, delete all existing users from public.users table
DELETE FROM public.users;

-- Create the admin user in auth.users if it doesn't exist
DO $$
DECLARE
  admin_user_id UUID;
  admin_email TEXT := 'kartikeshukla@gmail.com';
  admin_password TEXT := 'Kartike@9889';
BEGIN
  -- Check if user already exists in auth.users
  SELECT id INTO admin_user_id FROM auth.users WHERE email = admin_email;
  
  IF admin_user_id IS NULL THEN
    -- Create the user in auth.users
    admin_user_id := gen_random_uuid();
    
    INSERT INTO auth.users (
      id, email, encrypted_password, email_confirmed_at, 
      raw_app_meta_data, raw_user_meta_data, created_at, updated_at
    ) VALUES (
      admin_user_id, 
      admin_email,
      crypt(admin_password, gen_salt('bf')),
      now(),
      '{"provider":"email","providers":["email"]}'::jsonb,
      '{"full_name":"Admin User"}'::jsonb,
      now(),
      now()
    );
  END IF;
  
  -- Create or update the user in public.users with admin role
  INSERT INTO public.users (
    id, email, full_name, role, token_identifier, created_at
  ) VALUES (
    admin_user_id,
    admin_email,
    'Admin User',
    'admin',
    admin_user_id,
    now()
  );
  
  RAISE NOTICE 'Admin user created with email: %', admin_email;
END $$;
