import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, Product } from "@/services/products";
import { formatCurrency } from "@/lib/currency";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Plus, PenTool, Trash2, Loader2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import ProductForm from "@/components/admin/ProductForm";

const AdminProducts = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);

    const handleClose = () => {
        setIsOpen(false);
        setEditingProduct(null);
    };

    const handleOpen = (product?: Product) => {
        setEditingProduct(product || null);
        setIsOpen(true);
    };

    // Fetch Data
    const { data: products, isLoading: productsLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getProducts()
    });

    const deleteMutation = useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted");
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => toast.error("Failed to delete product")
    });

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this product?")) return;
        deleteMutation.mutate(id);
    };

    if (productsLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Products</h1>
                <div className="flex gap-2">
                    <Button onClick={() => handleOpen()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Product
                    </Button>
                </div>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Title</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>MRP</TableHead>
                            <TableHead>Discount</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {products?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center h-24 text-muted-foreground">
                                    No products found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            products?.map((product) => (
                                <TableRow key={product.id}>
                                    <TableCell>
                                        {(product.images && product.images[0]) || product.image_url ? (
                                            <img
                                                src={product.images?.[0] || product.image_url || ""}
                                                alt={product.title}
                                                className="h-10 w-10 object-cover rounded"
                                            />
                                        ) : (
                                            <div className="h-10 w-10 bg-muted rounded flex items-center justify-center">
                                                <ImageIcon className="h-4 w-4 text-muted-foreground" />
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>
                                        <div className="font-medium">{product.title}</div>
                                        <div className="text-xs text-muted-foreground truncate max-w-[150px]">{product.slug}</div>
                                    </TableCell>
                                    <TableCell>{(product as any).category?.name || "Uncategorized"}</TableCell>
                                    <TableCell><div className="font-medium">{formatCurrency(product.base_price || product.price)}</div></TableCell>
                                    <TableCell><div className="text-muted-foreground line-through">{product.base_mrp || product.mrp ? formatCurrency(product.base_mrp || product.mrp) : '-'}</div></TableCell>
                                    <TableCell>
                                        {(() => {
                                            const variant = product.variants?.find(v => v.is_active) || product.variants?.[0];
                                            const price = variant?.price || product.base_price || product.price;
                                            const mrp = variant?.mrp || product.base_mrp || product.mrp;

                                            if (!price || !mrp) return <span className="text-muted-foreground">--</span>;

                                            const discount = Math.round(((mrp - price) / mrp) * 100);

                                            return discount > 0 ? (
                                                <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                                                    {discount}% OFF
                                                </span>
                                            ) : (
                                                <span className="text-muted-foreground">--</span>
                                            );
                                        })()}
                                    </TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded-full text-xs ${product.is_active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {product.is_active ? 'Active' : 'Draft'}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(product)}>
                                            <PenTool className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(product.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={(open) => {
                if (!open) handleClose();
            }}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                    </DialogHeader>

                    <ProductForm
                        product={editingProduct}
                        onSuccess={() => {
                            queryClient.invalidateQueries({ queryKey: ['products'] });
                            handleClose();
                        }}
                        onCancel={handleClose}
                    />
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminProducts;
