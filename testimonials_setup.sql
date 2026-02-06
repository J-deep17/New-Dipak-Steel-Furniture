-- Create testimonials table
CREATE TABLE IF NOT EXISTS public.testimonials (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name TEXT NOT NULL,
    designation TEXT,
    company TEXT,
    city TEXT,
    review_text TEXT NOT NULL,
    rating INTEGER DEFAULT 5,
    photo_url TEXT,
    show_on_home BOOLEAN DEFAULT true,
    display_order INTEGER DEFAULT 0,
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Enable RLS
ALTER TABLE public.testimonials ENABLE ROW LEVEL SECURITY;

-- Policies
CREATE POLICY "Public can view active testimonials" 
ON public.testimonials 
FOR SELECT 
USING (active = true AND show_on_home = true);

CREATE POLICY "Admins can manage testimonials" 
ON public.testimonials 
FOR ALL 
USING (
  auth.uid() IN (
    SELECT id FROM public.profiles WHERE role = 'admin'
  )
);

-- Grant permissions (optional, depending on default setup)
GRANT ALL ON public.testimonials TO postgres;
GRANT ALL ON public.testimonials TO service_role;
GRANT SELECT ON public.testimonials TO anon;
GRANT SELECT ON public.testimonials TO authenticated;
