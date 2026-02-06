import { supabase as supabaseClient } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Cast supabase to any to avoid type errors with generated types
const supabase = supabaseClient as any;
export interface Product {
    id: string;
    title: string;
    slug: string;
    description: string | null;
    short_description: string | null;
    price: number;
    base_price: number;
    mrp: number | null;
    base_mrp: number | null;
    images: string[] | null;
    image_url: string | null;
    category_id: string | null;
    is_active: boolean | null;
    created_at: string | null;
    key_features: string[] | null;
    specifications: Record<string, string> | null;
    dimensions: string | null;
    warranty_coverage: string[] | null;
    warranty_care: string[] | null;
    // Marketing fields
    discount_percentage: number | null;
    is_new_arrival: boolean | null;
    is_hot_selling: boolean | null;
    is_featured: boolean | null;
    is_on_sale: boolean | null;
    sale_price: number | null;
    // SEO Fields
    meta_title?: string | null;
    meta_description?: string | null;
    image_alt?: string | null;
    category?: {
        name: string;
        slug: string;
    } | string | null;
    variants?: ProductVariant[];
    image?: string;
    name?: string; // For compatibility with local cart state
}

export interface ProductVariantImage {
    id: string;
    variant_id: string;
    image_url: string;
    sort_order: number | null; // Changed from display_order
    display_order: number; // Kept for types compatibility if needed
    created_at: string;
}

export interface ProductVariant {
    id: string;
    product_id: string;
    color_name: string;
    color_hex: string | null;
    images: ProductVariantImage[];
    price: number | null; // Renamed from price_override
    mrp: number | null;
    sku: string | null;
    stock: number;
    is_active: boolean;
    created_at: string;
}

export type ProductVariantInsert = {
    product_id: string;
    color_name: string;
    color_hex?: string | null;
    price?: number | null;
    mrp?: number | null;
    sku?: string | null;
    stock?: number;
    is_active?: boolean;
};

export type ProductVariantImageInsert = {
    variant_id: string;
    image_url: string;
    sort_order?: number | null;
    display_order?: number;
};

// Derived Types
// Using any to bypass TS errors with generated types for now
export type ProductInsert = any;
export type ProductUpdate = any;

export type Category = any;
export type CategoryInsert = any;
export type CategoryUpdate = any;

export type ProductTemplate = any;
export type TemplateInsert = any;

// Ensure ProductVariantInsert extends the DB insert type or is compatible
// (It seems manually defined above, but we can stick with manual for now or switch to DB types. 
// Given the error, we might want to cast or ensure exact match, but let's first fix the missing types).

export interface SearchSuggestion {
    id: string;
    title: string;
    type: 'product' | 'category';
    slug: string;
}

export interface ProductFilters {
    categorySlug?: string;
    sort?: 'default' | 'price_asc' | 'price_desc' | 'new' | 'hot' | 'featured';
    minPrice?: number;
    maxPrice?: number;
    discountedOnly?: boolean;
    newArrivals?: boolean;
    hotSelling?: boolean;
}

export const productService = {
    // --- Products ---
    getProducts: async (filters: ProductFilters = {}) => {
        const { categorySlug, sort, minPrice, maxPrice, discountedOnly, newArrivals, hotSelling } = filters;

        let query = supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug),
                variants:product_variants(
                    *,
                    images:product_variant_images(*)
                )
            `)
            .eq('is_active', true);

        // Category filter
        if (categorySlug) {
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

        // Price filters
        if (minPrice !== undefined) {
            query = query.gte('base_price', minPrice);
        }
        if (maxPrice !== undefined) {
            query = query.lte('base_price', maxPrice);
        }

        // Marketing filters
        if (discountedOnly) {
            query = query.gt('discount_percentage', 0);
        }
        if (newArrivals) {
            query = query.eq('is_new_arrival', true);
        }
        if (hotSelling) {
            query = query.eq('is_hot_selling', true);
        }

        // Sorting
        switch (sort) {
            case 'price_asc':
                query = query.order('base_price', { ascending: true });
                break;
            case 'price_desc':
                query = query.order('base_price', { ascending: false });
                break;
            case 'new':
                query = query.order('is_new_arrival', { ascending: false }).order('created_at', { ascending: false });
                break;
            case 'hot':
                query = query.order('is_hot_selling', { ascending: false }).order('created_at', { ascending: false });
                break;
            case 'featured':
                query = query.order('is_featured', { ascending: false }).order('created_at', { ascending: false });
                break;
            default:
                query = query.order('created_at', { ascending: false });
        }

        const { data, error } = await query;
        if (error) throw error;

        return data?.map(product => ({
            ...product,
            base_price: product.base_price || product.price,
            variants: product.variants.map((v: any) => ({
                ...v,
                price: v.price,
                images: v.images?.sort((a: any, b: any) => (a.sort_order || a.display_order || 0) - (b.sort_order || b.display_order || 0)) || []
            }))
        })) as unknown as Product[];
    },

    getActiveProducts: async () => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug),
                variants:product_variants(
                    *,
                    images:product_variant_images(*)
                )
            `)
            .eq('is_active', true)
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data?.map(product => ({
            ...product,
            base_price: product.base_price || product.price,
            variants: product.variants.map((v: any) => ({
                ...v,
                images: v.images?.sort((a: any, b: any) => (a.sort_order || a.display_order || 0) - (b.sort_order || b.display_order || 0)) || []
            }))
        })) as unknown as Product[];
    },

    getProduct: async (id: string) => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug),
                variants:product_variants(
                    *,
                    images:product_variant_images(*)
                )
            `)
            .eq('id', id)
            .single();

        if (error) throw error;
        if (data) {
            // ensure base_price is set in returned object even if missing in DB (fallback)
            (data as any).base_price = (data as any).base_price || (data as any).price;
        }
        if (data && data.variants) {
            data.variants = data.variants.map((v: any) => ({
                ...v,
                images: v.images?.sort((a: any, b: any) => (a.sort_order || a.display_order || 0) - (b.sort_order || b.display_order || 0)) || []
            }));
        }
        return data as unknown as Product;
    },

    getProductBySlug: async (slug: string) => {
        const { data, error } = await supabase
            .from('products')
            .select(`
                *,
                category:categories(name, slug),
                variants:product_variants(
                    *,
                    images:product_variant_images(*)
                )
            `)
            .eq('slug', slug)
            .single();

        if (error) throw error;
        if (data) {
            (data as any).base_price = (data as any).base_price || (data as any).price;
        }
        if (data && data.variants) {
            data.variants = data.variants.map((v: any) => ({
                ...v,
                images: v.images?.sort((a: any, b: any) => (a.sort_order || a.display_order || 0) - (b.sort_order || b.display_order || 0)) || []
            }));
        }
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
    },

    // --- Variants ---
    createVariant: async (variant: ProductVariantInsert) => {
        const { data, error } = await supabase
            .from('product_variants')
            .insert(variant)
            .select()
            .single();

        if (error) throw error;
        // Invalidate queries or return logic might need to handle images being empty initially
        return data;
    },

    updateVariant: async (id: string, updates: Partial<ProductVariantInsert>) => {
        const { data, error } = await supabase
            .from('product_variants')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteVariant: async (id: string) => {
        const { error } = await supabase
            .from('product_variants')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Variant Images ---
    saveVariantImage: async (image: ProductVariantImageInsert) => {
        const { data, error } = await supabase
            .from('product_variant_images')
            .insert(image)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteVariantImage: async (id: string) => {
        const { error } = await supabase
            .from('product_variant_images')
            .delete()
            .eq('id', id);

        if (error) throw error;
    },

    // --- Search ---
    getSearchSuggestions: async (query: string): Promise<SearchSuggestion[]> => {
        if (!query || query.length < 2) return [];

        const sanitizedQuery = query.trim();

        // Parallel fetch for products and categories
        const [productsRes, categoriesRes] = await Promise.all([
            supabase
                .from('products')
                .select('id, title, slug')
                .ilike('title', `%${sanitizedQuery}%`)
                .eq('is_active', true)
                .limit(10),
            supabase
                .from('categories')
                .select('id, name, slug')
                .ilike('name', `%${sanitizedQuery}%`)
                .limit(5)
        ]);

        const products: SearchSuggestion[] = (productsRes.data || []).map((p: any) => ({
            id: p.id,
            title: p.title,
            type: 'product',
            slug: p.slug
        }));

        const categories: SearchSuggestion[] = (categoriesRes.data || []).map((c: any) => ({
            id: c.id,
            title: c.name,
            type: 'category',
            slug: c.slug
        }));

        const all = [...categories, ...products];

        // Sort: Exact match > Starts with > Contains
        const lowerQuery = sanitizedQuery.toLowerCase();

        all.sort((a, b) => {
            const aTitle = a.title.toLowerCase();
            const bTitle = b.title.toLowerCase();

            const aExact = aTitle === lowerQuery;
            const bExact = bTitle === lowerQuery;
            if (aExact && !bExact) return -1;
            if (!aExact && bExact) return 1;

            const aStarts = aTitle.startsWith(lowerQuery);
            const bStarts = bTitle.startsWith(lowerQuery);
            if (aStarts && !bStarts) return -1;
            if (!aStarts && bStarts) return 1;

            return aTitle.localeCompare(bTitle);
        });

        return all.slice(0, 10);
    }
};
