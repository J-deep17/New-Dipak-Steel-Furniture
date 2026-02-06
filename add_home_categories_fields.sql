
-- Add show_on_home and home_order columns to categories table
ALTER TABLE public.categories 
ADD COLUMN IF NOT EXISTS show_on_home BOOLEAN DEFAULT false,
ADD COLUMN IF NOT EXISTS home_order INTEGER;

-- Create an index for faster querying of home categories
CREATE INDEX IF NOT EXISTS idx_categories_show_on_home ON public.categories (show_on_home);
CREATE INDEX IF NOT EXISTS idx_categories_home_order ON public.categories (home_order);

-- Update RLS policies if necessary (assuming existing policies cover update for admin)
-- Just in case, ensure policies exist (though we assume they do from previous context)
