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
  selectedVariantId?: string | null;
  selectedVariant?: any;
  onVariantChange?: (id: string) => void;
  rating?: number;
  totalReviews?: number;
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
  selectedVariantId,
  selectedVariant,
  onVariantChange,
  rating = 0,
  totalReviews = 0,
}: ProductInfoProps) => {
  const [pincode, setPincode] = useState("");
  const [deliveryInfo, setDeliveryInfo] = useState<string | null>(null);

  // Pricing Logic
  const hasDiscount = product.discount_percent > 0; // Check DB discount logic if available
  // Calculate price based on variant override if exists
  const currentPrice = (selectedVariant?.price !== null && selectedVariant?.price !== undefined)
    ? selectedVariant.price
    : product.price;

  const mrp = product.mrp; // Assuming MRP is on product for now

  // Stock Logic
  const isVariantActive = selectedVariant ? selectedVariant.is_active : true;
  const variantStock = selectedVariant ? selectedVariant.stock : null; // If null, assume unlimited/managed elsewhere
  // Only show out of stock if we are tracking stock (stock !== null) and it is <= 0, or if strictly inactive
  const isOutOfStock = (!isVariantActive) || (variantStock !== null && variantStock <= 0);

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
      <div className="flex flex-wrap gap-2 mb-2">
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
        {isOutOfStock && <Badge variant="destructive">Out of Stock</Badge>}
      </div>

      <div>
        <h1 className="text-2xl md:text-3xl font-bold text-foreground">
          {product.title}
        </h1>
      </div>

      {/* Price Section */}
      <div className="p-4 bg-muted/50 rounded-xl space-y-2">
        <div className="flex items-baseline gap-3">
          <span className="text-3xl font-bold text-primary">
            {formatCurrency(currentPrice)}
          </span>
          {mrp && mrp > currentPrice && (
            <>
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(mrp)}
              </span>
              {/* Calculate dynamic discount if price changed? Or just use static one */}
              {/* For now, simplistic discount display */}
              {((mrp - currentPrice) / mrp * 100) > 0 && (
                <Badge className="bg-green-500 hover:bg-green-600">
                  {Math.round(((mrp - currentPrice) / mrp) * 100)}% OFF
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
      {product.variants && product.variants.length > 0 && (
        <div className="space-y-3">
          <p className="font-medium">
            Color: <span className="text-muted-foreground">
              {product.variants.find((v: any) => v.id === selectedVariantId)?.color_name || "Select"}
            </span>
          </p>
          <div className="flex flex-wrap gap-2">
            {product.variants.map((variant: any) => (
              <button
                key={variant.id}
                onClick={() => onVariantChange?.(variant.id)}
                className={cn(
                  "relative px-4 py-2 rounded-lg border-2 text-sm font-medium transition-all flex items-center gap-2",
                  selectedVariantId === variant.id
                    ? "border-primary bg-primary/5 text-primary"
                    : "border-border hover:border-primary/50",
                  // Dim inactive/OOS variants?
                  (!variant.is_active || (variant.stock !== null && variant.stock <= 0)) && "opacity-60 grayscale"
                )}
                title={variant.color_name}
              >
                {variant.color_hex && (
                  <span
                    className="w-4 h-4 rounded-full border border-gray-200 shadow-sm"
                    style={{ backgroundColor: variant.color_hex }}
                  />
                )}
                {variant.color_name}
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
              disabled={quantity <= 1 || isOutOfStock}
            >
              <Minus className="h-4 w-4" />
            </Button>
            <span className="w-12 text-center font-medium">{quantity}</span>
            <Button
              variant="ghost"
              size="icon"
              className="h-10 w-10 rounded-l-none"
              onClick={incrementQuantity}
              disabled={quantity >= 100 || isOutOfStock}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3">
        <Button
          size="lg"
          className="flex-1 h-12 text-base"
          onClick={onAddToCart}
          disabled={isOutOfStock}
        >
          {isOutOfStock ? (
            "Out of Stock"
          ) : isInCart ? (
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
          disabled={isOutOfStock}
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
