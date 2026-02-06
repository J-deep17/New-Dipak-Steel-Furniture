import { Badge } from "@/components/ui/badge";

interface ProductBadgesProps {
    isNewArrival?: boolean | null;
    isHotSelling?: boolean | null;
    discountPercentage?: number | null;
}

const ProductBadges = ({ isNewArrival, isHotSelling, discountPercentage }: ProductBadgesProps) => {
    const hasBadges = isNewArrival || isHotSelling || (discountPercentage && discountPercentage > 0);

    if (!hasBadges) return null;

    return (
        <div className="absolute top-2 left-2 z-10 flex flex-col gap-1">
            {isNewArrival && (
                <Badge className="bg-emerald-500 hover:bg-emerald-600 text-white font-semibold shadow-md">
                    NEW
                </Badge>
            )}
            {isHotSelling && (
                <Badge className="bg-red-500 hover:bg-red-600 text-white font-semibold shadow-md">
                    HOT
                </Badge>
            )}
            {discountPercentage && discountPercentage > 0 && (
                <Badge className="bg-orange-500 hover:bg-orange-600 text-white font-semibold shadow-md">
                    {discountPercentage}% OFF
                </Badge>
            )}
        </div>
    );
};

export default ProductBadges;
