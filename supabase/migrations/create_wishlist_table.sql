-- Wishlist Table Migration
-- Creates the wishlist table with RLS policies for user-specific access

-- Create wishlist table
CREATE TABLE IF NOT EXISTS public.wishlist (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES public.products(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Unique constraint to prevent duplicate entries
    UNIQUE(user_id, product_id)
);

-- Create index for faster lookups
CREATE INDEX IF NOT EXISTS idx_wishlist_user_id ON public.wishlist(user_id);
CREATE INDEX IF NOT EXISTS idx_wishlist_product_id ON public.wishlist(product_id);

-- Enable Row Level Security
ALTER TABLE public.wishlist ENABLE ROW LEVEL SECURITY;

-- RLS Policies

-- Users can view their own wishlist items
CREATE POLICY "Users can view own wishlist"
    ON public.wishlist
    FOR SELECT
    USING (auth.uid() = user_id);

-- Users can insert their own wishlist items
CREATE POLICY "Users can insert own wishlist"
    ON public.wishlist
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

-- Users can delete their own wishlist items
CREATE POLICY "Users can delete own wishlist"
    ON public.wishlist
    FOR DELETE
    USING (auth.uid() = user_id);

-- Grant usage to authenticated users
GRANT SELECT, INSERT, DELETE ON public.wishlist TO authenticated;
