
import { useEffect, useState, useRef } from "react";
import { useQuery } from "@tanstack/react-query";
import { heroService } from "@/services/hero";
import {
    Carousel,
    CarouselContent,
    CarouselItem,
    CarouselNext,
    CarouselPrevious,
    type CarouselApi,
} from "@/components/ui/carousel";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

const Hero = () => {
    const [api, setApi] = useState<CarouselApi>();
    const [current, setCurrent] = useState(0);

    const { data: banners, isLoading: isLoadingBanners } = useQuery({
        queryKey: ['hero-banners-active'],
        queryFn: heroService.getActiveBanners
    });

    const { data: settings, isLoading: isLoadingSettings } = useQuery({
        queryKey: ['hero-settings'],
        queryFn: heroService.getSettings
    });

    // Autoplay Logic
    const [isPaused, setIsPaused] = useState(false);
    const autoplayRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        if (!api || !settings?.autoplay || !banners || banners.length <= 1) return;

        const startAutoplay = () => {
            stopAutoplay();
            // Don't start if paused
            if (isPaused && settings.pause_on_hover) return;

            autoplayRef.current = setInterval(() => {
                api.scrollNext();
            }, settings.autoplay_interval || 5000);
        };

        const stopAutoplay = () => {
            if (autoplayRef.current) {
                clearInterval(autoplayRef.current);
                autoplayRef.current = null;
            }
        };

        startAutoplay();

        // Listen to select to update current index
        api.on("select", () => {
            setCurrent(api.selectedScrollSnap());
        });

        // Interactions usually stop autoplay temporarily
        api.on("pointerDown", stopAutoplay);
        api.on("pointerUp", startAutoplay);

        return () => stopAutoplay();
    }, [api, settings, banners, isPaused]);


    if (isLoadingBanners || isLoadingSettings) {
        return <div className="w-full h-[60vh] bg-gray-100 flex items-center justify-center"><Loader2 className="animate-spin text-primary h-8 w-8" /></div>;
    }

    if (!banners || banners.length === 0) {
        return null; // Or partial hero?
    }

    return (
        <section className="relative w-full overflow-hidden bg-gray-900 text-white">
            <Carousel
                setApi={setApi}
                className="w-full"
                opts={{ loop: true }}
                onMouseEnter={() => setIsPaused(true)}
                onMouseLeave={() => setIsPaused(false)}
            >
                <CarouselContent>
                    {banners.map((banner) => (
                        <CarouselItem key={banner.id} className="relative h-[60vh] md:h-[80vh] w-full">
                            {/* Media Background */}
                            <div className="absolute inset-0 w-full h-full">
                                {banner.media_type === 'video' ? (
                                    <video
                                        src={banner.media_url}
                                        autoPlay
                                        muted
                                        loop={!banner.advance_after_video}
                                        playsInline
                                        preload="auto"
                                        className="w-full h-full object-cover"
                                        poster="/placeholder.svg"
                                        onEnded={() => {
                                            if (banner.advance_after_video && api) {
                                                api.scrollNext();
                                            }
                                        }}
                                        onError={(e) => {
                                            console.error("Video failed to load:", banner.media_url);
                                            (e.target as HTMLVideoElement).style.display = "none";
                                        }}
                                    />
                                ) : (
                                    <img
                                        src={banner.media_url || "/placeholder.svg"}
                                        alt={banner.title || "Banner"}
                                        className="w-full h-full object-cover"
                                        onError={(e) => {
                                            (e.target as HTMLImageElement).src = "/placeholder.svg";
                                        }}
                                    />
                                )}
                                {/* Overlay */}
                                <div
                                    className="absolute inset-0 bg-black"
                                    style={{ opacity: banner.overlay_opacity || 0.3 }}
                                />
                            </div>

                            {/* Content */}
                            <div className={cn(
                                "relative z-10 h-full container mx-auto px-4 flex flex-col justify-center",
                                banner.text_position === 'center' && "items-center text-center",
                                banner.text_position === 'right' && "items-end text-right",
                                banner.text_position === 'left' && "items-start text-left"
                            )}>
                                <div className="max-w-2xl space-y-6 animate-in fade-in slide-in-from-bottom-5 duration-700">
                                    {banner.title && (
                                        <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold tracking-tight text-white leading-tight drop-shadow-lg">
                                            {banner.title}
                                        </h1>
                                    )}
                                    {banner.subtitle && (
                                        <p className="text-lg md:text-xl text-gray-200 font-medium max-w-lg drop-shadow-md">
                                            {banner.subtitle}
                                        </p>
                                    )}

                                    <div className={cn(
                                        "flex flex-wrap gap-4 pt-4",
                                        banner.text_position === 'center' && "justify-center",
                                        banner.text_position === 'right' && "justify-end"
                                    )}>
                                        {banner.primary_button_text && banner.primary_button_link && (
                                            <Button asChild size="lg" className="text-base px-8 h-14 rounded-full bg-primary hover:bg-primary/90 border-0 shadow-lg hover:translate-y-[-2px] transition-transform">
                                                <Link to={banner.primary_button_link}>
                                                    {banner.primary_button_text}
                                                </Link>
                                            </Button>
                                        )}
                                        {banner.secondary_button_text && banner.secondary_button_link && (
                                            <Button asChild variant="outline" size="lg" className="text-base px-8 h-14 rounded-full bg-white/10 backdrop-blur-sm border-white/40 text-white hover:bg-white hover:text-black transition-all">
                                                <Link to={banner.secondary_button_link}>
                                                    {banner.secondary_button_text}
                                                </Link>
                                            </Button>
                                        )}
                                    </div>
                                </div>
                            </div>
                        </CarouselItem>
                    ))}
                </CarouselContent>

                {/* Arrows */}
                {settings?.show_arrows && banners.length > 1 && (
                    <>
                        <CarouselPrevious className="left-4 bg-black/20 hover:bg-black/40 border-none text-white h-12 w-12" />
                        <CarouselNext className="right-4 bg-black/20 hover:bg-black/40 border-none text-white h-12 w-12" />
                    </>
                )}

                {/* Dots */}
                {settings?.show_dots && banners.length > 1 && (
                    <div className="absolute bottom-8 left-0 right-0 z-20 flex justify-center gap-2">
                        {banners.map((_, index) => (
                            <button
                                key={index}
                                onClick={() => api?.scrollTo(index)}
                                className={cn(
                                    "w-3 h-3 rounded-full transition-all duration-300 shadow-sm",
                                    current === index ? "bg-white w-8" : "bg-white/50 hover:bg-white/80"
                                )}
                                aria-label={`Go to slide ${index + 1}`}
                            />
                        ))}
                    </div>
                )}
            </Carousel>
        </section>
    );
};

export default Hero;
