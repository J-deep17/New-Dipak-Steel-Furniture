
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Package, CheckCircle, Tag } from "lucide-react";

interface StatsProps {
    products: any[];
}

const Stats = ({ products }: StatsProps) => {
    const totalProducts = products.length;
    const activeProducts = products.filter(p => p.is_active).length;
    // Unique categories count - assuming products have categories loaded or we just count unique IDs from products if categories list isn't passed separately.
    // Ideally, we accept categories list as well, but let's derive or keep simple for now.
    const uniqueCategories = new Set(products.map(p => p.category_id).filter(Boolean)).size;

    const stats = [
        {
            title: "Total Products",
            value: totalProducts,
            icon: Package,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Active Products",
            value: activeProducts,
            icon: CheckCircle,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Categories Utilized",
            value: uniqueCategories,
            icon: Tag,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
    ];

    return (
        <div className="grid gap-4 md:grid-cols-3 mb-8">
            {stats.map((stat) => (
                <Card key={stat.title} className="border-none shadow-sm hover:shadow-md transition-shadow">
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {stat.title}
                        </CardTitle>
                        <div className={`p-2 rounded-full ${stat.bg}`}>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="text-2xl font-bold">{stat.value}</div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
};

export default Stats;
