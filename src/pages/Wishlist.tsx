import Layout from "@/components/layout/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Heart, ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";
import {
    Tooltip,
    TooltipContent,
    TooltipProvider,
    TooltipTrigger,
} from "@/components/ui/tooltip";

const Wishlist = () => {
    const { wishlist, removeFromWishlist, isLoading } = useWishlist();
    const { addToCart, isInCart } = useCart();
    const [isLoggedIn, setIsLoggedIn] = useState<boolean | null>(null);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            setIsLoggedIn(!!session?.user);
        });
    }, []);

    // Auth check loading
    if (isLoggedIn === null || isLoading) {
        return (
            <Layout>
                <div className="min-h-[60vh] flex items-center justify-center">
                    <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
                </div>
            </Layout>
        );
    }

    // Not logged in
    if (!isLoggedIn) {
        return (
            <Layout>
                <div className="container max-w-7xl py-20 px-4">
                    <div className="max-w-md mx-auto text-center space-y-6">
                        <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-6">
                            <Heart className="w-8 h-8 text-muted-foreground" />
                        </div>
                        <h1 className="text-2xl font-bold">Please Log In</h1>
                        <p className="text-muted-foreground">
                            Sign in to save items to your wishlist and access them from anywhere.
                        </p>
                        <Button asChild size="lg" className="rounded-full px-8">
                            <Link to="/login">Login / Sign Up</Link>
                        </Button>
                    </div>
                </div>
            </Layout>
        );
    }

    return (
        <Layout>
            <div className="container max-w-7xl py-12 px-4 sm:px-6">
                <div className="flex items-center justify-between mb-8">
                    <h1 className="text-3xl font-bold tracking-tight">My Wishlist</h1>
                    <span className="text-muted-foreground">{wishlist.length} Items</span>
                </div>

                {wishlist.length === 0 ? (
                    <div className="min-h-[400px] flex flex-col items-center justify-center text-center border-t border-dashed">
                        <div className="w-20 h-20 bg-muted/30 rounded-full flex items-center justify-center mb-6">
                            <Heart className="w-10 h-10 text-muted-foreground/50" />
                        </div>
                        <h2 className="text-xl font-semibold mb-2">Your wishlist is empty</h2>
                        <p className="text-muted-foreground max-w-sm mb-8">
                            Save items you love to review them here later.
                        </p>
                        <Button asChild size="lg" className="rounded-full px-8">
                            <Link to="/products">
                                Browse Products
                                <ArrowRight className="w-4 h-4 ml-2" />
                            </Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
                        {wishlist.map((item) => {
                            const product = item.product;
                            if (!product) return null;

                            const inCart = isInCart(product.id);

                            return (
                                <div
                                    key={item.id}
                                    className="group relative flex flex-col bg-white rounded-xl overflow-hidden border border-transparent hover:border-border hover:shadow-lg transition-all duration-300"
                                >
                                    {/* Image Area */}
                                    <Link to={`/product/${product.slug}`} className="relative aspect-square bg-secondary/10 overflow-hidden block">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.title}
                                                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Image</div>
                                        )}

                                        {/* Remove Button - Top Right */}
                                        <div className="absolute top-2 right-2 z-10">
                                            <TooltipProvider>
                                                <Tooltip>
                                                    <TooltipTrigger asChild>
                                                        <button
                                                            onClick={(e) => {
                                                                e.preventDefault();
                                                                e.stopPropagation();
                                                                removeFromWishlist(product.id);
                                                            }}
                                                            className="p-2 rounded-full bg-white/90 backdrop-blur-sm shadow-sm hover:bg-white text-red-500 transition-all hover:scale-110 cursor-pointer"
                                                            aria-label="Remove from wishlist"
                                                        >
                                                            <Heart className="w-4 h-4 fill-current" />
                                                        </button>
                                                    </TooltipTrigger>
                                                    <TooltipContent>
                                                        <p>Remove from wishlist</p>
                                                    </TooltipContent>
                                                </Tooltip>
                                            </TooltipProvider>
                                        </div>
                                    </Link>

                                    {/* Content Area */}
                                    <div className="flex flex-col flex-1 p-4">
                                        <Link to={`/product/${product.slug}`} className="block mb-2">
                                            <h3 className="font-semibold text-base text-gray-900 group-hover:text-primary transition-colors line-clamp-1" title={product.title}>
                                                {product.title}
                                            </h3>
                                        </Link>

                                        <div className="mb-4">
                                            <span className="text-lg font-bold text-gray-900">
                                                ₹{product.base_price?.toLocaleString('en-IN') || product.price?.toLocaleString('en-IN') || 0}
                                            </span>
                                        </div>

                                        <div className="mt-auto">
                                            <Button
                                                className={cn(
                                                    "w-full rounded-lg gap-2",
                                                    inCart ? "bg-green-50 text-green-700 hover:bg-green-100 border border-green-200" : "hover:bg-primary/90"
                                                )}
                                                variant={inCart ? "ghost" : "default"}
                                                onClick={() => addToCart({
                                                    id: product.id,
                                                    name: product.title,
                                                    price: product.base_price || product.price,
                                                    image: product.image_url || "/placeholder.svg",
                                                    category: "Wishlist",
                                                    description: ""
                                                } as any)}
                                            >
                                                {inCart ? (
                                                    <>In Cart</>
                                                ) : (
                                                    <>
                                                        <ShoppingCart className="w-4 h-4" />
                                                        Add to Cart
                                                    </>
                                                )}
                                            </Button>
                                        </div>
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default Wishlist;
