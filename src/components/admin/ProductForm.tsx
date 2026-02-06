
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
// import { adminService } from "@/services/admin"; // Unused, switching to direct service
import { Loader2, Upload, Plus, Trash2, X, ChevronDown, ChevronUp } from "lucide-react";
import { toast } from "sonner";
import { adminService } from "@/services/admin";
import { productService, ProductVariant, ProductVariantImage, Product } from "@/services/products";

interface ProductFormProps {
    product?: Product | null;
    onSuccess: () => void;
    onCancel: () => void;
}

// Extended variant type for form state
interface FormVariant {
    id?: string;
    // New fields
    color_name: string;
    color_hex: string;
    price: number | null; // Override
    mrp: number | null; // Override
    sku: string;
    stock: number;
    is_active: boolean;
    // Images
    images: ProductVariantImage[]; // Existing
    temp_images: string[]; // URLs of new images
}

const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
    const [loading, setLoading] = useState(false);
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    // Section 1: Basic Info
    const [basicInfo, setBasicInfo] = useState({
        title: "",
        slug: "",
        description: "",
        short_description: "",
        key_features: "", // One per line
        base_price: 0,
        base_mrp: null as number | null,
        category_id: "",
        is_active: true,
        // Marketing fields
        discount_percentage: null as number | null,
        is_new_arrival: false,
        is_hot_selling: false,
        is_on_sale: false,
        is_featured: false,
        sale_price: null as number | null,
    });

    // Section 2: Variants
    const [variants, setVariants] = useState<FormVariant[]>([]);

    // Section 3: Specifications
    const [specs, setSpecs] = useState({
        dimensions: "",
        warranty_coverage: "",
        warranty_care: "",
    });

    // Section 4 is Active Toggle (included in Basic Info mostly, or separate)

    // Upload state
    const [uploadingVariantIndex, setUploadingVariantIndex] = useState<number | null>(null);

    useEffect(() => {
        const fetchCategories = async () => {
            const { data } = await adminService.getCategories();
            if (data) setCategories(data);
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setBasicInfo({
                title: product.title || "",
                slug: product.slug || "",
                description: product.description || "",
                short_description: product.short_description || "",
                key_features: product.key_features?.join('\n') || "",
                base_price: product.base_price || product.price || 0,
                base_mrp: product.base_mrp || product.mrp || null,
                category_id: product.category_id || "",
                is_active: product.is_active ?? true,
                // Marketing fields
                discount_percentage: product.discount_percentage || null,
                is_new_arrival: product.is_new_arrival ?? false,
                is_hot_selling: product.is_hot_selling ?? false,
                is_on_sale: product.is_on_sale ?? false,
                is_featured: product.is_featured ?? false,
                sale_price: product.sale_price || null,
            });

            if (product.variants) {
                setVariants(product.variants.map(v => ({
                    id: v.id,
                    color_name: v.color_name,
                    color_hex: v.color_hex || "#000000",
                    price: v.price,
                    mrp: v.mrp,
                    sku: v.sku || "",
                    stock: v.stock,
                    is_active: v.is_active,
                    images: v.images || [],
                    temp_images: []
                })));
            }

            setSpecs({
                dimensions: product.dimensions || "",
                warranty_coverage: (product.warranty_coverage || []).join("\n"),
                warranty_care: (product.warranty_care || []).join("\n"),
            });
        }
    }, [product]);

    // Helpers
    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        setBasicInfo(prev => ({
            ...prev,
            title,
            slug: !product ? generateSlug(title) : prev.slug // Only auto-gen if new product
        }));
    };

    // Variant Handlers
    const addVariant = () => {
        setVariants([...variants, {
            color_name: "",
            color_hex: "#000000",
            price: null,
            mrp: null,
            sku: "",
            stock: 0,
            is_active: true,
            images: [],
            temp_images: []
        }]);
    };

    const removeVariant = async (index: number) => {
        const variant = variants[index];
        if (variant.id) {
            if (!confirm("Delete this variant? This action cannot be undone.")) return;
            try {
                await productService.deleteVariant(variant.id);
                toast.success("Variant deleted");
            } catch (e) {
                toast.error("Failed to delete variant");
                return;
            }
        }
        const newVariants = [...variants];
        newVariants.splice(index, 1);
        setVariants(newVariants);
    };

    const updateVariant = (index: number, updates: Partial<FormVariant>) => {
        const newVariants = [...variants];
        newVariants[index] = { ...newVariants[index], ...updates };
        setVariants(newVariants);
    };

    const handleVariantImageUpload = async (index: number, e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploadingVariantIndex(index);
        try {
            const url = await productService.uploadImage(file);
            const variant = variants[index];
            updateVariant(index, { temp_images: [...variant.temp_images, url] });
            toast.success("Image uploaded (Save product to persist)");
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploadingVariantIndex(null);
        }
    };

    const removeVariantImage = async (variantIndex: number, imageIndex: number, isTemp: boolean) => {
        const variant = variants[variantIndex];
        if (isTemp) {
            const newTemp = [...variant.temp_images];
            newTemp.splice(imageIndex, 1);
            updateVariant(variantIndex, { temp_images: newTemp });
        } else {
            const imageToRemove = variant.images[imageIndex];
            if (imageToRemove?.id) {
                try {
                    await productService.deleteVariantImage(imageToRemove.id);
                    const newImages = [...variant.images];
                    newImages.splice(imageIndex, 1);
                    updateVariant(variantIndex, { images: newImages });
                    toast.success("Image deleted");
                } catch (e) {
                    toast.error("Failed to delete image");
                }
            }
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let productId = product?.id;

            const productData = {
                title: basicInfo.title,
                slug: basicInfo.slug,
                description: basicInfo.description,
                short_description: basicInfo.short_description,
                key_features: basicInfo.key_features.split('\n').filter(Boolean),
                base_price: basicInfo.base_price,
                price: basicInfo.base_price,
                base_mrp: basicInfo.base_mrp,
                mrp: basicInfo.base_mrp,
                category_id: basicInfo.category_id || null,
                is_active: basicInfo.is_active,
                dimensions: specs.dimensions,
                warranty_coverage: specs.warranty_coverage.split('\n').filter(Boolean),
                warranty_care: specs.warranty_care.split('\n').filter(Boolean),
                image_url: variants[0]?.images?.[0]?.image_url || variants[0]?.temp_images?.[0] || null,
                // Marketing fields
                discount_percentage: basicInfo.discount_percentage,
                is_new_arrival: basicInfo.is_new_arrival,
                is_hot_selling: basicInfo.is_hot_selling,
                is_on_sale: basicInfo.is_on_sale,
                is_featured: basicInfo.is_featured,
                sale_price: basicInfo.sale_price,
            };

            console.log('[ProductForm] Saving product data:', productData);

            if (productId) {
                await productService.updateProduct(productId, productData);
            } else {
                const newProduct = await productService.createProduct(productData);
                if (!newProduct) throw new Error("Failed to create product");
                productId = newProduct.id;
            }

            // Save Variants
            for (const v of variants) {
                let variantId = v.id;
                const variantData = {
                    product_id: productId!,
                    color_name: v.color_name || "New Variant",
                    color_hex: v.color_hex,
                    price: v.price,
                    mrp: v.mrp,
                    sku: v.sku,
                    stock: v.stock,
                    is_active: v.is_active
                };

                if (variantId) {
                    await productService.updateVariant(variantId, variantData);
                } else {
                    const newVariant = await productService.createVariant(variantData);
                    if (!newVariant) throw new Error("Failed to create variant");
                    variantId = (newVariant as any).id;
                }

                // Save New Images
                if (v.temp_images.length > 0) {
                    // Determine starting sort order
                    const currentMaxOrder = v.images.length > 0 ? Math.max(...v.images.map(i => i.sort_order || i.display_order)) : -1;

                    for (let i = 0; i < v.temp_images.length; i++) {
                        await productService.saveVariantImage({
                            variant_id: variantId!,
                            image_url: v.temp_images[i],
                            sort_order: currentMaxOrder + 1 + i,
                            display_order: currentMaxOrder + 1 + i
                        });
                    }
                }
            }

            toast.success("Product saved successfully");
            onSuccess();
        } catch (error: any) {
            console.error('[ProductForm] Save error:', error);
            const errorMsg = error?.message || error?.error_description || JSON.stringify(error);
            toast.error(`Failed to save product: ${errorMsg}`);
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-8 max-h-[80vh] overflow-y-auto p-1">
            {/* Section 1: Basic Info */}
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                <h3 className="text-lg font-medium">Basic Information</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Title</Label>
                        <Input value={basicInfo.title} onChange={handleTitleChange} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Slug</Label>
                        <Input value={basicInfo.slug} onChange={e => setBasicInfo({ ...basicInfo, slug: e.target.value })} required />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Category</Label>
                        <Select value={basicInfo.category_id} onValueChange={v => setBasicInfo({ ...basicInfo, category_id: v })}>
                            <SelectTrigger><SelectValue placeholder="Select Category" /></SelectTrigger>
                            <SelectContent>
                                {categories.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="space-y-2">
                    <Label>Short Description</Label>
                    <Input value={basicInfo.short_description} onChange={e => setBasicInfo({ ...basicInfo, short_description: e.target.value })} />
                </div>

                <div className="space-y-2">
                    <Label>Full Description</Label>
                    <Textarea value={basicInfo.description} onChange={e => setBasicInfo({ ...basicInfo, description: e.target.value })} rows={4} />
                </div>

                <div className="space-y-2">
                    <Label>Key Features (One per line)</Label>
                    <Textarea
                        value={basicInfo.key_features}
                        onChange={e => setBasicInfo({ ...basicInfo, key_features: e.target.value })}
                        rows={4}
                        placeholder="Ergonomic design\nAdjustable height\nBreathable mesh back"
                    />
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Base Price (Default)</Label>
                        <Input type="number" value={basicInfo.base_price} onChange={e => setBasicInfo({ ...basicInfo, base_price: parseFloat(e.target.value) })} required />
                    </div>
                    <div className="space-y-2">
                        <Label>Base MRP (Default)</Label>
                        <Input type="number" value={basicInfo.base_mrp || ''} onChange={e => setBasicInfo({ ...basicInfo, base_mrp: e.target.value ? parseFloat(e.target.value) : null })} />
                    </div>
                </div>
            </div>

            {/* Marketing Section */}
            <div className="space-y-4 border p-4 rounded-lg bg-orange-50/50">
                <h3 className="text-lg font-medium text-orange-900">Marketing & Promotions</h3>

                <div className="grid grid-cols-4 gap-4">
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={basicInfo.is_new_arrival}
                            onCheckedChange={(checked) => setBasicInfo({ ...basicInfo, is_new_arrival: checked })}
                        />
                        <Label className="cursor-pointer">New Arrival</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={basicInfo.is_hot_selling}
                            onCheckedChange={(checked) => setBasicInfo({ ...basicInfo, is_hot_selling: checked })}
                        />
                        <Label className="cursor-pointer">Hot Selling</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={basicInfo.is_on_sale}
                            onCheckedChange={(checked) => setBasicInfo({ ...basicInfo, is_on_sale: checked })}
                        />
                        <Label className="cursor-pointer">On Sale</Label>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Switch
                            checked={basicInfo.is_featured}
                            onCheckedChange={(checked) => setBasicInfo({ ...basicInfo, is_featured: checked })}
                        />
                        <Label className="cursor-pointer">Featured</Label>
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Discount Percentage (%)</Label>
                        <Input
                            type="number"
                            min="0"
                            max="100"
                            placeholder="e.g. 20"
                            value={basicInfo.discount_percentage || ''}
                            onChange={e => setBasicInfo({ ...basicInfo, discount_percentage: e.target.value ? parseFloat(e.target.value) : null })}
                        />
                        <p className="text-xs text-muted-foreground">Set discount percentage to show "XX% OFF" badge</p>
                    </div>
                    <div className="space-y-2">
                        <Label>Sale Price (₹) - Optional Override</Label>
                        <Input
                            type="number"
                            placeholder="Leave empty to auto-calculate"
                            value={basicInfo.sale_price || ''}
                            onChange={e => setBasicInfo({ ...basicInfo, sale_price: e.target.value ? parseFloat(e.target.value) : null })}
                        />
                        <p className="text-xs text-muted-foreground">Override calculated sale price if needed</p>
                    </div>
                </div>
            </div>

            {/* Section 2: Variants */}
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                <div className="flex justify-between items-center">
                    <h3 className="text-lg font-medium">Product Variants</h3>
                    <Button type="button" onClick={addVariant} variant="outline" size="sm"><Plus className="w-4 h-4 mr-2" /> Add Color Variant</Button>
                </div>

                {variants.length === 0 && <p className="text-sm text-gray-500 italic">No variants added. Please add at least one variant.</p>}

                {variants.map((variant, idx) => (
                    <div key={idx} className="border p-4 rounded bg-white relative">
                        <Button type="button" variant="ghost" size="sm" className="absolute top-2 right-2 text-red-500" onClick={() => removeVariant(idx)}><Trash2 className="w-4 h-4" /></Button>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                            <div>
                                <Label>Color Name</Label>
                                <Input value={variant.color_name} onChange={e => updateVariant(idx, { color_name: e.target.value })} placeholder="e.g. Red" />
                            </div>
                            <div>
                                <Label>Color Hex</Label>
                                <div className="flex gap-2">
                                    <Input value={variant.color_hex} onChange={e => updateVariant(idx, { color_hex: e.target.value })} />
                                    <Input type="color" value={variant.color_hex} onChange={e => updateVariant(idx, { color_hex: e.target.value })} className="w-12 p-1" />
                                </div>
                            </div>

                            <div>
                                <Label>Stock</Label>
                                <Input type="number" value={variant.stock} onChange={e => updateVariant(idx, { stock: parseInt(e.target.value) || 0 })} />
                            </div>
                            <div>
                                <Label>SKU</Label>
                                <Input value={variant.sku} onChange={e => updateVariant(idx, { sku: e.target.value })} />
                            </div>

                            <div>
                                <Label>Price Override (Optional)</Label>
                                <Input type="number" value={variant.price ?? ''} onChange={e => updateVariant(idx, { price: e.target.value ? parseFloat(e.target.value) : null })} placeholder={`Default: ${basicInfo.base_price}`} />
                            </div>
                            <div>
                                <Label>MRP Override (Optional)</Label>
                                <Input type="number" value={variant.mrp ?? ''} onChange={e => updateVariant(idx, { mrp: e.target.value ? parseFloat(e.target.value) : null })} placeholder="Default MRP" />
                            </div>
                        </div>

                        {/* Variant Images */}
                        <div>
                            <Label>Variant Images</Label>
                            <div className="flex flex-wrap gap-2 mt-2">
                                {variant.images.map((img, i) => (
                                    <div key={img.id} className="relative w-20 h-20 group">
                                        <img src={img.image_url} className="w-full h-full object-cover rounded border" />
                                        <button type="button" onClick={() => removeVariantImage(idx, i, false)} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                                {variant.temp_images.map((url, i) => (
                                    <div key={i} className="relative w-20 h-20 group opacity-70">
                                        <img src={url} className="w-full h-full object-cover rounded border" />
                                        <button type="button" onClick={() => removeVariantImage(idx, i, true)} className="absolute top-0 right-0 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100"><X className="w-3 h-3" /></button>
                                    </div>
                                ))}
                                <label className="w-20 h-20 border-dahed border-2 rounded flex items-center justify-center cursor-pointer hover:bg-gray-50">
                                    {uploadingVariantIndex === idx ? <Loader2 className="animate-spin" /> : <Plus />}
                                    <input type="file" accept="image/*" className="hidden" onChange={(e) => handleVariantImageUpload(idx, e)} disabled={uploadingVariantIndex !== null} />
                                </label>
                            </div>
                        </div>

                        <div className="mt-4 flex items-center gap-2">
                            <Switch checked={variant.is_active} onCheckedChange={checked => updateVariant(idx, { is_active: checked })} />
                            <Label>Variant Active</Label>
                        </div>
                    </div>
                ))}
            </div>

            {/* Section 3: Specifications */}
            <div className="space-y-4 border p-4 rounded-lg bg-gray-50/50">
                <h3 className="text-lg font-medium">Specifications</h3>
                <div className="space-y-2">
                    <Label>Dimensions</Label>
                    <Input value={specs.dimensions} onChange={e => setSpecs({ ...specs, dimensions: e.target.value })} placeholder="e.g. 100x50x20 cm" />
                </div>
                <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                        <Label>Warranty Coverage (One per line)</Label>
                        <Textarea value={specs.warranty_coverage} onChange={e => setSpecs({ ...specs, warranty_coverage: e.target.value })} rows={3} />
                    </div>
                    <div className="space-y-2">
                        <Label>Care Instructions (One per line)</Label>
                        <Textarea value={specs.warranty_care} onChange={e => setSpecs({ ...specs, warranty_care: e.target.value })} rows={3} />
                    </div>
                </div>
            </div>

            {/* Section 4: Actions */}
            <div className="flex justify-between items-center border-t pt-4">
                <div className="flex items-center gap-2">
                    <Switch checked={basicInfo.is_active} onCheckedChange={checked => setBasicInfo({ ...basicInfo, is_active: checked })} />
                    <Label>Product Active</Label>
                </div>
                <div className="flex gap-2">
                    <Button type="button" variant="ghost" onClick={onCancel}>Cancel</Button>
                    <Button type="submit" disabled={loading}>
                        {loading && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
                        Save Product
                    </Button>
                </div>
            </div>
        </form>
    );
};

export default ProductForm;
