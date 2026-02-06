import { supabase } from "@/integrations/supabase/client";

export interface AnalyticsStats {
    totalProducts: number;
    activeProducts: number;
    totalCategories: number;
    totalEnquiries: number;
    visitorsToday: number; // Proxy: distinct users/sessions or total views
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
    // Tracking
    trackProductView: async (productId: string) => {
        await supabase.from("product_views").insert({ product_id: productId });
    },

    trackCategoryView: async (categoryId: string) => {
        await supabase.from("category_views").insert({ category_id: categoryId });
    },

    trackClick: async (type: 'whatsapp' | 'call', location: string, productId?: string) => {
        await supabase.from("click_events").insert({ type, location, product_id: productId });
    },

    submitEnquiry: async (data: { name: string; email?: string; phone?: string; message: string; product_id?: string }) => {
        return await supabase.from("enquiries").insert(data);
    },

    // Dashboard Stats
    getDashboardStats: async (): Promise<AnalyticsStats> => {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const todayIso = today.toISOString();

        // Run in parallel
        const [
            { count: totalProducts },
            { count: activeProducts },
            { count: totalCategories },
            { count: totalEnquiries },
            { count: enquiriesToday },
            { count: productViewsToday }, // Using views as visitor proxy for now
        ] = await Promise.all([
            supabase.from("products").select("*", { count: 'exact', head: true }),
            supabase.from("products").select("*", { count: 'exact', head: true }).eq('is_active', true),
            supabase.from("categories").select("*", { count: 'exact', head: true }),
            supabase.from("enquiries").select("*", { count: 'exact', head: true }),
            supabase.from("enquiries").select("*", { count: 'exact', head: true }).gte('created_at', todayIso),
            supabase.from("product_views").select("*", { count: 'exact', head: true }).gte('created_at', todayIso),
        ]);

        return {
            totalProducts: totalProducts || 0,
            activeProducts: activeProducts || 0,
            totalCategories: totalCategories || 0,
            totalEnquiries: totalEnquiries || 0,
            enquiriesToday: enquiriesToday || 0,
            visitorsToday: productViewsToday || 0, // Simple proxy
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

        data.forEach(item => {
            const date = item.created_at.split('T')[0];
            map.set(date, (map.get(date) || 0) + 1);
        });

        return Array.from(map.entries())
            .map(([date, count]) => ({ date, count }))
            .sort((a, b) => a.date.localeCompare(b.date));
    },

    getTopCategories: async (): Promise<CategoryData[]> => {
        // This is tricky without a join aggregation views. 
        // We'll fetch category views and client-side aggregate for now, or use products count per category.
        // User asked for "Top Categories by enquiries".
        // Let's fetch enquiries with product->category.

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
