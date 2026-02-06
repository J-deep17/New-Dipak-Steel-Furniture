import { Product } from "@/services/products";
import { Button } from "@/components/ui/button";
import { ShoppingCart, Check } from "lucide-react";

interface StickyMobileCartProps {
  product: Product;
  quantity: number;
  onAddToCart: () => void;
  isInCart: boolean;
}

const StickyMobileCart = ({
  product,
  quantity,
  onAddToCart,
  isInCart,
}: StickyMobileCartProps) => {
  return (
    <div className="fixed bottom-0 left-0 right-0 bg-background border-t shadow-lg p-4 md:hidden z-50">
      <div className="flex items-center gap-4">
        <div className="flex-1 min-w-0">
          <p className="font-medium truncate">{product.title}</p>
          <p className="text-sm text-muted-foreground">Qty: {quantity}</p>
        </div>
        <Button
          size="lg"
          className="shrink-0"
          onClick={onAddToCart}
        >
          {isInCart ? (
            <>
              <Check className="mr-2 h-4 w-4" />
              Added
            </>
          ) : (
            <>
              <ShoppingCart className="mr-2 h-4 w-4" />
              Add to Cart
            </>
          )}
        </Button>
      </div>
    </div>
  );
};

export default StickyMobileCart;
