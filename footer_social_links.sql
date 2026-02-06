-- Create footer_social_links table
CREATE TABLE IF NOT EXISTS public.footer_social_links (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    platform TEXT NOT NULL,
    icon TEXT NOT NULL,
    url TEXT NOT NULL,
    is_active BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.footer_social_links ENABLE ROW LEVEL SECURITY;

-- Policy: Public can read active links
CREATE POLICY "Public can read active footer links" 
ON public.footer_social_links 
FOR SELECT 
USING (is_active = true);

-- Policy: Admin can do everything
-- Assuming 'admin' role check is done via profile or app_metadata. 
-- For now, verifying against profiles table or simply checking if user is authenticated and has admin claim if simpler.
-- Based on previous artifacts, we check profile role.
CREATE POLICY "Admins can manage footer links" 
ON public.footer_social_links 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);
