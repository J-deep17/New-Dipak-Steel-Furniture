import { supabase as supabaseClient } from "@/integrations/supabase/client";

// Cast to any to avoid type errors with non-existent analytics tables
const supabase = supabaseClient as any;

export interface AnalyticsStats {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalEnquiries: number;
    visitorsToday: number;
    enquiriesToday: number;
}

export interface ChartData {
    date: string;
    count: number;
}

export interface CategoryData {
    name: string;
    count: number;
}

export const analyticsService = {
    // Track product view - fails silently if table doesn't exist
    trackProductView: async (productId: string) => {
        try {
            await supabase.from("product_views").insert({ product_id: productId });
        } catch (e) {
            // Table may not exist - fail silently
        }
    },

    // Track category view - fails silently if table doesn't exist
    trackCategoryView: async (categoryId: string) => {
        try {
            await supabase.from("category_views").insert({ category_id: categoryId });
        } catch (e) {
            // Table may not exist - fail silently
        }
    },

    // Track click events - fails silently if table doesn't exist
    trackClick: async (type: 'whatsapp' | 'call', location: string, productId?: string) => {
        try {
            await supabase.from("click_events").insert({ type, location, product_id: productId });
        } catch (e) {
            // Table may not exist - fail silently
        }
    },

    submitEnquiry: async (data: { name: string; email?: string; phone?: string; message: string; product_id?: string }) => {
        return await supabase.from("enquiries").insert(data);
    },

    // Dashboard Stats
    getDashboardStats: async (): Promise<AnalyticsStats> => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIso = today.toISOString();

        // Run in parallel with error handling for optional tables
        const [
            productsResult,
            activeProductsResult,
            categoriesResult,
            enquiriesResult,
            enquiriesTodayResult,
        ] = await Promise.all([
            supabase.from("products").select("*", { count: 'exact', head: true }),
            supabase.from("products").select("*", { count: 'exact', head: true }).eq('is_active', true),
            supabase.from("categories").select("*", { count: 'exact', head: true }),
            supabase.from("enquiries").select("*", { count: 'exact', head: true }),
            supabase.from("enquiries").select("*", { count: 'exact', head: true }).gte('created_at', todayIso),
        ]);

        // Try to get product views count separately (may not exist)
        let productViewsToday = 0;
        try {
            const { count } = await supabase.from("product_views").select("*", { count: 'exact', head: true }).gte('created_at', todayIso);
            productViewsToday = count || 0;
        } catch (e) {
            // Table doesn't exist - use 0
        }

        return {
            totalProducts: productsResult.count || 0,
            activeProducts: activeProductsResult.count || 0,
            totalCategories: categoriesResult.count || 0,
            totalEnquiries: enquiriesResult.count || 0,
            enquiriesToday: enquiriesTodayResult.count || 0,
            visitorsToday: productViewsToday,
        };
    },

    getEnquiriesTrend: async (): Promise<ChartData[]> => {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

        const { data } = await supabase
            .from("enquiries")
            .select("created_at")
            .gte("created_at", thirtyDaysAgo.toISOString())
            .order("created_at", { ascending: true });

        if (!data) return [];

        // Aggregate by day
        const map = new Map<string, number>();
        // Fill last 30 days with 0
        for (let i = 0; i < 30; i++) {
            const d = new Date();
            d.setDate(d.getDate() - i);
            map.set(d.toISOString().split('T')[0], 0);
        }

        data.forEach((item: any) => {
            const date = item.created_at.split('T')[0];
            map.set(date, (map.get(date) || 0) + 1);
        });

        return Array.from(map.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    },

    getTopCategories: async (): Promise<CategoryData[]> => {
        const { data } = await supabase
            .from("enquiries")
            .select("product_id, products(category_id, categories(name))")
            .not("product_id", "is", null);

        if (!data) return [];

        const counts: Record<string, number> = {};
        data.forEach((item: any) => {
            const catName = item.products?.categories?.name;
            if (catName) {
                counts[catName] = (counts[catName] || 0) + 1;
            }
        });

        return Object.entries(counts)
            .map(([name, count]) => ({ name, count }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 5);
    },

    getRecentEnquiries: async () => {
        const { data } = await supabase
            .from("enquiries")
            .select("*, products(title)")
            .order("created_at", { ascending: false })
            .limit(10);
        return data || [];
    }
};
