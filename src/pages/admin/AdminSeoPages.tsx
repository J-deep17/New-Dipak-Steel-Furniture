import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Switch } from "@/components/ui/switch";
import { Loader2, Plus, PenTool, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { cmsService, SeoPage } from "@/services/cms";
import RichTextEditor from "@/components/admin/RichTextEditor";
import { Textarea } from "@/components/ui/textarea";

const AdminSeoPages = () => {
    const [pages, setPages] = useState<SeoPage[]>([]);
    const [loading, setLoading] = useState(true);
    const [isOpen, setIsOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<SeoPage | null>(null);

    const [formData, setFormData] = useState({
        page_type: "custom",
        slug: "",
        heading: "",
        content: "",
        meta_title: "",
        meta_description: "",
        status: "draft" as 'draft' | 'published'
    });
    const [saving, setSaving] = useState(false);

    const fetchPages = async () => {
        setLoading(true);
        const { data, error } = await cmsService.getSeoPages();
        if (error) toast.error("Failed to load pages");
        else setPages(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchPages(); }, []);

    const handleOpen = (page?: SeoPage) => {
        if (page) {
            setEditingPage(page);
            setFormData({
                page_type: page.page_type,
                slug: page.slug,
                heading: page.heading || "",
                content: page.content || "",
                meta_title: page.meta_title || "",
                meta_description: page.meta_description || "",
                status: page.status
            });
        } else {
            setEditingPage(null);
            setFormData({
                page_type: "custom",
                slug: "",
                heading: "",
                content: "",
                meta_title: "",
                meta_description: "",
                status: "draft"
            });
        }
        setIsOpen(true);
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            if (editingPage) {
                await cmsService.updateSeoPage(editingPage.id, formData);
                toast.success("Page updated");
            } else {
                await cmsService.createSeoPage(formData);
                toast.success("Page created");
            }
            setIsOpen(false);
            fetchPages();
        } catch (error: any) {
            toast.error("Failed to save page");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Delete this page?")) return;
        try {
            await cmsService.deleteSeoPage(id);
            toast.success("Page deleted");
            fetchPages();
        } catch (error) { toast.error("Failed to delete"); }
    };

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">SEO Landing Pages</h1>
                <Button onClick={() => handleOpen()}><Plus className="mr-2 h-4 w-4" /> Add Page</Button>
            </div>

            {loading ? <Loader2 className="animate-spin" /> : (
                <div className="bg-white rounded-lg border">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Heading</TableHead>
                                <TableHead>Slug</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {pages.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">{page.heading}</TableCell>
                                    <TableCell>/{page.slug}</TableCell>
                                    <TableCell>
                                        <span className={`px-2 py-1 rounded text-xs ${page.status === 'published' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                                            {page.status}
                                        </span>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(page)}><PenTool className="h-4 w-4" /></Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(page.id)}><Trash2 className="h-4 w-4" /></Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            )}

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader><DialogTitle>{editingPage ? "Edit" : "Add"} SEO Page</DialogTitle></DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Page Type</Label>
                                <Input value={formData.page_type} onChange={e => setFormData({ ...formData, page_type: e.target.value })} placeholder="city_page" />
                            </div>
                            <div className="space-y-2">
                                <Label>Slug</Label>
                                <Input value={formData.slug} onChange={e => setFormData({ ...formData, slug: e.target.value })} required placeholder="office-furniture-ahmedabad" />
                            </div>
                        </div>
                        <div className="space-y-2">
                            <Label>Heading</Label>
                            <Input value={formData.heading} onChange={e => setFormData({ ...formData, heading: e.target.value })} required />
                        </div>
                        <div className="space-y-2">
                            <Label>Content (SEO Text)</Label>
                            <RichTextEditor value={formData.content} onChange={val => setFormData({ ...formData, content: val })} />
                        </div>

                        <div className="space-y-4 border p-4 rounded bg-gray-50">
                            <h4 className="font-medium text-sm text-gray-500">Metadata</h4>
                            <div className="space-y-2">
                                <Label>Meta Title</Label>
                                <Input value={formData.meta_title} onChange={e => setFormData({ ...formData, meta_title: e.target.value })} />
                            </div>
                            <div className="space-y-2">
                                <Label>Meta Description</Label>
                                <Textarea value={formData.meta_description} onChange={e => setFormData({ ...formData, meta_description: e.target.value })} />
                            </div>
                        </div>

                        <div className="flex items-center gap-2">
                            <Switch checked={formData.status === 'published'} onCheckedChange={checked => setFormData({ ...formData, status: checked ? 'published' : 'draft' })} />
                            <Label>Published</Label>
                        </div>
                        <Button type="submit" disabled={saving} className="w-full">
                            {saving && <Loader2 className="animate-spin mr-2" />} Save Page
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminSeoPages;
