import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type LegalPage = {
    id: string;
    slug: string;
    title: string;
    content: string | null;
    is_published: boolean;
    created_at: string;
};

export type LegalPageInsert = Omit<LegalPage, 'id' | 'created_at'>;
export type LegalPageUpdate = Partial<LegalPageInsert>;

export const legalService = {
    // Public: Get all published pages (for footer)
    getPublishedPages: async () => {
        const { data, error } = await supabase
            .from('legal_pages')
            .select('slug, title')
            .eq('is_published', true)
            .order('title');

        if (error) throw error;
        return data as Pick<LegalPage, 'slug' | 'title'>[];
    },

    // Public: Get single page by slug
    getPageBySlug: async (slug: string) => {
        const { data, error } = await supabase
            .from('legal_pages')
            .select('*')
            .eq('slug', slug)
            .eq('is_published', true)
            .single();

        if (error) throw error;
        return data as LegalPage;
    },

    // Admin: Get all pages
    getAllPages: async () => {
        const { data, error } = await supabase
            .from('legal_pages')
            .select('*')
            .order('created_at', { ascending: false });

        if (error) throw error;
        return data as LegalPage[];
    },

    // Admin: Create page
    createPage: async (page: LegalPageInsert) => {
        const { data, error } = await supabase
            .from('legal_pages')
            .insert(page)
            .select()
            .single();

        if (error) throw error;
        return data as LegalPage;
    },

    // Admin: Update page
    updatePage: async (id: string, updates: LegalPageUpdate) => {
        const { data, error } = await supabase
            .from('legal_pages')
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as LegalPage;
    },

    // Admin: Delete page
    deletePage: async (id: string) => {
        const { error } = await supabase
            .from('legal_pages')
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
