import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/products";
import { analyticsService } from "@/services/analytics";
import { productPageSettingsService } from "@/services/productPageSettings";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { useCart } from "@/contexts/CartContext";
import { useWishlist } from "@/contexts/WishlistContext";
import ProductImageGallery from "@/components/pdp/ProductImageGallery";
import ProductInfo from "@/components/pdp/ProductInfo";
import ProductTabs from "@/components/pdp/ProductTabs";
import RelatedProducts from "@/components/pdp/RelatedProducts";
import ProductBreadcrumb from "@/components/pdp/ProductBreadcrumb";
import StickyMobileCart from "@/components/pdp/StickyMobileCart";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Loader2 } from "lucide-react";

// Helper to map Supabase product to the shape expected by UI components
// (Transitionary step until components are fully refactored)
const mapProductToUI = (product: any) => ({
  ...product,
  name: product.title,
  category: product.category?.name || "Uncategorized",
  categorySlug: product.category?.slug,
  // Use DB key_features if available, else fallback
  features: product.key_features && product.key_features.length > 0 ? product.key_features : [product.short_description].filter(Boolean),
  description: product.description || "",
  images: product.images && product.images.length > 0 ? product.images : [product.image_url].filter(Boolean),
  colorVariants: [],
  isNew: false,
  backHeight: null,
  applications: [],
  finishes: [],
  // Pass through new fields
  specifications: product.specifications,
  dimensions: product.dimensions,
  warranty: {
    coverage: product.warranty_coverage || [],
    care: product.warranty_care || []
  },
});

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  const { data: product, isLoading } = useQuery({
    queryKey: ["product", productSlug],
    queryFn: () => productService.getProductBySlug(productSlug!),
    enabled: !!productSlug,
  });

  // Track View
  useEffect(() => {
    if (product?.id) {
      analyticsService.trackProductView(product.id);
    }
  }, [product?.id]);

  // Fetch page settings for dynamic text
  const { data: pageSettings } = useQuery({
    queryKey: ["product-page-settings"],
    queryFn: productPageSettingsService.getSettings,
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", product?.category?.slug],
    queryFn: () => productService.getProducts({ categorySlug: product?.category?.slug }),
    enabled: !!product?.category?.slug,
    select: (products) =>
      products
        .filter(p => p.id !== product?.id)
        .slice(0, 4)
        .map(mapProductToUI)
  });

  if (isLoading) {
    return <div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (!product) {
    return (
      <Layout>
        <div className="container mx-auto px-4 py-16 text-center">
          <h1 className="text-2xl font-bold mb-4">Product Not Found</h1>
          <p className="text-muted-foreground mb-6">
            The product you're looking for doesn't exist or has been removed.
          </p>
          <Button asChild>
            <Link to="/products">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Products
            </Link>
          </Button>
        </div>
      </Layout>
    );
  }

  const uiProduct = mapProductToUI(product);
  const productImages = uiProduct.images;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      // Map back to what cart expects if needed, or update cart context type
      addToCart({
        id: product.id,
        name: product.title,
        price: product.price,
        image: productImages[0],
        category: uiProduct.category,
        description: product.short_description || "",
      } as any);
    }
  };

  const handleBuyNow = () => {
    handleAddToCart();
    const phoneNumber = "919824044585";
    const message = `Hi! I want to buy: ${product.title} (Qty: ${quantity}). Please share the price and availability.`;
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    analyticsService.trackClick('whatsapp', 'product_page', product.id);
    window.open(whatsappUrl, "_blank");
  };

  const toggleWishlist = () => {
    if (!product) return;
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
    } else {
      addToWishlist(product.id);
    }
  };

  const metaTitle = `${product.title} | ${uiProduct.category} | Dipak Furniture`;
  const metaDescription = product.short_description || `Buy ${product.title} from Dipak Furniture.`;

  return (
    <Layout>
      <SEOHead
        title={metaTitle}
        description={metaDescription}
        keywords={`${product.title}, ${uiProduct.category}, office furniture`}
        canonicalUrl={`https://dipaksteelfurniture.lovable.app/product/${product.id}`}
      />

      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb - Need to handle prop mismatch or refactor Breadcrumb */}
          {/* Passing simpler props or skipping for now if complex. 
              Let's allow ProductBreadcrumb to take any for now or refactor it next. */}
          <ProductBreadcrumb product={uiProduct as any} category={{ name: uiProduct.category, slug: uiProduct.categorySlug } as any} />

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
            <ProductImageGallery images={productImages} productName={product.title} />

            <ProductInfo
              product={uiProduct as any}
              quantity={quantity}
              setQuantity={setQuantity}
              onAddToCart={handleAddToCart}
              onBuyNow={handleBuyNow}
              isInCart={isInCart(product.id)}
              isInWishlist={isInWishlist(product.id)}
              onToggleWishlist={toggleWishlist}
              pageSettings={pageSettings}
            />
          </div>

          <ProductTabs product={uiProduct as any} />

          {relatedProducts && relatedProducts.length > 0 && (
            <RelatedProducts products={relatedProducts as any} />
          )}
        </div>
      </div>

      <StickyMobileCart
        product={uiProduct as any}
        quantity={quantity}
        onAddToCart={handleAddToCart}
        isInCart={isInCart(product.id)}
      />
    </Layout>
  );
};

export default ProductDetail;
