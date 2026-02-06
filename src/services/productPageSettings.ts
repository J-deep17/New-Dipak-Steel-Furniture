import { supabase } from "@/integrations/supabase/client";

// Types for product page settings
export interface ProductPageSettings {
    id: string;
    product_tag_label: string;
    pricing_note: string;
    delivery_title: string;
    pincode_placeholder: string;
    delivery_button_text: string;
    created_at?: string;
    updated_at?: string;
}

// Default fallback values
export const defaultProductPageSettings: Omit<ProductPageSettings, 'id' | 'created_at' | 'updated_at'> = {
    product_tag_label: 'Furniture',
    pricing_note: '* GST and shipping charges extra. Bulk discounts available.',
    delivery_title: 'Check Delivery',
    pincode_placeholder: 'Enter pincode',
    delivery_button_text: 'Check',
};

export const productPageSettingsService = {
    // Get product page settings
    async getSettings(): Promise<ProductPageSettings> {
        // Cast to any first since table may not be in generated types yet
        const query = supabase
            .from('product_page_settings' as any)
            .select('*')
            .limit(1)
            .single();

        const { data, error } = await (query as unknown as Promise<{ data: ProductPageSettings | null; error: { message: string } | null }>);

        if (error || !data) {
            console.warn('Failed to fetch product page settings, using defaults:', error?.message);
            return {
                id: 'default',
                ...defaultProductPageSettings
            };
        }

        return data;
    },

    // Update product page settings (admin only)
    async updateSettings(settings: Partial<ProductPageSettings>): Promise<ProductPageSettings> {
        // First, get the current settings to get the ID
        const current = await this.getSettings();

        if (current.id === 'default') {
            // No existing record, create one
            const query = supabase
                .from('product_page_settings' as any)
                .insert({
                    ...defaultProductPageSettings,
                    ...settings,
                })
                .select()
                .single();

            const { data, error } = await (query as unknown as Promise<{ data: ProductPageSettings | null; error: { message: string } | null }>);

            if (error) throw new Error(error.message);
            if (!data) throw new Error('Failed to create settings');
            return data;
        }

        // Update existing record
        const query = supabase
            .from('product_page_settings' as any)
            .update({
                ...settings,
                updated_at: new Date().toISOString(),
            })
            .eq('id', current.id)
            .select()
            .single();

        const { data, error } = await (query as unknown as Promise<{ data: ProductPageSettings | null; error: { message: string } | null }>);

        if (error) throw new Error(error.message);
        if (!data) throw new Error('Failed to update settings');
        return data;
    },
};
