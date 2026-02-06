
import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { heroService, HeroBanner, HeroBannerInsert } from "@/services/hero";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
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
    DialogTrigger,
} from "@/components/ui/dialog";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Plus, PenTool, Trash2, Loader2, Settings, Image as ImageIcon, Video } from "lucide-react";
import { toast } from "sonner";

const AdminHero = () => {
    const queryClient = useQueryClient();
    const [isBannerOpen, setIsBannerOpen] = useState(false);
    const [isSettingsOpen, setIsSettingsOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<HeroBanner | null>(null);
    const [mediaUrl, setMediaUrl] = useState("");
    const [uploading, setUploading] = useState(false);

    // Queries
    const { data: banners, isLoading: isLoadingBanners } = useQuery({
        queryKey: ['hero-banners'],
        queryFn: heroService.getBanners
    });

    const { data: settings, isLoading: isLoadingSettings } = useQuery({
        queryKey: ['hero-settings'],
        queryFn: heroService.getSettings
    });

    // Mutations - Banners
    const createBanner = useMutation({
        mutationFn: heroService.createBanner,
        onSuccess: () => {
            toast.success("Banner created");
            closeBannerDialog();
            queryClient.invalidateQueries({ queryKey: ['hero-banners'] });
        },
        onError: () => toast.error("Failed to create banner")
    });

    const updateBanner = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            heroService.updateBanner(id, updates),
        onSuccess: () => {
            toast.success("Banner updated");
            closeBannerDialog();
            queryClient.invalidateQueries({ queryKey: ['hero-banners'] });
        },
        onError: () => toast.error("Failed to update banner")
    });

    const deleteBanner = useMutation({
        mutationFn: heroService.deleteBanner,
        onSuccess: () => {
            toast.success("Banner deleted");
            queryClient.invalidateQueries({ queryKey: ['hero-banners'] });
        },
        onError: () => toast.error("Failed to delete banner")
    });

    // Mutations - Settings
    const updateSettings = useMutation({
        mutationFn: ({ id, updates }: { id: string; updates: any }) =>
            heroService.updateSettings(id, updates),
        onSuccess: () => {
            toast.success("Settings updated");
            setIsSettingsOpen(false);
            queryClient.invalidateQueries({ queryKey: ['hero-settings'] });
        },
        onError: () => toast.error("Failed to update settings")
    });


    // Handlers
    const closeBannerDialog = () => {
        setIsBannerOpen(false);
        setEditingBanner(null);
        setMediaUrl("");
    };

    const openBannerDialog = (banner?: HeroBanner) => {
        if (banner) {
            setEditingBanner(banner);
            setMediaUrl(banner.media_url);
        } else {
            setMediaUrl("");
        }
        setIsBannerOpen(true);
    };

    const handleMediaUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            const file = e.target.files?.[0];
            if (!file) return;

            const url = await heroService.uploadMedia(file);
            setMediaUrl(url);

            // Auto-detect media type from file
            const isVideo = file.type.startsWith('video/') || /\.(mp4|webm|ogg|mov)$/i.test(file.name);

            // Update the media_type select element
            const mediaTypeSelect = document.querySelector('select[name="media_type"]') as HTMLSelectElement;
            if (mediaTypeSelect) {
                mediaTypeSelect.value = isVideo ? 'video' : 'image';
            }

            toast.success(`${isVideo ? 'Video' : 'Image'} uploaded successfully`);
        } catch (error) {
            toast.error("Upload failed");
            console.error(error);
        } finally {
            setUploading(false);
        }
    };

    const handleBannerSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);

        const data: any = {
            title: formData.get("title") as string,
            subtitle: formData.get("subtitle") as string,
            media_type: formData.get("media_type") as "image" | "video",
            media_url: mediaUrl,
            primary_button_text: formData.get("primary_button_text") as string,
            primary_button_link: formData.get("primary_button_link") as string,
            secondary_button_text: formData.get("secondary_button_text") as string,
            secondary_button_link: formData.get("secondary_button_link") as string,
            text_position: formData.get("text_position") as "left" | "center" | "right",
            order_index: parseInt(formData.get("order_index") as string) || 0,
            overlay_opacity: parseFloat(formData.get("overlay_opacity") as string) || 0.3,
            is_active: formData.get("is_active") === "on",
            advance_after_video: formData.get("advance_after_video") === "on"
        };

        if (editingBanner) {
            updateBanner.mutate({ id: editingBanner.id, updates: data });
        } else {
            createBanner.mutate(data);
        }
    };

    const handleSettingsSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!settings) return;

        const formData = new FormData(e.currentTarget);
        const updates = {
            autoplay: formData.get("autoplay") === "on",
            autoplay_interval: parseInt(formData.get("autoplay_interval") as string),
            show_arrows: formData.get("show_arrows") === "on",
            show_dots: formData.get("show_dots") === "on",
            pause_on_hover: formData.get("pause_on_hover") === "on",
            transition_effect: formData.get("transition_effect") as "fade" | "slide"
        };

        updateSettings.mutate({ id: settings.id, updates });
    };

    if (isLoadingBanners || isLoadingSettings) {
        return <div className="flex justify-center p-8"><Loader2 className="animate-spin" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h1 className="text-3xl font-bold tracking-tight">Hero Banners</h1>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => setIsSettingsOpen(true)}>
                        <Settings className="mr-2 h-4 w-4" /> Settings
                    </Button>
                    <Button onClick={() => openBannerDialog()}>
                        <Plus className="mr-2 h-4 w-4" /> Add Banner
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Active Banners</CardTitle>
                    <CardDescription>Manage the slides displayed on your homepage.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead className="w-[100px]">Media</TableHead>
                                <TableHead>Title</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Order</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {banners?.map((banner) => (
                                <TableRow key={banner.id}>
                                    <TableCell>
                                        {banner.media_type === 'video' ? (
                                            <div className="flex items-center justify-center h-10 w-16 bg-muted rounded">
                                                <Video className="h-5 w-5" />
                                            </div>
                                        ) : (
                                            <img
                                                src={banner.media_url || "/placeholder.svg"}
                                                alt={banner.title || "Banner"}
                                                className="h-10 w-16 object-cover rounded"
                                            />
                                        )}
                                    </TableCell>
                                    <TableCell className="font-medium">{banner.title || "(No Title)"}</TableCell>
                                    <TableCell className="capitalize">{banner.media_type}</TableCell>
                                    <TableCell>{banner.order_index}</TableCell>
                                    <TableCell>
                                        <div className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${banner.is_active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-700'}`}>
                                            {banner.is_active ? 'Active' : 'Inactive'}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="ghost" size="icon" onClick={() => openBannerDialog(banner)}>
                                            <PenTool className="h-4 w-4" />
                                        </Button>
                                        <Button variant="ghost" size="icon" className="text-destructive" onClick={() => deleteBanner.mutate(banner.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                            {banners?.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={6} className="text-center py-6 text-muted-foreground">
                                        No banners found. Add one to get started.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {/* Banner Dialog */}
            <Dialog open={isBannerOpen} onOpenChange={closeBannerDialog}>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                    <DialogHeader>
                        <DialogTitle>{editingBanner ? "Edit Banner" : "Add New Banner"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleBannerSubmit} className="space-y-6">
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="media_type">Media Type</Label>
                                <Select name="media_type" defaultValue={editingBanner?.media_type || "image"}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="image">Image</SelectItem>
                                        <SelectItem value="video">Video</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="media_upload">Upload Media</Label>
                                <Input
                                    id="media_upload"
                                    type="file"
                                    accept="image/*,video/*"
                                    onChange={handleMediaUpload}
                                    disabled={uploading}
                                />
                                {uploading && <p className="text-xs text-muted-foreground">Uploading...</p>}
                            </div>
                        </div>

                        {mediaUrl && (
                            <div className="aspect-video w-full bg-black/5 rounded-md overflow-hidden flex items-center justify-center">
                                {/* Simple preview */}
                                {mediaUrl.match(/\.(mp4|webm)$/i) ? (
                                    <video src={mediaUrl} className="h-full w-full object-contain" controls />
                                ) : (
                                    <img src={mediaUrl} alt="Preview" className="h-full w-full object-contain" />
                                )}
                            </div>
                        )}

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="title">Title</Label>
                                <Input id="title" name="title" defaultValue={editingBanner?.title || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="subtitle">Subtitle</Label>
                                <Input id="subtitle" name="subtitle" defaultValue={editingBanner?.subtitle || ""} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="primary_button_text">Primary Button Text</Label>
                                <Input id="primary_button_text" name="primary_button_text" defaultValue={editingBanner?.primary_button_text || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="primary_button_link">Primary Button Link</Label>
                                <Input id="primary_button_link" name="primary_button_link" defaultValue={editingBanner?.primary_button_link || ""} />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="secondary_button_text">Secondary Button Text</Label>
                                <Input id="secondary_button_text" name="secondary_button_text" defaultValue={editingBanner?.secondary_button_text || ""} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="secondary_button_link">Secondary Button Link</Label>
                                <Input id="secondary_button_link" name="secondary_button_link" defaultValue={editingBanner?.secondary_button_link || ""} />
                            </div>
                        </div>

                        <div className="grid grid-cols-3 gap-4">
                            <div className="space-y-2">
                                <Label htmlFor="text_position">Text Position</Label>
                                <Select name="text_position" defaultValue={editingBanner?.text_position || "left"}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="left">Left</SelectItem>
                                        <SelectItem value="center">Center</SelectItem>
                                        <SelectItem value="right">Right</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="order_index">Order Index</Label>
                                <Input id="order_index" name="order_index" type="number" defaultValue={editingBanner?.order_index || 0} />
                            </div>
                            <div className="space-y-2">
                                <Label htmlFor="overlay_opacity">Overlay Opacity (0-1)</Label>
                                <Input id="overlay_opacity" name="overlay_opacity" type="number" step="0.1" min="0" max="1" defaultValue={editingBanner?.overlay_opacity || 0.3} />
                            </div>
                        </div>

                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="is_active"
                                name="is_active"
                                defaultChecked={editingBanner ? editingBanner.is_active ?? true : true}
                                className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                            />
                            <Label htmlFor="is_active">Active</Label>
                        </div>

                        <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                                <input
                                    type="checkbox"
                                    id="advance_after_video"
                                    name="advance_after_video"
                                    defaultChecked={editingBanner?.advance_after_video ?? false}
                                    className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
                                />
                                <Label htmlFor="advance_after_video">Advance slide after video ends</Label>
                            </div>
                            <p className="text-xs text-muted-foreground ml-6">
                                If enabled, slide changes only after video finishes. If disabled, video loops continuously.
                            </p>
                        </div>

                        <Button type="submit" className="w-full" disabled={createBanner.isPending || updateBanner.isPending || uploading}>
                            {createBanner.isPending || updateBanner.isPending ? <Loader2 className="animate-spin mr-2" /> : null}
                            Save Banner
                        </Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Settings Dialog */}
            <Dialog open={isSettingsOpen} onOpenChange={setIsSettingsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Hero Settings</DialogTitle>
                    </DialogHeader>
                    {settings && (
                        <form onSubmit={handleSettingsSubmit} className="space-y-6">
                            <div className="space-y-4">
                                <div className="flex items-center justify-between">
                                    <Label htmlFor="autoplay">Autoplay</Label>
                                    <Switch id="autoplay" name="autoplay" defaultChecked={settings.autoplay ?? true} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="autoplay_interval">Autoplay Interval (ms)</Label>
                                    <Input id="autoplay_interval" name="autoplay_interval" type="number" step="500" defaultValue={settings.autoplay_interval || 5000} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="show_arrows">Show Arrows</Label>
                                    <Switch id="show_arrows" name="show_arrows" defaultChecked={settings.show_arrows ?? true} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="show_dots">Show Dots</Label>
                                    <Switch id="show_dots" name="show_dots" defaultChecked={settings.show_dots ?? true} />
                                </div>

                                <div className="flex items-center justify-between">
                                    <Label htmlFor="pause_on_hover">Pause on Hover</Label>
                                    <Switch id="pause_on_hover" name="pause_on_hover" defaultChecked={settings.pause_on_hover ?? true} />
                                </div>

                                <div className="space-y-2">
                                    <Label htmlFor="transition_effect">Transition Effect</Label>
                                    <Select name="transition_effect" defaultValue={settings.transition_effect || "fade"}>
                                        <SelectTrigger>
                                            <SelectValue />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="fade">Fade</SelectItem>
                                            <SelectItem value="slide">Slide</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </div>
                            </div>
                            <Button type="submit" className="w-full" disabled={updateSettings.isPending}>
                                {updateSettings.isPending && <Loader2 className="animate-spin mr-2" />}
                                Save Settings
                            </Button>
                        </form>
                    )}
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default AdminHero;
