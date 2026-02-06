import { useState, useRef, useCallback, useEffect } from "react";
import { cn } from "@/lib/utils";
import { ChevronUp, ChevronDown, ZoomIn, Share2, Heart, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";

interface ProductImageGalleryProps {
  images: string[];
  productName: string;
}

const ProductImageGallery = ({ images, productName }: ProductImageGalleryProps) => {
  const [selectedIndex, setSelectedIndex] = useState(0);
  const [isWishlisted, setIsWishlisted] = useState(false);
  const [showMagnifier, setShowMagnifier] = useState(false);
  const [magnifierPosition, setMagnifierPosition] = useState({ x: 0, y: 0 });
  const [zoomPosition, setZoomPosition] = useState({ x: 50, y: 50 });

  // Mobile pinch zoom state
  const [isMobile, setIsMobile] = useState(false);
  const [mobileZoomActive, setMobileZoomActive] = useState(false);
  const [mobileScale, setMobileScale] = useState(1);
  const [mobileOffset, setMobileOffset] = useState({ x: 0, y: 0 });
  const [lastTouchDistance, setLastTouchDistance] = useState<number | null>(null);
  const [lastTouchCenter, setLastTouchCenter] = useState<{ x: number; y: number } | null>(null);
  const [lastTap, setLastTap] = useState(0);

  const imageContainerRef = useRef<HTMLDivElement>(null);
  const thumbnailsRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Magnifier settings
  const MAGNIFIER_SIZE = isMobile ? 140 : 180;
  const ZOOM_LEVEL = 2.5;
  const [imageNaturalSize, setImageNaturalSize] = useState({ width: 0, height: 0 });

  // Detect mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.matchMedia("(max-width: 768px)").matches || 'ontouchstart' in window);
    };
    checkMobile();
    window.addEventListener('resize', checkMobile);
    return () => window.removeEventListener('resize', checkMobile);
  }, []);

  // Desktop: Throttled mouse move handler using requestAnimationFrame
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (isMobile || !imageContainerRef.current) return;

    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }

    animationFrameRef.current = requestAnimationFrame(() => {
      const rect = imageContainerRef.current!.getBoundingClientRect();

      // Cursor position relative to container (0-100%)
      const xPercent = ((e.clientX - rect.left) / rect.width) * 100;
      const yPercent = ((e.clientY - rect.top) / rect.height) * 100;

      // Clamp values to stay within bounds
      const clampedX = Math.max(0, Math.min(100, xPercent));
      const clampedY = Math.max(0, Math.min(100, yPercent));

      // Position magnifier centered on cursor
      const magnifierX = e.clientX - rect.left - MAGNIFIER_SIZE / 2;
      const magnifierY = e.clientY - rect.top - MAGNIFIER_SIZE / 2;

      setZoomPosition({ x: clampedX, y: clampedY });
      setMagnifierPosition({ x: magnifierX, y: magnifierY });
    });
  }, [isMobile]);

  const handleMouseEnter = () => {
    if (!isMobile) {
      setShowMagnifier(true);
    }
  };

  const handleMouseLeave = () => {
    setShowMagnifier(false);
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
    }
  };

  // Mobile: Touch handlers for pinch zoom
  const getTouchDistance = (touches: React.TouchList) => {
    if (touches.length < 2) return 0;
    const dx = touches[0].clientX - touches[1].clientX;
    const dy = touches[0].clientY - touches[1].clientY;
    return Math.sqrt(dx * dx + dy * dy);
  };

  const getTouchCenter = (touches: React.TouchList) => {
    if (touches.length < 2) return { x: touches[0].clientX, y: touches[0].clientY };
    return {
      x: (touches[0].clientX + touches[1].clientX) / 2,
      y: (touches[0].clientY + touches[1].clientY) / 2
    };
  };

  const handleTouchStart = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    // Double tap detection
    const now = Date.now();
    if (now - lastTap < 300 && e.touches.length === 1) {
      e.preventDefault();
      if (mobileZoomActive) {
        // Reset zoom
        setMobileScale(1);
        setMobileOffset({ x: 0, y: 0 });
        setMobileZoomActive(false);
      } else {
        // Zoom in on tap location
        const rect = imageContainerRef.current?.getBoundingClientRect();
        if (rect) {
          const x = e.touches[0].clientX - rect.left;
          const y = e.touches[0].clientY - rect.top;
          setMobileScale(2.5);
          setMobileOffset({
            x: (rect.width / 2 - x) * 1.5,
            y: (rect.height / 2 - y) * 1.5
          });
          setMobileZoomActive(true);
        }
      }
    }
    setLastTap(now);

    // Pinch start
    if (e.touches.length === 2) {
      setLastTouchDistance(getTouchDistance(e.touches));
      setLastTouchCenter(getTouchCenter(e.touches));
    }
  };

  const handleTouchMove = (e: React.TouchEvent<HTMLDivElement>) => {
    if (!isMobile) return;

    // Pinch zoom
    if (e.touches.length === 2 && lastTouchDistance) {
      e.preventDefault();
      const newDistance = getTouchDistance(e.touches);
      const newCenter = getTouchCenter(e.touches);
      const scaleDiff = newDistance / lastTouchDistance;

      setMobileScale(prev => Math.min(Math.max(prev * scaleDiff, 1), 4));
      setMobileZoomActive(true);

      // Pan while zooming
      if (lastTouchCenter) {
        setMobileOffset(prev => ({
          x: prev.x + (newCenter.x - lastTouchCenter.x),
          y: prev.y + (newCenter.y - lastTouchCenter.y)
        }));
      }

      setLastTouchDistance(newDistance);
      setLastTouchCenter(newCenter);
    }
    // Pan when zoomed in
    else if (e.touches.length === 1 && mobileZoomActive && mobileScale > 1) {
      const touch = e.touches[0];
      if (lastTouchCenter) {
        setMobileOffset(prev => ({
          x: prev.x + (touch.clientX - lastTouchCenter.x),
          y: prev.y + (touch.clientY - lastTouchCenter.y)
        }));
      }
      setLastTouchCenter({ x: touch.clientX, y: touch.clientY });
    }
  };

  const handleTouchEnd = () => {
    setLastTouchDistance(null);
    setLastTouchCenter(null);

    // Reset if scale is close to 1
    if (mobileScale <= 1.1) {
      setMobileScale(1);
      setMobileOffset({ x: 0, y: 0 });
      setMobileZoomActive(false);
    }
  };

  const handleThumbnailClick = (index: number) => {
    setSelectedIndex(index);
    setShowMagnifier(false);
    // Reset mobile zoom when changing images
    setMobileScale(1);
    setMobileOffset({ x: 0, y: 0 });
    setMobileZoomActive(false);
  };

  const scrollThumbnails = (direction: "up" | "down") => {
    if (!thumbnailsRef.current) return;
    const scrollAmount = 80;
    thumbnailsRef.current.scrollBy({
      top: direction === "up" ? -scrollAmount : scrollAmount,
      behavior: "smooth",
    });
  };

  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: productName,
          text: `Check out ${productName} from Dipak Furniture`,
          url: window.location.href,
        });
      } else {
        await navigator.clipboard.writeText(window.location.href);
        toast.success("Link copied to clipboard!");
      }
    } catch {
      toast.error("Failed to share");
    }
  };

  const handleWishlist = () => {
    setIsWishlisted(!isWishlisted);
    toast.success(isWishlisted ? "Removed from wishlist" : "Added to wishlist");
  };

  // Cleanup animation frame on unmount
  useEffect(() => {
    return () => {
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  if (images.length === 0) {
    return (
      <div className="aspect-square bg-muted rounded-xl flex items-center justify-center">
        <p className="text-muted-foreground">No image available</p>
      </div>
    );
  }

  return (
    <div className="flex gap-4">
      {/* Vertical Thumbnails */}
      {images.length > 1 && (
        <div className="hidden md:flex flex-col items-center gap-2 w-20">
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => scrollThumbnails("up")}
          >
            <ChevronUp className="h-4 w-4" />
          </Button>

          <div
            ref={thumbnailsRef}
            className="flex flex-col gap-2 overflow-y-auto max-h-[400px] scrollbar-hide"
          >
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all",
                  selectedIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <img
                  src={img}
                  alt={`${productName} view ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>

          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0"
            onClick={() => scrollThumbnails("down")}
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Main Image */}
      <div className="flex-1 relative">
        <div
          ref={imageContainerRef}
          className={cn(
            "relative aspect-square rounded-xl overflow-hidden bg-muted group",
            isMobile ? "touch-none" : "cursor-crosshair"
          )}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          {/* Main product image */}
          <img
            src={images[selectedIndex]}
            alt={productName}
            className="w-full h-full object-contain transition-transform duration-100"
            style={
              isMobile && mobileZoomActive
                ? {
                  transform: `scale(${mobileScale}) translate(${mobileOffset.x / mobileScale}px, ${mobileOffset.y / mobileScale}px)`,
                }
                : undefined
            }
            draggable={false}
            onError={(e) => {
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />

          {/* Desktop: Magnifier lens overlay */}
          {showMagnifier && !isMobile && imageContainerRef.current && (
            <div
              className="absolute pointer-events-none rounded-full overflow-hidden z-20"
              style={{
                width: MAGNIFIER_SIZE,
                height: MAGNIFIER_SIZE,
                left: magnifierPosition.x,
                top: magnifierPosition.y,
                border: '2px solid rgba(255,255,255,0.8)',
                borderRadius: '50%',
                backgroundImage: `url(${images[selectedIndex]})`,
                backgroundRepeat: 'no-repeat',
                // Use container width * zoom level for background size
                backgroundSize: `${imageContainerRef.current.offsetWidth * ZOOM_LEVEL}px ${imageContainerRef.current.offsetHeight * ZOOM_LEVEL}px`,
                // Map cursor position to zoomed background position
                backgroundPosition: `${-((zoomPosition.x / 100) * imageContainerRef.current.offsetWidth * ZOOM_LEVEL - MAGNIFIER_SIZE / 2)}px ${-((zoomPosition.y / 100) * imageContainerRef.current.offsetHeight * ZOOM_LEVEL - MAGNIFIER_SIZE / 2)}px`,
                boxShadow: '0 10px 30px rgba(0,0,0,0.25), inset 0 0 0 1px rgba(255,255,255,0.3)'
              }}
            />
          )}

          {/* Desktop: Zoom indicator */}
          {!isMobile && (
            <div className="absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-sm opacity-0 group-hover:opacity-100 transition-opacity">
              <Search className="h-4 w-4" />
              <span>Hover to magnify</span>
            </div>
          )}

          {/* Mobile: Zoom indicator */}
          {isMobile && (
            <div className={cn(
              "absolute bottom-4 left-4 bg-background/80 backdrop-blur-sm px-3 py-1.5 rounded-full flex items-center gap-2 text-sm transition-opacity",
              mobileZoomActive ? "opacity-0" : "opacity-100"
            )}>
              <ZoomIn className="h-4 w-4" />
              <span>Double-tap or pinch to zoom</span>
            </div>
          )}

          {/* Mobile: Zoom reset button */}
          {isMobile && mobileZoomActive && (
            <button
              className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-primary text-primary-foreground px-4 py-2 rounded-full text-sm font-medium shadow-lg z-30"
              onClick={() => {
                setMobileScale(1);
                setMobileOffset({ x: 0, y: 0 });
                setMobileZoomActive(false);
              }}
            >
              Reset Zoom
            </button>
          )}

          {/* Watermarks */}
          <div className="absolute top-4 left-4 text-foreground/30 text-sm font-medium pointer-events-none">
            Dipak Furniture
          </div>
          <div className="absolute bottom-4 right-4 text-foreground/30 text-sm font-medium pointer-events-none">
            dipaksteelfurniture.com
          </div>
        </div>

        {/* Action buttons */}
        <div className="absolute top-4 right-4 flex flex-col gap-2">
          <Button
            variant="secondary"
            size="icon"
            className="h-10 w-10 rounded-full shadow-md"
            onClick={handleShare}
          >
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="secondary"
            size="icon"
            className={cn(
              "h-10 w-10 rounded-full shadow-md",
              isWishlisted && "text-red-500"
            )}
            onClick={handleWishlist}
          >
            <Heart className={cn("h-4 w-4", isWishlisted && "fill-current")} />
          </Button>
        </div>

        {/* Image counter */}
        {images.length > 1 && (
          <div className="absolute top-4 left-1/2 -translate-x-1/2 bg-background/80 backdrop-blur-sm px-3 py-1 rounded-full text-sm">
            {selectedIndex + 1} / {images.length}
          </div>
        )}

        {/* Mobile horizontal thumbnails */}
        {images.length > 1 && (
          <div className="flex md:hidden gap-2 mt-4 overflow-x-auto pb-2">
            {images.map((img, index) => (
              <button
                key={index}
                onClick={() => handleThumbnailClick(index)}
                className={cn(
                  "w-16 h-16 rounded-lg border-2 overflow-hidden shrink-0 transition-all",
                  selectedIndex === index
                    ? "border-primary ring-2 ring-primary/20"
                    : "border-border hover:border-primary/50"
                )}
              >
                <img
                  src={img}
                  alt={`${productName} view ${index + 1}`}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductImageGallery;

