import { useState, useEffect, useRef } from "react";
import { Search } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";

const PLACEHOLDERS = [
    "Search for office chairs",
    "Search for executive chairs",
    "Search for ergonomic chairs",
    "Search for visitor chairs",
    "Search for desks",
    "Search for workstations",
    "Search for conference tables"
];

const AnimatedSearchBar = ({ className }: { className?: string }) => {
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);
    const navigate = useNavigate();
    const intervalRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        // Only animate if user hasn't typed anything
        if (query.length > 0) return;

        intervalRef.current = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
            setIsAnimating(true);

            // Reset animation state briefly to trigger re-render of animation (handled via key or class)
        }, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [query]);

    const handleSearch = () => {
        if (query.trim()) {
            navigate(`/products?search=${encodeURIComponent(query)}`);
            // Optional: Clear query after search or keep it
        }
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Enter") {
            handleSearch();
        }
    };

    return (
        <div
            className={cn(
                "relative flex items-center w-full max-w-md h-10 rounded-full border border-border bg-background transition-all duration-300",
                isFocused ? "ring-2 ring-primary/20 border-primary shadow-sm" : "hover:border-primary/50",
                className
            )}
        >
            <div className="pl-3 text-muted-foreground">
                <Search className="h-4 w-4" />
            </div>

            <div className="relative flex-1 h-full mx-2 overflow-hidden">
                {/* Animated Placeholder */}
                {!query && (
                    <div
                        key={placeholderIndex}
                        className="absolute inset-0 flex items-center text-sm text-muted-foreground/70 pointer-events-none animate-in fade-in slide-in-from-bottom-2 duration-500"
                    >
                        {PLACEHOLDERS[placeholderIndex]}
                    </div>
                )}

                <input
                    type="text"
                    className="w-full h-full bg-transparent border-none outline-none text-sm focus:ring-0 placeholder:text-transparent z-10"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    onKeyDown={handleKeyDown}
                    onFocus={() => setIsFocused(true)}
                    onBlur={() => setIsFocused(false)}
                // Set opacity of browser placeholder to 0 to use our custom one, 
                // or just don't set placeholder prop at all.
                />
            </div>
        </div>
    );
};

export default AnimatedSearchBar;
