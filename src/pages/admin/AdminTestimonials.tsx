
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { testimonialsService, Testimonial, CreateTestimonialDTO } from "@/services/testimonials";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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
import { Loader2, Plus, PenTool, Trash2, Image as ImageIcon } from "lucide-react";
import { toast } from "sonner";
import { supabase } from "@/integrations/supabase/client";

const AdminTestimonials = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingId, setEditingId] = useState<string | null>(null);
    const [uploading, setUploading] = useState(false);

    // Form State
    const [formData, setFormData] = useState<CreateTestimonialDTO>({
        name: "",
        designation: "",
        company: "",
        city: "",
        review_text: "",
        rating: 5,
        photo_url: "",
        show_on_home: true,
        display_order: 0,
        active: true,
    });

    // Fetch Testimonials
    const { data: testimonials, isLoading } = useQuery({
        queryKey: ['admin-testimonials'],
        queryFn: testimonialsService.getAllTestimonials
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: testimonialsService.createTestimonial,
        onSuccess: () => {
            toast.success("Testimonial added");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials-public'] });
        },
        onError: () => toast.error("Failed to add testimonial")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            testimonialsService.updateTestimonial(id, updates),
        onSuccess: () => {
            toast.success("Testimonial updated");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials-public'] });
        },
        onError: () => toast.error("Failed to update testimonial")
    });

    const deleteMutation = useMutation({
        mutationFn: testimonialsService.deleteTestimonial,
        onSuccess: () => {
            toast.success("Testimonial deleted");
            queryClient.invalidateQueries({ queryKey: ['admin-testimonials'] });
            queryClient.invalidateQueries({ queryKey: ['testimonials-public'] });
        },
        onError: () => toast.error("Failed to delete testimonial")
    });

    const handleClose = () => {
        setIsOpen(false);
        setEditingId(null);
        setFormData({
            name: "",
            designation: "",
            company: "",
            city: "",
            review_text: "",
            rating: 5,
            photo_url: "",
            show_on_home: true,
            display_order: (testimonials?.length || 0) + 1,
            active: true,
        });
    };

    const handleOpen = (testimonial?: Testimonial) => {
        if (testimonial) {
            setEditingId(testimonial.id);
            setFormData({
                name: testimonial.name,
                designation: testimonial.designation || "",
                company: testimonial.company || "",
                city: testimonial.city || "",
                review_text: testimonial.review_text,
                rating: testimonial.rating,
                photo_url: testimonial.photo_url || "",
                show_on_home: testimonial.show_on_home,
                display_order: testimonial.display_order,
                active: testimonial.active,
            });
        } else {
            setEditingId(null);
            setFormData(prev => ({ ...prev, display_order: (testimonials?.length || 0) + 1 }));
        }
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (editingId) {
            updateMutation.mutate({ id: editingId, updates: formData });
        } else {
            createMutation.mutate(formData);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure you want to delete this testimonial?")) return;
        deleteMutation.mutate(id);
    };

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) return;

            const file = e.target.files[0];
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `testimonials/${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('product-images') // Reusing existing bucket or create new 'testimonials' bucket if preferred? Plan didn't specify bucket. Assuming reuse or need to handle.
                // NOTE: Using 'product-images' for now as it's likely public. 
                // Checks should be made if 'testimonials' bucket exists.
                // For safety, let's assume 'product-images' is the general public bucket or use 'public' if available. 
                // Given previous context, 'product-images' was used. I'll stick to it or clearer: 'public'
                .upload(filePath, file);

            if (uploadError) throw uploadError;

            const { data: { publicUrl } } = supabase.storage
                .from('product-images')
                .getPublicUrl(filePath);

            setFormData(prev => ({ ...prev, photo_url: publicUrl }));
            toast.success("Image uploaded");
        } catch (error) {
            console.error(error);
            toast.error("Upload failed");
        } finally {
            setUploading(false);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Testimonials</h1>
                    <p className="text-muted-foreground">Manage customer reviews and feedback.</p>
                </div>
                <Button onClick={() => handleOpen()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                </Button>
            </div>

            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Photo</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Role / Company</TableHead>
                            <TableHead>Rating</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {testimonials?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={7} className="text-center h-24 text-muted-foreground">
                                    No testimonials found.
                                </TableCell>
                            </TableRow>
                        ) : (
                            testimonials?.map((t) => (
                                <TableRow key={t.id}>
                                    <TableCell>
                                        {t.photo_url ? (
                                            <img src={t.photo_url} alt={t.name} className="h-10 w-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center text-xs font-bold">
                                                {t.name.substring(0, 2).toUpperCase()}
                                            </div>
                                        )}
                                    </TableCell>
                                    <TableCell>{t.display_order}</TableCell>
                                    <TableCell>
                                        <div className="font-medium">{t.name}</div>
                                        <div className="text-xs text-muted-foreground">{t.city}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="text-sm">{t.designation}</div>
                                        <div className="text-xs text-muted-foreground">{t.company}</div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex text-yellow-500">
                                            {[...Array(t.rating)].map((_, i) => <span key={i}>★</span>)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex flex-col gap-1">
                                            <span className={`text-xs px-2 py-0.5 rounded-full w-fit ${t.active ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                                {t.active ? 'Active' : 'Inactive'}
                                            </span>
                                            {t.show_on_home && <span className="text-[10px] text-blue-600">On Home</span>}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(t)}>
                                            <PenTool className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(t.id)}>
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
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingId ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Name *</Label>
                                <Input
                                    required
                                    value={formData.name}
                                    onChange={e => setFormData({ ...formData, name: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>City</Label>
                                <Input
                                    value={formData.city || ""}
                                    onChange={e => setFormData({ ...formData, city: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Designation</Label>
                                <Input
                                    value={formData.designation || ""}
                                    onChange={e => setFormData({ ...formData, designation: e.target.value })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Company</Label>
                                <Input
                                    value={formData.company || ""}
                                    onChange={e => setFormData({ ...formData, company: e.target.value })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Review Text *</Label>
                            <Textarea
                                required
                                rows={4}
                                value={formData.review_text}
                                onChange={e => setFormData({ ...formData, review_text: e.target.value })}
                            />
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Rating (1-5)</Label>
                                <Input
                                    type="number"
                                    min="1"
                                    max="5"
                                    value={formData.rating}
                                    onChange={e => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label>Display Order</Label>
                                <Input
                                    type="number"
                                    value={formData.display_order}
                                    onChange={e => setFormData({ ...formData, display_order: parseInt(e.target.value) })}
                                />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Photo</Label>
                            <div className="flex items-center gap-4">
                                {formData.photo_url && (
                                    <img src={formData.photo_url} alt="Preview" className="h-12 w-12 rounded-full object-cover border" />
                                )}
                                <Input
                                    type="file"
                                    accept="image/*"
                                    onChange={handleImageUpload}
                                    disabled={uploading}
                                />
                            </div>
                        </div>

                        <div className="flex gap-6 pt-2">
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.active}
                                    onCheckedChange={c => setFormData({ ...formData, active: c })}
                                />
                                <Label>Active</Label>
                            </div>
                            <div className="flex items-center space-x-2">
                                <Switch
                                    checked={formData.show_on_home}
                                    onCheckedChange={c => setFormData({ ...formData, show_on_home: c })}
                                />
                                <Label>Show on Home</Label>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2 pt-4">
                            <Button type="button" variant="outline" onClick={handleClose}>Cancel</Button>
                            <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending || uploading}>
                                {(createMutation.isPending || updateMutation.isPending) && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                                Save Testimonial
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminTestimonials;
