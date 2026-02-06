-- CMS Pages Table Migration
-- Run this in Supabase SQL Editor

-- Create the cms_pages table
CREATE TABLE IF NOT EXISTS public.cms_pages (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    page_key TEXT UNIQUE NOT NULL,
    content JSONB NOT NULL DEFAULT '{}',
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS
ALTER TABLE public.cms_pages ENABLE ROW LEVEL SECURITY;

-- Allow anyone to read CMS pages (public content)
CREATE POLICY "Anyone can read CMS pages" ON public.cms_pages
    FOR SELECT USING (true);

-- Only admins can update CMS pages
CREATE POLICY "Admins can update CMS pages" ON public.cms_pages
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Only admins can insert CMS pages
CREATE POLICY "Admins can insert CMS pages" ON public.cms_pages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM public.profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Insert default content for each page
INSERT INTO public.cms_pages (page_key, content) VALUES
('about_page', '{
    "hero": {
        "heading": "About Dipak Furniture – Office Furniture Manufacturer Since 1998",
        "subheading": "Crafting premium office and institutional furniture for Indian workspaces for over 25 years."
    },
    "who_we_are": {
        "heading": "Who We Are",
        "paragraph1": "<strong>Dipak Furniture</strong> is a leading <strong>office furniture manufacturer in Ahmedabad</strong>, Gujarat, with over 25 years of experience in crafting premium quality furniture for offices, educational institutions, healthcare facilities, and government organizations across India. As a trusted <strong>office chair manufacturer</strong>, we specialize in ergonomic seating solutions designed for comfort during long working hours.",
        "paragraph2": "Our state-of-the-art manufacturing facility combines traditional craftsmanship with modern technology to produce furniture that meets the highest standards of quality, durability, and comfort. Every piece that leaves our factory undergoes rigorous quality checks to ensure it meets our exacting standards. We are proud to be a <strong>wholesale office furniture supplier</strong> serving businesses of all sizes.",
        "paragraph3": "We believe that great furniture can transform spaces and improve productivity. That''s why we focus on ergonomic design, premium materials, and attention to detail in everything we create. Whether you need <strong>executive office chairs</strong>, <strong>mesh task chairs</strong>, <strong>steel almirahs</strong>, or <strong>school furniture</strong>, Dipak Furniture has you covered."
    },
    "vision": {
        "title": "Our Vision",
        "description": "To be India''s most trusted office furniture brand, known for transforming workspaces with ergonomic, sustainable, and beautifully designed furniture that enhances productivity and well-being."
    },
    "mission": {
        "title": "Our Mission",
        "description": "To design and manufacture furniture that combines comfort, durability, and aesthetics while maintaining affordable pricing and exceptional customer service. We aim to support Indian businesses with products made for Indian workspaces."
    },
    "core_values": [
        {"title": "Integrity", "description": "Honest dealings and transparent business practices in every interaction."},
        {"title": "Quality", "description": "Uncompromising standards in materials, craftsmanship, and finish."},
        {"title": "Customer Focus", "description": "Your satisfaction is our primary measure of success."},
        {"title": "Innovation", "description": "Continuously improving designs for better comfort and functionality."}
    ],
    "manufacturing": {
        "heading": "Manufacturing Excellence in Ahmedabad",
        "description": "Our manufacturing facility in Ahmedabad is equipped with modern machinery and staffed by skilled craftsmen who bring decades of experience to every piece of furniture. We use premium-grade materials sourced from trusted suppliers, ensuring durability and longevity in all our products.",
        "stats": [
            {"value": "25+", "label": "Years of Experience"},
            {"value": "10,000+", "label": "Satisfied Clients"},
            {"value": "50,000+", "label": "Products Delivered"}
        ]
    },
    "cta": {
        "heading": "Ready to Furnish Your Workspace?",
        "subheading": "Contact us for personalized recommendations and competitive quotes on bulk orders."
    }
}'::jsonb),
('philosophy_page', '{
    "hero": {
        "heading": "Our Design Philosophy – Ergonomic Office Furniture",
        "subheading": "Where sustainability meets ergonomics for smarter, healthier workspaces. Office furniture designed for <strong>long working hours</strong>."
    },
    "eco_ergo": {
        "description": "Our design philosophy combines eco-friendly materials with ergonomic engineering to create furniture that''s good for you and good for the planet. The <strong>best ergonomic office chairs</strong> for Indian workplaces."
    },
    "eco_design": {
        "heading": "Eco-Conscious Design",
        "points": [
            "Sustainable materials sourced from responsible suppliers",
            "Low-VOC finishes and environmentally safe adhesives",
            "Durable construction that reduces replacement frequency",
            "Recyclable components and minimal packaging waste"
        ]
    },
    "ergo_design": {
        "heading": "Ergonomic Excellence – Best Office Chairs for Long Hours",
        "points": [
            "Scientifically designed for proper posture support",
            "Adjustable features to accommodate different body types",
            "Lumbar support and pressure distribution for all-day comfort",
            "Reduces fatigue and prevents work-related strain injuries"
        ]
    },
    "indian_workspaces": {
        "heading": "Designed for Indian Workspaces",
        "paragraph1": "Indian offices face unique challenges – varied climate conditions, diverse body types, and the need for furniture that withstands heavy use while remaining budget-friendly.",
        "paragraph2": "Our <strong>ergonomic office chairs</strong> are specifically engineered for these conditions. From the humidity-resistant finishes to the robust construction that handles high-traffic environments, every detail is considered for the Indian workplace.",
        "paragraph3": "Whether it''s a startup in Bangalore, a school in Bihar, or a corporate office in Mumbai – our furniture is built to perform in any Indian setting.",
        "stats": [
            {"value": "28+", "label": "States Served"},
            {"value": "All Climates", "label": "Tested & Proven"},
            {"value": "ISO", "label": "Quality Standards"},
            {"value": "5 Year", "label": "Warranty Support"}
        ]
    }
}'::jsonb),
('materials_page', '{
    "hero": {
        "heading": "Premium Materials & Finishes for Office Furniture",
        "subheading": "Quality materials and finishes that ensure durability, comfort, and style in every piece we create. From <strong>mesh back office chairs</strong> to <strong>CRCA steel almirahs</strong>."
    },
    "materials_intro": {
        "heading": "Materials We Use",
        "description": "Every material is carefully selected for durability, comfort, and aesthetics. Learn what makes our office furniture stand out."
    },
    "cta": {
        "heading": "Custom Finishes Available",
        "subheading": "Need a specific color or material for your project? We offer custom finishing options for bulk orders. Contact us to discuss your requirements."
    }
}'::jsonb),
('quality_page', '{
    "hero": {
        "heading": "Quality & Trust – Our Manufacturing Promise",
        "subheading": "Our commitment to excellence is reflected in every office chair, table, and furniture piece we manufacture. Quality you can trust from Ahmedabad''s leading furniture manufacturer."
    },
    "quality_promise": {
        "heading": "Our Quality Promise",
        "description": "From raw materials to final delivery, quality is embedded in every step of our manufacturing process. That''s why businesses trust us for their <strong>office furniture</strong> needs."
    },
    "quality_points": [
        {"title": "Rigorous Testing", "description": "Every product undergoes extensive durability and safety testing before leaving our facility."},
        {"title": "Quality Control", "description": "Multi-stage quality checks ensure consistent standards across all products."},
        {"title": "Premium Materials", "description": "We source only high-grade materials from trusted suppliers with verified quality."},
        {"title": "Safe Delivery", "description": "Careful packaging and handling ensure your furniture arrives in perfect condition."},
        {"title": "Long Lifespan", "description": "Built to last for years with minimal maintenance, reducing replacement costs."},
        {"title": "Warranty Support", "description": "Comprehensive warranty coverage with responsive after-sales support."}
    ],
    "trust_stats": [
        {"value": "25+", "label": "Years in Business"},
        {"value": "10,000+", "label": "Happy Clients"},
        {"value": "98%", "label": "Customer Satisfaction"},
        {"value": "5 Years", "label": "Warranty Coverage"}
    ],
    "testimonials_heading": {
        "heading": "What Our Clients Say",
        "subheading": "Trusted by offices, schools, hospitals, and institutions across India."
    },
    "testimonials": [
        {"quote": "Dipak Furniture has been our furniture partner for 10 years. Their quality and service are unmatched in the industry.", "author": "Rajesh Sharma", "company": "ABC Corporation, Ahmedabad"},
        {"quote": "We furnished our entire school with their products. The durability has been exceptional even with heavy student use.", "author": "Dr. Meera Patel", "company": "Sunshine School, Gandhinagar"},
        {"quote": "Professional service from enquiry to delivery. The ergonomic chairs have significantly improved our team''s comfort.", "author": "Amit Desai", "company": "TechStart Solutions, Bangalore"}
    ],
    "cta": {
        "heading": "Experience the Dipak Furniture Difference",
        "subheading": "Join thousands of satisfied clients who trust us for their office furniture needs. Get in touch today for a free quote."
    }
}'::jsonb),
('contact_page', '{
    "hero": {
        "heading": "Contact Dipak Furniture – Office Furniture Shop in Ahmedabad",
        "subheading": "Get in touch for enquiries, quotes, or visit our showroom. We''re here to help you find the perfect office furniture solution."
    },
    "contact_info": {
        "heading": "Get In Touch – Office Furniture Near You",
        "description": "We''d love to hear from you. Whether you''re looking for <strong>office chairs</strong>, <strong>steel almirahs</strong>, or <strong>institutional furniture</strong>, reach out through any of the channels below or fill out the contact form."
    },
    "address": {
        "line1": "Plot-4, No. 2 Bhagirath Estate,",
        "line2": "Opp. Jawaharnagar, Near Gulabnagar Char Rasta,",
        "line3": "Amraiwadi, Ahmedabad, Gujarat – 380026"
    },
    "business_hours": {
        "weekdays": "Monday - Saturday: 9:00 AM - 7:00 PM",
        "sunday": "Sunday: Closed"
    },
    "map_heading": "Visit Our Office Furniture Showroom in Ahmedabad",
    "form_heading": "Request a Free Quote"
}'::jsonb)
ON CONFLICT (page_key) DO NOTHING;
