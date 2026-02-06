import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useParams } from "react-router-dom";
import { cmsService, SeoPage } from "@/services/cms";
import SEO from "@/components/SEO";
import { Loader2 } from "lucide-react";
import NotFound from "./NotFound";

const SeoPageTemplate = () => {
    const { slug } = useParams<{ slug: string }>();
    const [page, setPage] = useState<SeoPage | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            // Avoid fetching for reserved routes if they slip through
            // The router order in App.tsx handles this, but good safety check
            if (!slug) return;
            const { data } = await cmsService.getSeoPageBySlug(slug);
            setPage(data);
            setLoading(false);
        };
        fetch();
    }, [slug]);

    if (loading) return <Layout><div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div></Layout>;
    if (!page) return <NotFound />; // Render standard 404 if slug doesn't match an SEO page

    return (
        <Layout>
            <SEO
                title={page.meta_title || page.heading}
                description={page.meta_description || ""}
            />

            <div className="bg-primary/5 py-16">
                <div className="container">
                    <h1 className="text-4xl md:text-5xl font-bold mb-4">{page.heading}</h1>
                </div>
            </div>

            <div className="container py-12">
                <div
                    className="prose prose-lg max-w-none"
                    dangerouslySetInnerHTML={{ __html: page.content }}
                />
            </div>
        </Layout>
    );
};

export default SeoPageTemplate;
