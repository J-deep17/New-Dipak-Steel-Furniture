
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type CartItemRow = Database['public']['Tables']['cart_items']['Row'] & {
    products?: Database['public']['Tables']['products']['Row']
};

export const cartService = {
    getCart: async (userId: string) => {
        const { data, error } = await supabase
            .from('cart_items')
            .select(`
                *,
                products (
                    *,
                    category:categories (
                        name,
                        slug
                    )
                )
            `)
            .eq('user_id', userId);

        if (error) throw error;
        // Cast to any because deep nesting types are hard to auto-infer perfectly with the generated types sometimes
        return data as any[];
    },

    addToCart: async (userId: string, productId: string, quantity: number) => {
        // Upsert? Or check existence first?
        // Let's try upsert if unique constraint exists on (user_id, product_id).
        // If not, we need to check. Assuming Supabase usually has ID. 
        // Let's check if item exists first to update quantity or insert.

        const { data: existing } = await supabase
            .from('cart_items')
            .select('*')
            .eq('user_id', userId)
            .eq('product_id', productId)
            .single();

        if (existing) {
            const { error } = await supabase
                .from('cart_items')
                .update({ quantity: existing.quantity + quantity })
                .eq('id', existing.id);
            if (error) throw error;
        } else {
            const { error } = await supabase
                .from('cart_items')
                .insert({ user_id: userId, product_id: productId, quantity: quantity });
            if (error) throw error;
        }
    },

    updateQuantity: async (userId: string, productId: string, quantity: number) => {
        const { error } = await supabase
            .from('cart_items')
            .update({ quantity: quantity })
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
    },

    removeFromCart: async (userId: string, productId: string) => {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId)
            .eq('product_id', productId);

        if (error) throw error;
    },

    clearCart: async (userId: string) => {
        const { error } = await supabase
            .from('cart_items')
            .delete()
            .eq('user_id', userId);
        if (error) throw error;
    }
};
