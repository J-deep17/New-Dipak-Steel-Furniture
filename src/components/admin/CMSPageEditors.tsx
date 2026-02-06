import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Save } from "lucide-react";
import {
    cmsPagesService,
    AboutPageContent,
    PhilosophyPageContent,
    MaterialsPageContent,
    QualityPageContent,
    ContactPageContent,
    PageKey
} from "@/services/cmsPages";

// Helper function to safely handle arrays that might be null/undefined
const safeArray = <T,>(arr: T[] | null | undefined): T[] => {
    return Array.isArray(arr) ? arr : [];
};

// Generic page editor props
interface PageEditorProps {
    pageKey: PageKey;
}

// About Page Editor
export const AboutPageEditor = () => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState<AboutPageContent | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['cms-page', 'about_page'],
        queryFn: () => cmsPagesService.getPageContent<AboutPageContent>('about_page')
    });

    useEffect(() => {
        if (data) setContent(data);
    }, [data]);

    const mutation = useMutation({
        mutationFn: (content: AboutPageContent) => cmsPagesService.updatePageContent('about_page', content),
        onSuccess: () => {
            toast.success("About page updated successfully");
            queryClient.invalidateQueries({ queryKey: ['cms-page', 'about_page'] });
        },
        onError: () => toast.error("Failed to update About page")
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content) mutation.mutate(content);
    };

    const updateField = (path: string, value: string) => {
        if (!content) return;
        const keys = path.split('.');
        const newContent = { ...content };
        let current: any = newContent;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setContent(newContent);
    };

    const updateArrayField = (arrayPath: string, index: number, field: string, value: string) => {
        if (!content) return;
        const newContent = { ...content };
        const keys = arrayPath.split('.');
        let current: any = newContent;
        for (let i = 0; i < keys.length; i++) {
            if (i === keys.length - 1) {
                current[keys[i]] = [...current[keys[i]]];
                current[keys[i]][index] = { ...current[keys[i]][index], [field]: value };
            } else {
                current[keys[i]] = { ...current[keys[i]] };
                current = current[keys[i]];
            }
        }
        setContent(newContent);
    };

    if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {/* Hero Section */}
            <Card>
                <CardHeader>
                    <CardTitle>Hero Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.hero?.heading || ""} onChange={(e) => updateField('hero.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading</Label>
                        <Textarea value={content?.hero?.subheading || ""} onChange={(e) => updateField('hero.subheading', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Who We Are */}
            <Card>
                <CardHeader>
                    <CardTitle>Who We Are Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.who_we_are?.heading || ""} onChange={(e) => updateField('who_we_are.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Paragraph 1 (supports HTML)</Label>
                        <Textarea rows={4} value={content?.who_we_are?.paragraph1 || ""} onChange={(e) => updateField('who_we_are.paragraph1', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Paragraph 2 (supports HTML)</Label>
                        <Textarea rows={4} value={content?.who_we_are?.paragraph2 || ""} onChange={(e) => updateField('who_we_are.paragraph2', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Paragraph 3 (supports HTML)</Label>
                        <Textarea rows={4} value={content?.who_we_are?.paragraph3 || ""} onChange={(e) => updateField('who_we_are.paragraph3', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            {/* Vision & Mission */}
            <Card>
                <CardHeader>
                    <CardTitle>Vision & Mission</CardTitle>
                </CardHeader>
                <CardContent className="grid gap-6 md:grid-cols-2">
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Vision Title</Label>
                            <Input value={content?.vision?.title || ""} onChange={(e) => updateField('vision.title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Vision Description</Label>
                            <Textarea rows={4} value={content?.vision?.description || ""} onChange={(e) => updateField('vision.description', e.target.value)} />
                        </div>
                    </div>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label>Mission Title</Label>
                            <Input value={content?.mission?.title || ""} onChange={(e) => updateField('mission.title', e.target.value)} />
                        </div>
                        <div className="space-y-2">
                            <Label>Mission Description</Label>
                            <Textarea rows={4} value={content?.mission?.description || ""} onChange={(e) => updateField('mission.description', e.target.value)} />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Core Values */}
            <Card>
                <CardHeader>
                    <CardTitle>Core Values</CardTitle>
                    <CardDescription>Edit the 4 core values displayed on the page</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    {safeArray(content?.core_values).map((value, index) => (
                        <div key={index} className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg">
                            <div className="space-y-2">
                                <Label>Value {index + 1} Title</Label>
                                <Input value={value.title || ""} onChange={(e) => updateArrayField('core_values', index, 'title', e.target.value)} />
                            </div>
                            <div className="space-y-2">
                                <Label>Value {index + 1} Description</Label>
                                <Input value={value.description || ""} onChange={(e) => updateArrayField('core_values', index, 'description', e.target.value)} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            {/* Manufacturing Excellence */}
            <Card>
                <CardHeader>
                    <CardTitle>Manufacturing Excellence</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.manufacturing?.heading || ""} onChange={(e) => updateField('manufacturing.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea rows={3} value={content?.manufacturing?.description || ""} onChange={(e) => updateField('manufacturing.description', e.target.value)} />
                    </div>
                    <div className="grid gap-4 md:grid-cols-3">
                        {safeArray(content?.manufacturing?.stats).map((stat, index) => (
                            <div key={index} className="space-y-2 p-4 border rounded-lg">
                                <div className="space-y-2">
                                    <Label>Stat {index + 1} Value</Label>
                                    <Input value={stat.value || ""} onChange={(e) => {
                                        const newStats = [...safeArray(content?.manufacturing?.stats)];
                                        newStats[index] = { ...newStats[index], value: e.target.value };
                                        setContent({ ...content!, manufacturing: { ...content!.manufacturing, stats: newStats } });
                                    }} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Stat {index + 1} Label</Label>
                                    <Input value={stat.label || ""} onChange={(e) => {
                                        const newStats = [...safeArray(content?.manufacturing?.stats)];
                                        newStats[index] = { ...newStats[index], label: e.target.value };
                                        setContent({ ...content!, manufacturing: { ...content!.manufacturing, stats: newStats } });
                                    }} />
                                </div>
                            </div>
                        ))}
                    </div>
                </CardContent>
            </Card>

            {/* CTA */}
            <Card>
                <CardHeader>
                    <CardTitle>CTA Section</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.cta?.heading || ""} onChange={(e) => updateField('cta.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading</Label>
                        <Textarea value={content?.cta?.subheading || ""} onChange={(e) => updateField('cta.subheading', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save About Page
            </Button>
        </form>
    );
};

// Philosophy Page Editor
export const PhilosophyPageEditor = () => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState<PhilosophyPageContent | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['cms-page', 'philosophy_page'],
        queryFn: () => cmsPagesService.getPageContent<PhilosophyPageContent>('philosophy_page')
    });

    useEffect(() => {
        if (data) setContent(data);
    }, [data]);

    const mutation = useMutation({
        mutationFn: (content: PhilosophyPageContent) => cmsPagesService.updatePageContent('philosophy_page', content),
        onSuccess: () => {
            toast.success("Philosophy page updated successfully");
            queryClient.invalidateQueries({ queryKey: ['cms-page', 'philosophy_page'] });
        },
        onError: () => toast.error("Failed to update Philosophy page")
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content) mutation.mutate(content);
    };

    const updateField = (path: string, value: string) => {
        if (!content) return;
        const keys = path.split('.');
        const newContent = { ...content };
        let current: any = newContent;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setContent(newContent);
    };

    if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.hero?.heading || ""} onChange={(e) => updateField('hero.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading (supports HTML)</Label>
                        <Textarea value={content?.hero?.subheading || ""} onChange={(e) => updateField('hero.subheading', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>ECO + ERGO Description</CardTitle></CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <Label>Description (supports HTML)</Label>
                        <Textarea rows={3} value={content?.eco_ergo?.description || ""} onChange={(e) => updateField('eco_ergo.description', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Eco-Conscious Design</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.eco_design?.heading || ""} onChange={(e) => updateField('eco_design.heading', e.target.value)} />
                    </div>
                    {safeArray(content?.eco_design?.points).map((point, index) => (
                        <div key={index} className="space-y-2">
                            <Label>Point {index + 1}</Label>
                            <Input value={point || ""} onChange={(e) => {
                                const newPoints = [...safeArray(content?.eco_design?.points)];
                                newPoints[index] = e.target.value;
                                setContent({ ...content!, eco_design: { ...content!.eco_design, points: newPoints } });
                            }} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Ergonomic Excellence</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.ergo_design?.heading || ""} onChange={(e) => updateField('ergo_design.heading', e.target.value)} />
                    </div>
                    {safeArray(content?.ergo_design?.points).map((point, index) => (
                        <div key={index} className="space-y-2">
                            <Label>Point {index + 1}</Label>
                            <Input value={point || ""} onChange={(e) => {
                                const newPoints = [...safeArray(content?.ergo_design?.points)];
                                newPoints[index] = e.target.value;
                                setContent({ ...content!, ergo_design: { ...content!.ergo_design, points: newPoints } });
                            }} />
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Indian Workspaces Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.indian_workspaces?.heading || ""} onChange={(e) => updateField('indian_workspaces.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Paragraph 1</Label>
                        <Textarea value={content?.indian_workspaces?.paragraph1 || ""} onChange={(e) => updateField('indian_workspaces.paragraph1', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Paragraph 2 (supports HTML)</Label>
                        <Textarea value={content?.indian_workspaces?.paragraph2 || ""} onChange={(e) => updateField('indian_workspaces.paragraph2', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Paragraph 3</Label>
                        <Textarea value={content?.indian_workspaces?.paragraph3 || ""} onChange={(e) => updateField('indian_workspaces.paragraph3', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Philosophy Page
            </Button>
        </form>
    );
};

// Materials Page Editor
export const MaterialsPageEditor = () => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState<MaterialsPageContent | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['cms-page', 'materials_page'],
        queryFn: () => cmsPagesService.getPageContent<MaterialsPageContent>('materials_page')
    });

    useEffect(() => {
        if (data) setContent(data);
    }, [data]);

    const mutation = useMutation({
        mutationFn: (content: MaterialsPageContent) => cmsPagesService.updatePageContent('materials_page', content),
        onSuccess: () => {
            toast.success("Materials page updated successfully");
            queryClient.invalidateQueries({ queryKey: ['cms-page', 'materials_page'] });
        },
        onError: () => toast.error("Failed to update Materials page")
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content) mutation.mutate(content);
    };

    const updateField = (path: string, value: string) => {
        if (!content) return;
        const keys = path.split('.');
        const newContent = { ...content };
        let current: any = newContent;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setContent(newContent);
    };

    if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.hero?.heading || ""} onChange={(e) => updateField('hero.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading (supports HTML)</Label>
                        <Textarea value={content?.hero?.subheading || ""} onChange={(e) => updateField('hero.subheading', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Materials Introduction</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.materials_intro?.heading || ""} onChange={(e) => updateField('materials_intro.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={content?.materials_intro?.description || ""} onChange={(e) => updateField('materials_intro.description', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>CTA Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.cta?.heading || ""} onChange={(e) => updateField('cta.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading</Label>
                        <Textarea value={content?.cta?.subheading || ""} onChange={(e) => updateField('cta.subheading', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Materials Page
            </Button>
        </form>
    );
};

// Quality Page Editor
export const QualityPageEditor = () => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState<QualityPageContent | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['cms-page', 'quality_page'],
        queryFn: () => cmsPagesService.getPageContent<QualityPageContent>('quality_page')
    });

    useEffect(() => {
        if (data) setContent(data);
    }, [data]);

    const mutation = useMutation({
        mutationFn: (content: QualityPageContent) => cmsPagesService.updatePageContent('quality_page', content),
        onSuccess: () => {
            toast.success("Quality page updated successfully");
            queryClient.invalidateQueries({ queryKey: ['cms-page', 'quality_page'] });
        },
        onError: () => toast.error("Failed to update Quality page")
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content) mutation.mutate(content);
    };

    const updateField = (path: string, value: string) => {
        if (!content) return;
        const keys = path.split('.');
        const newContent = { ...content };
        let current: any = newContent;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setContent(newContent);
    };

    if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.hero?.heading || ""} onChange={(e) => updateField('hero.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading</Label>
                        <Textarea value={content?.hero?.subheading || ""} onChange={(e) => updateField('hero.subheading', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Quality Promise</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.quality_promise?.heading || ""} onChange={(e) => updateField('quality_promise.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description (supports HTML)</Label>
                        <Textarea value={content?.quality_promise?.description || ""} onChange={(e) => updateField('quality_promise.description', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Quality Points</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    {safeArray(content?.quality_points).map((point, index) => (
                        <div key={index} className="grid gap-4 md:grid-cols-2 p-4 border rounded-lg">
                            <div className="space-y-2">
                                <Label>Point {index + 1} Title</Label>
                                <Input value={point.title || ""} onChange={(e) => {
                                    const newPoints = [...safeArray(content?.quality_points)];
                                    newPoints[index] = { ...newPoints[index], title: e.target.value };
                                    setContent({ ...content!, quality_points: newPoints });
                                }} />
                            </div>
                            <div className="space-y-2">
                                <Label>Point {index + 1} Description</Label>
                                <Input value={point.description || ""} onChange={(e) => {
                                    const newPoints = [...safeArray(content?.quality_points)];
                                    newPoints[index] = { ...newPoints[index], description: e.target.value };
                                    setContent({ ...content!, quality_points: newPoints });
                                }} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Trust Statistics</CardTitle></CardHeader>
                <CardContent className="grid gap-4 md:grid-cols-4">
                    {safeArray(content?.trust_stats).map((stat, index) => (
                        <div key={index} className="space-y-2 p-4 border rounded-lg">
                            <div className="space-y-2">
                                <Label>Value</Label>
                                <Input value={stat.value || ""} onChange={(e) => {
                                    const newStats = [...safeArray(content?.trust_stats)];
                                    newStats[index] = { ...newStats[index], value: e.target.value };
                                    setContent({ ...content!, trust_stats: newStats });
                                }} />
                            </div>
                            <div className="space-y-2">
                                <Label>Label</Label>
                                <Input value={stat.label || ""} onChange={(e) => {
                                    const newStats = [...safeArray(content?.trust_stats)];
                                    newStats[index] = { ...newStats[index], label: e.target.value };
                                    setContent({ ...content!, trust_stats: newStats });
                                }} />
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Testimonials Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Section Heading</Label>
                        <Input value={content?.testimonials_heading?.heading || ""} onChange={(e) => updateField('testimonials_heading.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Section Subheading</Label>
                        <Input value={content?.testimonials_heading?.subheading || ""} onChange={(e) => updateField('testimonials_heading.subheading', e.target.value)} />
                    </div>
                    {safeArray(content?.testimonials).map((t, index) => (
                        <div key={index} className="p-4 border rounded-lg space-y-3">
                            <div className="space-y-2">
                                <Label>Testimonial {index + 1} Quote</Label>
                                <Textarea value={t.quote || ""} onChange={(e) => {
                                    const newTestimonials = [...safeArray(content?.testimonials)];
                                    newTestimonials[index] = { ...newTestimonials[index], quote: e.target.value };
                                    setContent({ ...content!, testimonials: newTestimonials });
                                }} />
                            </div>
                            <div className="grid gap-4 md:grid-cols-2">
                                <div className="space-y-2">
                                    <Label>Author</Label>
                                    <Input value={t.author || ""} onChange={(e) => {
                                        const newTestimonials = [...safeArray(content?.testimonials)];
                                        newTestimonials[index] = { ...newTestimonials[index], author: e.target.value };
                                        setContent({ ...content!, testimonials: newTestimonials });
                                    }} />
                                </div>
                                <div className="space-y-2">
                                    <Label>Company</Label>
                                    <Input value={t.company || ""} onChange={(e) => {
                                        const newTestimonials = [...safeArray(content?.testimonials)];
                                        newTestimonials[index] = { ...newTestimonials[index], company: e.target.value };
                                        setContent({ ...content!, testimonials: newTestimonials });
                                    }} />
                                </div>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>CTA Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.cta?.heading || ""} onChange={(e) => updateField('cta.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading</Label>
                        <Textarea value={content?.cta?.subheading || ""} onChange={(e) => updateField('cta.subheading', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Quality Page
            </Button>
        </form>
    );
};

// Contact Page Editor
export const ContactPageEditor = () => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState<ContactPageContent | null>(null);

    const { data, isLoading } = useQuery({
        queryKey: ['cms-page', 'contact_page'],
        queryFn: () => cmsPagesService.getPageContent<ContactPageContent>('contact_page')
    });

    useEffect(() => {
        if (data) setContent(data);
    }, [data]);

    const mutation = useMutation({
        mutationFn: (content: ContactPageContent) => cmsPagesService.updatePageContent('contact_page', content),
        onSuccess: () => {
            toast.success("Contact page updated successfully");
            queryClient.invalidateQueries({ queryKey: ['cms-page', 'contact_page'] });
        },
        onError: () => toast.error("Failed to update Contact page")
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (content) mutation.mutate(content);
    };

    const updateField = (path: string, value: string) => {
        if (!content) return;
        const keys = path.split('.');
        const newContent = { ...content };
        let current: any = newContent;
        for (let i = 0; i < keys.length - 1; i++) {
            current[keys[i]] = { ...current[keys[i]] };
            current = current[keys[i]];
        }
        current[keys[keys.length - 1]] = value;
        setContent(newContent);
    };

    if (isLoading) return <div className="flex h-48 items-center justify-center"><Loader2 className="h-6 w-6 animate-spin" /></div>;

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <Card>
                <CardHeader><CardTitle>Hero Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.hero?.heading || ""} onChange={(e) => updateField('hero.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Subheading</Label>
                        <Textarea value={content?.hero?.subheading || ""} onChange={(e) => updateField('hero.subheading', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Contact Info Section</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={content?.contact_info?.heading || ""} onChange={(e) => updateField('contact_info.heading', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description (supports HTML)</Label>
                        <Textarea rows={3} value={content?.contact_info?.description || ""} onChange={(e) => updateField('contact_info.description', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Address</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Address Line 1</Label>
                        <Input value={content?.address?.line1 || ""} onChange={(e) => updateField('address.line1', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Address Line 2</Label>
                        <Input value={content?.address?.line2 || ""} onChange={(e) => updateField('address.line2', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Address Line 3</Label>
                        <Input value={content?.address?.line3 || ""} onChange={(e) => updateField('address.line3', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Business Hours</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Weekdays</Label>
                        <Input value={content?.business_hours?.weekdays || ""} onChange={(e) => updateField('business_hours.weekdays', e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Sunday</Label>
                        <Input value={content?.business_hours?.sunday || ""} onChange={(e) => updateField('business_hours.sunday', e.target.value)} />
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader><CardTitle>Other</CardTitle></CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <Label>Map Section Heading</Label>
                        <Input value={content?.map_heading || ""} onChange={(e) => setContent({ ...content!, map_heading: e.target.value })} />
                    </div>
                    <div className="space-y-2">
                        <Label>Form Heading</Label>
                        <Input value={content?.form_heading || ""} onChange={(e) => setContent({ ...content!, form_heading: e.target.value })} />
                    </div>
                </CardContent>
            </Card>

            <Button type="submit" disabled={mutation.isPending} className="w-full">
                {mutation.isPending ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Save className="mr-2 h-4 w-4" />}
                Save Contact Page
            </Button>
        </form>
    );
};
