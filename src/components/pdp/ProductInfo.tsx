import { useState } from "react";
import { formatCurrency } from "@/lib/currency";
import { analyticsService } from "@/services/analytics";
// import { Product } from "@/data/products"; // REMOVED
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import {
  Star,
  Truck,
  ShieldCheck,
  Minus,
  Plus,
  ShoppingCart,
  Zap,
  Check,
  MapPin,
  Phone,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductInfoProps {
  product: any;
  quantity: number;
  setQuantity: (qty: number) => void;
  onAddToCart: () => void;
  onBuyNow: () => void;
  isInCart: boolean;
  isInWishlist: boolean;
  onToggleWishlist: () => void;
  pageSettings?: {
    product_tag_label: string;
    pricing_note: string;
    delivery_title: string;
    pincode_placeholder: string;
    delivery_button_text: string;
  };
}

const ProductInfo = ({
  product,
  quantity,
  setQuantity,
  onAddToCart,
  onBuyNow,
  isInCart,
  isInWishlist,
  onToggleWishlist,
  pageSettings,
}: ProductInfoProps) => {
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);
  const [selectedColor, setSelectedColor] = useState(
    product.colorVariants?.[0]?.color || null
  );

  // Mock pricing (since no price in data, we'll show "Get Quote")
  const hasDiscount = false;
  const mrp = null;
  const salePrice = null;

  const checkDelivery = () => {
    if (pincode.length !== 6) {
      setDeliveryInfo("Please enter a valid 6-digit pincode");
      return;
    }
    // Simulate delivery check
    setDeliveryInfo("Delivery available in 5-7 business days");
  };

  const decrementQuantity = () => {
    if (quantity > 1) setQuantity(quantity - 1);
  };

  const incrementQuantity = () => {
    if (quantity < 100) setQuantity(quantity + 1);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap gap-2">
        {(product as any).backHeight && (
          <Badge variant="secondary">
            {(product as any).backHeight === "HB"
              ? "High Back"
              : (product as any).backHeight === "MB"
                ? "Medium Back"
                : "Low Back"}
          </Badge>
        )}
        <Badge variant="outline">{(product as any).category?.name || pageSettings?.product_tag_label || "Furniture"}</Badge>
      </div>

      <div className="flex justify-between items-start gap-4">
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {product.title}
        </h1>
        <Button
          variant="ghost"
          size="icon"
          className="rounded-full hover:bg-red-50 hover:text-red-500 transition-colors"
          onClick={onToggleWishlist}
          aria-label={isInWishlist ? "Remove from wishlist" : "Add to wishlist"}
        >
          <Star className={cn("h-6 w-6", isInWishlist ? "fill-red-500 text-red-500" : "text-muted-foreground")} />
          {/* Note: User usually expects Heart for wishlist, but Star is imported. I'll switch to Heart if available or stick to Star */}
        </Button>
      </div>

      {/* Price Section */}
      <div className="p-4 bg-muted/50 rounded-xl space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(product.price)}
          </span>
          {product.mrp && product.mrp > product.price && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                ₹{product.mrp.toLocaleString()}
              </span>
              {product.discount_percent > 0 && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  {product.discount_percent}% OFF
                </Badge>
              )}
            </>
          )}
        </div>
        <p className="text-sm text-muted-foreground">
          {pageSettings?.pricing_note || "* GST and shipping charges extra. Bulk discounts available."}
        </p>
      </div>

      {/* Color Variants */}
      {product.colorVariants && product.colorVariants.length > 1 && (
        <div className="space-y-3">
          <p className="font-medium">
            Color: <span className="text-muted-foreground">{selectedColor}</span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.colorVariants.map((variant: any) => (
              <button
                key={variant.color}
                onClick={() => setSelectedColor(variant.color)}
                className={cn(
                  "px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all",
                  selectedColor === variant.color
                    ? "border-primary bg-primary/10 text-primary"
                    : "border-border hover:border-primary/50"
                )}
              >
                {variant.color}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="space-y-3">
        <div className="flex items-center gap-2">
          <MapPin className="h-4 w-4 text-muted-foreground" />
          <span className="font-medium">{pageSettings?.delivery_title || "Check Delivery"}</span>
        </div>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder={pageSettings?.pincode_placeholder || "Enter pincode"}
            value={pincode}
            onChange={(e) => setPincode(e.target.value.replace(/\D/g, "").slice(0, 6))}
            className="max-w-[180px]"
          />
          <Button variant="outline" onClick={checkDelivery}>
            {pageSettings?.delivery_button_text || "Check"}
          </Button>
        </div>
        {deliveryInfo && (
          <p
            className={cn(
              "text-sm flex items-center gap-2",
              deliveryInfo.includes("available")
                ? "text-green-600"
                : "text-destructive"
            )}
          >
            <Truck className="h-4 w-4" />
            {deliveryInfo}
          </p>
        )}
      </div>

      {/* Quantity Selector */}
      <div className="space-y-3">
        <p className="font-medium">Quantity</p>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-r-none"
              onClick={decrementQuantity}
              disabled={quantity <= 1}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={incrementQuantity}
              disabled={quantity >= 100}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
          <span className="text-sm text-muted-foreground">
            (Min: 1, Max: 100)
          </span>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1 h-12 text-base"
          onClick={onAddToCart}
        >
          {isInCart ? (
            <>
              <Check className="mr-2 h-5 w-5" />
              Added to Cart
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-5 w-5" />
              Add to Cart
            </>
          )}
        </Button>
        <Button
          size="lg"
          variant="secondary"
          className="flex-1 h-12 text-base bg-green-600 hover:bg-green-700 text-white"
          onClick={onBuyNow}
        >
          <Zap className="mr-2 h-5 w-5" />
          Buy Now via WhatsApp
        </Button>
      </div>

      {/* Call Now */}
      <Button
        variant="outline"
        className="w-full h-11"
        onClick={() => analyticsService.trackClick('call', 'product_page', product.id)}
        asChild
      >
        <a href="tel:+919824044585">
          <Phone className="mr-2 h-4 w-4" />
          Call Now: +91 98240 44585
        </a>
      </Button>

      {/* Trust Badges */}
      <div className="grid grid-cols-2 gap-4 pt-4 border-t">
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <Truck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">Free Shipping</p>
            <p className="text-xs text-muted-foreground">On bulk orders</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <div className="p-2 bg-primary/10 rounded-full">
            <ShieldCheck className="h-5 w-5 text-primary" />
          </div>
          <div>
            <p className="font-medium text-sm">1 Year Warranty</p>
            <p className="text-xs text-muted-foreground">Manufacturing defects</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfo;
