
import { supabase as supabaseClient } from "@/integrations/supabase/client";

// Cast supabase to any to avoid type errors with generated types
const supabase = supabaseClient as any;

export interface Review {
    id: string;
    product_id: string;
    user_id: string;
    rating: number;
    title: string | null;
    comment: string | null;
    status: 'pending' | 'approved' | 'rejected';
    created_at: string;
    product?: {
        title: string;
        slug: string;
    };
    // Profile might be expanded later
    profile?: {
        id: string;
    };
}

export const reviewService = {
    // Submit a review (Status defaults to pending in DB, but we strictly set it too)
    submitReview: async (review: { product_id: string; user_id: string; rating: number; title?: string; comment?: string }) => {
        // Check for existing review
        const { data: existing } = await supabase
            .from('product_reviews')
            .select('id')
            .eq('product_id', review.product_id)
            .eq('user_id', review.user_id)
            .maybeSingle();

        if (existing) {
            throw new Error("You have already reviewed this product.");
        }

        const { data, error } = await supabase
            .from('product_reviews')
            .insert({
                ...review,
                status: 'pending' // Enforce pending status
            })
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Get approved reviews for a product (Public)
    getProductReviews: async (productId: string) => {
        const { data, error } = await supabase
            .from('product_reviews')
            .select(`
                *,
                profile:profiles(*)
            `)
            .eq('product_id', productId)
            .eq('status', 'approved')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as unknown as Review[];
    },

    // Get average rating and count (Public)
    getProductRating: async (productId: string) => {
        const { data, error } = await supabase
            .from('product_reviews')
            .select('rating')
            .eq('product_id', productId)
            .eq('status', 'approved');

        if (error) throw error;

        if (!data || data.length === 0) return { average: 0, count: 0 };

        const total = data.reduce((acc, curr) => acc + curr.rating, 0);
        return {
            average: Number((total / data.length).toFixed(1)),
            count: data.length
        };
    },

    // Get all reviews (Admin)
    getAllReviews: async () => {
        const { data, error } = await supabase
            .from('product_reviews')
            .select(`
                *,
                product:products(title, slug),
                profile:profiles(*)
            `)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as unknown as Review[];
    },

    // Update status (Admin)
    updateStatus: async (id: string, status: 'approved' | 'rejected') => {
        const { data, error } = await supabase
            .from('product_reviews')
            .update({ status })
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // Delete review (Admin)
    deleteReview: async (id: string) => {
        const { error } = await supabase
            .from('product_reviews')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
