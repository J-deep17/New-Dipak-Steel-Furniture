-- Add advance_after_video column to hero_banners table
ALTER TABLE hero_banners
ADD COLUMN IF NOT EXISTS advance_after_video BOOLEAN DEFAULT false;

-- Add comment for documentation
COMMENT ON COLUMN hero_banners.advance_after_video IS 'If true, slider advances to next slide after video ends. If false, video loops.';
