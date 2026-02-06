import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/products";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight } from "lucide-react";

const FeaturedProducts = () => {
  const { data: products, isLoading } = useQuery({
    queryKey: ['featured-products'],
    queryFn: productService.getActiveProducts
  });

  const featuredProducts = products ? products.slice(0, 3) : [];

  if (isLoading) {
    return <div className="py-24 text-center">Loading featured products...</div>;
  }

  if (featuredProducts.length === 0) return null;

  return (
    <section className="bg-secondary/50 py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
            Best Sellers
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Featured Products
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Discover our most popular chairs and furniture pieces, loved by
            offices and institutions across India.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
          >
            Browse All Products
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default FeaturedProducts;
