import { useState, useEffect, useCallback } from "react";
import { X, ChevronLeft, ChevronRight, Images, Loader2 } from "lucide-react";
import { Dialog, DialogContent, DialogOverlay, DialogTitle } from "@/components/ui/dialog";
import { VisuallyHidden } from "@radix-ui/react-visually-hidden";
import { cn } from "@/lib/utils";
import logo from "@/assets/logo.png";
import { getAllGalleryImages } from "@/data/productGallery";

interface ImageZoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  imageSrc: string;
  alt: string;
  productId?: string;
}

// Preload images utility
const preloadImages = (urls: string[]): Promise<void[]> => {
  return Promise.all(
    urls.map(
      (url) =>
        new Promise<void>((resolve) => {
          const img = new Image();
          img.onload = () => resolve();
          img.onerror = () => resolve(); // Don't fail on error
          img.src = url;
        })
    )
  );
};

const ImageZoomModal = ({ isOpen, onClose, imageSrc, alt, productId }: ImageZoomModalProps) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isBlurred, setIsBlurred] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [loadedImages, setLoadedImages] = useState<Set<number>>(new Set([0]));
  const galleryImages = productId ? getAllGalleryImages(productId) : [];
  
  // Build images array: main image + all gallery images
  const images = [imageSrc, ...galleryImages];
  const hasMultipleImages = images.length > 1;

  // Preload all images when modal opens
  useEffect(() => {
    if (isOpen && images.length > 0) {
      setIsLoading(true);
      // Preload all images in parallel
      preloadImages(images).then(() => {
        setLoadedImages(new Set(images.map((_, i) => i)));
        setIsLoading(false);
      });
    }
  }, [isOpen, imageSrc, productId]);

  // Reset to first image when modal opens
  useEffect(() => {
    if (isOpen) {
      setCurrentIndex(0);
      setIsBlurred(false);
    }
  }, [isOpen]);

  // Track individual image loading
  const handleImageLoad = useCallback((index: number) => {
    setLoadedImages((prev) => new Set([...prev, index]));
  }, []);

  const handlePrev = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = (e: React.MouseEvent) => {
    e.stopPropagation();
    setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  const handleThumbnailClick = (index: number) => {
    setCurrentIndex(index);
  };

  // Handle keyboard navigation and block screenshot shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!isOpen) return;
      
      // Block common screenshot shortcuts
      if (e.key === "PrintScreen" || 
          (e.ctrlKey && e.key === "p") || 
          (e.ctrlKey && e.shiftKey && e.key === "s") ||
          (e.metaKey && e.shiftKey && (e.key === "3" || e.key === "4" || e.key === "5"))) {
        e.preventDefault();
        return;
      }
      
      if (!hasMultipleImages) return;
      
      if (e.key === "ArrowLeft") {
        setCurrentIndex((prev) => (prev === 0 ? images.length - 1 : prev - 1));
      } else if (e.key === "ArrowRight") {
        setCurrentIndex((prev) => (prev === images.length - 1 ? 0 : prev + 1));
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, hasMultipleImages, images.length]);

  // Blur content when window loses focus (screenshot deterrent)
  useEffect(() => {
    if (!isOpen) return;

    const handleVisibilityChange = () => {
      if (document.hidden) {
        setIsBlurred(true);
      }
    };

    const handleBlur = () => {
      setIsBlurred(true);
    };

    const handleFocus = () => {
      setIsBlurred(false);
    };

    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleBlur);
    window.addEventListener("focus", handleFocus);

    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleBlur);
      window.removeEventListener("focus", handleFocus);
    };
  }, [isOpen]);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogOverlay className="bg-background/80 backdrop-blur-sm" />
      <DialogContent 
        className="max-w-5xl border-none bg-transparent p-0 shadow-none"
        aria-describedby={undefined}
      >
        {/* Accessible title (visually hidden) */}
        <VisuallyHidden>
          <DialogTitle>{alt} - Product Gallery</DialogTitle>
        </VisuallyHidden>

        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 z-50 rounded-full bg-background/90 p-2 text-foreground transition-colors hover:bg-background"
        >
          <X className="h-6 w-6" />
        </button>

        <div className="flex flex-col items-center gap-4">
          {/* Main image container */}
          <div 
            className="relative flex items-center justify-center p-4"
            onContextMenu={(e) => e.preventDefault()}
          >
            {/* Left arrow */}
            {hasMultipleImages && (
              <button
                onClick={handlePrev}
                className="absolute left-2 z-40 rounded-full bg-background/90 p-2 text-foreground transition-all hover:bg-background hover:scale-110 md:left-4"
              >
                <ChevronLeft className="h-6 w-6" />
              </button>
            )}

            {/* Image display with blur protection */}
            <div className={cn("relative transition-all duration-200", isBlurred && "blur-xl")}>
              {/* Loading spinner */}
              {isLoading && (
                <div className="flex h-[50vh] w-[50vw] max-w-3xl items-center justify-center">
                  <Loader2 className="h-12 w-12 animate-spin text-accent" />
                </div>
              )}
              
              <img
                src={images[currentIndex]}
                alt={`${alt} - View ${currentIndex + 1}`}
                className={cn(
                  "max-h-[70vh] max-w-full rounded-lg object-contain shadow-2xl select-none md:max-h-[75vh]",
                  isLoading && "hidden"
                )}
                draggable={false}
                onContextMenu={(e) => e.preventDefault()}
                onDragStart={(e) => e.preventDefault()}
                onLoad={() => handleImageLoad(currentIndex)}
              />
              
              {/* Top-left Watermark - Fixed position */}
              <div className="pointer-events-none absolute left-4 top-4 z-30">
                <img
                  src={logo}
                  alt="Dipak Furniture"
                  className="h-10 w-auto opacity-60 md:h-12"
                  style={{ userSelect: "none" }}
                  draggable={false}
                />
              </div>

              {/* Bottom-right Watermark - Fixed position */}
              <div className="pointer-events-none absolute bottom-4 right-4 z-30">
                <img
                  src={logo}
                  alt="Dipak Furniture"
                  className="h-12 w-auto opacity-70 md:h-14"
                  style={{ userSelect: "none" }}
                  draggable={false}
                />
              </div>

              {/* Image counter badge - moved to top-right to avoid watermark conflict */}
              {hasMultipleImages && (
                <div className="absolute right-4 top-4 flex items-center gap-1.5 rounded-full bg-background/90 px-3 py-1.5 text-sm font-medium text-foreground">
                  <Images className="h-4 w-4" />
                  <span>{currentIndex + 1} / {images.length}</span>
                </div>
              )}

              {/* Protection overlay message when blurred */}
              {isBlurred && (
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-lg bg-background/90 px-6 py-4 text-center shadow-lg">
                    <p className="text-lg font-medium text-foreground">Image Protected</p>
                    <p className="text-sm text-muted-foreground">Click here to continue viewing</p>
                  </div>
                </div>
              )}
            </div>

            {/* Right arrow */}
            {hasMultipleImages && (
              <button
                onClick={handleNext}
                className="absolute right-2 z-40 rounded-full bg-background/90 p-2 text-foreground transition-all hover:bg-background hover:scale-110 md:right-4"
              >
                <ChevronRight className="h-6 w-6" />
              </button>
            )}
          </div>

          {/* Thumbnail navigation */}
          {hasMultipleImages && (
            <div className="flex items-center justify-center gap-2 pb-4">
              {images.map((img, index) => (
                <button
                  key={index}
                  onClick={() => handleThumbnailClick(index)}
                  className={cn(
                    "relative h-16 w-16 overflow-hidden rounded-lg border-2 transition-all md:h-20 md:w-20",
                    currentIndex === index
                      ? "border-accent ring-2 ring-accent/50"
                      : "border-border/50 opacity-60 hover:opacity-100"
                  )}
                >
                  <img
                    src={img}
                    alt={`Thumbnail ${index + 1}`}
                    className="h-full w-full object-cover select-none"
                    draggable={false}
                    onContextMenu={(e) => e.preventDefault()}
                  />
                  {index > 0 && (
                    <div className="absolute inset-0 flex items-center justify-center bg-background/60 text-xs font-medium text-foreground">
                      {index === 1 ? "Views" : `+${index}`}
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* View label */}
          {hasMultipleImages && (
            <p className="pb-2 text-sm text-muted-foreground">
              {currentIndex === 0 ? "Main View" : `Gallery View ${currentIndex} - Multiple Angles`}
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ImageZoomModal;
