import { useParams } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { legalService } from "@/services/legal";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";

const LegalPage = () => {
    const { slug } = useParams<{ slug: string }>();

    const { data: page, isLoading, error } = useQuery({
        queryKey: ['legal-page', slug],
        queryFn: () => legalService.getPageBySlug(slug!),
        enabled: !!slug
    });

    useEffect(() => {
        if (page) {
            document.title = `${page.title} | SteelShow Digital`;
            const metaDescription = document.querySelector('meta[name="description"]');
            if (metaDescription) {
                metaDescription.setAttribute('content', `Read our ${page.title} at SteelShow Digital.`);
            } else {
                const meta = document.createElement('meta');
                meta.name = "description";
                meta.content = `Read our ${page.title} at SteelShow Digital.`;
                document.head.appendChild(meta);
            }
        }
    }, [page]);

    if (isLoading) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 flex items-center justify-center">
                    <Loader2 className="h-8 w-8 animate-spin text-primary" />
                </main>
                <Footer />
            </div>
        );
    }

    if (error || !page) {
        return (
            <div className="flex flex-col min-h-screen">
                <Header />
                <main className="flex-1 container mx-auto px-4 py-16 text-center">
                    <h1 className="text-4xl font-bold mb-4">404</h1>
                    <p className="text-xl text-muted-foreground">Page not found</p>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="flex flex-col min-h-screen">
            <Header />

            <main className="flex-1 container mx-auto px-4 py-8 md:py-16 max-w-4xl">
                <article className="prose prose-blue max-w-none">
                    <h1 className="text-3xl md:text-4xl font-bold mb-8">{page.title}</h1>
                    <div
                        className="html-content"
                        dangerouslySetInnerHTML={{ __html: page.content || "" }}
                    />
                </article>
            </main>

            <Footer />
        </div>
    );
};

export default LegalPage;
