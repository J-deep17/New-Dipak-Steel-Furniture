import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

export type HeroData = Database['public']['Tables']['homepage_hero']['Row'];
export type StatData = Database['public']['Tables']['homepage_stats']['Row'];
export type CategoryData = Database['public']['Tables']['homepage_categories']['Row'];
export type AboutData = Database['public']['Tables']['homepage_about']['Row'];
export type TestimonialData = Database['public']['Tables']['homepage_testimonials']['Row'];
export type FeatureData = Database['public']['Tables']['homepage_features']['Row'];
export type FAQData = Database['public']['Tables']['homepage_faq']['Row'];
export type CTAData = Database['public']['Tables']['homepage_cta']['Row'];

export type CategoryInsert = Database['public']['Tables']['homepage_categories']['Insert'];
export type StatInsert = Database['public']['Tables']['homepage_stats']['Insert'];
export type FeatureInsert = Database['public']['Tables']['homepage_features']['Insert'];
export type FAQInsert = Database['public']['Tables']['homepage_faq']['Insert'];
export type TestimonialInsert = Database['public']['Tables']['homepage_testimonials']['Insert'];


export const cmsService = {
    // Fetch all data for the homepage
    getHomepageData: async () => {
        try {
            const [
                hero, stats, categories, about, testimonials, features, faq, cta
            ] = await Promise.all([
                supabase.from('homepage_hero').select('*').single(),
                supabase.from('homepage_stats').select('*'),
                supabase.from('homepage_categories').select('*'),
                supabase.from('homepage_about').select('*').single(),
                supabase.from('homepage_testimonials').select('*'),
                supabase.from('homepage_features').select('*'),
                supabase.from('homepage_faq').select('*'),
                supabase.from('homepage_cta').select('*').single(),
            ]);

            return {
                hero: hero.data,
                stats: stats.data || [],
                categories: categories.data || [],
                about: about.data,
                testimonials: testimonials.data || [],
                features: features.data || [],
                faq: faq.data || [],
                cta: cta.data,
            };
        } catch (error) {
            console.error('Error fetching homepage data:', error);
            throw error;
        }
    },

    // Update specific sections
    updateHero: async (data: Partial<HeroData> & { id: string }) => {
        const { error } = await supabase.from('homepage_hero').update(data).eq('id', data.id);
        if (error) throw error;
    },

    updateAbout: async (data: Partial<AboutData> & { id: string }) => {
        const { error } = await supabase.from('homepage_about').update(data).eq('id', data.id);
        if (error) throw error;
    },

    updateCTA: async (data: Partial<CTAData> & { id: string }) => {
        const { error } = await supabase.from('homepage_cta').update(data).eq('id', data.id);
        if (error) throw error;
    },

    // Image Upload
    uploadImage: async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random()}.${fileExt}`;
        const filePath = `${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('cms-uploads')
            .upload(filePath, file);

        if (uploadError) {
            throw uploadError;
        }

        const { data } = supabase.storage.from('cms-uploads').getPublicUrl(filePath);
        return data.publicUrl;
    },


    // Generic CRUD for list items (Stats, Categories, Testimonials, Features, FAQ)

    // Stats
    createStat: async (data: StatInsert) => {
        const { error } = await supabase.from('homepage_stats').insert(data);
        if (error) throw error;
    },
    updateStat: async (data: Partial<StatData> & { id: string }) => {
        const { error } = await supabase.from('homepage_stats').update(data).eq('id', data.id);
        if (error) throw error;
    },
    deleteStat: async (id: string) => {
        const { error } = await supabase.from('homepage_stats').delete().eq('id', id);
        if (error) throw error;
    },

    // Categories
    createCategory: async (data: CategoryInsert) => {
        const { error } = await supabase.from('homepage_categories').insert(data);
        if (error) throw error;
    },
    updateCategory: async (data: Partial<CategoryData> & { id: string }) => {
        const { error } = await supabase.from('homepage_categories').update(data).eq('id', data.id);
        if (error) throw error;
    },
    deleteCategory: async (id: string) => {
        const { error } = await supabase.from('homepage_categories').delete().eq('id', id);
        if (error) throw error;
    },

    // Testimonials
    createTestimonial: async (data: TestimonialInsert) => {
        const { error } = await supabase.from('homepage_testimonials').insert(data);
        if (error) throw error;
    },
    updateTestimonial: async (data: Partial<TestimonialData> & { id: string }) => {
        const { error } = await supabase.from('homepage_testimonials').update(data).eq('id', data.id);
        if (error) throw error;
    },
    deleteTestimonial: async (id: string) => {
        const { error } = await supabase.from('homepage_testimonials').delete().eq('id', id);
        if (error) throw error;
    },

    // Features
    createFeature: async (data: FeatureInsert) => {
        const { error } = await supabase.from('homepage_features').insert(data);
        if (error) throw error;
    },
    updateFeature: async (data: Partial<FeatureData> & { id: string }) => {
        const { error } = await supabase.from('homepage_features').update(data).eq('id', data.id);
        if (error) throw error;
    },
    deleteFeature: async (id: string) => {
        const { error } = await supabase.from('homepage_features').delete().eq('id', id);
        if (error) throw error;
    },

    // FAQ
    createFAQ: async (data: FAQInsert) => {
        const { error } = await supabase.from('homepage_faq').insert(data);
        if (error) throw error;
    },
    updateFAQ: async (data: Partial<FAQData> & { id: string }) => {
        const { error } = await supabase.from('homepage_faq').update(data).eq('id', data.id);
        if (error) throw error;
    },
    deleteFAQ: async (id: string) => {
        const { error } = await supabase.from('homepage_faq').delete().eq('id', id);
        if (error) throw error;
    }
};
