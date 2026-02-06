
-- Replace 'YOUR_EMAIL_HERE' with your email address used to sign up
DO $$
DECLARE
  target_email text := 'dipaksteel@gmail.com';
  user_record record;
BEGIN
  SELECT id INTO user_record FROM auth.users WHERE email = target_email;
  
  IF user_record.id IS NOT NULL THEN
    INSERT INTO public.profiles (id, role)
    VALUES (user_record.id, 'admin')
    ON CONFLICT (id) DO UPDATE SET role = 'admin';
    RAISE NOTICE 'User % promoted to admin.', target_email;
  ELSE
    RAISE WARNING 'User % not found. Please sign up first.', target_email;
  END IF;
END $$;
