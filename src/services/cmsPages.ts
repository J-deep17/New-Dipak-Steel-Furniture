import { supabase } from "@/integrations/supabase/client";

// Type definitions for CMS page content

export interface HomePageContent {
    seo: { title: string; description: string };
    hero_section: { title: string; subtitle: string; }; // Additional text not in main table
    welcome_section: { heading: string; description: string };
}


export interface AboutPageContent {
    hero: { heading: string; subheading: string };
    who_we_are: { heading: string; paragraph1: string; paragraph2: string; paragraph3: string };
    vision: { title: string; description: string };
    mission: { title: string; description: string };
    core_values: Array<{ title: string; description: string }>;
    manufacturing: {
        heading: string;
        description: string;
        stats: Array<{ value: string; label: string }>;
    };
    cta: { heading: string; subheading: string };
}

export interface PhilosophyPageContent {
    hero: { heading: string; subheading: string };
    eco_ergo: { description: string };
    eco_design: { heading: string; points: string[] };
    ergo_design: { heading: string; points: string[] };
    indian_workspaces: {
        heading: string;
        paragraph1: string;
        paragraph2: string;
        paragraph3: string;
        stats: Array<{ value: string; label: string }>;
    };
}

export interface MaterialsPageContent {
    hero: { heading: string; subheading: string };
    materials_intro: { heading: string; description: string };
    cta: { heading: string; subheading: string };
}

export interface QualityPageContent {
    hero: { heading: string; subheading: string };
    quality_promise: { heading: string; description: string };
    quality_points: Array<{ title: string; description: string }>;
    trust_stats: Array<{ value: string; label: string }>;
    testimonials_heading: { heading: string; subheading: string };
    testimonials: Array<{ quote: string; author: string; company: string }>;
    cta: { heading: string; subheading: string };
}

export interface ContactPageContent {
    hero: { heading: string; subheading: string };
    contact_info: { heading: string; description: string };
    address: { line1: string; line2: string; line3: string };
    business_hours: { weekdays: string; sunday: string };
    map_heading: string;
    form_heading: string;
}

export type PageKey = 'home_page' | 'about_page' | 'philosophy_page' | 'materials_page' | 'quality_page' | 'contact_page';

export type PageContent = HomePageContent | AboutPageContent | PhilosophyPageContent | MaterialsPageContent | QualityPageContent | ContactPageContent;

export interface CMSPage {
    id: string;
    page_key: PageKey;
    content: PageContent;
    updated_at: string;
}

export const cmsPagesService = {
    // Get page content by key
    getPageContent: async <T extends PageContent>(pageKey: PageKey): Promise<T | null> => {
        const { data, error } = await supabase
            .from('cms_pages' as any)
            .select('*')
            .eq('page_key', pageKey)
            .single();

        if (error) {
            console.error(`Error fetching ${pageKey}:`, error);
            return null;
        }

        return (data as any)?.content as T || null;
    },

    // Update page content
    updatePageContent: async <T extends PageContent>(pageKey: PageKey, content: T): Promise<void> => {
        const { error } = await supabase
            .from('cms_pages' as any)
            .update({ content, updated_at: new Date().toISOString() })
            .eq('page_key', pageKey);

        if (error) {
            throw error;
        }
    },

    // Get all pages (for admin)
    getAllPages: async (): Promise<CMSPage[]> => {
        const { data, error } = await supabase
            .from('cms_pages' as any)
            .select('*')
            .order('page_key');

        if (error) {
            console.error('Error fetching all pages:', error);
            return [];
        }

        return (data as any) || [];
    },

    // Upsert page content (create if not exists)
    upsertPageContent: async <T extends PageContent>(pageKey: PageKey, content: T): Promise<void> => {
        const { error } = await supabase
            .from('cms_pages' as any)
            .upsert(
                { page_key: pageKey, content, updated_at: new Date().toISOString() },
                { onConflict: 'page_key' }
            );

        if (error) {
            throw error;
        }
    }
};
