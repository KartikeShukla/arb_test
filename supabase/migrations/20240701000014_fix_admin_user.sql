-- Create the admin user directly with proper password hashing
DO $$
DECLARE
  admin_user_id UUID;
  admin_email TEXT := 'kartikeshukla@gmail.com';
BEGIN
  -- Delete existing user if exists
  DELETE FROM auth.users WHERE email = admin_email;
  DELETE FROM public.users WHERE email = admin_email;
  
  -- Create new admin user with proper password
  INSERT INTO auth.users (
    id, 
    email, 
    raw_user_meta_data,
    raw_app_meta_data,
    encrypted_password,
    email_confirmed_at,
    created_at,
    updated_at,
    confirmation_token,
    recovery_token,
    aud
  ) VALUES (
    gen_random_uuid(), 
    admin_email,
    '{"full_name":"Admin User"}'::jsonb,
    '{"provider":"email","providers":["email"]}'::jsonb,
    crypt('Kartike@9889', gen_salt('bf')),
    now(),
    now(),
    now(),
    '',
    '',
    'authenticated'
  )
  RETURNING id INTO admin_user_id;
  
  -- Create the user in public.users with admin role
  INSERT INTO public.users (
    id, 
    email, 
    full_name, 
    role, 
    token_identifier, 
    created_at
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