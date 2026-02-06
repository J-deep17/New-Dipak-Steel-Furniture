import { Link } from "react-router-dom";
import { Product } from "@/services/products";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowRight } from "lucide-react";

interface RelatedProductsProps {
  products: Product[];
}

const RelatedProducts = ({ products }: RelatedProductsProps) => {
  if (!products || products.length === 0) return null;

  // Use first product's category slug, fallback to 'tables' or safe default if needed
  const categoryLink = products[0]?.category_id ? `/products/${products[0].category_id}` : '/products';
  // Ideally we need category slug from the product, but DB schema might only have category_id or joined category object. 
  // ProductCard uses (product as any).category?.slug or similar. Let's try to be safe.

  return (
    <section className="mt-16">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Related Products</h2>
        {/* Simplified link for now */}
        <Link
          to="/products"
          className="text-primary hover:underline flex items-center gap-1 text-sm font-medium"
        >
          View All
          <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {products.map((product) => {
          const image = (product.images && product.images.length > 0)
            ? product.images[0]
            : (product.image_url || "/placeholder.svg");

          return (
            <Link key={product.id} to={`/product/${product.slug || product.id}`}>
              <Card className="group overflow-hidden hover:shadow-lg transition-all duration-300">
                <div className="aspect-square overflow-hidden bg-muted relative">
                  <img
                    src={image}
                    alt={product.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                  {/* New badge removed as property does not exist in DB schema yet */}
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-sm line-clamp-2 group-hover:text-primary transition-colors">
                    {product.title}
                  </h3>
                  <p className="text-xs text-muted-foreground mt-1">
                    {(product as any).category?.name || "Product"}
                  </p>
                </CardContent>
              </Card>
            </Link>
          );
        })}
      </div>
    </section>
  );
};

export default RelatedProducts;
