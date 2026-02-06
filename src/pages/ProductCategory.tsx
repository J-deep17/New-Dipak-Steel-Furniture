import { useState } from "react";
import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { useParams, Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService, Product, ProductFilters as ProductFiltersType } from "@/services/products";
import { ChevronRight, ChevronDown, ChevronUp, SlidersHorizontal, X, Heart } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import ProductBadges from "@/components/products/ProductBadges";

type SortOption = 'default' | 'price_asc' | 'price_desc' | 'new' | 'hot' | 'featured';

interface FilterState {
    minPrice?: number;
    maxPrice?: number;
    discountedOnly: boolean;
    newArrivals: boolean;
    hotSelling: boolean;
}

import { useWishlist } from "@/contexts/WishlistContext";
import { cn } from "@/lib/utils";

const ProductCategory = () => {
    const { categorySlug } = useParams<{ categorySlug: string }>();
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const [sortBy, setSortBy] = useState<SortOption>('default');
    const [showFilters, setShowFilters] = useState(true);
    const [filters, setFilters] = useState<FilterState>({
        discountedOnly: false,
        newArrivals: false,
        hotSelling: false
    });
    const [priceRange, setPriceRange] = useState<[number, number]>([0, 100000]);

    // Accordion states
    const [openSections, setOpenSections] = useState({
        price: true,
        type: true,
        availability: false
    });

    const toggleSection = (section: keyof typeof openSections) => {
        setOpenSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Fetch category info
    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: productService.getCategories
    });

    const category = categories?.find(c => c.slug === categorySlug);

    // Build filter params
    const filterParams: ProductFiltersType = {
        categorySlug,
        sort: sortBy,
        minPrice: filters.minPrice,
        maxPrice: filters.maxPrice,
        discountedOnly: filters.discountedOnly,
        newArrivals: filters.newArrivals,
        hotSelling: filters.hotSelling
    };

    // Fetch products with filters
    const { data: products, isLoading } = useQuery({
        queryKey: ['products', categorySlug, sortBy, filters],
        queryFn: () => productService.getProducts(filterParams),
        enabled: !!categorySlug
    });

    // Calculate display price
    const getDisplayPrice = (product: Product) => {
        if (product.sale_price) return product.sale_price;
        if (product.discount_percentage && product.base_price) {
            return product.base_price * (1 - product.discount_percentage / 100);
        }
        return product.base_price || product.price || 0;
    };

    const getOriginalPrice = (product: Product) => {
        return product.base_price || product.price || 0;
    };

    const hasDiscount = (product: Product) => {
        return (product.discount_percentage && product.discount_percentage > 0) ||
            (product.sale_price && product.sale_price < getOriginalPrice(product));
    };

    const handlePriceApply = () => {
        setFilters(prev => ({
            ...prev,
            minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
            maxPrice: priceRange[1] < 100000 ? priceRange[1] : undefined
        }));
    };

    const clearFilters = () => {
        setPriceRange([0, 100000]);
        setFilters({
            discountedOnly: false,
            newArrivals: false,
            hotSelling: false,
            minPrice: undefined,
            maxPrice: undefined
        });
    };

    const hasActiveFilters = filters.discountedOnly || filters.newArrivals || filters.hotSelling ||
        filters.minPrice !== undefined || filters.maxPrice !== undefined;

    // Filter Sidebar Content (shared between desktop and mobile)
    const FilterContent = () => (
        <div className="space-y-1">
            {/* Price Range Accordion */}
            <Collapsible open={openSections.price} onOpenChange={() => toggleSection('price')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium hover:text-primary transition-colors border-b">
                    Price Range
                    {openSections.price ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="py-4 space-y-4">
                    <Slider
                        value={priceRange}
                        onValueChange={(v) => setPriceRange([v[0], v[1]])}
                        max={100000}
                        step={1000}
                        className="mt-2"
                    />
                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                        <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                        <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                    </div>
                    <Button size="sm" variant="outline" onClick={handlePriceApply} className="w-full text-xs">
                        Apply
                    </Button>
                </CollapsibleContent>
            </Collapsible>

            {/* Product Type Accordion */}
            <Collapsible open={openSections.type} onOpenChange={() => toggleSection('type')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium hover:text-primary transition-colors border-b">
                    Product Type
                    {openSections.type ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="py-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                            checked={filters.discountedOnly}
                            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, discountedOnly: !!checked }))}
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">On Sale</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                            checked={filters.newArrivals}
                            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, newArrivals: !!checked }))}
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">New Arrivals</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox
                            checked={filters.hotSelling}
                            onCheckedChange={(checked) => setFilters(prev => ({ ...prev, hotSelling: !!checked }))}
                        />
                        <span className="text-sm group-hover:text-primary transition-colors">Hot Selling</span>
                    </label>
                </CollapsibleContent>
            </Collapsible>

            {/* Availability Accordion */}
            <Collapsible open={openSections.availability} onOpenChange={() => toggleSection('availability')}>
                <CollapsibleTrigger className="flex items-center justify-between w-full py-3 text-sm font-medium hover:text-primary transition-colors border-b">
                    Availability
                    {openSections.availability ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                </CollapsibleTrigger>
                <CollapsibleContent className="py-4 space-y-3">
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox defaultChecked />
                        <span className="text-sm group-hover:text-primary transition-colors">In Stock</span>
                    </label>
                    <label className="flex items-center gap-3 cursor-pointer group">
                        <Checkbox />
                        <span className="text-sm group-hover:text-primary transition-colors">Pre-order</span>
                    </label>
                </CollapsibleContent>
            </Collapsible>

            {/* Clear All */}
            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full mt-4 text-muted-foreground hover:text-destructive">
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    // Product Card Skeleton
    const ProductSkeleton = () => (
        <div className="bg-white rounded-lg overflow-hidden">
            <Skeleton className="aspect-square w-full" />
            <div className="p-3 space-y-2">
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-5 w-1/3" />
            </div>
        </div>
    );

    return (
        <Layout>
            <SEOHead
                title={`${category?.name || 'Products'} | Dipak Furniture`}
                description={`Browse our ${category?.name || 'products'} collection.`}
            />

            {/* Minimal Header - Nike Style */}
            <div className="bg-white border-b sticky top-0 z-40">
                <div className="container">
                    {/* Breadcrumb */}
                    <nav className="flex items-center gap-2 text-xs text-muted-foreground py-2">
                        <Link to="/" className="hover:text-foreground transition-colors">Home</Link>
                        <ChevronRight className="h-3 w-3" />
                        <Link to="/products" className="hover:text-foreground transition-colors">Products</Link>
                        <ChevronRight className="h-3 w-3" />
                        <span className="text-foreground">{category?.name || categorySlug}</span>
                    </nav>

                    {/* Title + Toolbar */}
                    <div className="flex items-center justify-between py-3 border-t">
                        <div className="flex items-center gap-4">
                            <h1 className="text-xl font-semibold">
                                {category?.name || categorySlug?.replace(/-/g, ' ').replace(/\b\w/g, c => c.toUpperCase())}
                            </h1>
                            <span className="text-sm text-muted-foreground">
                                {isLoading ? '...' : `${products?.length || 0} Products`}
                            </span>
                        </div>

                        <div className="flex items-center gap-3">
                            {/* Hide/Show Filters Toggle (Desktop) */}
                            <Button
                                variant="ghost"
                                size="sm"
                                className="hidden lg:flex text-sm"
                                onClick={() => setShowFilters(!showFilters)}
                            >
                                {showFilters ? 'Hide Filters' : 'Show Filters'}
                                <SlidersHorizontal className="h-4 w-4 ml-2" />
                            </Button>

                            {/* Mobile Filter Button */}
                            <Sheet>
                                <SheetTrigger asChild>
                                    <Button variant="outline" size="sm" className="lg:hidden">
                                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                                        Filters
                                        {hasActiveFilters && (
                                            <span className="ml-2 bg-primary text-primary-foreground rounded-full w-5 h-5 text-xs flex items-center justify-center">
                                                !
                                            </span>
                                        )}
                                    </Button>
                                </SheetTrigger>
                                <SheetContent side="left" className="w-80 overflow-y-auto">
                                    <SheetHeader>
                                        <SheetTitle>Filters</SheetTitle>
                                    </SheetHeader>
                                    <div className="mt-4">
                                        <FilterContent />
                                    </div>
                                </SheetContent>
                            </Sheet>

                            {/* Sort Dropdown */}
                            <Select value={sortBy} onValueChange={(v) => setSortBy(v as SortOption)}>
                                <SelectTrigger className="w-[160px] text-sm">
                                    <SelectValue placeholder="Sort By" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="default">Newest</SelectItem>
                                    <SelectItem value="price_asc">Price: Low → High</SelectItem>
                                    <SelectItem value="price_desc">Price: High → Low</SelectItem>
                                    <SelectItem value="new">New Arrivals</SelectItem>
                                    <SelectItem value="hot">Popularity</SelectItem>
                                    <SelectItem value="featured">Featured</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content - Two Column Layout */}
            <div className="container py-6">
                <div className="flex gap-8">
                    {/* Filter Sidebar (Desktop) */}
                    {showFilters && (
                        <aside className="hidden lg:block w-60 shrink-0">
                            <div className="sticky top-32">
                                <FilterContent />
                            </div>
                        </aside>
                    )}

                    {/* Products Grid */}
                    <main className="flex-1 min-w-0">
                        {isLoading ? (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {[...Array(8)].map((_, i) => (
                                    <ProductSkeleton key={i} />
                                ))}
                            </div>
                        ) : !products || products.length === 0 ? (
                            <div className="py-20 text-center">
                                <p className="text-muted-foreground mb-3">No products match your filters.</p>
                                <Button variant="outline" size="sm" onClick={clearFilters}>
                                    Clear Filters
                                </Button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                                {products.map((product: Product) => {
                                    const primaryImage = product.variants?.[0]?.images?.[0]?.image_url
                                        || product.image_url
                                        || product.images?.[0]
                                        || "/placeholder.svg";

                                    const displayPrice = getDisplayPrice(product);
                                    const originalPrice = getOriginalPrice(product);
                                    const showStrikethrough = hasDiscount(product);

                                    return (
                                        <Link
                                            key={product.id}
                                            to={`/product/${product.slug}`}
                                            className="group bg-white rounded-lg overflow-hidden transition-all duration-200 hover:shadow-lg"
                                        >
                                            {/* Image Container */}
                                            <div className="relative aspect-square overflow-hidden bg-gray-100">
                                                {/* Badges */}
                                                <ProductBadges
                                                    isNewArrival={product.is_new_arrival}
                                                    isHotSelling={product.is_hot_selling}
                                                    discountPercentage={product.discount_percentage}
                                                />

                                                {/* Wishlist Button Overlay */}
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        console.log('Heart clicked for:', product.id);
                                                        if (isInWishlist(product.id)) {
                                                            console.log('Removing from wishlist...');
                                                            removeFromWishlist(product.id);
                                                        } else {
                                                            console.log('Adding to wishlist...');
                                                            addToWishlist(product.id);
                                                        }
                                                    }}
                                                    className="absolute top-2 right-2 z-10 p-2 rounded-full bg-white/80 backdrop-blur-sm hover:bg-white transition-all shadow-sm opacity-0 group-hover:opacity-100 focus:opacity-100"
                                                >
                                                    <Heart
                                                        className={cn(
                                                            "h-4 w-4 transition-colors",
                                                            isInWishlist(product.id) ? "fill-red-500 text-red-500" : "text-gray-600"
                                                        )}
                                                    />
                                                </button>

                                                <img
                                                    src={primaryImage}
                                                    alt={product.title}
                                                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                                                    onError={(e) => {
                                                        (e.target as HTMLImageElement).src = "/placeholder.svg";
                                                    }}
                                                />
                                            </div>

                                            {/* Content */}
                                            <div className="p-3">
                                                <h3 className="font-medium text-sm text-gray-900 group-hover:text-primary transition-colors line-clamp-2 leading-tight">
                                                    {product.title}
                                                </h3>
                                                {product.short_description && (
                                                    <p className="mt-1 text-xs text-gray-500 line-clamp-1">
                                                        {product.short_description}
                                                    </p>
                                                )}
                                                <div className="mt-2 flex items-baseline gap-2">
                                                    <span className="font-bold text-gray-900">
                                                        ₹{Math.round(displayPrice).toLocaleString('en-IN')}
                                                    </span>
                                                    {showStrikethrough && (
                                                        <span className="text-xs text-gray-400 line-through">
                                                            ₹{Math.round(originalPrice).toLocaleString('en-IN')}
                                                        </span>
                                                    )}
                                                </div>
                                            </div>
                                        </Link>
                                    );
                                })}
                            </div>
                        )}
                    </main>
                </div>
            </div>
        </Layout>
    );
};

export default ProductCategory;
