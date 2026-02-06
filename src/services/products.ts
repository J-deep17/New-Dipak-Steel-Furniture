import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";
export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    price: number;
    mrp: number | null;
    discount_percent: number | null;
    images: string[] | null;
    image_url: string | null;
    category_id: string | null;
    is_active: boolean | null;
    created_at: string | null;
    // New fields
    key_features: string[] | null;
    specifications: Record<string, string> | null; // jsonb
    dimensions: string | null;
    warranty_coverage: string[] | null;
    warranty_care: string[] | null;
    category?: {
        name: string;
        slug: string;
    } | null;
}



export interface ProductTemplate {
    id: string;
    name: string;
    key_features: string[] | null;
    warranty_coverage: string[] | null;
    warranty_care: string[] | null;
    dimensions: string | null;
}

export type ProductInsert = Database['public']['Tables']['products']['Insert'];
export type ProductUpdate = Database['public']['Tables']['products']['Update'];

export interface Category {
    id: string;
    name: string;
    slug: string;
    image_url: string | null;
    created_at: string;
    show_on_home?: boolean; // Optional until DB types match
    home_order?: number | null;
}

export type CategoryInsert = Database['public']['Tables']['categories']['Insert'];
export type CategoryUpdate = Database['public']['Tables']['categories']['Update'];

export type TemplateInsert = Database['public']['Tables']['product_templates']['Insert'];

export const productService = {
    // --- Products ---
    getProducts: async ({ categorySlug }: { categorySlug?: string } = {}) => {
        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug)
            `)
            .order('created_at', { ascending: false });

        if (categorySlug) {
            // First get category ID from slug
            const { data: categoryData, error: categoryError } = await supabase
                .from('categories')
                .select('id')
                .eq('slug', categorySlug)
                .single();

            if (categoryError) {
                console.error("Error fetching category ID:", categoryError);
                return [];
            }

            if (categoryData) {
                query = query.eq('category_id', categoryData.id);
            }
        }

        const { data, error } = await query;
        if (error) throw error;
        return data as unknown as Product[];
    },

    getActiveProducts: async () => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug)
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as unknown as Product[];
    },

    getProduct: async (id: string) => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug)
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        return data as unknown as Product;
    },

    getProductBySlug: async (slug: string) => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug)
            `)
            .eq('slug', slug)
            .single();

        if (error) throw error;
        return data as unknown as Product;
    },

    createProduct: async (product: ProductInsert) => {
        const { data, error } = await supabase
            .from('products')
            .insert(product)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateProduct: async (id: string, updates: ProductUpdate) => {
        const { data, error } = await supabase
            .from('products')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteProduct: async (id: string) => {
        const { error } = await supabase
            .from('products')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Templates ---
    getTemplates: async () => {
        const { data, error } = await supabase
            .from('product_templates')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as ProductTemplate[];
    },

    createTemplate: async (template: TemplateInsert) => {
        const { data, error } = await supabase
            .from('product_templates')
            .insert(template)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    // --- Categories ---
    getCategories: async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .order('name');

        if (error) throw error;
        return data as Category[];
    },

    getHomeCategories: async () => {
        const { data, error } = await supabase
            .from('categories')
            .select('*')
            .eq('show_on_home', true)
            .order('home_order', { ascending: true, nullsFirst: false });

        if (error) throw error;
        return data as Category[];
    },

    createCategory: async (category: CategoryInsert) => {
        const { data, error } = await supabase
            .from('categories')
            .insert(category)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateCategory: async (id: string, updates: CategoryUpdate) => {
        const { data, error } = await supabase
            .from('categories')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteCategory: async (id: string) => {
        const { error } = await supabase
            .from('categories')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Storage ---
    uploadImage: async (file: File, bucket: 'product-images' | 'uploads' = 'product-images') => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from(bucket)
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from(bucket).getPublicUrl(filePath);
        return data.publicUrl;
    }
};
