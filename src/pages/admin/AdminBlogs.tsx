import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, PenTool, Trash2, Eye } from "lucide-react";
import { toast } from "sonner";
import { cmsService, Blog } from "@/services/cms";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Textarea } from "@/components/ui/textarea";

const AdminBlogs = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingBlog, setEditingBlog] = useState<Blog | null>(null);

    // Form State
    const [formData, setFormData] = useState({
        title: "",
        slug: "",
        content: "",
        meta_title: "",
        meta_description: "",
        featured_image: "",
        status: "draft" as 'draft' | 'published'
    });

    const [saving, setSaving] = useState(false);

    const fetchBlogs = async () => {
        setLoading(true);
        const { data, error } = await cmsService.getBlogs();
        if (error) {
            toast.error("Failed to load blogs");
        } else {
            setBlogs(data || []);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchBlogs();
    }, []);

    const resetForm = () => {
        setFormData({
            title: "",
            slug: "",
            content: "",
            meta_title: "",
            meta_description: "",
            featured_image: "",
            status: "draft"
        });
        setEditingBlog(null);
    };

    const handleOpen = (blog?: Blog) => {
        if (blog) {
            setEditingBlog(blog);
            setFormData({
                title: blog.title,
                slug: blog.slug,
                content: blog.content || "",
                meta_title: blog.meta_title || "",
                meta_description: blog.meta_description || "",
                featured_image: blog.featured_image || "",
                status: blog.status
            });
        } else {
            resetForm();
        }
        setIsOpen(true);
    };

    const handleClose = () => {
        setIsOpen(false);
        resetForm();
    };

    const generateSlug = (title: string) => {
        return title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
    };

    const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const title = e.target.value;
        if (!editingBlog && !formData.slug) {
            setFormData(prev => ({ ...prev, title, slug: generateSlug(title) }));
        } else {
            setFormData(prev => ({ ...prev, title }));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingBlog) {
                await cmsService.updateBlog(editingBlog.id, formData);
                toast.success("Blog updated");
            } else {
                await cmsService.createBlog(formData);
                toast.success("Blog created");
            }
            handleClose();
            fetchBlogs();
        } catch (error: any) {
            toast.error("Failed to save blog: " + error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure?")) return;
        try {
            await cmsService.deleteBlog(id);
            toast.success("Blog deleted");
            fetchBlogs();
        } catch (error) {
            toast.error("Failed to delete blog");
        }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Blogs</h1>
                <Button onClick={() => handleOpen()}><Plus className="mr-2 h-4 w-4" /> Add Blog</Button>
            </div>

            {loading ? <Loader2 className="animate-spin" /> : (
                <div className="bg-white rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Title</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {blogs.map((blog) => (
                                <TableRow key={blog.id}>
                                    <TableCell className="font-medium">{blog.title}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${blog.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {blog.status}
                                        </span>
                                    </TableCell>
                                    <TableCell>{new Date(blog.created_at).toLocaleDateString()}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(blog)}>
                                            <PenTool className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(blog.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingBlog ? "Edit Blog" : "New Blog"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Title</Label>
                                <Input value={formData.title} onChange={handleTitleChange} required />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Content</Label>
                            <RichTextEditor value={formData.content} onChange={val => setFormData({ ...formData, content: val })} />
                        </div>

                        <div className="space-y-4 border p-4 rounded bg-gray-50">
                            <h4 className="font-medium text-sm text-gray-500">SEO Settings</h4>
                            <div className="space-y-2">
                                <Label>Meta Title</Label>
                                <Input value={formData.meta_title} onChange={e => setFormData({ ...formData, meta_title: e.target.value })} placeholder="Browser Tab Title" />
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Description</Label>
                                <Textarea value={formData.meta_description} onChange={e => setFormData({ ...formData, meta_description: e.target.value })} placeholder="Search engine description" />
                            </div>
                            <div className="space-y-2">
                                <Label>Featured Image URL</Label>
                                <Input value={formData.featured_image} onChange={e => setFormData({ ...formData, featured_image: e.target.value })} placeholder="https://..." />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch checked={formData.status === 'published'} onCheckedChange={checked => setFormData({ ...formData, status: checked ? 'published' : 'draft' })} />
                            <Label>Published</Label>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="ghost" onClick={handleClose}>Cancel</Button>
                            <Button type="submit" disabled={saving}>
                                {saving && <Loader2 className="animate-spin mr-2" />}
                                Save Blog
                            </Button>
                        </div>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminBlogs;
