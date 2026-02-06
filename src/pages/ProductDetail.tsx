import { useParams, Link } from "react-router-dom";
import { useState, useEffect } from "react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/products";
import { analyticsService } from "@/services/analytics";
import { productPageSettingsService } from "@/services/productPageSettings";
import { reviewService } from "@/services/reviews";
import Layout from "@/components/layout/Layout";
import SEO from "@/components/SEO";
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
  price: product.base_price || product.price, // Use base_price
  category: product.category?.name || "Uncategorized",
  categorySlug: product.category?.slug,
  // Use DB key_features if available, else fallback
  features: product.key_features && product.key_features.length > 0 ? product.key_features : [product.short_description].filter(Boolean),
  description: product.description || "",
  images: product.images && product.images.length > 0 ? product.images : [product.image_url].filter(Boolean),
  // SEO Fields
  meta_title: product.meta_title,
  meta_description: product.meta_description,
  image_alt: product.image_alt,
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
  variants: product.variants || []
});

const ProductDetail = () => {
  const { productSlug } = useParams<{ productSlug: string }>();
  const [quantity, setQuantity] = useState(1);
  const { addToCart, isInCart } = useCart();
  const { addToWishlist, removeFromWishlist, isInWishlist } = useWishlist();

  // Variant State Management
  // Initialize with null, will update in useEffect/render logic if needed
  const [selectedVariantId, setSelectedVariantId] = useState<string | null>(null);

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

  // Fetch Reviews
  const { data: reviews = [], refetch: refetchReviews } = useQuery({
    queryKey: ["reviews", product?.id],
    queryFn: () => reviewService.getProductReviews(product!.id),
    enabled: !!product?.id
  });

  // Fetch Rating
  const { data: ratingData } = useQuery({
    queryKey: ["rating", product?.id],
    queryFn: () => reviewService.getProductRating(product!.id),
    enabled: !!product?.id
  });

  const { data: relatedProducts } = useQuery({
    queryKey: ["related-products", (product as any)?.category?.slug],
    queryFn: () => productService.getProducts({ categorySlug: (product as any)?.category?.slug }),
    enabled: !!(product as any)?.category?.slug,
    select: (products) =>
      products
        .filter(p => p.id !== product?.id)
        .slice(0, 4)
        .map(mapProductToUI) // Re-using helper, though ideally we move this out
  });

  // Auto-select first variant on load
  // We need to calculate uiProduct early or use direct product data
  const variants = product?.variants || [];
  useEffect(() => {
    if (variants && variants.length > 0 && !selectedVariantId) {
      const activeVariant = variants.find((v: any) => v.is_active);
      if (activeVariant) setSelectedVariantId(activeVariant.id);
    }
  }, [variants, selectedVariantId]);

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

  const selectedVariant = uiProduct.variants?.find((v: any) => v.id === selectedVariantId);

  // Determine images to display: Variant images -> Product images -> Fallback
  // Ensure we flatten variant images effectively if they are arrays of objects with image_url
  const variantImages = selectedVariant?.images?.map((img: any) => img.image_url) || [];
  const displayImages = variantImages.length > 0
    ? variantImages
    : (uiProduct.images && uiProduct.images.length > 0 ? uiProduct.images : []);

  const handleColorChange = (variantId: string) => {
    setSelectedVariantId(variantId);
  };

  const handleAddToCart = () => {
    const currentPrice = (selectedVariant?.price !== null && selectedVariant?.price !== undefined)
      ? selectedVariant.price
      : uiProduct.price;

    for (let i = 0; i < quantity; i++) {
      // Prepare variant info
      const variantData = selectedVariant ? {
        variant_id: selectedVariant.id,
        color_name: selectedVariant.color_name,
        sku: selectedVariant.sku // Add SKU to cart if supported
      } : {};

      addToCart({
        id: product.id,
        name: product.title,
        price: currentPrice,
        image: displayImages[0], // Use the first image of the variant or product
        category: uiProduct.category,
        description: product.short_description || "",
        ...variantData
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

  return (
    <Layout>
      <SEO
        title={uiProduct.meta_title || uiProduct.name}
        description={uiProduct.meta_description || uiProduct.short_description || uiProduct.description.slice(0, 160)}
        canonicalUrl={`https://steelshow.com/product/${uiProduct.slug}`}
        ogImage={uiProduct.images[0]}
        ogType="product"
        jsonLd={{
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": uiProduct.name,
          "image": uiProduct.images,
          "description": uiProduct.description,
          "sku": uiProduct.id,
          "offers": {
            "@type": "Offer",
            "priceCurrency": "INR",
            "price": uiProduct.sale_price || uiProduct.price,
            "availability": "https://schema.org/InStock"
          }
        }}
      />

      <div className="bg-background min-h-screen">
        <div className="container mx-auto px-4 py-6">
          {/* Breadcrumb - Need to handle prop mismatch or refactor Breadcrumb */}
          {/* Passing simpler props or skipping for now if complex.
              Let's allow ProductBreadcrumb to take any for now or refactor it next. */}
          <ProductBreadcrumb product={uiProduct as any} category={{ name: uiProduct.category, slug: uiProduct.categorySlug } as any} />

          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 mt-6">
            <ProductImageGallery
              images={displayImages}
              productName={product.title}
              productId={product.id}
            />

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
              selectedVariantId={selectedVariantId}
              selectedVariant={selectedVariant}
              onVariantChange={handleColorChange}
              rating={ratingData?.average || 0}
              totalReviews={ratingData?.count || 0}
            />
          </div>

          <ProductTabs
            product={uiProduct as any}
            reviews={reviews}
            onReviewSuccess={refetchReviews}
          />

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
