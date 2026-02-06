import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { productService } from "@/services/products";
import AnimatedSearchBar from "./AnimatedSearchBar";
import { Menu, ChevronDown, Phone, Search, Heart, MessageCircle, LogIn } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import CartDrawer from "@/components/cart/CartDrawer";
import logo from "@/assets/logo.png";
import { cn } from "@/lib/utils";



const navLinks = [
  { name: "Home", path: "/" },
  { name: "About Us", path: "/about" },
  { name: "Philosophy", path: "/philosophy" },
  { name: "Materials", path: "/materials" },
  { name: "Quality", path: "/quality" },
  { name: "Contact", path: "/contact" },
];

const Header = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  const { data: categories } = useQuery({
    queryKey: ['categories'],
    queryFn: productService.getCategories,
    staleTime: 1000 * 60 * 5, // Cache for 5 minutes
  });

  const isActive = (path: string) => location.pathname === path;
  const isProductsActive = location.pathname.startsWith("/products");

  // Common icon button styles
  const iconButtonStyles = "flex items-center justify-center p-2 text-muted-foreground transition-all duration-200 hover:text-accent hover:scale-105 rounded-md";

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center justify-between md:h-20">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <img
            src={logo}
            alt="Dipak Furniture"
            className="h-16 w-auto md:h-20"
          />
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-1 lg:flex">
          {navLinks.slice(0, 3).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-accent ${isActive(link.path)
                ? "text-accent"
                : "text-muted-foreground"
                }`}
            >
              {link.name}
            </Link>
          ))}

          {/* Products Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                className={`flex items-center gap-1 px-3 py-2 text-sm font-medium transition-colors hover:text-accent ${isProductsActive ? "text-accent" : "text-muted-foreground"
                  }`}
              >
                Products
                <ChevronDown className="h-4 w-4" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64">
              <DropdownMenuItem asChild>
                <Link to="/products" className="w-full font-medium">
                  All Products
                </Link>
              </DropdownMenuItem>
              {categories?.map((category) => (
                <DropdownMenuItem key={category.id} asChild>
                  <Link to={`/products/${category.slug}`} className="w-full">
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {navLinks.slice(3).map((link) => (
            <Link
              key={link.path}
              to={link.path}
              className={`px-3 py-2 text-sm font-medium transition-colors hover:text-accent ${isActive(link.path)
                ? "text-accent"
                : "text-muted-foreground"
                }`}
            >
              {link.name}
            </Link>
          ))}
        </nav>

        {/* Desktop Action Cluster */}
        <div className="hidden items-center gap-3.5 lg:flex">
          {/* Animated Search Bar - Replacing static icon */}
          <AnimatedSearchBar className="w-64 hidden xl:flex" />
          <Link to="/search" className={cn(iconButtonStyles, "xl:hidden")} title="Search Products">
            <Search className="h-5 w-5" />
            <span className="sr-only">Search</span>
          </Link>

          {/* Wishlist */}
          <Link to="/wishlist" className={iconButtonStyles} title="My Wishlist">
            <Heart className="h-5 w-5" />
            <span className="sr-only">Wishlist</span>
          </Link>

          {/* Phone Dropdown */}
          <Popover>
            <PopoverTrigger asChild>
              <button className={iconButtonStyles} title="Call Us">
                <Phone className="h-5 w-5" />
                <span className="sr-only">Call</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-3" align="center">
              <div className="space-y-3">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wide">
                  Contact Us
                </p>
                <a
                  href="tel:+919824044585"
                  className="flex items-center gap-3 p-2 rounded-md bg-secondary/50 hover:bg-secondary transition-colors"
                >
                  <Phone className="h-4 w-4 text-accent" />
                  <div>
                    <p className="text-xs text-muted-foreground">Call Now</p>
                    <p className="text-sm font-medium">+91 98240 44585</p>
                  </div>
                </a>
                <a
                  href="https://wa.me/919824044585"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 p-2 rounded-md bg-green-500/10 hover:bg-green-500/20 transition-colors"
                >
                  <MessageCircle className="h-4 w-4 text-green-500" />
                  <div>
                    <p className="text-xs text-muted-foreground">WhatsApp</p>
                    <p className="text-sm font-medium text-green-600">Chat with us</p>
                  </div>
                </a>
              </div>
            </PopoverContent>
          </Popover>

          {/* Cart */}
          <CartDrawer />

          {/* Divider */}
          <div className="h-6 w-px bg-border/60" />

          {/* Login Button */}
          <Button asChild variant="outline" className="gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200">
            <Link to="/login">
              <LogIn className="h-4 w-4" />
              Login
            </Link>
          </Button>
        </div>

        {/* Mobile Actions - Visible icons before menu */}
        <div className="flex items-center gap-2 lg:hidden">
          <Link to="/search" className={cn(iconButtonStyles, "p-1.5")}>
            <Search className="h-5 w-5" />
          </Link>
          <CartDrawer />
          <Sheet open={mobileMenuOpen} onOpenChange={setMobileMenuOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-6 w-6" />
                <span className="sr-only">Toggle menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-80">
              <nav className="flex flex-col gap-4 pt-8">
                {navLinks.map((link) => (
                  <Link
                    key={link.path}
                    to={link.path}
                    onClick={() => setMobileMenuOpen(false)}
                    className={`text-lg font-medium transition-colors hover:text-accent ${isActive(link.path)
                      ? "text-accent"
                      : "text-foreground"
                      }`}
                  >
                    {link.name}
                  </Link>
                ))}

                <div className="border-t pt-4">
                  <p className="mb-3 text-sm font-semibold text-muted-foreground">
                    Products
                  </p>
                  <Link
                    to="/products"
                    onClick={() => setMobileMenuOpen(false)}
                    className="mb-2 block text-base font-medium text-foreground hover:text-accent"
                  >
                    All Products
                  </Link>
                  {categories?.map((category) => (
                    <Link
                      key={category.id}
                      to={`/products/${category.slug}`}
                      onClick={() => setMobileMenuOpen(false)}
                      className="block py-1.5 text-sm text-muted-foreground hover:text-accent"
                    >
                      {category.name}
                    </Link>
                  ))}
                </div>

                <div className="mt-4 border-t pt-4 space-y-3">
                  <Link
                    to="/wishlist"
                    onClick={() => setMobileMenuOpen(false)}
                    className="flex items-center gap-3 text-base font-medium text-foreground hover:text-accent"
                  >
                    <Heart className="h-5 w-5" />
                    My Wishlist
                  </Link>

                  <a
                    href="tel:+919824044585"
                    className="flex items-center gap-3 p-3 rounded-lg bg-secondary/50"
                  >
                    <Phone className="h-5 w-5 text-accent" />
                    <div>
                      <p className="text-xs text-muted-foreground">Call Us</p>
                      <p className="text-sm font-semibold">+91 98240 44585</p>
                    </div>
                  </a>

                  <a
                    href="https://wa.me/919824044585"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-3 p-3 rounded-lg bg-green-500/10"
                  >
                    <MessageCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="text-xs text-muted-foreground">WhatsApp</p>
                      <p className="text-sm font-semibold text-green-600">Chat with us</p>
                    </div>
                  </a>

                  <Button
                    asChild
                    variant="outline"
                    className="w-full mt-4 gap-2 border-primary/30 text-primary hover:bg-primary hover:text-primary-foreground transition-all duration-200"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    <Link to="/login">
                      <LogIn className="h-4 w-4" />
                      Login
                    </Link>
                  </Button>
                </div>
              </nav>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
};

export default Header;

