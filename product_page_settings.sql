-- Create product_page_settings table
CREATE TABLE IF NOT EXISTS product_page_settings (
    id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
    product_tag_label text NOT NULL DEFAULT 'Furniture',
    pricing_note text NOT NULL DEFAULT '* GST and shipping charges extra. Bulk discounts available.',
    delivery_title text NOT NULL DEFAULT 'Check Delivery',
    pincode_placeholder text NOT NULL DEFAULT 'Enter pincode',
    delivery_button_text text NOT NULL DEFAULT 'Check',
    created_at timestamptz DEFAULT now(),
    updated_at timestamptz DEFAULT now()
);

-- Insert default settings
INSERT INTO product_page_settings (
    product_tag_label,
    pricing_note,
    delivery_title,
    pincode_placeholder,
    delivery_button_text
) VALUES (
    'Furniture',
    '* GST and shipping charges extra. Bulk discounts available.',
    'Check Delivery',
    'Enter pincode',
    'Check'
) ON CONFLICT DO NOTHING;

-- Enable RLS
ALTER TABLE product_page_settings ENABLE ROW LEVEL SECURITY;

-- Policy: Anyone can read settings
CREATE POLICY "Anyone can read product page settings"
    ON product_page_settings
    FOR SELECT
    USING (true);

-- Policy: Only admins can update settings
CREATE POLICY "Admins can update product page settings"
    ON product_page_settings
    FOR UPDATE
    USING (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );

-- Policy: Only admins can insert settings
CREATE POLICY "Admins can insert product page settings"
    ON product_page_settings
    FOR INSERT
    WITH CHECK (
        EXISTS (
            SELECT 1 FROM profiles
            WHERE profiles.id = auth.uid()
            AND profiles.role = 'admin'
        )
    );
