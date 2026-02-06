
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import ScrollToTop from "@/components/common/ScrollToTop";
import { CartProvider } from "@/contexts/CartContext";
import { WishlistProvider } from "@/contexts/WishlistContext";
import { AuthProvider } from "@/contexts/AuthContext";

import Index from "./pages/Index";
import About from "./pages/About";
import Philosophy from "./pages/Philosophy";
import Products from "./pages/Products";
import ProductCategory from "./pages/ProductCategory";
import ProductDetail from "./pages/ProductDetail";
import Materials from "./pages/Materials";
import Quality from "./pages/Quality";
import Contact from "./pages/Contact";
import Search from "./pages/Search";
import NotFound from "./pages/NotFound";
import Login from "./pages/Login";
import Wishlist from "./pages/Wishlist";
import LegalPage from "./pages/LegalPage";

import Admin from "./pages/Admin";
import CMS from "./pages/CMS";
import AdminProducts from "./pages/admin/AdminProducts";
import AdminCategories from "./pages/admin/AdminCategories";
import AdminHero from "./pages/admin/AdminHero";
import AdminProductPageSettings from "./pages/admin/AdminProductPageSettings";
import AdminLegalPages from "./pages/admin/AdminLegalPages";
import AdminDashboard from "./pages/admin/AdminDashboard";
import AdminLogin from "./pages/admin/AdminLogin";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <AuthProvider>
        <BrowserRouter>
          <ScrollToTop />
          <Routes>
            {/* Admin Routes - No Providers */}
            <Route path="/admin" element={<Admin />}>
              <Route index element={<AdminDashboard />} />
              <Route path="cms" element={<CMS />} />
              <Route path="products" element={<AdminProducts />} />
              <Route path="categories" element={<AdminCategories />} />
              <Route path="hero" element={<AdminHero />} />
              <Route path="cms" element={<CMS />} />
              <Route path="legal" element={<AdminLegalPages />} />
              <Route path="product-page-settings" element={<AdminProductPageSettings />} />
            </Route>
            <Route path="/admin/login" element={<AdminLogin />} />

            {/* Public Routes - Wrapped in Providers */}
            <Route element={
              <WishlistProvider>
                <CartProvider>
                  <Outlet />
                </CartProvider>
              </WishlistProvider>
            }>
              <Route path="/" element={<Index />} />
              <Route path="/login" element={<Login />} />
              <Route path="/wishlist" element={<Wishlist />} />
              <Route path="/legal/:slug" element={<LegalPage />} />
              <Route path="/about" element={<About />} />
              <Route path="/philosophy" element={<Philosophy />} />
              <Route path="/products" element={<Products />} />
              <Route path="/products/:categorySlug" element={<ProductCategory />} />
              <Route path="/product/:productSlug" element={<ProductDetail />} />
              <Route path="/materials" element={<Materials />} />
              <Route path="/quality" element={<Quality />} />
              <Route path="/contact" element={<Contact />} />
              <Route path="/search" element={<Search />} />
              <Route path="*" element={<NotFound />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
