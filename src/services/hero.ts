
import { supabase } from "@/integrations/supabase/client";
import { Database } from "@/integrations/supabase/types";

// Extended type to include new field until Supabase types are regenerated
export type HeroBanner = Database["public"]["Tables"]["hero_banners"]["Row"] & {
    advance_after_video?: boolean;
};
export type HeroBannerInsert = Database["public"]["Tables"]["hero_banners"]["Insert"] & {
    advance_after_video?: boolean;
};
export type HeroBannerUpdate = Database["public"]["Tables"]["hero_banners"]["Update"] & {
    advance_after_video?: boolean;
};

export type HeroSettings = Database["public"]["Tables"]["hero_settings"]["Row"];
export type HeroSettingsUpdate = Database["public"]["Tables"]["hero_settings"]["Update"];

export const heroService = {
    // --- Banners ---
    getBanners: async () => {
        const { data, error } = await supabase
            .from("hero_banners")
            .select("*")
            .order("order_index", { ascending: true }); // Prefer order_index

        if (error) throw error;
        return data;
    },

    getActiveBanners: async () => {
        const { data, error } = await supabase
            .from("hero_banners")
            .select("*")
            .eq("is_active", true)
            .order("order_index", { ascending: true });

        if (error) throw error;
        return data;
    },

    createBanner: async (banner: HeroBannerInsert) => {
        const { data, error } = await supabase
            .from("hero_banners")
            .insert(banner)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    updateBanner: async (id: string, updates: HeroBannerUpdate) => {
        const { data, error } = await supabase
            .from("hero_banners")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
    },

    deleteBanner: async (id: string) => {
        const { error } = await supabase
            .from("hero_banners")
            .delete()
            .eq("id", id);

        if (error) throw error;
    },

    updateBannerOrder: async (items: { id: string; order_index: number }[]) => {
        // In a real app, might want a dedicated RPC or batch update.
        // For now, looping updates is simplest for small number of items.
        // Or upsert.
        const updates = items.map(item => ({
            id: item.id,
            order_index: item.order_index,
            // We need mandatory columns for UPSERT if not partial? 
            // Update is safer.
        }));

        // Promise.all to update sequentially or parallel
        await Promise.all(items.map(item =>
            supabase
                .from("hero_banners")
                .update({ order_index: item.order_index })
                .eq("id", item.id)
        ));
    },

    // --- Settings ---
    getSettings: async () => {
        const { data, error } = await supabase
            .from("hero_settings")
            .select("*")
            .single(); // Should be only one row

        if (error) throw error;
        return data;
    },

    updateSettings: async (id: string, updates: HeroSettingsUpdate) => {
        const { data, error } = await supabase
            .from("hero_settings")
            .update(updates)
            .eq("id", id)
            .select()
            .single();

        if (error) throw error;
        return data;
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
