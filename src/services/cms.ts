import { supabase } from "@/integrations/supabase/client";

export interface Blog {
    id: string;
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    featured_image: string;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
}

export interface Location {
    id: string;
    city: string;
    state: string;
    created_at: string;
}

export interface SeoPage {
    id: string;
    page_type: string;
    slug: string;
    heading: string;
    content: string;
    meta_title: string;
    meta_description: string;
    status: 'draft' | 'published';
    created_at: string;
    updated_at: string;
}

export const cmsService = {
    // Blogs
    getBlogs: async (publishedOnly = false) => {
        let query = supabase.from('blogs' as any).select('*').order('created_at', { ascending: false });
        if (publishedOnly) {
            query = query.eq('status', 'published');
        }
        return await query;
    },
    getBlogBySlug: async (slug: string) => {
        return await supabase.from('blogs' as any).select('*').eq('slug', slug).single();
    },
    createBlog: async (data: Partial<Blog>) => {
        return await supabase.from('blogs' as any).insert(data as any).select().single();
    },
    updateBlog: async (id: string, data: Partial<Blog>) => {
        return await supabase.from('blogs' as any).update({ ...data, updated_at: new Date().toISOString() } as any).eq('id', id).select().single();
    },
    deleteBlog: async (id: string) => {
        return await supabase.from('blogs' as any).delete().eq('id', id);
    },

    // Locations
    getLocations: async () => {
        return await supabase.from('locations' as any).select('*').order('city', { ascending: true });
    },
    createLocation: async (data: Partial<Location>) => {
        return await supabase.from('locations' as any).insert(data as any).select().single();
    },
    createLocationsBulk: async (data: Partial<Location>[]) => {
        return await supabase.from('locations' as any).upsert(data as any, { onConflict: 'city', ignoreDuplicates: true }).select();
    },
    updateLocation: async (id: string, data: Partial<Location>) => {
        return await supabase.from('locations' as any).update(data as any).eq('id', id).select().single();
    },
    deleteLocation: async (id: string) => {
        return await supabase.from('locations' as any).delete().eq('id', id);
    },

    // SEO Pages
    getSeoPages: async (publishedOnly = false) => {
        let query = supabase.from('seo_pages' as any).select('*').order('created_at', { ascending: false });
        if (publishedOnly) {
            query = query.eq('status', 'published');
        }
        return await query;
    },
    getSeoPageBySlug: async (slug: string) => {
        return await supabase.from('seo_pages' as any).select('*').eq('slug', slug).single();
    },
    createSeoPage: async (data: Partial<SeoPage>) => {
        return await supabase.from('seo_pages' as any).insert(data as any).select().single();
    },
    updateSeoPage: async (id: string, data: Partial<SeoPage>) => {
        return await supabase.from('seo_pages' as any).update({ ...data, updated_at: new Date().toISOString() } as any).eq('id', id).select().single();
    },
    deleteSeoPage: async (id: string) => {
        return await supabase.from('seo_pages' as any).delete().eq('id', id);
    },

    // Helper: Upload Image (for rich text editor or featured image)
    uploadImage: async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `cms-images/${fileName}`;

        const { error: uploadError } = await supabase.storage.from('products').upload(filePath, file); // reusing products bucket for simplicity or create new 'cms' bucket
        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('products').getPublicUrl(filePath);
        return data.publicUrl;
    }
};
