import { supabase } from "@/integrations/supabase/client";

export interface Testimonial {
    id: string;
    name: string;
    designation: string | null;
    company: string | null;
    city: string | null;
    review_text: string;
    rating: number;
    photo_url: string | null;
    show_on_home: boolean;
    display_order: number;
    active: boolean;
    created_at: string;
}

export type CreateTestimonialDTO = Omit<Testimonial, "id" | "created_at">;
export type UpdateTestimonialDTO = Partial<CreateTestimonialDTO>;

export const testimonialsService = {
    // Public: Get testimonials for homepage
    getTestimonials: async () => {
        const { data, error } = await supabase
            .from('testimonials' as any)
            .select('*')
            .eq('active', true)
            .eq('show_on_home', true)
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data as unknown as Testimonial[];
    },

    // Admin: Get all testimonials
    getAllTestimonials: async () => {
        const { data, error } = await supabase
            .from('testimonials' as any)
            .select('*')
            .order('display_order', { ascending: true });

        if (error) throw error;
        return data as unknown as Testimonial[];
    },

    // Admin: Create testimonial
    createTestimonial: async (testimonial: CreateTestimonialDTO) => {
        const { data, error } = await supabase
            .from('testimonials' as any)
            .insert(testimonial)
            .select()
            .single();

        if (error) throw error;
        return data as unknown as Testimonial;
    },

    // Admin: Update testimonial
    updateTestimonial: async (id: string, updates: UpdateTestimonialDTO) => {
        const { data, error } = await supabase
            .from('testimonials' as any)
            .update(updates)
            .eq('id', id)
            .select()
            .single();

        if (error) throw error;
        return data as unknown as Testimonial;
    },

    // Admin: Delete testimonial
    deleteTestimonial: async (id: string) => {
        const { error } = await supabase
            .from('testimonials' as any)
            .delete()
            .eq('id', id);

        if (error) throw error;
    }
};
