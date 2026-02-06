import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { footerService, FooterSocialLink, FooterSocialLinkInsert } from "@/services/footer";
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { Plus, PenTool, Trash2, Loader2, Save, Facebook, Instagram, Linkedin, Twitter, Youtube, MessageCircle, Pin } from "lucide-react";
import { toast } from "sonner";

// Icon mapping for display
const ICON_MAP: Record<string, any> = {
    facebook: Facebook,
    instagram: Instagram,
    linkedin: Linkedin,
    twitter: Twitter,
    youtube: Youtube,
    whatsapp: MessageCircle,
    pinterest: Pin, // Closest match if brand icon missing
};

export const PLATFORMS = [
    { value: "facebook", label: "Facebook", icon: Facebook },
    { value: "instagram", label: "Instagram", icon: Instagram },
    { value: "whatsapp", label: "WhatsApp", icon: MessageCircle },
    { value: "linkedin", label: "LinkedIn", icon: Linkedin },
    { value: "youtube", label: "YouTube", icon: Youtube },
    { value: "twitter", label: "Twitter / X", icon: Twitter },
    { value: "pinterest", label: "Pinterest", icon: Pin },
];

const SocialLinkRow = ({ link, onEdit, onDelete }: { link: FooterSocialLink, onEdit: (l: FooterSocialLink) => void, onDelete: (id: string) => void }) => {
    const [isActive, setIsActive] = useState(link.is_active);
    const [displayOrder, setDisplayOrder] = useState(link.display_order.toString());
    const [isDirty, setIsDirty] = useState(false);

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            footerService.updateFooterLink(id, updates),
        onSuccess: () => {
            toast.success("Link updated");
            setIsDirty(false);
        },
        onError: () => toast.error("Failed to update link")
    });

    const handleSave = () => {
        updateMutation.mutate({
            id: link.id,
            updates: {
                is_active: isActive,
                display_order: parseInt(displayOrder) || 0
            }
        });
    };

    const handleToggle = (checked: boolean) => {
        setIsActive(checked);
        setIsDirty(true);
    };

    const handleOrderChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setDisplayOrder(e.target.value);
        setIsDirty(true);
    };

    const Icon = ICON_MAP[link.icon] || MessageCircle;

    return (
        <TableRow>
            <TableCell>
                <div className="flex items-center gap-2">
                    <Icon className="h-5 w-5 text-gray-500" />
                    <span className="capitalize">{link.platform}</span>
                </div>
            </TableCell>
            <TableCell className="max-w-xs truncate" title={link.url}>
                {link.url}
            </TableCell>
            <TableCell>
                <div className="flex items-center space-x-2">
                    <Switch
                        checked={isActive}
                        onCheckedChange={handleToggle}
                    />
                    <span className="text-xs text-muted-foreground">{isActive ? 'Active' : 'Inactive'}</span>
                </div>
            </TableCell>
            <TableCell>
                <Input
                    type="number"
                    value={displayOrder}
                    onChange={handleOrderChange}
                    className="w-20 h-8"
                />
            </TableCell>
            <TableCell className="text-right space-x-2">
                {isDirty && (
                    <Button
                        size="sm"
                        onClick={handleSave}
                        disabled={updateMutation.isPending}
                        className="bg-green-600 hover:bg-green-700 text-white"
                        title="Save Changes"
                    >
                        {updateMutation.isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
                    </Button>
                )}
                <Button variant="ghost" size="icon" onClick={() => onEdit(link)}>
                    <PenTool className="h-4 w-4" />
                </Button>
                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => onDelete(link.id)}>
                    <Trash2 className="h-4 w-4" />
                </Button>
            </TableCell>
        </TableRow>
    );
};

const FooterSettings = () => {
    const queryClient = useQueryClient();
    const [isOpen, setIsOpen] = useState(false);
    const [editingLink, setEditingLink] = useState<FooterSocialLink | null>(null);

    // Fetch Links
    const { data: links, isLoading } = useQuery({
        queryKey: ['footer-links-admin'],
        queryFn: footerService.getAllFooterLinks
    });

    // Mutations
    const createMutation = useMutation({
        mutationFn: footerService.createFooterLink,
        onSuccess: () => {
            toast.success("Social link added");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['footer-links-admin'] });
        },
        onError: () => toast.error("Failed to add link")
    });

    const updateMutation = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            footerService.updateFooterLink(id, updates),
        onSuccess: () => {
            toast.success("Social link updated");
            handleClose();
            queryClient.invalidateQueries({ queryKey: ['footer-links-admin'] });
        },
        onError: () => toast.error("Failed to update link")
    });

    const deleteMutation = useMutation({
        mutationFn: footerService.deleteFooterLink,
        onSuccess: () => {
            toast.success("Social link deleted");
            queryClient.invalidateQueries({ queryKey: ['footer-links-admin'] });
        },
        onError: () => toast.error("Failed to delete link")
    });

    const handleClose = () => {
        setIsOpen(false);
        setEditingLink(null);
    };

    const handleOpen = (link?: FooterSocialLink) => {
        setEditingLink(link || null);
        setIsOpen(true);
    };

    const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const platform = formData.get("platform") as string;
        const url = formData.get("url") as string;
        const icon = formData.get("icon") as string;

        if (editingLink) {
            updateMutation.mutate({
                id: editingLink.id,
                updates: { platform, url, icon }
            });
        } else {
            createMutation.mutate({
                platform,
                url,
                icon,
                is_active: true,
                display_order: (links?.length || 0) + 1
            });
        }
    };

    const handleDelete = (id: string) => {
        if (confirm("Are you sure you want to delete this link?")) {
            deleteMutation.mutate(id);
        }
    };

    if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Footer Settings</h1>
                    <p className="text-muted-foreground mt-1">Manage social media links displayed in the footer.</p>
                </div>
                <Button onClick={() => handleOpen()}>
                    <Plus className="mr-2 h-4 w-4" /> Add Social Link
                </Button>
            </div>

            <div className="rounded-md border bg-white">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Platform</TableHead>
                            <TableHead>URL</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Order</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {links?.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                                    No social links added yet.
                                </TableCell>
                            </TableRow>
                        ) : (
                            links?.map((link) => (
                                <SocialLinkRow
                                    key={link.id}
                                    link={link}
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
                        <DialogTitle>{editingLink ? "Edit Social Link" : "Add Social Link"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="platform">Platform Name</Label>
                            <Input
                                id="platform"
                                name="platform"
                                placeholder="e.g. Facebook"
                                defaultValue={editingLink?.platform}
                                required
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="icon">Icon</Label>
                            <Select name="icon" defaultValue={editingLink?.icon || "facebook"}>
                                <SelectTrigger>
                                    <SelectValue placeholder="Select icon" />
                                </SelectTrigger>
                                <SelectContent>
                                    {PLATFORMS.map((p) => (
                                        <SelectItem key={p.value} value={p.value}>
                                            <div className="flex items-center gap-2">
                                                <p.icon className="h-4 w-4" />
                                                <span>{p.label}</span>
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="url">Profile URL</Label>
                            <Input
                                id="url"
                                name="url"
                                type="url"
                                placeholder="https://..."
                                defaultValue={editingLink?.url}
                                required
                            />
                        </div>

                        <Button type="submit" className="w-full" disabled={createMutation.isPending || updateMutation.isPending}>
                            {createMutation.isPending || updateMutation.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                            Save Link
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default FooterSettings;
