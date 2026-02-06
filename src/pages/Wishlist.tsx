
import Layout from "@/components/layout/Layout";
import { useWishlist } from "@/contexts/WishlistContext";
import { Button } from "@/components/ui/button";
import { Trash2, ShoppingCart } from "lucide-react";
import { Link } from "react-router-dom";
import { useCart } from "@/contexts/CartContext";

const Wishlist = () => {
    const { wishlist, removeFromWishlist, isLoading } = useWishlist();
    const { addToCart } = useCart();

    if (isLoading) return (
        <Layout>
            <div className="container py-20 text-center">Loading wishlist...</div>
        </Layout>
    );

    return (
        <Layout>
            <div className="container py-12">
                <h1 className="text-3xl font-bold mb-8">My Wishlist</h1>

                {wishlist.length === 0 ? (
                    <div className="text-center py-12 border rounded-lg bg-gray-50">
                        <p className="text-muted-foreground mb-4">Your wishlist is empty.</p>
                        <Button asChild>
                            <Link to="/products">Browse Products</Link>
                        </Button>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {wishlist.map((item) => {
                            const product = item.products;
                            if (!product) return null;

                            return (
                                <div key={item.id} className="border rounded-lg overflow-hidden flex flex-col group bg-white shadow-sm hover:shadow-md transition-shadow">
                                    <div className="relative aspect-square bg-secondary/20">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.title}
                                                className="w-full h-full object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">No Image</div>
                                        )}
                                    </div>
                                    <div className="p-4 flex-1 flex flex-col">
                                        <h3 className="font-semibold text-lg mb-1">{product.title}</h3>
                                        <p className="text-muted-foreground text-sm mb-4 line-clamp-2">{product.description}</p>

                                        <div className="mt-auto flex gap-2">
                                            <Button
                                                className="flex-1"
                                                variant="default"
                                                onClick={() => addToCart({
                                                    id: product.id,
                                                    name: product.title,
                                                    price: product.price,
                                                    image: product.image_url || "/placeholder.svg",
                                                    category: "Wishlist", // Fallback
                                                    description: product.short_description || ""
                                                } as any)}
                                            >
                                                <ShoppingCart className="w-4 h-4 mr-2" />
                                                Add to Cart
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="icon"
                                                className="text-destructive hover:bg-destructive/10"
                                                onClick={() => removeFromWishlist(product.id)}
                                            >
                                                <Trash2 className="w-4 h-4" />
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
