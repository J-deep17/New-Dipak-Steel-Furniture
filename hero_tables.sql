-- Hero Banners Table (if not exists)
-- Run this in Supabase SQL Editor

-- Check if hero_banners table exists, create if not
CREATE TABLE IF NOT EXISTS public.hero_banners (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    title TEXT,
    subtitle TEXT,
    media_url TEXT,
    media_type TEXT DEFAULT 'image' CHECK (media_type IN ('image', 'video')),
    primary_button_text TEXT,
    primary_button_link TEXT,
    secondary_button_text TEXT,
    secondary_button_link TEXT,
    text_position TEXT DEFAULT 'left' CHECK (text_position IN ('left', 'center', 'right')),
    overlay_opacity DECIMAL(3,2) DEFAULT 0.3,
    is_active BOOLEAN DEFAULT true,
    order_index INTEGER DEFAULT 0,
    advance_after_video BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Hero Settings Table
CREATE TABLE IF NOT EXISTS public.hero_settings (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    autoplay BOOLEAN DEFAULT true,
    autoplay_interval INTEGER DEFAULT 5000,
    show_arrows BOOLEAN DEFAULT true,
    show_dots BOOLEAN DEFAULT true,
    pause_on_hover BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.hero_banners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.hero_settings ENABLE ROW LEVEL SECURITY;

-- RLS Policies for hero_banners
DROP POLICY IF EXISTS "Anyone can read active hero banners" ON public.hero_banners;
CREATE POLICY "Anyone can read active hero banners" ON public.hero_banners
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage hero banners" ON public.hero_banners;
CREATE POLICY "Admins can manage hero banners" ON public.hero_banners
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- RLS Policies for hero_settings
DROP POLICY IF EXISTS "Anyone can read hero settings" ON public.hero_settings;
CREATE POLICY "Anyone can read hero settings" ON public.hero_settings
    FOR SELECT USING (true);

DROP POLICY IF EXISTS "Admins can manage hero settings" ON public.hero_settings;
CREATE POLICY "Admins can manage hero settings" ON public.hero_settings
    FOR ALL USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default hero settings (if not exists)
INSERT INTO public.hero_settings (autoplay, autoplay_interval, show_arrows, show_dots, pause_on_hover)
SELECT true, 5000, true, true, true
WHERE NOT EXISTS (SELECT 1 FROM public.hero_settings);

-- Insert default hero banner (if no banners exist)
INSERT INTO public.hero_banners (
    title,
    subtitle,
    media_url,
    media_type,
    primary_button_text,
    primary_button_link,
    secondary_button_text,
    secondary_button_link,
    text_position,
    overlay_opacity,
    is_active,
    order_index
)
SELECT
    'Premium Office Furniture Manufacturer',
    'Quality furniture for modern workspaces. Ergonomic chairs, executive desks, and storage solutions.',
    'https://images.unsplash.com/photo-1497366216548-37526070297c?w=1920&q=80',
    'image',
    'Browse Products',
    '/products',
    'Get a Quote',
    '/contact',
    'left',
    0.4,
    true,
    0
WHERE NOT EXISTS (SELECT 1 FROM public.hero_banners);
