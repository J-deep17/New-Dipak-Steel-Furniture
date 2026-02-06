import { supabase } from "@/integrations/supabase/client";

export interface FooterSocialLink {
    id: string;
    platform: string;
    icon: string;
    url: string;
    is_active: boolean;
    display_order: number;
    created_at: string;
}

export type FooterSocialLinkInsert = Omit<FooterSocialLink, 'id' | 'created_at'>;
export type FooterSocialLinkUpdate = Partial<FooterSocialLinkInsert>;

export const footerService = {
    // Public: Get active links
    getFooterLinks: async () => {
        const { data, error } = await supabase
            .from('footer_social_links' as any)
            .select('*')
            .eq('is_active', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data as FooterSocialLink[];
    },

    // Admin: Get all links
    getAllFooterLinks: async () => {
        const { data, error } = await supabase
            .from('footer_social_links' as any)
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data as FooterSocialLink[];
    },

    // Admin: Create link
    createFooterLink: async (link: FooterSocialLinkInsert) => {
        const { error } = await supabase
            .from('footer_social_links' as any)
            .insert(link);

        if (error) throw error;
    },

    // Admin: Update link
    updateFooterLink: async (id: string, updates: FooterSocialLinkUpdate) => {
        const { error } = await supabase
            .from('footer_social_links' as any)
            .update(updates)
            .eq('id', id);

        if (error) throw error;
    },

    // Admin: Delete link
    deleteFooterLink: async (id: string) => {
        const { error } = await supabase
            .from('footer_social_links' as any)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
