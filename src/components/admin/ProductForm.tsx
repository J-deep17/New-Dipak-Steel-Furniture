
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
import { CreateProductDTO, UpdateProductDTO, adminService } from "@/services/admin";
import { Loader2, Upload } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

interface ProductFormProps {
    product?: UpdateProductDTO | null;
    onSuccess: () => void;
    onCancel: () => void;
}

const ProductForm = ({ product, onSuccess, onCancel }: ProductFormProps) => {
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false); // New state for upload status
    const [categories, setCategories] = useState<{ id: string; name: string }[]>([]);

    const [formData, setFormData] = useState<CreateProductDTO>({
        title: "",
        description: "",
        price: 0,
        image_url: "",
        category_id: "",
        is_active: true,
    });

    useEffect(() => {
        const fetchCategories = async () => {
            const { data, error } = await adminService.getCategories();
            if (data) setCategories(data);
            if (error) toast.error("Failed to load categories");
        };
        fetchCategories();
    }, []);

    useEffect(() => {
        if (product) {
            setFormData({
                title: product.title || "",
                description: product.description || "",
                price: product.price || 0,
                image_url: product.image_url || "",
                category_id: product.category_id || "",
                is_active: product.is_active ?? true,
            });
        }
    }, [product]);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (!file) return;

        setUploading(true);
        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, image_url: publicUrl }));
            toast.success("Image uploaded successfully");
        } catch (error) {
            console.error('Error uploading image:', error);
            toast.error("Failed to upload image");
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (product?.id) {
                await adminService.updateProduct({ id: product.id, ...formData });
                toast.success("Product updated successfully");
            } else {
                await adminService.createProduct(formData);
                toast.success("Product created successfully");
            }
            onSuccess();
        } catch (error) {
            console.error(error);
            toast.error("Operation failed");
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            <div>
                <Label htmlFor="title">Title</Label>
                <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    required
                />
            </div>

            <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                    id="description"
                    value={formData.description}
                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
            </div>

            <div className="grid grid-cols-2 gap-4">
                <div>
                    <Label htmlFor="price">Price</Label>
                    <Input
                        id="price"
                        type="number"
                        step="0.01"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })}
                        required
                    />
                </div>

                <div>
                    <Label htmlFor="category">Category</Label>
                    <Select
                        value={formData.category_id}
                        onValueChange={(value) => setFormData({ ...formData, category_id: value })}
                    >
                        <SelectTrigger>
                            <SelectValue placeholder="Select Category" />
                        </SelectTrigger>
                        <SelectContent>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                </div>
            </div>

            <div>
                <Label htmlFor="image">Product Image</Label>
                <div className="flex items-center gap-4 mt-2">
                    {formData.image_url && (
                        <div className="relative h-20 w-20 rounded-md border overflow-hidden">
                            <img src={formData.image_url} alt="Preview" className="h-full w-full object-cover" />
                        </div>
                    )}
                    <div className="flex-1">
                        <Input
                            id="image"
                            type="file"
                            accept="image/*"
                            onChange={handleImageUpload}
                            disabled={uploading}
                        />
                        {uploading && <p className="text-xs text-muted-foreground mt-1">Uploading...</p>}
                    </div>
                </div>
                <div className="mt-2">
                    <Label htmlFor="image_url_manual" className="text-xs text-muted-foreground">Or enter URL manually</Label>
                    <Input
                        id="image_url_manual"
                        value={formData.image_url}
                        onChange={(e) => setFormData({ ...formData, image_url: e.target.value })}
                        placeholder="https://..."
                        className="mt-1"
                    />
                </div>
            </div>

            <div className="flex items-center gap-2">
                <Switch
                    checked={formData.is_active}
                    onCheckedChange={(checked) => setFormData({ ...formData, is_active: checked })}
                />
                <Label>Active Product</Label>
            </div>

            <div className="flex justify-end gap-2 pt-4">
                <Button type="button" variant="outline" onClick={onCancel}>
                    Cancel
                </Button>
                <Button type="submit" disabled={loading || uploading}>
                    {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                    {product ? "Update Product" : "Create Product"}
                </Button>
            </div>
        </form>
    );
};

export default ProductForm;
