import { useState } from "react";
import { cn } from "@/lib/utils";
import { Heart, Share2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useWishlist } from "@/contexts/WishlistContext";
import { toast } from "sonner";

interface ProductImageGalleryProps {
    images: string[];
    productName: string;
    productId: string;
}

const ProductImageGallery = ({ images, productName, productId }: ProductImageGalleryProps) => {
    const [selectedIndex, setSelectedIndex] = useState(0);
    const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
    const isWishlisted = isInWishlist(productId);

    // State to track if mouse is over interactive elements (like wishlist button)
    const [isHoveringControl, setIsHoveringControl] = useState(false);

    const [magnifierState, setMagnifierState] = useState({
        show: false,
        x: 0,
        y: 0,
        width: 0,
        height: 0
    });

    const validImages = images.length > 0 ? images : ["/placeholder.svg"];
    const currentImage = validImages[selectedIndex];

    // Constants for Lens
    const LENS_SIZE = 200; // px
    const ZOOM_LEVEL = 2.5;
    const HALF_LENS = LENS_SIZE / 2;

    const handleShare = async () => {
        const shareData = {
            title: productName,
            text: `Check out ${productName} from Dipak Furniture`,
            url: window.location.href,
        };

        try {
            if (navigator.share) {
                await navigator.share(shareData);
            } else {
                await navigator.clipboard.writeText(window.location.href);
                toast.success("Link copied to clipboard!");
            }
        } catch (error) {
            console.error('Error sharing:', error);
        }
    };

    const handleWishlist = async () => {
        console.log('[PDP] Toggle wishlist for product:', productId);
        try {
            if (isWishlisted) {
                console.log('[PDP] Removing from wishlist...');
                await removeFromWishlist(productId);
            } else {
                console.log('[PDP] Adding to wishlist...');
                await addToWishlist(productId);
            }
        } catch (error) {
            console.error('[PDP] Wishlist toggle failed:', error);
            toast.error("Failed to update wishlist");
        }
    };

    const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
        // If hovering over a control (like wishlist), don't show magnifier
        if (isHoveringControl) {
            if (magnifierState.show) {
                setMagnifierState(prev => ({ ...prev, show: false }));
            }
            return;
        }

        const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
        const x = e.clientX - left;
        const y = e.clientY - top;

        setMagnifierState({
            show: true,
            x,
            y,
            width,
            height
        });
    };

    const handleMouseLeave = () => {
        setMagnifierState(prev => ({ ...prev, show: false }));
    };

    return (
        <div className="flex flex-col-reverse lg:flex-row gap-4">
            {/* Thumbnails - Vertical on Desktop, Horizontal on Mobile */}
            <div className="flex lg:flex-col gap-4 overflow-x-auto lg:overflow-y-auto lg:h-[600px] hide-scrollbar scroll-smooth">
                {validImages.map((image, index) => (
                    <button
                        key={index}
                        onClick={() => setSelectedIndex(index)}
                        className={cn(
                            "relative min-w-[80px] w-20 h-20 lg:w-24 lg:h-24 rounded-lg overflow-hidden border-2 transition-all",
                            selectedIndex === index
                                ? "border-primary ring-2 ring-primary/20"
                                : "border-transparent hover:border-gray-300"
                        )}
                        aria-label={`View image ${index + 1} of ${productName} `}
                    >
                        <img
                            src={image}
                            alt={`${productName} thumbnail ${index + 1} `}
                            className="w-full h-full object-cover"
                        />
                    </button>
                ))}
            </div>

            {/* Main Image */}
            <div
                className={cn(
                    "relative flex-1 bg-secondary/5 rounded-2xl overflow-hidden aspect-square group",
                    // Only show crosshair if NOT hovering a control
                    !isHoveringControl && "cursor-crosshair"
                )}
                onMouseMove={handleMouseMove}
                onMouseLeave={handleMouseLeave}
                onMouseEnter={(e) => !isHoveringControl && handleMouseMove(e)}
            >
                {/* Base Image */}
                <img
                    src={currentImage}
                    alt={productName}
                    className="w-full h-full object-cover"
                />

                {/* Circular Magnifier Lens - True Lens Logic */}
                {magnifierState.show && !isHoveringControl && (
                    <div
                        className="absolute border-[3px] border-white/80 shadow-2xl rounded-full pointer-events-none z-30 bg-white"
                        style={{
                            width: `${LENS_SIZE}px`,
                            height: `${LENS_SIZE}px`,
                            left: `${magnifierState.x - HALF_LENS}px`,
                            top: `${magnifierState.y - HALF_LENS}px`,
                            backgroundImage: `url(${currentImage})`,
                            backgroundSize: `${magnifierState.width * ZOOM_LEVEL}px ${magnifierState.height * ZOOM_LEVEL}px`,
                            backgroundPositionX: `${HALF_LENS - magnifierState.x * ZOOM_LEVEL}px`,
                            backgroundPositionY: `${HALF_LENS - magnifierState.y * ZOOM_LEVEL}px`,
                            backgroundRepeat: 'no-repeat'
                        }}
                    />
                )}

                {/* Controls: Wishlist & Share - Unified Logic */}
                <div
                    className="absolute top-4 right-4 z-40 flex flex-col gap-3"
                    onMouseEnter={() => {
                        setIsHoveringControl(true);
                        setMagnifierState(prev => ({ ...prev, show: false }));
                    }}
                    onMouseLeave={() => setIsHoveringControl(false)}
                >
                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
                            "hover:scale-110 active:scale-95",
                            isWishlisted
                                ? "bg-white text-red-500 hover:text-red-600 hover:bg-red-50"
                                : "bg-white/90 hover:bg-white text-gray-600"
                        )}
                        onClick={(e) => {
                            e.stopPropagation(); // Prevent zoom click if that becomes an issue
                            handleWishlist();
                        }}
                        aria-label={isWishlisted ? "Remove from wishlist" : "Add to wishlist"}
                    >
                        <Heart
                            className={cn(
                                "h-6 w-6 transition-all duration-300",
                                "fill-none", /* Ensure consistent fill behavior */
                                isWishlisted && "fill-current scale-110"
                            )}
                        />
                    </Button>

                    <Button
                        variant="secondary"
                        size="icon"
                        className={cn(
                            "h-12 w-12 rounded-full shadow-lg transition-all duration-300",
                            "hover:scale-110 active:scale-95",
                            "bg-white/90 hover:bg-white text-gray-600"
                        )}
                        onClick={(e) => {
                            e.stopPropagation();
                            handleShare();
                        }}
                        aria-label="Share product"
                    >
                        <Share2 className="h-6 w-6" />
                    </Button>
                </div>
            </div>
        </div>
    );
};

export default ProductImageGallery;
