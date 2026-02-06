-- Analytics Tables Setup

-- Enquiries Table
CREATE TABLE IF NOT EXISTS enquiries (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    email TEXT,
    phone TEXT,
    message TEXT,
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    status TEXT DEFAULT 'new', -- new, contacted, closed
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Click Events Table (WhatsApp, Calls)
CREATE TABLE IF NOT EXISTS click_events (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    type TEXT NOT NULL, -- 'whatsapp', 'call'
    location TEXT, -- 'header', 'footer', 'product_page', 'contact_page'
    product_id UUID REFERENCES products(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Product Views Table
CREATE TABLE IF NOT EXISTS product_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    product_id UUID REFERENCES products(id) ON DELETE CASCADE,
    user_id UUID REFERENCES profiles(id) ON DELETE SET NULL, -- Optional, if logged in
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- Category Views Table
CREATE TABLE IF NOT EXISTS category_views (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    category_id UUID REFERENCES categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- RLS Policies

-- Enable RLS
ALTER TABLE enquiries ENABLE ROW LEVEL SECURITY;
ALTER TABLE click_events ENABLE ROW LEVEL SECURITY;
ALTER TABLE product_views ENABLE ROW LEVEL SECURITY;
ALTER TABLE category_views ENABLE ROW LEVEL SECURITY;

-- Enquiries Policies
CREATE POLICY "Public can insert enquiries" ON enquiries
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view enquiries" ON enquiries
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

CREATE POLICY "Admins can update enquiries" ON enquiries
    FOR UPDATE TO authenticated
    USING (public.is_admin(auth.uid()));

-- Click Events Policies
CREATE POLICY "Public can insert click events" ON click_events
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view click events" ON click_events
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

-- Product Views Policies
CREATE POLICY "Public can insert product views" ON product_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view product views" ON product_views
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

-- Category Views Policies
CREATE POLICY "Public can insert category views" ON category_views
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Admins can view category views" ON category_views
    FOR SELECT TO authenticated
    USING (public.is_admin(auth.uid()));

