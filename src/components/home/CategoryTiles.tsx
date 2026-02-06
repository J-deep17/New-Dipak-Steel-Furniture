import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/products";

const CategoryTiles = () => {
  const { data: categories, isLoading } = useQuery({
    queryKey: ['home-categories'],
    queryFn: productService.getHomeCategories
  });

  if (isLoading) {
    return <div className="py-24 text-center">Loading categories...</div>;
  }

  if (!categories || categories.length === 0) {
    console.warn("No home categories selected in Admin > Categories");
    return null;
  }

  // Show all selected categories (ordered by home_order)
  const featuredCategories = categories;

  return (
    <section className="py-16 md:py-24">
      <div className="container">
        <div className="mb-12 text-center">
          <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">
            Our Collection
          </p>
          <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
            Browse Office Furniture by Category
          </h2>
          <p className="mx-auto max-w-2xl text-muted-foreground">
            Explore our comprehensive range of <strong>office chairs</strong>, <strong>steel almirahs</strong>, and institutional furniture,
            designed for comfort and built to last.
          </p>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {featuredCategories.map((category) => (
            <Link
              key={category.slug}
              to={`/products/${category.slug}`}
              className="group relative overflow-hidden rounded-xl bg-card shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg"
            >
              <div className="aspect-[4/3] overflow-hidden bg-secondary">
                <img
                  src={category.image_url || "/placeholder.svg"}
                  alt={category.name}
                  className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-110"
                  onError={(e) => {
                    (e.target as HTMLImageElement).src = "/placeholder.svg";
                  }}
                />
              </div>
              <div className="p-5">
                <h3 className="mb-2 text-lg font-semibold text-foreground group-hover:text-accent">
                  {category.name}
                </h3>
                {/* Description requires DB schema update, omitting for now or using generic text */}
                <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                  Premium quality {category.name.toLowerCase()} designed for modern workspaces.
                </p>
                <span className="inline-flex items-center text-sm font-medium text-accent">
                  View Products
                  <ArrowRight className="ml-1 h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/products"
            className="inline-flex items-center gap-2 rounded-lg border border-accent bg-transparent px-6 py-3 font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
          >
            View All Categories
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </section>
  );
};

export default CategoryTiles;