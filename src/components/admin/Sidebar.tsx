import { LayoutDashboard, Package, ShoppingCart, FolderTree, LogOut, LayoutTemplate, Image as ImageIcon, Settings, Quote, MessageSquare, PenTool } from "lucide-react";
import { Link, useLocation } from "react-router-dom";

interface SidebarProps {
    onLogout: () => void;
}

export const Sidebar = ({ onLogout }: SidebarProps) => {
    const location = useLocation();

    // Helper to check if link is active
    const isActive = (path: string) => {
        if (path === "/admin" && location.pathname === "/admin") return true;
        if (path !== "/admin" && location.pathname.startsWith(path)) return true;
        return false;
    };

    const menuItems = [
        { path: "/admin", label: "Dashboard", icon: LayoutDashboard },
        { path: "/admin/products", label: "Products", icon: Package },
        { path: "/admin/categories", label: "Categories", icon: FolderTree },
        { path: "/admin/hero", label: "Hero Banners", icon: ImageIcon },
        { path: "/admin/cms", label: "CMS Layout", icon: LayoutTemplate },
        { path: "/admin/blogs", label: "Blogs", icon: PenTool },
        { path: "/admin/locations", label: "Locations", icon: FolderTree },
        { path: "/admin/seo-pages", label: "SEO Pages", icon: LayoutTemplate },
        { path: "/admin/legal", label: "Legal Pages", icon: LayoutTemplate },
        { path: "/admin/footer-settings", label: "Footer Settings", icon: Settings },
        { path: "/admin/reviews", label: "Reviews", icon: MessageSquare },
        { path: "/admin/testimonials", label: "Testimonials", icon: Quote },
        { path: "/admin/product-page-settings", label: "Product Page Settings", icon: Settings },
    ];

    return (
        <div className="h-screen w-64 bg-white border-r border-gray-200 flex flex-col fixed left-0 top-0">
            <div className="p-6 border-b border-gray-100">
                <h1 className="text-xl font-bold text-primary flex items-center gap-2">
                    <span className="bg-primary text-white p-1 rounded">SD</span> Admin
                </h1>
            </div>

            <nav className="flex-1 p-4 space-y-2">
                {menuItems.map((item) => (
                    <Link
                        key={item.path}
                        to={item.path}
                        className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all ${isActive(item.path)
                            ? "bg-primary/10 text-primary shadow-sm"
                            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
                            }`}
                    >
                        <item.icon className="h-5 w-5" />
                        {item.label}
                    </Link>
                ))}
            </nav>

            <div className="p-4 border-t border-gray-100">
                <button
                    onClick={onLogout}
                    className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                >
                    <LogOut className="h-5 w-5" />
                    Logout
                </button>
            </div>
        </div>
    );
};

export default Sidebar;
