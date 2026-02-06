import { useParams, Navigate, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";
import { productService } from "@/services/products";
import { analyticsService } from "@/services/analytics";
import Layout from "@/components/layout/Layout";
import { useEffect } from "react";
import SEOHead from "@/components/seo/SEOHead";
import CategoryHeader from "@/components/products/CategoryHeader";
import ProductCard from "@/components/products/ProductCard";
import { ArrowRight, Phone, MessageCircle, Loader2 } from "lucide-react";

const ProductCategory = () => {
  const { categorySlug } = useParams<{ categorySlug: string }>();

  // 1. Fetch Category by slug
  const { data: category, isLoading: categoryLoading } = useQuery({
    queryKey: ['category', categorySlug],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('categories')
        .select('*')
        .eq('slug', categorySlug!)
        .single();
      if (error) throw error;
      return data;
    },
    enabled: !!categorySlug
  });

  // 1. Fetch products using the service which handles slug lookup internally if needed, 
  // but since we are fetching category details anyway for the header, we can just rely on the service to fetch products.
  // Actually, let's use the service's getProducts by categorySlug feature we added to keep it clean.
  const { data: products, isLoading: productsLoading } = useQuery({
    queryKey: ['products', categorySlug],
    queryFn: () => productService.getProducts({ categorySlug }),
    enabled: !!categorySlug
  });

  if (categoryLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="animate-spin" /></div>;
  }

  if (!category) {
    return <Navigate to="/products" replace />;
  }

  return (
    <Layout>
      <SEOHead
        title={`${category.name} | Dipak Furniture`}
        description={`Browse our ${category.name} collection.`}
      />

      <CategoryHeader
        title={category.name}
        description={`Explore our collection of ${category.name}.`}
        breadcrumbs={[
          { name: "Products", path: "/products" },
          { name: category.name, path: `/products/${category.slug}` },
        ]}
      />

      <section className="py-12 md:py-16">
        <div className="container">
          {productsLoading ? (
            <div className="flex justify-center"><Loader2 className="animate-spin" /></div>
          ) : products && products.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          ) : (
            <div className="text-center py-24">
              <h3 className="text-xl font-semibold text-muted-foreground">
                No products available. Please check back later.
              </h3>
            </div>
          )}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-accent py-12">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-accent-foreground">
            Need Bulk Orders or Custom Solutions?
          </h2>
          <p className="mb-6 text-accent-foreground/80 max-w-xl mx-auto">
            Get special pricing on bulk orders. We're a leading {category.name.toLowerCase()} manufacturer.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Request Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default ProductCategory;
