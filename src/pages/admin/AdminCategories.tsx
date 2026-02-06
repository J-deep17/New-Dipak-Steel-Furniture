import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { productService, Category } from "@/services/products";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
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
import { Plus, PenTool, Trash2, Loader2, Save } from "lucide-react";
import { toast } from "sonner";

const CategoryRow = ({ category, onEdit, onDelete }: { category: Category, onEdit: (c: Category) => void, onDelete: (id: string) => void }) => {
    const [showOnHome, setShowOnHome] = useState(category.show_on_home || false);
    const [homeOrder, setHomeOrder] = useState<string>(category.home_order?.toString() || "");
    const [isDirty, setIsDirty] = useState(false);

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            productService.updateCategory(id, updates),
        onSuccess: () => {
            toast.success("Home settings updated");
            setIsDirty(false);
        },
        onError: () => toast.error("Failed to update home settings")
    });

    // Reset local state when category prop changes (e.g. after external update)
    useEffect(() => {
        setShowOnHome(category.show_on_home || false);
        setHomeOrder(category.home_order?.toString() || "");
        setIsDirty(false);
    }, [category]);

    const handleSave = () => {
        const order = homeOrder ? parseInt(homeOrder) : null;
        updateMutation.mutate({
            id: category.id,
            updates: {
                show_on_home: showOnHome,
                home_order: order
            }
        });
    };

    const handleToggle = (checked: boolean) => {
        setShowOnHome(checked);
        setIsDirty(true);
        if (!checked) {
            setHomeOrder(""); // Clear order if toggled off? User said: "Toggling OFF sets show_on_home = false and clears home_order"
        }
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setHomeOrder(e.target.value);
        setIsDirty(true);
    };

    return (
        <TableRow>
            <TableCell>
                <img
                    src={category.image_url || "/placeholder.svg"}
                    alt={category.name}
                    className="h-10 w-10 rounded-md object-cover border"
                />
            </TableCell>
            <TableCell className="font-medium">{category.name}</TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={showOnHome}
                        onCheckedChange={handleToggle}
                    />
                    <span className="text-xs text-muted-foreground">{showOnHome ? 'Shown' : 'Hidden'}</span>
                </div>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    value={homeOrder}
                    onChange={handleOrderChange}
                    className="w-20 h-8"
                    placeholder="#"
                    disabled={!showOnHome}
                />
            </TableCell>
            <TableCell className="text-right space-x-2">
                {isDirty && (
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        title="Save Home Settings"
                    >
                        {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => onEdit(category)}>
                    <PenTool className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(category.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
};

const AdminCategories = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<Category | null>(null);
    const [categoryImageUrl, setCategoryImageUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    // Fetch Categories
    const { data: categories, isLoading } = useQuery({
        queryKey: ['categories'],
        queryFn: productService.getCategories
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: productService.createCategory,
        onSuccess: () => {
            toast.success("Category created");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => toast.error("Failed to create category")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            productService.updateCategory(id, updates),
        onSuccess: () => {
            toast.success("Category updated");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => toast.error("Failed to update category")
    });

    const deleteMutation = useMutation({
        mutationFn: productService.deleteCategory,
        onSuccess: () => {
            toast.success("Category deleted");
            queryClient.invalidateQueries({ queryKey: ['categories'] });
        },
        onError: () => toast.error("Failed to delete category")
    });

    const handleClose = () => {
        setIsOpen(false);
        setEditingCategory(null);
        setCategoryImageUrl("");
    };

    const handleOpen = (category?: Category) => {
        if (category) {
            setEditingCategory(category);
            setCategoryImageUrl(category.image_url || "");
        } else {
            setCategoryImageUrl("");
        }
        setIsOpen(true);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                return;
            }
            const file = e.target.files[0];
            const publicUrl = await productService.uploadImage(file);
            setCategoryImageUrl(publicUrl);
            toast.success("Image uploaded!");
        } catch (error) {
            toast.error("Failed to upload image");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const name = formData.get("name") as string;
        const slug = formData.get("slug") as string;

        if (editingCategory) {
            updateMutation.mutate({
                id: editingCategory.id,
                updates: { name, slug, image_url: categoryImageUrl }
            });
        } else {
            createMutation.mutate({ name, slug, image_url: categoryImageUrl });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete the category.")) return;
        deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Categories</h1>
                <Button onClick={() => handleOpen()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Category
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Show on Home</TableHead>
                            <TableHead>Home Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {categories?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No categories found. Create one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            categories?.map((category) => (
                                <CategoryRow
                                    key={category.id}
                                    category={category}
                                    onEdit={handleOpen}
                                    onDelete={handleDelete}
                                />
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <Dialog open={isOpen} onOpenChange={handleClose}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="category-name">Name</Label>
                            <Input
                                id="category-name"
                                name="name"
                                defaultValue={editingCategory?.name}
                                required
                                onChange={(e) => {
                                    // Simple slug auto-gen if adding
                                    if (!editingCategory) {
                                        const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                        const slugInput = document.getElementById("category-slug") as HTMLInputElement;
                                        if (slugInput) slugInput.value = slug;
                                    }
                                }}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category-slug">Slug</Label>
                            <Input id="category-slug" name="slug" defaultValue={editingCategory?.slug} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="category-image">Category Image</Label>
                            <Input
                                id="category-image"
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                disabled={uploading}
                            />
                            {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
                            {categoryImageUrl && (
                                <div className="mt-2">
                                    <img src={categoryImageUrl} alt="Preview" className="h-40 w-full object-contain rounded-md border bg-secondary/50" />
                                </div>
                            )}
                        </div>
                        <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                            {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                            Save Category
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminCategories;
