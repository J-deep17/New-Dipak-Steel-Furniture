import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsService } from "@/services/cms";
import { cmsPagesService, AboutPageContent, PhilosophyPageContent, MaterialsPageContent, QualityPageContent, ContactPageContent } from "@/services/cmsPages";
import { AboutPageEditor, PhilosophyPageEditor, MaterialsPageEditor, QualityPageEditor, ContactPageEditor } from "@/components/admin/CMSPageEditors";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save, Plus, Trash2, PenTool } from "lucide-react";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog";
import { StatData, FeatureData, FAQData, CategoryData, TestimonialData, CTAData } from "@/services/cms";

const CMS = () => {
    const queryClient = useQueryClient();
    const { data, isLoading } = useQuery({
        queryKey: ['homepage-data'],
        queryFn: cmsService.getHomepageData
    });

    const [activeTab, setActiveTab] = useState("about");
    const [heroImageUrl, setHeroImageUrl] = useState("");

    useEffect(() => {
        if (data?.hero?.hero_image) {
            setHeroImageUrl(data.hero.hero_image);
        }
    }, [data]);

    // Hero Mutation
    const updateHeroMutation = useMutation({
        mutationFn: cmsService.updateHero,
        onSuccess: () => {
            toast.success("Hero section updated successfully");
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        },
        onError: () => toast.error("Failed to update Hero section")
    });

    // Handle Hero Submit
    const handleHeroSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data?.hero) return;
        const formData = new FormData(e.currentTarget);
        updateHeroMutation.mutate({
            id: data.hero.id,
            heading: formData.get("heading") as string,
            subheading: formData.get("subheading") as string,
            highlight_text: formData.get("highlight_text") as string,
            hero_image: heroImageUrl, // Use state
            cta_primary_text: formData.get("cta_primary_text") as string,
            cta_primary_link: formData.get("cta_primary_link") as string,
            cta_secondary_text: formData.get("cta_secondary_text") as string,
            cta_secondary_link: formData.get("cta_secondary_link") as string,
        });
    };

    // --- Stats Management ---
    const [isStatOpen, setIsStatOpen] = useState(false);
    const [editingStat, setEditingStat] = useState<StatData | null>(null);

    const openStatDialog = (stat?: StatData) => {
        setEditingStat(stat || null);
        setIsStatOpen(true);
    };

    const handleStatSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const statData = {
            value: formData.get("value") as string,
            label: formData.get("label") as string,
            display_order: parseInt(formData.get("display_order") as string) || 0,
        };

        try {
            if (editingStat) {
                await cmsService.updateStat({ ...editingStat, ...statData });
                toast.success("Stat updated");
            } else {
                await cmsService.createStat({ ...statData, icon: null });
                toast.success("Stat created");
            }
            setIsStatOpen(false);
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to save stat");
        }
    };

    const handleDeleteStat = async (id: string) => {
        if (!confirm("Delete this stat?")) return;
        try {
            await cmsService.deleteStat(id);
            toast.success("Stat deleted");
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to delete stat");
        }
    };

    // --- Features Management ---
    const [isFeatureOpen, setIsFeatureOpen] = useState(false);
    const [editingFeature, setEditingFeature] = useState<FeatureData | null>(null);

    const openFeatureDialog = (feature?: FeatureData) => {
        setEditingFeature(feature || null);
        setIsFeatureOpen(true);
    };

    const handleFeatureSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const featureData = {
            title: formData.get("title") as string,
            description: formData.get("description") as string,
            icon: formData.get("icon") as string,
        };

        try {
            if (editingFeature) {
                await cmsService.updateFeature({ ...editingFeature, ...featureData });
                toast.success("Feature updated");
            } else {
                await cmsService.createFeature(featureData);
                toast.success("Feature created");
            }
            setIsFeatureOpen(false);
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to save feature");
        }
    };

    const handleDeleteFeature = async (id: string) => {
        if (!confirm("Delete this feature?")) return;
        try {
            await cmsService.deleteFeature(id);
            toast.success("Feature deleted");
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to delete feature");
        }
    };

    // --- FAQ Management ---
    const [isFAQOpen, setIsFAQOpen] = useState(false);
    const [editingFAQ, setEditingFAQ] = useState<FAQData | null>(null);

    const openFAQDialog = (faq?: FAQData) => {
        setEditingFAQ(faq || null);
        setIsFAQOpen(true);
    };

    const handleFAQSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const faqData = {
            question: formData.get("question") as string,
            answer: formData.get("answer") as string,
        };

        try {
            if (editingFAQ) {
                await cmsService.updateFAQ({ ...editingFAQ, ...faqData });
                toast.success("FAQ updated");
            } else {
                await cmsService.createFAQ(faqData);
                toast.success("FAQ created");
            }
            setIsFAQOpen(false);
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to save FAQ");
        }
    };

    const handleDeleteFAQ = async (id: string) => {
        if (!confirm("Delete this FAQ?")) return;
        try {
            await cmsService.deleteFAQ(id);
            toast.success("FAQ deleted");
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to delete FAQ");
        }
    };

    // --- Image Upload Helper ---
    const [uploading, setUploading] = useState(false);

    const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        try {
            setUploading(true);
            if (!e.target.files || e.target.files.length === 0) {
                throw new Error("You must select an image to upload.");
            }

            const file = e.target.files[0];
            const publicUrl = await cmsService.uploadImage(file);
            toast.success("Image uploaded successfully!");
            return publicUrl;
        } catch (error) {
            toast.error("Error uploading image");
            console.error(error);
            return null;
        } finally {
            setUploading(false);
        }
    };

    // --- Category Management ---
    const [isCategoryOpen, setIsCategoryOpen] = useState(false);
    const [editingCategory, setEditingCategory] = useState<CategoryData | null>(null);
    const [categoryImageUrl, setCategoryImageUrl] = useState("");

    const openCategoryDialog = (category?: CategoryData) => {
        setEditingCategory(category || null);
        setCategoryImageUrl(category?.image_url || "");
        setIsCategoryOpen(true);
    };

    const handleCategorySubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const categoryData = {
            title: formData.get("title") as string,
            image_url: categoryImageUrl, // Use state
            link: formData.get("link") as string,
        };

        try {
            if (editingCategory) {
                await cmsService.updateCategory({ ...editingCategory, ...categoryData });
                toast.success("Category updated");
            } else {
                await cmsService.createCategory(categoryData);
                toast.success("Category created");
            }
            setIsCategoryOpen(false);
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to save category");
        }
    };

    const handleDeleteCategory = async (id: string) => {
        if (!confirm("Delete this category?")) return;
        try {
            await cmsService.deleteCategory(id);
            toast.success("Category deleted");
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to delete category");
        }
    };

    // --- Testimonial Management ---
    const [isTestimonialOpen, setIsTestimonialOpen] = useState(false);
    const [editingTestimonial, setEditingTestimonial] = useState<TestimonialData | null>(null);

    const openTestimonialDialog = (testimonial?: TestimonialData) => {
        setEditingTestimonial(testimonial || null);
        setIsTestimonialOpen(true);
    };

    const handleTestimonialSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        const formData = new FormData(e.currentTarget);
        const testimonialData = {
            name: formData.get("name") as string,
            message: formData.get("message") as string,
            rating: parseInt(formData.get("rating") as string) || 5,
        };

        try {
            if (editingTestimonial) {
                await cmsService.updateTestimonial({ ...editingTestimonial, ...testimonialData });
                toast.success("Testimonial updated");
            } else {
                await cmsService.createTestimonial(testimonialData);
                toast.success("Testimonial created");
            }
            setIsTestimonialOpen(false);
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to save testimonial");
        }
    };

    const handleDeleteTestimonial = async (id: string) => {
        if (!confirm("Delete this testimonial?")) return;
        try {
            await cmsService.deleteTestimonial(id);
            toast.success("Testimonial deleted");
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to delete testimonial");
        }
    };

    // --- About Submit ---
    const handleAboutSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data?.about) return;
        const formData = new FormData(e.currentTarget);
        try {
            await cmsService.updateAbout({
                id: data.about.id,
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                button_text: formData.get("button_text") as string,
                button_link: formData.get("button_link") as string,
            });
            toast.success("About section updated");
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to update about section");
        }
    };

    // --- CTA Submit ---
    const handleCTASubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        if (!data?.cta) return;
        const formData = new FormData(e.currentTarget);
        try {
            await cmsService.updateCTA({
                id: data.cta.id,
                title: formData.get("title") as string,
                description: formData.get("description") as string,
                button_text: formData.get("button_text") as string,
                button_link: formData.get("button_link") as string,
            });
            toast.success("CTA section updated");
            queryClient.invalidateQueries({ queryKey: ['homepage-data'] });
        } catch (error) {
            toast.error("Failed to update CTA section");
        }
    };

    if (isLoading) return <div className="flex h-96 items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <h2 className="text-3xl font-bold tracking-tight">Content Management</h2>
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
                <TabsList className="flex h-auto flex-wrap gap-2 bg-transparent p-0">
                    <TabsTrigger value="about" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">About</TabsTrigger>
                    <TabsTrigger value="testimonials" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Testimonials</TabsTrigger>
                    <TabsTrigger value="features" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Features</TabsTrigger>
                    <TabsTrigger value="faq" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">FAQ</TabsTrigger>
                    <TabsTrigger value="cta" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">CTA Banner</TabsTrigger>
                    <TabsTrigger value="about_page" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">About Page</TabsTrigger>
                    <TabsTrigger value="philosophy_page" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Philosophy Page</TabsTrigger>
                    <TabsTrigger value="materials_page" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Materials Page</TabsTrigger>
                    <TabsTrigger value="quality_page" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Quality Page</TabsTrigger>
                    <TabsTrigger value="contact_page" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">Contact Page</TabsTrigger>
                </TabsList>

                <TabsContent value="hero" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Hero Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleHeroSubmit} className="space-y-4">
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="heading">Heading</Label>
                                        <Input id="heading" name="heading" defaultValue={data?.hero?.heading} required />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="highlight_text">Highlight Text</Label>
                                        <Input id="highlight_text" name="highlight_text" defaultValue={data?.hero?.highlight_text || ""} />
                                    </div>
                                    <div className="space-y-2 col-span-2">
                                        <Label>Hero Image</Label>
                                        <div className="flex gap-2 items-end">
                                            <div className="flex-1">
                                                <Label htmlFor="hero-image-upload" className="sr-only">Upload Image</Label>
                                                <Input
                                                    id="hero-image-upload"
                                                    type="file"
                                                    accept="image/*"
                                                    onChange={async (e) => {
                                                        const url = await handleImageUpload(e);
                                                        if (url) setHeroImageUrl(url);
                                                    }}
                                                    disabled={uploading}
                                                />
                                            </div>
                                            <div className="flex-1">
                                                <Label htmlFor="hero-image-url" className="sr-only">Image URL</Label>
                                                <Input id="hero-image-url" value={heroImageUrl} onChange={(e) => setHeroImageUrl(e.target.value)} placeholder="Or enter URL manually" />
                                            </div>
                                        </div>
                                        {uploading && <p className="text-sm text-muted-foreground mt-1">Uploading...</p>}
                                        {heroImageUrl && (
                                            <img src={heroImageUrl} alt="Hero Preview" className="h-40 w-full object-cover rounded-md border mt-2" />
                                        )}
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="subheading">Subheading</Label>
                                    <Textarea id="subheading" name="subheading" defaultValue={data?.hero?.subheading || ""} rows={3} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="cta_primary_text">Primary Button Text</Label>
                                        <Input id="cta_primary_text" name="cta_primary_text" defaultValue={data?.hero?.cta_primary_text || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cta_primary_link">Primary Button Link</Label>
                                        <Input id="cta_primary_link" name="cta_primary_link" defaultValue={data?.hero?.cta_primary_link || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cta_secondary_text">Secondary Button Text</Label>
                                        <Input id="cta_secondary_text" name="cta_secondary_text" defaultValue={data?.hero?.cta_secondary_text || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cta_secondary_link">Secondary Button Link</Label>
                                        <Input id="cta_secondary_link" name="cta_secondary_link" defaultValue={data?.hero?.cta_secondary_link || ""} />
                                    </div>
                                </div>
                                <Button type="submit" disabled={updateHeroMutation.isPending}>
                                    {updateHeroMutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                                    Save Changes
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Placeholders for other tabs to verify structure before implementing all forms */}
                <TabsContent value="stats" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Trust Indicators</CardTitle>
                            <Button onClick={() => openStatDialog()}>
                                <Plus className="mr-2 h-4 w-4" /> Add Stat
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data?.stats?.sort((a, b) => (a.display_order || 0) - (b.display_order || 0)).map((stat) => (
                                    <div key={stat.id} className="flex items-center justify-between rounded-lg border p-4">
                                        <div>
                                            <p className="font-bold">{stat.value}</p>
                                            <p className="text-sm text-muted-foreground">{stat.label}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openStatDialog(stat)}>
                                                <PenTool className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteStat(stat.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="categories" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Homepage Categories</CardTitle>
                            <Button onClick={() => openCategoryDialog()}>
                                <Plus className="mr-2 h-4 w-4" /> Add Category
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                                {data?.categories?.map((category) => (
                                    <div key={category.id} className="relative aspect-square overflow-hidden rounded-lg border group">
                                        <img src={category.image_url || "/placeholder.svg"} alt={category.title} className="h-full w-full object-cover transition-transform group-hover:scale-105" />
                                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                                            <h3 className="text-xl font-bold text-white">{category.title}</h3>
                                        </div>
                                        <div className="absolute top-2 right-2 flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <Button variant="secondary" size="icon" className="h-8 w-8" onClick={() => openCategoryDialog(category)}>
                                                <PenTool className="h-4 w-4" />
                                            </Button>
                                            <Button variant="destructive" size="icon" className="h-8 w-8" onClick={() => handleDeleteCategory(category.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="about" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>About Section</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAboutSubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="about-title">Title</Label>
                                    <Input id="about-title" name="title" defaultValue={data?.about?.title} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="about-desc">Description</Label>
                                    <Textarea id="about-desc" name="description" defaultValue={data?.about?.description} rows={5} required />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="about-btn-text">Button Text</Label>
                                        <Input id="about-btn-text" name="button_text" defaultValue={data?.about?.button_text || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="about-btn-link">Button Link</Label>
                                        <Input id="about-btn-link" name="button_link" defaultValue={data?.about?.button_link || ""} />
                                    </div>
                                </div>
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" /> Save About Section
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="testimonials" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Customer Testimonials</CardTitle>
                            <Button onClick={() => openTestimonialDialog()}>
                                <Plus className="mr-2 h-4 w-4" /> Add Testimonial
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {data?.testimonials?.map((t) => (
                                    <div key={t.id} className="rounded-lg border p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <div>
                                                <p className="font-semibold">{t.name}</p>
                                                <div className="flex text-yellow-400">
                                                    {[...Array(5)].map((_, i) => (
                                                        <span key={i} className={i < (t.rating || 5) ? "fill-current" : "text-gray-300"}>★</span>
                                                    ))}
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openTestimonialDialog(t)}>
                                                    <PenTool className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteTestimonial(t.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground italic">"{t.message}"</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="features" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Why Choose Us Features</CardTitle>
                            <Button onClick={() => openFeatureDialog()}>
                                <Plus className="mr-2 h-4 w-4" /> Add Feature
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="grid gap-4 md:grid-cols-2">
                                {data?.features?.map((feature) => (
                                    <div key={feature.id} className="flex items-start justify-between rounded-lg border p-4">
                                        <div>
                                            <div className="flex items-center gap-2 mb-1">
                                                <span className="text-xs bg-secondary px-2 py-0.5 rounded">{feature.icon}</span>
                                                <p className="font-semibold">{feature.title}</p>
                                            </div>
                                            <p className="text-sm text-muted-foreground">{feature.description}</p>
                                        </div>
                                        <div className="flex gap-2">
                                            <Button variant="ghost" size="icon" onClick={() => openFeatureDialog(feature)}>
                                                <PenTool className="h-4 w-4" />
                                            </Button>
                                            <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteFeature(feature.id)}>
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="faq" className="space-y-4">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle>Frequently Asked Questions</CardTitle>
                            <Button onClick={() => openFAQDialog()}>
                                <Plus className="mr-2 h-4 w-4" /> Add FAQ
                            </Button>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {data?.faq?.map((faq) => (
                                    <div key={faq.id} className="rounded-lg border p-4">
                                        <div className="flex items-start justify-between mb-2">
                                            <p className="font-semibold">{faq.question}</p>
                                            <div className="flex gap-2">
                                                <Button variant="ghost" size="icon" onClick={() => openFAQDialog(faq)}>
                                                    <PenTool className="h-4 w-4" />
                                                </Button>
                                                <Button variant="ghost" size="icon" className="text-destructive" onClick={() => handleDeleteFAQ(faq.id)}>
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                        <p className="text-sm text-muted-foreground">{faq.answer}</p>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="cta" className="space-y-4">
                    <Card>
                        <CardHeader>
                            <CardTitle>Call to Action Banner</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleCTASubmit} className="space-y-4">
                                <div className="space-y-2">
                                    <Label htmlFor="cta-title">Title</Label>
                                    <Input id="cta-title" name="title" defaultValue={data?.cta?.title} required />
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="cta-desc">Description</Label>
                                    <Textarea id="cta-desc" name="description" defaultValue={data?.cta?.description || ""} />
                                </div>
                                <div className="grid gap-4 md:grid-cols-2">
                                    <div className="space-y-2">
                                        <Label htmlFor="cta-btn-text">Button Text</Label>
                                        <Input id="cta-btn-text" name="button_text" defaultValue={data?.cta?.button_text || ""} />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="cta-btn-link">Button Link</Label>
                                        <Input id="cta-btn-link" name="button_link" defaultValue={data?.cta?.button_link || ""} />
                                    </div>
                                </div>
                                <Button type="submit">
                                    <Save className="mr-2 h-4 w-4" /> Save CTA Banner
                                </Button>
                            </form>
                        </CardContent>
                    </Card>
                </TabsContent>

                {/* Page Editor Tabs */}
                <TabsContent value="about_page" className="space-y-4">
                    <AboutPageEditor />
                </TabsContent>
                <TabsContent value="philosophy_page" className="space-y-4">
                    <PhilosophyPageEditor />
                </TabsContent>
                <TabsContent value="materials_page" className="space-y-4">
                    <MaterialsPageEditor />
                </TabsContent>
                <TabsContent value="quality_page" className="space-y-4">
                    <QualityPageEditor />
                </TabsContent>
                <TabsContent value="contact_page" className="space-y-4">
                    <ContactPageEditor />
                </TabsContent>
            </Tabs>

            {/* Dialogs */}

            {/* Stat Dialog */}
            <Dialog open={isStatOpen} onOpenChange={setIsStatOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingStat ? "Edit Stat" : "Add Stat"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleStatSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="stat-value">Value (e.g. "25+")</Label>
                            <Input id="stat-value" name="value" defaultValue={editingStat?.value} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stat-label">Label (e.g. "Years Experience")</Label>
                            <Input id="stat-label" name="label" defaultValue={editingStat?.label} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="stat-order">Display Order</Label>
                            <Input id="stat-order" name="display_order" type="number" defaultValue={editingStat?.display_order || 0} />
                        </div>
                        <Button type="submit" className="w-full">Save Stat</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Feature Dialog */}
            <Dialog open={isFeatureOpen} onOpenChange={setIsFeatureOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingFeature ? "Edit Feature" : "Add Feature"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFeatureSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="feature-title">Title</Label>
                            <Input id="feature-title" name="title" defaultValue={editingFeature?.title} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feature-desc">Description</Label>
                            <Textarea id="feature-desc" name="description" defaultValue={editingFeature?.description || ""} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="feature-icon">Icon Name (Lucide React)</Label>
                            <Input id="feature-icon" name="icon" defaultValue={editingFeature?.icon || "check"} placeholder="check, shield, truck..." />
                            <p className="text-xs text-muted-foreground">Supported icons: check, shield, truck, heart-handshake, leaf, award, star, pen-tool, layout, box</p>
                        </div>
                        <Button type="submit" className="w-full">Save Feature</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* FAQ Dialog */}
            <Dialog open={isFAQOpen} onOpenChange={setIsFAQOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingFAQ ? "Edit FAQ" : "Add FAQ"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleFAQSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="faq-question">Question</Label>
                            <Input id="faq-question" name="question" defaultValue={editingFAQ?.question} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="faq-answer">Answer</Label>
                            <Textarea id="faq-answer" name="answer" defaultValue={editingFAQ?.answer} required />
                        </div>
                        <Button type="submit" className="w-full">Save FAQ</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Category Dialog */}
            <Dialog open={isCategoryOpen} onOpenChange={setIsCategoryOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingCategory ? "Edit Category" : "Add Category"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleCategorySubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="cat-title">Title</Label>
                            <Input id="cat-title" name="title" defaultValue={editingCategory?.title} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-image">Image</Label>
                            <div className="flex gap-2">
                                <Input
                                    id="cat-image-upload"
                                    type="file"
                                    accept="image/*"
                                    onChange={async (e) => {
                                        const url = await handleImageUpload(e);
                                        if (url) setCategoryImageUrl(url);
                                    }}
                                    disabled={uploading}
                                />
                            </div>
                            {uploading && <p className="text-sm text-muted-foreground">Uploading...</p>}
                            {categoryImageUrl && (
                                <img src={categoryImageUrl} alt="Preview" className="h-20 w-20 object-cover rounded-md border mt-2" />
                            )}
                            <Input id="cat-image" name="image_url" value={categoryImageUrl} onChange={(e) => setCategoryImageUrl(e.target.value)} placeholder="Or enter URL manually" />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="cat-link">Link</Label>
                            <Input id="cat-link" name="link" defaultValue={editingCategory?.link || ""} />
                        </div>
                        <Button type="submit" className="w-full">Save Category</Button>
                    </form>
                </DialogContent>
            </Dialog>

            {/* Testimonial Dialog */}
            <Dialog open={isTestimonialOpen} onOpenChange={setIsTestimonialOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{editingTestimonial ? "Edit Testimonial" : "Add Testimonial"}</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleTestimonialSubmit} className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="t-name">Name</Label>
                            <Input id="t-name" name="name" defaultValue={editingTestimonial?.name} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="t-message">Message</Label>
                            <Textarea id="t-message" name="message" defaultValue={editingTestimonial?.message} required />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="t-rating">Rating (1-5)</Label>
                            <Input id="t-rating" name="rating" type="number" min="1" max="5" defaultValue={editingTestimonial?.rating || 5} required />
                        </div>
                        <Button type="submit" className="w-full">Save Testimonial</Button>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};
export default CMS;
