import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, Product, Category } from "@/services/products";
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

const AdminProducts = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [productImages, setProductImages] = useState<string[]>([]);
    const [selectedCategory, setSelectedCategory] = useState<string>("");
    const [title, setTitle] = useState("");
    const [slug, setSlug] = useState("");
    const [price, setPrice] = useState<string>("");
    const [mrp, setMrp] = useState<string>("");
    const [discountPercent, setDiscountPercent] = useState<number>(0);
    const [isActive, setIsActive] = useState(true);

    // Dynamic Fields State (Text Areas)
    const [keyFeaturesText, setKeyFeaturesText] = useState("");
    const [specifications, setSpecifications] = useState<{ key: string, value: string }[]>([]);
    const [warrantyCoverageText, setWarrantyCoverageText] = useState("");
    const [warrantyCareText, setWarrantyCareText] = useState("");
    const [dimensions, setDimensions] = useState("");
    const [shortDescription, setShortDescription] = useState("");
    const [description, setDescription] = useState("");

    // Fetch Data
    const { data: products, isLoading: productsLoading } = useQuery({
        queryKey: ['products'],
        queryFn: () => productService.getProducts()
    });

    const { data: categories } = useQuery({
        queryKey: ['categories'],
        queryFn: () => productService.getCategories()
    });

    const { data: templates } = useQuery({
        queryKey: ['templates'],
        queryFn: () => productService.getTemplates()
    });

    // Auto-calculate Discount
    useEffect(() => {
        const p = parseFloat(price);
        const m = parseFloat(mrp);
        if (!isNaN(p) && !isNaN(m) && m > 0 && m > p) {
            const discount = Math.round(((m - p) / m) * 100);
            setDiscountPercent(discount);
        } else {
            setDiscountPercent(0);
        }
    }, [price, mrp]);

    // Auto-generate Slug
    useEffect(() => {
        if (!editingProduct && title) {
            const generated = title
                .toLowerCase()
                .replace(/[^a-z0-9]+/g, '-')
                .replace(/(^-|-$)+/g, '');
            setSlug(generated);
        }
    }, [title, editingProduct]);

    // Mutations
    const createMutation = useMutation({
        mutationFn: productService.createProduct,
        onSuccess: () => {
            toast.success("Product created");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => toast.error("Failed to create product")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            productService.updateProduct(id, updates),
        onSuccess: () => {
            toast.success("Product updated");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => toast.error("Failed to update product")
    });

    const deleteMutation = useMutation({
        mutationFn: productService.deleteProduct,
        onSuccess: () => {
            toast.success("Product deleted");
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
        onError: () => toast.error("Failed to delete product")
    });

    const handleClose = () => {
        setIsOpen(false);
        setEditingProduct(null);
        resetForm();
    };

    const resetForm = () => {
        setTitle("");
        setSlug("");
        setPrice("");
        setMrp("");
        setDiscountPercent(0);
        setProductImages([]);
        setSelectedCategory("");
        setKeyFeaturesText("");
        setSpecifications([]);
        setWarrantyCoverageText("");
        setWarrantyCareText("");
        setDimensions("");
        setShortDescription("");
        setDescription("");
        setIsActive(true);
    };

    const handleOpen = (product?: Product) => {
        if (product) {
            setEditingProduct(product);
            setTitle(product.title);
            setSlug(product.slug || "");
            setPrice(String(product.price));
            setMrp(product.mrp ? String(product.mrp) : "");
            setDiscountPercent(product.discount_percent || 0);

            const images = product.images && product.images.length > 0
                ? product.images
                : product.image_url ? [product.image_url] : [];
            setProductImages(images);

            setSelectedCategory(product.category_id || "");
            setIsActive(product.is_active ?? true);

            // Populate new fields
            setKeyFeaturesText(product.key_features ? product.key_features.join('\n') : "");

            const specsArray = product.specifications
                ? Object.entries(product.specifications).map(([key, value]) => ({ key, value: String(value) }))
                : [];
            setSpecifications(specsArray);

            setWarrantyCoverageText(product.warranty_coverage ? product.warranty_coverage.join('\n') : "");
            setWarrantyCareText(product.warranty_care ? product.warranty_care.join('\n') : "");

            setDimensions(product.dimensions || "");
            setShortDescription(product.short_description || "");
            setDescription(product.description || "");
        } else {
            setEditingProduct(null);
            resetForm();
        }
        setIsOpen(true);
    };

    const handleTemplateSelect = (templateId: string) => {
        const template = templates?.find(t => t.id === templateId);
        if (template) {
            if (template.key_features) setKeyFeaturesText(template.key_features.join('\n'));
            if (template.warranty_coverage) setWarrantyCoverageText(template.warranty_coverage.join('\n'));
            if (template.warranty_care) setWarrantyCareText(template.warranty_care.join('\n'));
            if (template.dimensions) setDimensions(template.dimensions);
            toast.success("Template applied");
        }
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const newImages: string[] = [];
            for (let i = 0; i < e.target.files.length; i++) {
                const file = e.target.files[i];
                const publicUrl = await productService.uploadImage(file);
                newImages.push(publicUrl);
            }

            setProductImages(prev => [...prev, ...newImages]);
            toast.success(`${newImages.length} image(s) uploaded`);
            e.target.value = '';
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    const removeImage = (indexToRemove: number) => {
        setProductImages(prev => prev.filter((_, index) => index !== indexToRemove));
    };

    // Helper for Spec Inputs
    const addSpec = () => {
        setSpecifications(prev => [...prev, { key: "", value: "" }]);
    };
    const updateSpec = (index: number, field: 'key' | 'value', val: string) => {
        setSpecifications(prev => {
            const temp = [...prev];
            temp[index][field] = val;
            return temp;
        });
    };
    const removeSpec = (index: number) => {
        setSpecifications(prev => prev.filter((_, i) => i !== index));
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();

        // Parse Lists
        const key_features = keyFeaturesText.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
        const warranty_coverage = warrantyCoverageText.split(/[\n,]/).map(s => s.trim()).filter(Boolean);
        const warranty_care = warrantyCareText.split(/[\n,]/).map(s => s.trim()).filter(Boolean);

        // Convert key-value array to object for jsonb
        const specsObject: Record<string, string> = {};
        specifications.forEach(item => {
            if (item.key.trim()) specsObject[item.key.trim()] = item.value;
        });

        const productData = {
            title,
            slug,
            short_description: shortDescription,
            description,
            price: parseFloat(price) || 0,
            mrp: parseFloat(mrp) || 0,
            discount_percent: discountPercent,
            category_id: selectedCategory || null,
            is_active: isActive,
            images: productImages,
            image_url: productImages.length > 0 ? productImages[0] : null,

            // New Fields
            key_features: key_features,
            specifications: specsObject,
            dimensions,
            warranty_coverage: warranty_coverage,
            warranty_care: warranty_care,
        };

        if (editingProduct) {
            updateMutation.mutate({
                id: editingProduct.id,
                updates: productData
            });
        } else {
            createMutation.mutate(productData);
        }
    };

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
                    {/* Placeholder for Template Manager - In a real app this would open a dialog */}
                    <Button variant="outline" onClick={() => toast.info("Template Manager would open here")}>
                        Manage Templates
                    </Button>
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
                                    <TableCell><div className="font-medium">{formatCurrency(product.price)}</div></TableCell>
                                    <TableCell><div className="text-muted-foreground line-through">{product.mrp ? formatCurrency(product.mrp) : '-'}</div></TableCell>
                                    <TableCell>
                                        {product.discount_percent && product.discount_percent > 0 ? (
                                            <span className="bg-red-100 text-red-700 px-2 py-0.5 rounded text-xs font-semibold">
                                                {product.discount_percent}% OFF
                                            </span>
                                        ) : null}
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

            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingProduct ? "Edit Product" : "Add Product"}</DialogTitle>
                    </DialogHeader>

                    {/* Template Selector */}
                    {!editingProduct && (
                        <div className="bg-muted/30 p-4 rounded-lg border mb-4">
                            <Label className="mb-2 block text-xs font-semibold text-muted-foreground uppercase">Fast Fill</Label>
                            <div className="flex gap-4 items-center">
                                <Select onValueChange={handleTemplateSelect}>
                                    <SelectTrigger className="w-[250px]">
                                        <SelectValue placeholder="Select a Template..." />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {templates?.map(t => (
                                            <SelectItem key={t.id} value={t.id}>{t.name}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                <span className="text-xs text-muted-foreground">Select a template to auto-fill common fields</span>
                            </div>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Left Column: Basic Info & Content */}
                            <div className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="title">Title</Label>
                                    <Input
                                        id="title"
                                        value={title}
                                        onChange={(e) => setTitle(e.target.value)}
                                        required
                                        placeholder="Product Title"
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="slug">Slug (URL)</Label>
                                    <Input
                                        id="slug"
                                        value={slug}
                                        onChange={(e) => setSlug(e.target.value)}
                                        placeholder="auto-generated-slug"
                                        required
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="category">Category</Label>
                                    <Select value={selectedCategory} onValueChange={setSelectedCategory}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="Select a category" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            {categories?.map((c) => (
                                                <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="short_description">Short Description</Label>
                                    <Textarea
                                        id="short_description"
                                        value={shortDescription}
                                        onChange={(e) => setShortDescription(e.target.value)}
                                        placeholder="Brief overview for listings..."
                                        rows={2}
                                    />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="description">Full Description</Label>
                                    <Textarea
                                        id="description"
                                        value={description}
                                        onChange={(e) => setDescription(e.target.value)}
                                        rows={6}
                                        placeholder="Detailed explanation..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Dimensions</Label>
                                    <Textarea
                                        value={dimensions}
                                        onChange={(e) => setDimensions(e.target.value)}
                                        rows={3}
                                        placeholder="e.g., W: 60cm, D: 70cm, H: 120cm"
                                    />
                                </div>
                            </div>

                            {/* Right Column: Pricing, Images, Lists */}
                            <div className="space-y-4">
                                <div className="grid grid-cols-3 gap-4">
                                    <div className="space-y-2">
                                        <Label htmlFor="price">Price (₹)</Label>
                                        <Input
                                            id="price"
                                            type="number"
                                            step="0.01"
                                            value={price}
                                            onChange={(e) => setPrice(e.target.value)}
                                            required
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="mrp">MRP (₹)</Label>
                                        <Input
                                            id="mrp"
                                            type="number"
                                            step="0.01"
                                            value={mrp}
                                            onChange={(e) => setMrp(e.target.value)}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Discount %</Label>
                                        <div className="flex h-9 w-full items-center justify-center rounded-md border border-input bg-muted px-3 py-1 text-sm shadow-sm">
                                            {discountPercent}%
                                        </div>
                                    </div>
                                </div>

                                {/* Images */}
                                <div className="space-y-2 border-t pt-4">
                                    <Label>Product Images</Label>
                                    <div className="grid grid-cols-4 gap-2 mb-2">
                                        {productImages.map((url, idx) => (
                                            <div key={idx} className="relative group aspect-square border rounded overflow-hidden">
                                                <img src={url} alt={`Product ${idx}`} className="w-full h-full object-cover" />
                                                <button
                                                    type="button"
                                                    onClick={() => removeImage(idx)}
                                                    className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                                                >
                                                    <Trash2 className="h-3 w-3" />
                                                </button>
                                            </div>
                                        ))}
                                        <label className="border-2 border-dashed rounded aspect-square flex flex-col items-center justify-center cursor-pointer hover:bg-muted/50 transition-colors">
                                            {uploading ? <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" /> : <Plus className="h-6 w-6 text-muted-foreground" />}
                                            <span className="text-xs text-muted-foreground mt-1">Upload</span>
                                            <input
                                                type="file"
                                                accept="image/*"
                                                multiple
                                                onChange={handleImageUpload}
                                                className="hidden"
                                                disabled={uploading}
                                            />
                                        </label>
                                    </div>
                                </div>

                                {/* Key Features (Textarea) */}
                                <div className="space-y-2 pt-2">
                                    <Label>Key Features</Label>
                                    <div className="relative">
                                        <Textarea
                                            id="key_features"
                                            placeholder="Enter key features (one per line OR comma separated)&#10;e.g.&#10;Ergonomic Design&#10;Adjustable Height"
                                            value={keyFeaturesText}
                                            onChange={(e) => setKeyFeaturesText(e.target.value)}
                                            className="min-h-[120px]"
                                        />
                                    </div>
                                </div>

                                {/* Specifications */}
                                <div className="space-y-2 pt-2">
                                    <Label>Specifications</Label>
                                    <div className="space-y-2 max-h-[200px] overflow-y-auto pr-2">
                                        {specifications.map((spec, idx) => (
                                            <div key={idx} className="flex gap-2">
                                                <Input value={spec.key} onChange={(e) => updateSpec(idx, 'key', e.target.value)} placeholder="Label" className="h-8" />
                                                <Input value={spec.value} onChange={(e) => updateSpec(idx, 'value', e.target.value)} placeholder="Value" className="h-8" />
                                                <Button type="button" size="icon" variant="ghost" className="h-8 w-8 text-red-500" onClick={() => removeSpec(idx)}><Trash2 className="h-3 w-3" /></Button>
                                            </div>
                                        ))}
                                        <Button type="button" variant="outline" size="sm" onClick={addSpec} className="w-full">Add Specification</Button>
                                    </div>
                                </div>

                                {/* Warranty */}
                                <div className="space-y-2 pt-2 border-t">
                                    <Label>Warranty Coverage</Label>
                                    <Textarea
                                        value={warrantyCoverageText}
                                        onChange={(e) => setWarrantyCoverageText(e.target.value)}
                                        rows={4}
                                        placeholder="Coverage points, one per line..."
                                    />
                                </div>

                                <div className="space-y-2">
                                    <Label>Care Instructions</Label>
                                    <Textarea
                                        value={warrantyCareText}
                                        onChange={(e) => setWarrantyCareText(e.target.value)}
                                        rows={4}
                                        placeholder="Care instructions, one per line..."
                                    />
                                </div>

                                <div className="flex items-center space-x-2 pt-4">
                                    <Switch checked={isActive} onCheckedChange={setIsActive} />
                                    <Label>Active (Visible to public)</Label>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end gap-3 pt-4 border-t">
                            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                                {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                                Save Product
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminProducts;
