
import { Button } from "@/components/ui/button";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { Switch } from "@/components/ui/switch";

interface ProductsViewProps {
    products: any[];
    onAdd: () => void;
    onEdit: (product: any) => void;
    onDelete: (id: string, name: string) => void;
    onToggleStatus: (product: any) => void;
}

const ProductsView = ({ products, onAdd, onEdit, onDelete, onToggleStatus }: ProductsViewProps) => {
    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-2xl font-bold tracking-tight">Products</h2>
                    <p className="text-muted-foreground">
                        Manage your product inventory and prices
                    </p>
                </div>
                <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Product
                </Button>
            </div>

            <div className="rounded-xl border bg-white shadow-sm overflow-hidden">
                <Table>
                    <TableHeader className="bg-gray-50/50">
                        <TableRow>
                            <TableHead className="w-[100px]">Image</TableHead>
                            <TableHead>Product Details</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products.map((product) => (
                            <TableRow key={product.id} className="hover:bg-gray-50/50 transition-colors">
                                <TableCell>
                                    <div className="h-16 w-16 overflow-hidden rounded-lg border bg-gray-100 flex items-center justify-center">
                                        {product.image_url ? (
                                            <img
                                                src={product.image_url}
                                                alt={product.title}
                                                className="h-full w-full object-cover"
                                                onError={(e) => {
                                                    (e.target as HTMLImageElement).src = `https://placehold.co/600x400?text=${product.title.charAt(0)}`;
                                                }}
                                            />
                                        ) : (
                                            <span className="text-xs text-gray-400">No Img</span>
                                        )}
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <div className="flex flex-col">
                                        <span className="font-semibold text-gray-900">{product.title}</span>
                                        <span className="text-sm text-gray-500 line-clamp-1">{product.description}</span>
                                    </div>
                                </TableCell>
                                <TableCell>
                                    <span className="inline-flex items-center rounded-md bg-blue-50 px-2 py-1 text-xs font-medium text-blue-700 ring-1 ring-inset ring-blue-700/10">
                                        {product.categories?.name || 'Uncategorized'}
                                    </span>
                                </TableCell>
                                <TableCell className="font-mono font-medium">${product.price}</TableCell>
                                <TableCell>
                                    <div className="flex items-center gap-2">
                                        <Switch
                                            checked={product.is_active}
                                            onCheckedChange={() => onToggleStatus(product)}
                                        />
                                        <span className={`text-sm ${product.is_active ? 'text-green-600' : 'text-gray-500'}`}>
                                            {product.is_active ? 'Active' : 'Inactive'}
                                        </span>
                                    </div>
                                </TableCell>
                                <TableCell className="text-right">
                                    <div className="flex justify-end gap-2">
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
                                            onClick={() => onEdit(product)}
                                        >
                                            <Pencil className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="text-red-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                                            onClick={() => onDelete(product.id, product.title)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </TableCell>
                            </TableRow>
                        ))}
                        {products.length === 0 && (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-16">
                                    <div className="flex flex-col items-center gap-2 text-gray-500">
                                        <Package className="h-8 w-8 opacity-50" />
                                        <p>No products found in your inventory.</p>
                                    </div>
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
        </div>
    );
};

export default ProductsView;
