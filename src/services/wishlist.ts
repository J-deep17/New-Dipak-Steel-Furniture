
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type WishlistItem = Database['public']['Tables']['wishlist']['Row'] & {
    products?: Database['public']['Tables']['products']['Row']
};

export const wishlistService = {
    getWishlist: async (userId: string) => {
        const { data, error } = await supabase
            .from('wishlist')
            .select('*, products(*)')
            .eq('user_id', userId);

        if (error) throw error;
        return data as WishlistItem[];
    },

    addToWishlist: async (userId: string, productId: string) => {
        const { error } = await supabase
            .from('wishlist')
            .insert({ user_id: userId, product_id: productId });

        if (error) {
            // Check for duplicate key manually if needed, or let error handling manage it
            if (error.code === '23505') return; // Ignore duplicates
            throw error;
        }
    },

    removeFromWishlist: async (userId: string, productId: string) => {
        const { error } = await supabase
            .from('wishlist')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
    }
};
