
import { supabase } from "@/integrations/supabase/client";

export interface CreateProductDTO {
    title: string;
    description?: string;
    price: number;
    image_url?: string;
    category_id?: string;
    is_active?: boolean;
}

export interface UpdateProductDTO extends Partial<CreateProductDTO> {
    id: string;
}

export const adminService = {
    // Admin Operations (Require Admin Role)

    async createProduct(product: CreateProductDTO) {
        const { data, error } = await supabase.functions.invoke('admin-products', {
            body: product,
            method: 'POST',
        });
        if (error) throw error;
        return data;
    },

    async updateProduct(product: UpdateProductDTO) {
        const { data, error } = await supabase.functions.invoke('admin-products', {
            body: product,
            method: 'PUT',
        });
        if (error) throw error;
        return data;
    },

    async deleteProduct(id: string) {
        const { data, error } = await supabase.functions.invoke('admin-products', {
            body: { id },
            method: 'DELETE',
        });
        if (error) throw error;
        return data;
    },

    // Public/Shared Operations

    async getProducts() {
        // Try to fetch via Function (Secure/Filtered)
        const { data, error } = await supabase.functions.invoke('public-products', {
            method: 'GET'
        });
        if (error) {
            console.warn('Backend function failed, falling back to direct DB', error);
            // Fallback to direct DB if function fails (e.g. not deployed)
            return await supabase.from('products').select('*, categories(*)').eq('is_active', true);
        }
        return { data, error: null };
    },

    async getCategories() {
        const { data, error } = await supabase.functions.invoke('public-categories', {
            method: 'GET'
        });
        if (error) {
            console.warn('Backend function failed, falling back to direct DB', error);
            return await supabase.from('categories').select('*');
        }
        return { data, error: null };
    }
};
