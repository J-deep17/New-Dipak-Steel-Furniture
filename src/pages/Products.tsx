import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/products";
import { ArrowRight, Loader2 } from "lucide-react";

const Products = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories
  });

  return (
    <Layout>
      <SEOHead
        title="Office Furniture Products | Dipak Furniture"
        description="Browse our complete range of office furniture."
      />

      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              Office Furniture Products
            </h1>
            <p className="text-lg text-primary-foreground/80">
              Explore our comprehensive collection of office and institutional furniture.
            </p>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container">
          {isLoading ? (
            <div className="flex h-40 items-center justify-center">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : !categories || categories.length === 0 ? (
            <div className="py-12 text-center">
              <p className="text-lg text-muted-foreground">No categories available yet.</p>
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  to={`/products/${category.slug}`}
                  className="group relative overflow-hidden rounded-xl bg-card transition-all duration-300 hover:shadow-lg"
                >
                  <div className="aspect-square w-full overflow-hidden bg-muted">
                    <img
                      src={category.image_url || "/placeholder.svg"}
                      alt={category.name}
                      className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                  </div>
                  <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/60 to-transparent p-6">
                    <h3 className="text-xl font-bold text-white">
                      {category.name}
                    </h3>
                    <div className="mt-2 flex items-center gap-2 text-sm font-medium text-white/90 opacity-0 transition-opacity duration-300 group-hover:opacity-100">
                      View Products <ArrowRight className="h-4 w-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>
    </Layout>
  );
};

export default Products;
