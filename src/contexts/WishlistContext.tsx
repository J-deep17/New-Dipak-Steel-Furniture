
import { createContext, useContext, useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { wishlistService, WishlistItem } from "@/services/wishlist";
import { toast } from "sonner";
import { useNavigate } from "react-router-dom";

interface WishlistContextType {
    wishlist: WishlistItem[];
    isLoading: boolean;
    addToWishlist: (productId: string) => Promise<void>;
    removeFromWishlist: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
}

const WishlistContext = createContext<WishlistContextType | undefined>(undefined);

export const WishlistProvider = ({ children }: { children: React.ReactNode }) => {
    const [wishlist, setWishlist] = useState<WishlistItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [userId, setUserId] = useState<string | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setUserId(session?.user?.id || null);
        });

        const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
            setUserId(session?.user?.id || null);
        });

        return () => subscription.unsubscribe();
    }, []);

    useEffect(() => {
        if (userId) {
            loadWishlist();
        } else {
            setWishlist([]);
            setIsLoading(false);
        }
    }, [userId]);

    const loadWishlist = async () => {
        try {
            if (!userId) return;
            setIsLoading(true);
            const data = await wishlistService.getWishlist(userId);
            setWishlist(data);
        } catch (error) {
            console.error("Failed to load wishlist", error);
        } finally {
            setIsLoading(false);
        }
    };

    const addToWishlist = async (productId: string) => {
        if (!userId) {
            toast.error("Please login to use wishlist");
            // Optionally navigate to login
            return;
        }

        // Optimistic update
        const tempId = Math.random().toString();
        // We can't easily optimistically add full item without product data, 
        // so we just rely on refetch or assuming network is fast.
        // For now, let's just await.

        try {
            await wishlistService.addToWishlist(userId, productId);
            toast.success("Added to wishlist");
            loadWishlist();
        } catch (error) {
            console.error(error);
            toast.error("Failed to add to wishlist");
        }
    };

    const removeFromWishlist = async (productId: string) => {
        if (!userId) return;

        try {
            const oldWishlist = [...wishlist];
            // Optimistic removal
            setWishlist(prev => prev.filter(item => item.product_id !== productId));

            await wishlistService.removeFromWishlist(userId, productId);
            toast.success("Removed from wishlist");
        } catch (error) {
            console.error("Failed to remove from wishlist", error);
            loadWishlist(); // Revert
            toast.error("Failed to remove from wishlist");
        }
    };

    const isInWishlist = (productId: string) => {
        return wishlist.some(item => item.product_id === productId);
    };

    return (
        <WishlistContext.Provider value={{ wishlist, isLoading, addToWishlist, removeFromWishlist, isInWishlist }}>
            {children}
        </WishlistContext.Provider>
    );
};

export const useWishlist = () => {
    const context = useContext(WishlistContext);
    if (context === undefined) {
        throw new Error("useWishlist must be used within a WishlistProvider");
    }
    return context;
};
