
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Extended type to include new field until Supabase types are regenerated
export type HeroBanner = Database["public"]["Tables"]["hero_banners"]["Row"] & {
    advance_after_video?: boolean;
    title_color?: string;
    title_font_size?: string;
    title_font_weight?: string;
    subtitle_color?: string;
    subtitle_font_size?: string;
    subtitle_font_weight?: string;
    text_animation?: string;
    vertical_alignment?: string;
    content_width?: string;
};
export type HeroBannerInsert = Database["public"]["Tables"]["hero_banners"]["Insert"] & {
    advance_after_video?: boolean;
    title_color?: string;
    title_font_size?: string;
    title_font_weight?: string;
    subtitle_color?: string;
    subtitle_font_size?: string;
    subtitle_font_weight?: string;
    text_animation?: string;
    vertical_alignment?: string;
    content_width?: string;
};
export type HeroBannerUpdate = Database["public"]["Tables"]["hero_banners"]["Update"] & {
    advance_after_video?: boolean;
    title_color?: string;
    title_font_size?: string;
    title_font_weight?: string;
    subtitle_color?: string;
    subtitle_font_size?: string;
    subtitle_font_weight?: string;
    text_animation?: string;
    vertical_alignment?: string;
    content_width?: string;
};

export type HeroSettings = Database["public"]["Tables"]["hero_settings"]["Row"] & {
    content_vertical_align?: string;
    content_horizontal_align?: string;
    heading_align?: string;
    subheading_align?: string;
    button_align?: string;
};
export type HeroSettingsUpdate = Database["public"]["Tables"]["hero_settings"]["Update"] & {
    content_vertical_align?: string;
    content_horizontal_align?: string;
    heading_align?: string;
    subheading_align?: string;
    button_align?: string;
};

export const heroService = {
    // --- Banners ---
    getBanners: async () => {
        const { data, error } = await supabase
            .from("hero_banners" as any)
            .select("*")
            .order("order_index", { ascending: true }); // Prefer order_index

        if (error) throw error;
        return data as HeroBanner[];
    },

    getActiveBanners: async () => {
        const { data, error } = await supabase
            .from("hero_banners" as any)
            .select("*")
            .eq("is_active", true)
            .order("order_index", { ascending: true });

        if (error) throw error;
        return data as HeroBanner[];
    },

    createBanner: async (banner: HeroBannerInsert) => {
        const { data, error } = await supabase
            .from("hero_banners" as any)
            .insert(banner as any)
            .select()
            .single();

        if (error) throw error;
        return data as HeroBanner;
    },

    updateBanner: async (id: string, updates: HeroBannerUpdate) => {
        const { data, error } = await supabase
            .from("hero_banners" as any)
            .update(updates as any)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as HeroBanner;
    },

    deleteBanner: async (id: string) => {
        const { error } = await supabase
            .from("hero_banners" as any)
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    updateBannerOrder: async (items: { id: string; order_index: number }[]) => {
        // In a real app, might want a dedicated RPC or batch update.
        // For now, looping updates is simplest for small number of items.
        // Or upsert.
        // Promise.all to update sequentially or parallel
        await Promise.all(items.map(item =>
            supabase
                .from("hero_banners" as any)
                .update({ order_index: item.order_index })
                .eq("id", item.id)
        ));
    },

    // --- Settings ---
    getSettings: async () => {
        const { data, error } = await supabase
            .from("hero_settings" as any)
            .select("*")
            .single(); // Should be only one row

        if (error) throw error;
        return data as HeroSettings;
    },

    updateSettings: async (id: string, updates: HeroSettingsUpdate) => {
        const { data, error } = await supabase
            .from("hero_settings" as any)
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data as HeroSettings;
    },

    // --- Storage for Hero Media ---
    uploadMedia: async (file: File) => {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Date.now()}-${Math.random().toString(36).substring(2, 9)}.${fileExt}`;
        const filePath = `hero/${fileName}`;

        const { error: uploadError } = await supabase.storage
            .from('uploads')
            .upload(filePath, file);

        if (uploadError) throw uploadError;

        const { data } = supabase.storage.from('uploads').getPublicUrl(filePath);
        return data.publicUrl;
    }
};
