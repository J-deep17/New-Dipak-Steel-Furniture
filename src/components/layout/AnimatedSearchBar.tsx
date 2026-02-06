import { useState, useEffect, useRef } from "react";
import { Search, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { cn } from "@/lib/utils";
import { productService, SearchSuggestion } from "@/services/products";
import { useOnClickOutside } from "@/hooks/use-click-outside"; // You might not have this hook, I will implement inline or check for it.
// Actually, I'll implement a simple ref check for outside click.

const PLACEHOLDERS = [
    "Search for office chairs",
    "Search for executive chairs",
    "Search for ergonomic chairs",
    "Search for visitor chairs",
    "Search for descriptors",
    "Search for workstations",
    "Search for conference tables"
];

const AnimatedSearchBar = ({ className }: { className?: string }) => {
    const [placeholderIndex, setPlaceholderIndex] = useState(0);
    const [isAnimating, setIsAnimating] = useState(true);
    const [query, setQuery] = useState("");
    const [isFocused, setIsFocused] = useState(false);

    // Suggestions State
    const [suggestions, setSuggestions] = useState<SearchSuggestion[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [showDropdown, setShowDropdown] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);

    const navigate = useNavigate();
    const containerRef = useRef<HTMLDivElement>(null);
    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const debounceRef = useRef<NodeJS.Timeout | null>(null);

    // Placeholder Animation
    useEffect(() => {
        if (query.length > 0 || isFocused) return; // Stop animation on focus too for cleaner UX

        intervalRef.current = setInterval(() => {
            setPlaceholderIndex((prev) => (prev + 1) % PLACEHOLDERS.length);
            setIsAnimating(true);
        }, 3000);

        return () => {
            if (intervalRef.current) clearInterval(intervalRef.current);
        };
    }, [query, isFocused]);

    // Outside Click Handling
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
                setShowDropdown(false);
                setIsFocused(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    // Debounced Search
    useEffect(() => {
        if (debounceRef.current) clearTimeout(debounceRef.current);

        if (query.length < 2) {
            setSuggestions([]);
            setShowDropdown(false);
            return;
        }

        setIsLoading(true);
        // Show dropdown immediately if we want "loading" state visible? 
        // Or wait? Nike shows skeleton or spinner. I'll show spinner in input/dropdown.
        setShowDropdown(true);

        debounceRef.current = setTimeout(async () => {
            try {
                const results = await productService.getSearchSuggestions(query);
                setSuggestions(results);
                setSelectedIndex(-1); // Reset selection
            } catch (error) {
                console.error("Search error:", error);
            } finally {
                setIsLoading(false);
            }
        }, 250);

        return () => {
            if (debounceRef.current) clearTimeout(debounceRef.current);
        };
    }, [query]);


    const handleSearch = (targetQuery: string) => {
        if (!targetQuery.trim()) return;

        setShowDropdown(false);
        setIsFocused(false); // Remove focus to hide keyboard on mobile
        navigate(`/products?search=${encodeURIComponent(targetQuery)}`);
    };

    const handleSuggestionClick = (suggestion: SearchSuggestion) => {
        if (suggestion.type === 'product') {
            navigate(`/product/${suggestion.slug}`);
        } else {
            // If category, search for it or go to category page?
            // "Categories (name)". Usually typing "Office Chairs" -> go to category page.
            // Assuming we have a category route or just search.
            // Let's assume search filter for now, or if we have category slug route: /products?category=slug
            navigate(`/products?category=${suggestion.slug}`);
        }
        setShowDropdown(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
        if (!showDropdown || suggestions.length === 0) {
            if (e.key === "Enter") {
                handleSearch(query);
            }
            return;
        }

        if (e.key === "ArrowDown") {
            e.preventDefault();
            setSelectedIndex(prev => (prev + 1) % suggestions.length);
        } else if (e.key === "ArrowUp") {
            e.preventDefault();
            setSelectedIndex(prev => (prev - 1 + suggestions.length) % suggestions.length);
        } else if (e.key === "Enter") {
            e.preventDefault();
            if (selectedIndex >= 0) {
                handleSuggestionClick(suggestions[selectedIndex]);
            } else {
                handleSearch(query);
            }
        } else if (e.key === "Escape") {
            setShowDropdown(false);
        }
    };

    return (
        <div
            ref={containerRef}
            className={cn(
                "relative flex items-center w-full max-w-md h-10 rounded-full border bg-background transition-all duration-300 z-50",
                // Mobile full width fix might be needed on parent, but here we control the bar style
                isFocused || showDropdown ? "border-primary shadow-md ring-2 ring-primary/10" : "border-border hover:border-primary/50",
                // Specific styling for dropdown open: maybe square bottom corners? 
                // Nike keeps rounded, just adds floating dropdown.
                className
            )}
        >
            <div className="pl-3 text-muted-foreground">
                {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Search className="h-4 w-4" />}
            </div>

            <div className="relative flex-1 h-full mx-2 overflow-hidden">
                {/* Animated Placeholder */}
                {!query && !isFocused && ( // Hide placeholder on focus for cleaner look
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
                    onFocus={() => {
                        setIsFocused(true);
                        if (query.length >= 2) setShowDropdown(true);
                    }}
                // onBlur handled by click outside
                />
            </div>

            {/* Suggestions Dropdown */}
            {showDropdown && suggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden animate-in fade-in zoom-in-95 duration-200">
                    <div className="px-4 py-2 text-xs font-semibold text-gray-400 uppercase tracking-wider bg-gray-50/50">
                        Top Suggestions
                    </div>
                    <ul>
                        {suggestions.map((item, index) => (
                            <li
                                key={`${item.type}-${item.id}`}
                                className={cn(
                                    "px-4 py-3 text-sm cursor-pointer transition-colors flex items-center gap-2",
                                    index === selectedIndex ? "bg-gray-100/80 text-primary font-medium" : "hover:bg-gray-50 text-gray-700"
                                )}
                                onClick={() => handleSuggestionClick(item)}
                                onMouseEnter={() => setSelectedIndex(index)}
                            >
                                {item.type === 'category' ? (
                                    <span className="text-xs bg-gray-200 text-gray-600 px-1.5 py-0.5 rounded mr-1">Cat</span>
                                ) : null}
                                <span dangerouslySetInnerHTML={{
                                    // Simple highlight logic
                                    __html: item.title.replace(new RegExp(`(${query})`, 'gi'), '<b>$1</b>')
                                }} />
                            </li>
                        ))}
                    </ul>
                </div>
            )}

            {/* Empty State / No Results (Optional, user didn't ask explicitly but good UX) */}
            {showDropdown && query.length >= 2 && !isLoading && suggestions.length === 0 && (
                <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-gray-100 p-4 text-center text-sm text-gray-500 animate-in fade-in zoom-in-95 duration-200">
                    No results found for "{query}"
                </div>
            )}
        </div>
    );
};

export default AnimatedSearchBar;
