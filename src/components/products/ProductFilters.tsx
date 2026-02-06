import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Slider } from "@/components/ui/slider";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { SlidersHorizontal, X } from "lucide-react";

export interface FilterState {
    minPrice?: number;
    maxPrice?: number;
    discountedOnly: boolean;
    newArrivals: boolean;
    hotSelling: boolean;
}

interface ProductFiltersProps {
    filters: FilterState;
    onFiltersChange: (filters: FilterState) => void;
    maxPriceLimit?: number;
}

const ProductFilters = ({ filters, onFiltersChange, maxPriceLimit = 100000 }: ProductFiltersProps) => {
    const [priceRange, setPriceRange] = useState<[number, number]>([
        filters.minPrice || 0,
        filters.maxPrice || maxPriceLimit
    ]);

    const handlePriceChange = (values: number[]) => {
        setPriceRange([values[0], values[1]]);
    };

    const handleApplyPriceFilter = () => {
        onFiltersChange({
            ...filters,
            minPrice: priceRange[0] > 0 ? priceRange[0] : undefined,
            maxPrice: priceRange[1] < maxPriceLimit ? priceRange[1] : undefined
        });
    };

    const handleCheckboxChange = (key: keyof FilterState, checked: boolean) => {
        onFiltersChange({
            ...filters,
            [key]: checked
        });
    };

    const clearFilters = () => {
        setPriceRange([0, maxPriceLimit]);
        onFiltersChange({
            discountedOnly: false,
            newArrivals: false,
            hotSelling: false,
            minPrice: undefined,
            maxPrice: undefined
        });
    };

    const hasActiveFilters = filters.discountedOnly || filters.newArrivals || filters.hotSelling ||
        filters.minPrice !== undefined || filters.maxPrice !== undefined;

    const FilterContent = () => (
        <div className="space-y-6">
            {/* Price Range */}
            <div className="space-y-4">
                <Label className="text-sm font-medium">Price Range</Label>
                <Slider
                    value={priceRange}
                    onValueChange={handlePriceChange}
                    max={maxPriceLimit}
                    step={500}
                    className="mt-2"
                />
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                    <span>₹{priceRange[0].toLocaleString('en-IN')}</span>
                    <span>₹{priceRange[1].toLocaleString('en-IN')}</span>
                </div>
                <Button size="sm" variant="outline" onClick={handleApplyPriceFilter} className="w-full">
                    Apply Price Filter
                </Button>
            </div>

            {/* Checkboxes */}
            <div className="space-y-3">
                <Label className="text-sm font-medium">Product Type</Label>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="discounted"
                        checked={filters.discountedOnly}
                        onCheckedChange={(checked) => handleCheckboxChange('discountedOnly', !!checked)}
                    />
                    <label htmlFor="discounted" className="text-sm cursor-pointer">
                        On Sale / Discounted
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="newArrivals"
                        checked={filters.newArrivals}
                        onCheckedChange={(checked) => handleCheckboxChange('newArrivals', !!checked)}
                    />
                    <label htmlFor="newArrivals" className="text-sm cursor-pointer">
                        New Arrivals
                    </label>
                </div>

                <div className="flex items-center space-x-2">
                    <Checkbox
                        id="hotSelling"
                        checked={filters.hotSelling}
                        onCheckedChange={(checked) => handleCheckboxChange('hotSelling', !!checked)}
                    />
                    <label htmlFor="hotSelling" className="text-sm cursor-pointer">
                        Hot Selling
                    </label>
                </div>
            </div>

            {hasActiveFilters && (
                <Button variant="ghost" size="sm" onClick={clearFilters} className="w-full text-muted-foreground">
                    <X className="h-4 w-4 mr-2" />
                    Clear All Filters
                </Button>
            )}
        </div>
    );

    return (
        <>
            {/* Desktop Sidebar */}
            <div className="hidden lg:block w-64 shrink-0">
                <div className="sticky top-24 bg-card rounded-lg border p-4">
                    <h3 className="font-semibold mb-4 flex items-center gap-2">
                        <SlidersHorizontal className="h-4 w-4" />
                        Filters
                    </h3>
                    <FilterContent />
                </div>
            </div>

            {/* Mobile Sheet */}
            <Sheet>
                <SheetTrigger asChild>
                    <Button variant="outline" size="sm" className="lg:hidden">
                        <SlidersHorizontal className="h-4 w-4 mr-2" />
                        Filters
                        {hasActiveFilters && (
                            <span className="ml-2 bg-primary text-primary-foreground rounded-full px-2 py-0.5 text-xs">
                                Active
                            </span>
                        )}
                    </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                    <SheetHeader>
                        <SheetTitle className="flex items-center gap-2">
                            <SlidersHorizontal className="h-4 w-4" />
                            Filters
                        </SheetTitle>
                    </SheetHeader>
                    <div className="mt-6">
                        <FilterContent />
                    </div>
                </SheetContent>
            </Sheet>
        </>
    );
};

export default ProductFilters;
