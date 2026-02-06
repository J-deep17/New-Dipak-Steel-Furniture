import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { Product } from "@/services/products";
import { supabase } from "@/integrations/supabase/client";
import { cartService } from "@/services/cart";
import { toast } from "sonner";

interface CartItem {
  product: Product;
  quantity: number;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (product: Product) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => Promise<void>;
  getTotalItems: () => number;
  isInCart: (productId: string) => boolean;
  sendToWhatsApp: () => void;
  isLoading: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider = ({ children }: { children: ReactNode }) => {
  const [items, setItems] = useState<CartItem[]>([]);
  const [userId, setUserId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Auth observer
  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUserId(session?.user?.id || null);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setUserId(session?.user?.id || null);
    });

    return () => subscription.unsubscribe();
  }, []);

  // Sync with DB or Load Local
  useEffect(() => {
    const loadCart = async () => {
      setIsLoading(true);
      if (userId) {
        try {
          const dbItems = await cartService.getCart(userId);
          const mappedItems: CartItem[] = dbItems.map((item: any) => ({
            product: {
              ...item.products,
              category: item.products.category // mapped from service select
            },
            quantity: item.quantity
          }));
          setItems(mappedItems);
        } catch (error) {
          console.error("Failed to load cart from DB", error);
        }
      } else {
        // Load from local storage if needed, or just keep state if we want session-only for guests.
        // Assuming session-only for guests for now as there's no localStorage code in previous file.
        // If we want detailed persistence for guests, we'd add localStorage here.
        // Let's assume previous implementation was just in-memory state (React useState), 
        // so we start empty or keep what's there if valid.
        // Actually, previous code: const [items, setItems] = useState<CartItem[]>([]); 
        // So it was transient. We'll keep it transient for guests.
      }
      setIsLoading(false);
    };

    loadCart();
  }, [userId]);

  const addToCart = async (product: Product) => {
    // Optimistic update
    const previousItems = [...items];
    setItems((prev) => {
      const existing = prev.find((item) => item.product.id === product.id);
      if (existing) {
        return prev.map((item) =>
          item.product.id === product.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prev, { product, quantity: 1 }];
    });

    if (userId) {
      try {
        await cartService.addToCart(userId, product.id, 1);
      } catch (error) {
        console.error(error);
        setItems(previousItems); // Revert
        toast.error("Failed to update cart");
      }
    }
  };

  const removeFromCart = async (productId: string) => {
    const previousItems = [...items];
    setItems((prev) => prev.filter((item) => item.product.id !== productId));

    if (userId) {
      try {
        await cartService.removeFromCart(userId, productId);
      } catch (error) {
        console.error(error);
        setItems(previousItems);
        toast.error("Failed to remove item");
      }
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }

    const previousItems = [...items];
    setItems((prev) =>
      prev.map((item) =>
        item.product.id === productId ? { ...item, quantity } : item
      )
    );

    if (userId) {
      try {
        await cartService.updateQuantity(userId, productId, quantity);
      } catch (error) {
        console.error(error);
        setItems(previousItems);
        toast.error("Failed to update quantity");
      }
    }
  };

  const clearCart = async () => {
    const previousItems = [...items];
    setItems([]);

    if (userId) {
      try {
        await cartService.clearCart(userId);
      } catch (error) {
        console.error(error);
        setItems(previousItems);
        toast.error("Failed to clear cart");
      }
    }
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const isInCart = (productId: string) => {
    return items.some((item) => item.product.id === productId);
  };

  const sendToWhatsApp = () => {
    if (items.length === 0) return;

    const phoneNumber = "919824044585";

    // Build the message with product list
    const productList = items
      .map(
        (item, index) =>
          `${index + 1}. ${item.product.title} (${item.product.category?.name || 'Furniture'}) - Qty: ${item.quantity}`
      )
      .join("\n");

    const message = `Hello! I'm interested in the following products:\n\n${productList}\n\nPlease provide pricing and availability details.`;

    // Encode the message for URL - validate and sanitize
    const encodedMessage = encodeURIComponent(message.substring(0, 2000)); // Limit message length
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <CartContext.Provider
      value={{
        items,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        getTotalItems,
        isInCart,
        sendToWhatsApp,
        isLoading
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
};
