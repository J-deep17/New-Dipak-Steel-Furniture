import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { useParams } from "react-router-dom";
import { cmsService, Blog } from "@/services/cms";
import SEO from "@/components/SEO";
import { Loader2 } from "lucide-react";

const BlogDetail = () => {
    const { slug } = useParams<{ slug: string }>();
    const [blog, setBlog] = useState<Blog | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            if (!slug) return;
            const { data } = await cmsService.getBlogBySlug(slug);
            setBlog(data);
            setLoading(false);
        };
        fetch();
    }, [slug]);

    if (loading) return <Layout><div className="h-screen flex items-center justify-center"><Loader2 className="animate-spin" /></div></Layout>;
    if (!blog) return <Layout><div className="py-20 text-center"><h1>Post Not Found</h1></div></Layout>;

    return (
        <Layout>
            <SEO
                title={blog.meta_title || blog.title}
                description={blog.meta_description || ""}
                ogImage={blog.featured_image}
                ogType="article"
            />

            <article className="max-w-4xl mx-auto py-12 px-4">
                <h1 className="text-4xl md:text-5xl font-bold mb-6">{blog.title}</h1>
                <p className="text-muted-foreground mb-8">Published on {new Date(blog.created_at).toLocaleDateString()}</p>

                {blog.featured_image && (
                    <img src={blog.featured_image} alt={blog.title} className="w-full rounded-xl mb-10 shadow-lg" />
                )}

                <div
                    className="prose prose-lg max-w-none prose-img:rounded-lg prose-a:text-primary"
                    dangerouslySetInnerHTML={{ __html: blog.content }}
                />
            </article>
        </Layout>
    );
};

export default BlogDetail;
