import { useState, useMemo } from "react";
import { Search, X, Filter } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useQuery } from "@tanstack/react-query";
import { productService, Product } from "@/services/products";
import ProductCard from "./ProductCard";

const ProductSearch = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [selectedFeatures, setSelectedFeatures] = useState<string[]>([]);
  const [selectedApplications, setSelectedApplications] = useState<string[]>([]);
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const { data: products = [], isLoading: isLoadingProducts } = useQuery({
    queryKey: ['products'],
    queryFn: () => productService.getProducts({})
  });

  const { data: categories = [], isLoading: isLoadingCategories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories
  });

  const allFeatures = useMemo(() => {
    const features = new Set<string>();
    products.forEach(p => p.key_features?.forEach(f => features.add(f)));
    return Array.from(features).sort();
  }, [products]);

  const allApplications = useMemo(() => {
    // Placeholder as application field is not explicitly in Product type yet
    return [];
  }, [products]);

  const filteredProducts = useMemo(() => {
    return products.filter(product => {
      const matchesSearch = product.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesCategory = selectedCategory === "all" || product.category?.slug === selectedCategory;
      const matchesFeatures = selectedFeatures.length === 0 ||
        selectedFeatures.every(f => product.key_features?.includes(f));
      const matchesApplications = selectedApplications.length === 0;

      return matchesSearch && matchesCategory && matchesFeatures && matchesApplications;
    });
  }, [products, searchQuery, selectedCategory, selectedFeatures, selectedApplications]);

  const toggleFeature = (feature: string) => {
    setSelectedFeatures((prev) =>
      prev.includes(feature) ? prev.filter((f) => f !== feature) : [...prev, feature]
    );
  };

  const toggleApplication = (app: string) => {
    setSelectedApplications((prev) =>
      prev.includes(app) ? prev.filter((a) => a !== app) : [...prev, app]
    );
  };

  const clearAllFilters = () => {
    setSearchQuery("");
    setSelectedCategory("all");
    setSelectedFeatures([]);
    setSelectedApplications([]);
  };

  const activeFiltersCount =
    (selectedCategory !== "all" ? 1 : 0) +
    selectedFeatures.length +
    selectedApplications.length;

  if (isLoadingProducts || isLoadingCategories) {
    return <div className="py-24 text-center">Loading products...</div>;
  }

  return (
    <div className="space-y-6">
      {/* Search Bar */}
      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search products, features, applications..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10 pr-10"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          )}
        </div>

        {/* Category Select */}
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="w-full sm:w-48">
            <SelectValue placeholder="All Categories" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            {categories.map((cat) => (
              <SelectItem key={cat.slug} value={cat.slug}>
                {cat.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Filter Button for Mobile */}
        <Sheet open={isFilterOpen} onOpenChange={setIsFilterOpen}>
          <SheetTrigger asChild>
            <Button variant="outline" className="relative">
              <Filter className="mr-2 h-4 w-4" />
              Filters
              {activeFiltersCount > 0 && (
                <Badge className="ml-2 h-5 w-5 rounded-full p-0 text-xs">
                  {activeFiltersCount}
                </Badge>
              )}
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-80 overflow-y-auto">
            <SheetHeader>
              <SheetTitle>Filter Products</SheetTitle>
            </SheetHeader>
            <div className="mt-6 space-y-6">
              {/* Features */}
              <div>
                <h4 className="mb-3 font-medium text-foreground">Features</h4>
                <div className="flex flex-wrap gap-2">
                  {allFeatures.slice(0, 20).map((feature) => (
                    <Badge
                      key={feature}
                      variant={
                        selectedFeatures.includes(feature)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleFeature(feature)}
                    >
                      {feature}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Applications */}
              <div>
                <h4 className="mb-3 font-medium text-foreground">
                  Applications
                </h4>
                <div className="flex flex-wrap gap-2">
                  {allApplications.slice(0, 15).map((app) => (
                    <Badge
                      key={app}
                      variant={
                        selectedApplications.includes(app)
                          ? "default"
                          : "outline"
                      }
                      className="cursor-pointer"
                      onClick={() => toggleApplication(app)}
                    >
                      {app}
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Clear Filters */}
              {activeFiltersCount > 0 && (
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={clearAllFilters}
                >
                  Clear All Filters
                </Button>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>

      {/* Active Filters Display */}
      {(selectedFeatures.length > 0 || selectedApplications.length > 0) && (
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-sm text-muted-foreground">Active filters:</span>
          {selectedFeatures.map((feature) => (
            <Badge
              key={feature}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleFeature(feature)}
            >
              {feature}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          {selectedApplications.map((app) => (
            <Badge
              key={app}
              variant="secondary"
              className="cursor-pointer"
              onClick={() => toggleApplication(app)}
            >
              {app}
              <X className="ml-1 h-3 w-3" />
            </Badge>
          ))}
          <Button
            variant="ghost"
            size="sm"
            onClick={clearAllFilters}
            className="text-muted-foreground"
          >
            Clear all
          </Button>
        </div>
      )}

      {/* Results Count */}
      <div className="text-sm text-muted-foreground">
        Showing {filteredProducts.length} of {products.length} products
      </div>

      {/* Products Grid */}
      {filteredProducts.length > 0 ? (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <Search className="mb-4 h-12 w-12 text-muted-foreground/50" />
          <h3 className="mb-2 text-lg font-medium text-foreground">
            No products found
          </h3>
          <p className="mb-4 text-muted-foreground">
            Try adjusting your search or filters to find what you're looking for.
          </p>
          <Button variant="outline" onClick={clearAllFilters}>
            Clear All Filters
          </Button>
        </div>
      )}
    </div>
  );
};

export default ProductSearch;
