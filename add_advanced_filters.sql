-- Phase 1: Add Required Columns
ALTER TABLE products
ADD COLUMN IF NOT EXISTS product_type TEXT,
ADD COLUMN IF NOT EXISTS materials TEXT[],
ADD COLUMN IF NOT EXISTS colors TEXT[],
ADD COLUMN IF NOT EXISTS stock_status TEXT DEFAULT 'in_stock',
ADD COLUMN IF NOT EXISTS is_featured BOOLEAN DEFAULT false;

-- Phase 1.2: Indexes for Performance
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);
CREATE INDEX IF NOT EXISTS idx_products_stock_status ON products(stock_status);
CREATE INDEX IF NOT EXISTS idx_products_price ON products(price);
CREATE INDEX IF NOT EXISTS idx_products_materials ON products USING GIN (materials);
CREATE INDEX IF NOT EXISTS idx_products_colors ON products USING GIN (colors);

-- Phase 1.3: Backfill Existing Products (Optional default values)
UPDATE products
SET
  product_type = 'chair',
  materials = ARRAY['metal'],
  colors = ARRAY['black'],
  stock_status = 'in_stock'
WHERE product_type IS NULL;
