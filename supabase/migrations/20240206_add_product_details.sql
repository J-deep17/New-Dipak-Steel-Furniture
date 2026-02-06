ALTER TABLE products
ADD COLUMN IF NOT EXISTS key_features text[] DEFAULT '{}',
ADD COLUMN IF NOT EXISTS specifications jsonb DEFAULT '{}'::jsonb,
ADD COLUMN IF NOT EXISTS dimensions text,
ADD COLUMN IF NOT EXISTS warranty jsonb DEFAULT '{}'::jsonb;

DROP TABLE IF EXISTS reviews;
