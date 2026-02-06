import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { legalService, LegalPage } from "@/services/legal";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
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
import { Plus, PenTool, Trash2, Loader2, FileText, CheckCircle, XCircle } from "lucide-react";
import { toast } from "sonner";
import { format } from "date-fns";

const AdminLegalPages = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingPage, setEditingPage] = useState<LegalPage | null>(null);

    // Fetch Pages
    const { data: pages, isLoading } = useQuery({
        queryKey: ['legal-pages'],
        queryFn: legalService.getAllPages
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: legalService.createPage,
        onSuccess: () => {
            toast.success("Page created");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['legal-pages'] });
        },
        onError: () => toast.error("Failed to create page")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            legalService.updatePage(id, updates),
        onSuccess: () => {
            toast.success("Page updated");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['legal-pages'] });
        },
        onError: () => toast.error("Failed to update page")
    });

    const deleteMutation = useMutation({
        mutationFn: legalService.deletePage,
        onSuccess: () => {
            toast.success("Page deleted");
            queryClient.invalidateQueries({ queryKey: ['legal-pages'] });
        },
        onError: () => toast.error("Failed to delete page")
    });

    const handleClose = () => {
        setIsOpen(false);
        setEditingPage(null);
    };

    const handleOpen = (page?: LegalPage) => {
        if (page) {
            setEditingPage(page);
        }
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const title = formData.get("title") as string;
        const slug = formData.get("slug") as string;
        const content = formData.get("content") as string;
        const is_published = formData.get("is_published") === "on";

        if (editingPage) {
            updateMutation.mutate({
                id: editingPage.id,
                updates: { title, slug, content, is_published }
            });
        } else {
            createMutation.mutate({ title, slug, content, is_published });
        }
    };

    const handleDelete = async (id: string) => {
        if (!confirm("Are you sure? This will delete the page.")) return;
        deleteMutation.mutate(id);
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Legal Pages</h1>
                    <p className="text-muted-foreground">Manage policy and legal documents.</p>
                </div>
                <Button onClick={() => handleOpen()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Page
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Title</TableHead>
                            <TableHead>Slug</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Last Updated</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {pages?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No legal pages found. Create one!
                                </TableCell>
                            </TableRow>
                        ) : (
                            pages?.map((page) => (
                                <TableRow key={page.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            <FileText className="h-4 w-4 text-muted-foreground" />
                                            {page.title}
                                        </div>
                                    </TableCell>
                                    <TableCell className="font-mono text-xs">{page.slug}</TableCell>
                                    <TableCell>
                                        {page.is_published ? (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                <CheckCircle className="w-3 h-3 mr-1" /> Published
                                            </span>
                                        ) : (
                                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                                                <XCircle className="w-3 h-3 mr-1" /> Draft
                                            </span>
                                        )}
                                    </TableCell>
                                    <TableCell className="text-muted-foreground text-sm">
                                        {format(new Date(page.created_at), 'MMM d, yyyy')}
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => handleOpen(page)}>
                                            <PenTool className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDelete(page.id)}>
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
                        <DialogTitle>{editingPage ? "Edit Page" : "Add Page"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="page-title">Title</Label>
                                <Input
                                    id="page-title"
                                    name="title"
                                    defaultValue={editingPage?.title}
                                    required
                                    placeholder="e.g. Privacy Policy"
                                    onChange={(e) => {
                                        if (!editingPage) {
                                            const slug = e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
                                            const slugInput = document.getElementById("page-slug") as HTMLInputElement;
                                            if (slugInput) slugInput.value = slug;
                                        }
                                    }}
                                />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="page-slug">Slug</Label>
                                <Input id="page-slug" name="slug" defaultValue={editingPage?.slug} required placeholder="e.g. privacy-policy" />
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="page-content">Content (Supports HTML)</Label>
                            <Textarea
                                id="page-content"
                                name="content"
                                defaultValue={editingPage?.content || ""}
                                className="min-h-[300px] font-mono text-sm"
                                placeholder="<h3>Policy Section</h3><p>Enter your policy content here...</p>"
                            />
                            <p className="text-xs text-muted-foreground">
                                You can use basic HTML tags for formatting (h1-h6, p, ul, ol, li, strong, em, br).
                            </p>
                        </div>

                        <div className="flex items-center space-x-2 border p-4 rounded-md">
                            <Switch
                                id="page-published"
                                name="is_published"
                                defaultChecked={editingPage ? editingPage.is_published : true}
                            />
                            <Label htmlFor="page-published">Published</Label>
                            <span className="text-xs text-muted-foreground ml-auto">
                                If unchecked, page will return 404 to public users.
                            </span>
                        </div>

                        <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                            {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                            Save Page
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminLegalPages;
