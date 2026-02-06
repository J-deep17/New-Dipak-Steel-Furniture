
import { supabase } from "@/integrations/supabase/client";

export interface WishlistItem {
    id: string;
    user_id: string;
    product_id: string;
    created_at: string;
    product?: {
        id: string;
        title: string;
        slug: string;
        image_url: string;
        base_price: number;
    };
}

export const wishlistService = {
    getWishlist: async (userId: string): Promise<WishlistItem[]> => {
        console.log('[Wishlist] Fetching wishlist for user:', userId);

        const { data, error } = await (supabase as any)
            .from('wishlist')
            .select(`
                *,
                product:products(id, title, slug, image_url, base_price)
            `)
            .eq('user_id', userId)
            .order('created_at', { ascending: false });

        if (error) {
            console.error('[Wishlist] Fetch error:', error);
            throw error;
        }

        console.log('[Wishlist] Fetched items:', data?.length || 0, data);
        return data || [];
    },

    addToWishlist: async (userId: string, productId: string): Promise<void> => {
        console.log('[Wishlist] Adding to wishlist:', { userId, productId });

        const { data, error } = await (supabase as any)
            .from('wishlist')
            .insert({ user_id: userId, product_id: productId })
            .select();

        if (error) {
            console.error('[Wishlist] Add error:', error);
            throw error;
        }

        console.log('[Wishlist] Add success:', data);
    },

    removeFromWishlist: async (userId: string, productId: string): Promise<void> => {
        console.log('[Wishlist] Removing from wishlist:', { userId, productId });

        const { data, error } = await (supabase as any)
            .from('wishlist')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId)
            .select();

        if (error) {
            console.error('[Wishlist] Remove error:', error);
            throw error;
        }

        console.log('[Wishlist] Remove success:', data);
    },

    isInWishlist: async (userId: string, productId: string): Promise<boolean> => {
        const { data, error } = await (supabase as any)
            .from('wishlist')
            .select('id')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .maybeSingle();

        if (error) {
            console.error('[Wishlist] Check error:', error);
            return false;
        }

        return !!data;
    }
};
