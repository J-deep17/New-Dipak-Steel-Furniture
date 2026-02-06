import { useState, useEffect } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { cmsPagesService, PageKey, PageContent, AboutPageContent, PhilosophyPageContent, MaterialsPageContent, QualityPageContent, ContactPageContent, HomePageContent } from "@/services/cmsPages";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Save, Loader2 } from "lucide-react";

// Generic Editor Component
const GenericPageEditor = <T extends PageContent>({
    pageKey,
    title,
    defaultContent,
    renderFields
}: {
    pageKey: PageKey;
    title: string;
    defaultContent: T;
    renderFields: (content: T, handleChange: (path: string, value: any) => void) => React.ReactNode;
}) => {
    const queryClient = useQueryClient();
    const [content, setContent] = useState<T>(defaultContent);

    // Fetch Content
    const { data, isLoading } = useQuery({
        queryKey: ['cms-page', pageKey],
        queryFn: () => cmsPagesService.getPageContent<T>(pageKey),
    });

    // Update local state when data loads
    useEffect(() => {
        if (data) {
            setContent(data);
        }
    }, [data]);

    // Mutation
    const mutation = useMutation({
        mutationFn: (newContent: T) => cmsPagesService.upsertPageContent(pageKey, newContent),
        onSuccess: () => {
            toast.success(`${title} saved successfully`);
            queryClient.invalidateQueries({ queryKey: ['cms-page', pageKey] });
        },
        onError: () => toast.error(`Failed to save ${title}`)
    });

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        mutation.mutate(content);
    };

    const handleChange = (path: string, value: any) => {
        setContent(prev => {
            const newContent = { ...prev };
            const keys = path.split('.');
            let current: any = newContent;
            for (let i = 0; i < keys.length - 1; i++) {
                if (!current[keys[i]]) current[keys[i]] = {};
                current = current[keys[i]];
            }
            current[keys[keys.length - 1]] = value;
            return newContent;
        });
    };

    if (isLoading) return <div className="p-4"><Loader2 className="animate-spin" /> Loading...</div>;

    return (
        <Card>
            <CardHeader>
                <CardTitle>{title}</CardTitle>
            </CardHeader>
            <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                    {renderFields(content, handleChange)}
                    <Button type="submit" disabled={mutation.isPending}>
                        {mutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Save Changes
                    </Button>
                </form>
            </CardContent>
        </Card>
    );
};

// --- Page Editors ---

export const HomePageEditor = () => (
    <GenericPageEditor<HomePageContent>
        pageKey="home_page"
        title="Home Page Content"
        defaultContent={{
            seo: { title: "", description: "" },
            hero_section: { title: "", subtitle: "" },
            welcome_section: { heading: "", description: "" }
        }}
        renderFields={(c, h) => (
            <>
                <div className="space-y-4 border p-4 rounded">
                    <h3 className="font-semibold">SEO Utils</h3>
                    <div className="space-y-2">
                        <Label>Meta Title</Label>
                        <Input value={c.seo?.title || ""} onChange={e => h("seo.title", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Meta Description</Label>
                        <Textarea value={c.seo?.description || ""} onChange={e => h("seo.description", e.target.value)} />
                    </div>
                </div>
                <div className="space-y-4 border p-4 rounded">
                    <h3 className="font-semibold">Welcome Section</h3>
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={c.welcome_section?.heading || ""} onChange={e => h("welcome_section.heading", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Description</Label>
                        <Textarea value={c.welcome_section?.description || ""} onChange={e => h("welcome_section.description", e.target.value)} />
                    </div>
                </div>
            </>
        )}
    />
);

export const AboutPageEditor = () => (
    <GenericPageEditor<AboutPageContent>
        pageKey="about_page"
        title="About Page Content"
        defaultContent={{
            hero: { heading: "", subheading: "" },
            who_we_are: { heading: "", paragraph1: "", paragraph2: "", paragraph3: "" },
            vision: { title: "", description: "" },
            mission: { title: "", description: "" },
            core_values: [],
            manufacturing: { heading: "", description: "", stats: [] },
            cta: { heading: "", subheading: "" }
        }}
        renderFields={(c, h) => (
            <>
                <div className="space-y-2">
                    <Label>Hero Heading</Label>
                    <Input value={c.hero?.heading || ""} onChange={e => h("hero.heading", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Hero Subheading</Label>
                    <Textarea value={c.hero?.subheading || ""} onChange={e => h("hero.subheading", e.target.value)} />
                </div>

                <div className="border p-4 rounded space-y-4">
                    <h4 className="font-semibold">Who We Are</h4>
                    <div className="space-y-2">
                        <Label>Heading</Label>
                        <Input value={c.who_we_are?.heading || ""} onChange={e => h("who_we_are.heading", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Paragraph 1</Label>
                        <Textarea value={c.who_we_are?.paragraph1 || ""} onChange={e => h("who_we_are.paragraph1", e.target.value)} />
                    </div>
                    <div className="space-y-2">
                        <Label>Paragraph 2</Label>
                        <Textarea value={c.who_we_are?.paragraph2 || ""} onChange={e => h("who_we_are.paragraph2", e.target.value)} />
                    </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                    <div className="border p-4 rounded space-y-2">
                        <h4 className="font-semibold">Vision</h4>
                        <Input value={c.vision?.title || ""} onChange={e => h("vision.title", e.target.value)} placeholder="Title" />
                        <Textarea value={c.vision?.description || ""} onChange={e => h("vision.description", e.target.value)} placeholder="Description" />
                    </div>
                    <div className="border p-4 rounded space-y-2">
                        <h4 className="font-semibold">Mission</h4>
                        <Input value={c.mission?.title || ""} onChange={e => h("mission.title", e.target.value)} placeholder="Title" />
                        <Textarea value={c.mission?.description || ""} onChange={e => h("mission.description", e.target.value)} placeholder="Description" />
                    </div>
                </div>
            </>
        )}
    />
);

export const PhilosophyPageEditor = () => (
    <GenericPageEditor<PhilosophyPageContent>
        pageKey="philosophy_page"
        title="Philosophy Page Content"
        defaultContent={{
            hero: { heading: "", subheading: "" },
            eco_ergo: { description: "" },
            eco_design: { heading: "", points: [] },
            ergo_design: { heading: "", points: [] },
            indian_workspaces: { heading: "", paragraph1: "", paragraph2: "", paragraph3: "", stats: [] }
        }}
        renderFields={(c, h) => (
            <>
                <div className="space-y-2">
                    <Label>Hero Heading</Label>
                    <Input value={c.hero?.heading || ""} onChange={e => h("hero.heading", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Eco-Ergo Description</Label>
                    <Textarea value={c.eco_ergo?.description || ""} onChange={e => h("eco_ergo.description", e.target.value)} />
                </div>
                <div className="border p-4 rounded space-y-2">
                    <h4 className="font-semibold">Indian Workspaces Section</h4>
                    <Label>Heading</Label>
                    <Input value={c.indian_workspaces?.heading || ""} onChange={e => h("indian_workspaces.heading", e.target.value)} />
                    <Label>Paragraph 1</Label>
                    <Textarea value={c.indian_workspaces?.paragraph1 || ""} onChange={e => h("indian_workspaces.paragraph1", e.target.value)} />
                </div>
            </>
        )}
    />
);

export const MaterialsPageEditor = () => (
    <GenericPageEditor<MaterialsPageContent>
        pageKey="materials_page"
        title="Materials Page Content"
        defaultContent={{
            hero: { heading: "", subheading: "" },
            materials_intro: { heading: "", description: "" },
            cta: { heading: "", subheading: "" }
        }}
        renderFields={(c, h) => (
            <>
                <div className="space-y-2">
                    <Label>Hero Heading</Label>
                    <Input value={c.hero?.heading || ""} onChange={e => h("hero.heading", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Intro Heading</Label>
                    <Input value={c.materials_intro?.heading || ""} onChange={e => h("materials_intro.heading", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Intro Description</Label>
                    <Textarea value={c.materials_intro?.description || ""} onChange={e => h("materials_intro.description", e.target.value)} />
                </div>
            </>
        )}
    />
);

export const QualityPageEditor = () => (
    <GenericPageEditor<QualityPageContent>
        pageKey="quality_page"
        title="Quality Page Content"
        defaultContent={{
            hero: { heading: "", subheading: "" },
            quality_promise: { heading: "", description: "" },
            quality_points: [],
            trust_stats: [],
            testimonials_heading: { heading: "", subheading: "" },
            testimonials: [],
            cta: { heading: "", subheading: "" }
        }}
        renderFields={(c, h) => (
            <>
                <div className="space-y-2">
                    <Label>Hero Heading</Label>
                    <Input value={c.hero?.heading || ""} onChange={e => h("hero.heading", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Promise Heading</Label>
                    <Input value={c.quality_promise?.heading || ""} onChange={e => h("quality_promise.heading", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Promise Description</Label>
                    <Textarea value={c.quality_promise?.description || ""} onChange={e => h("quality_promise.description", e.target.value)} />
                </div>
            </>
        )}
    />
);

export const ContactPageEditor = () => (
    <GenericPageEditor<ContactPageContent>
        pageKey="contact_page"
        title="Contact Page Content"
        defaultContent={{
            hero: { heading: "", subheading: "" },
            contact_info: { heading: "", description: "" },
            address: { line1: "", line2: "", line3: "" },
            business_hours: { weekdays: "", sunday: "" },
            map_heading: "",
            form_heading: ""
        }}
        renderFields={(c, h) => (
            <>
                <div className="space-y-2">
                    <Label>Hero Heading</Label>
                    <Input value={c.hero?.heading || ""} onChange={e => h("hero.heading", e.target.value)} />
                </div>
                <div className="space-y-2">
                    <Label>Contact Info Heading</Label>
                    <Input value={c.contact_info?.heading || ""} onChange={e => h("contact_info.heading", e.target.value)} />
                </div>
                <div className="border p-4 rounded space-y-2">
                    <h4 className="font-semibold">Address</h4>
                    <Input value={c.address?.line1 || ""} onChange={e => h("address.line1", e.target.value)} placeholder="Line 1" />
                    <Input value={c.address?.line2 || ""} onChange={e => h("address.line2", e.target.value)} placeholder="Line 2" />
                    <Input value={c.address?.line3 || ""} onChange={e => h("address.line3", e.target.value)} placeholder="Line 3" />
                </div>
            </>
        )}
    />
);
