import { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { Link } from "react-router-dom";
import { Product } from "@/services/products";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ZoomIn, ShoppingCart, Heart } from "lucide-react";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import { useToast } from "@/hooks/use-toast";
import { cn } from "@/lib/utils";

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isZoomOpen, setIsZoomOpen] = useState(false);
  const { addToCart, isInCart } = useCart();
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
  const { toast } = useToast();

  const inCart = isInCart(product.id);

  // Use uploaded image or placeholder. prioritize images array
  const imageSrc = (product.images && product.images.length > 0)
    ? product.images[0]
    : (product.image_url || "/placeholder.svg");

  const productLink = `/product/${product.slug || product.id}`;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault(); // Prevent link navigation if inside a link
    e.stopPropagation();

    addToCart({
      id: product.id,
      name: product.title,
      price: product.price,
      image: imageSrc,
      category: (product as any).category?.name || "Product",
      description: product.description || product.short_description || "",
      features: [],
      sections: []
    } as any);

    toast({
      title: "Added to cart",
      description: `${product.title} has been added.`,
    });
  };

  // Calculate discount if not provided but mrp exists
  let discountDisplay = null;
  const discountPercent = product.discount_percent || (product.mrp && product.mrp > product.price ? Math.round(((product.mrp - product.price) / product.mrp) * 100) : 0);

  if (discountPercent > 0) {
    discountDisplay = <Badge className="absolute left-3 top-3 bg-red-500 hover:bg-red-600">{discountPercent}% OFF</Badge>;
  }

  return (
    <div className="group relative flex flex-col overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:border-accent/30 hover:shadow-lg h-full">
      <Link to={productLink} className="relative aspect-square w-full overflow-hidden bg-secondary/50 block">
        <img
          src={imageSrc}
          alt={product.title}
          className="h-full w-full object-cover transition-all duration-500 group-hover:scale-110"
        />
        {discountDisplay}

        {/* Quick action buttons overlay */}
        <div className="absolute right-3 top-3 flex flex-col gap-2 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              setIsZoomOpen(true);
            }}
          >
            <ZoomIn className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className="h-8 w-8 rounded-full bg-background/80 backdrop-blur-sm"
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
              if (isInWishlist(product.id)) {
                removeFromWishlist(product.id);
              } else {
                addToWishlist(product.id);
              }
            }}
          >
            <Heart className={cn("h-4 w-4", isInWishlist(product.id) ? "fill-red-500 text-red-500" : "")} />
          </Button>
        </div>
      </Link>

      <div className="flex flex-1 flex-col p-4">
        <div className="mb-2">
          <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
            {(product as any).category?.name || "Collection"}
          </p>
          <Link to={productLink} className="block mt-1">
            <h3 className="text-base font-semibold text-foreground hover:text-primary line-clamp-2 min-h-[3rem]">
              {product.title}
            </h3>
          </Link>
        </div>

        <div className="mt-auto">
          <div className="mb-3 flex items-baseline gap-2">
            <span className="text-lg font-bold text-foreground">{formatCurrency(product.price)}</span>
            {product.mrp && product.mrp > product.price && (
              <span className="text-sm text-muted-foreground line-through">₹{product.mrp?.toLocaleString()}</span>
            )}
          </div>

          <Button
            onClick={handleAddToCart}
            variant={inCart ? "secondary" : "default"}
            className={`w-full gap-2 ${inCart ? 'bg-green-100 text-green-800 hover:bg-green-200' : ''}`}
          >
            <ShoppingCart className="h-4 w-4" />
            {inCart ? "In Cart" : "Add to Cart"}
          </Button>
        </div>
      </div>

      {isZoomOpen && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4 backdrop-blur-sm"
          onClick={(e) => {
            e.stopPropagation();
            setIsZoomOpen(false);
          }}
        >
          <img
            src={imageSrc}
            alt={product.title}
            className="max-h-[90vh] max-w-[90vw] rounded-lg object-contain"
          />
          <button className="absolute top-4 right-4 text-white p-2">
            Close
          </button>
        </div>
      )}
    </div>
  );
};

export default ProductCard;
