import { useState, useEffect } from "react";
import Layout from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { cmsService, Blog } from "@/services/cms";
import SEO from "@/components/SEO";
import { Loader2 } from "lucide-react";

const BlogList = () => {
    const [blogs, setBlogs] = useState<Blog[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetch = async () => {
            const { data } = await cmsService.getBlogs(true);
            setBlogs(data || []);
            setLoading(false);
        };
        fetch();
    }, []);

    return (
        <Layout>
            <SEO title="Blog | Dipak Steel Furniture" description="Latest news and updates from Dipak Steel Furniture." />

            <div className="bg-primary/5 py-12">
                <div className="container">
                    <h1 className="text-4xl font-bold mb-4">Our Blog</h1>
                    <p className="text-lg text-muted-foreground">Insights, tips, and updates about office furniture.</p>
                </div>
            </div>

            <div className="container py-12">
                {loading ? <Loader2 className="animate-spin mx-auto" /> : (
                    <div className="grid md:grid-cols-3 gap-8">
                        {blogs.map(blog => (
                            <Link key={blog.id} to={`/blog/${blog.slug}`} className="group block bg-white border rounded-lg overflow-hidden hover:shadow-lg transition-all">
                                {blog.featured_image && (
                                    <div className="aspect-video w-full overflow-hidden">
                                        <img src={blog.featured_image} alt={blog.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                    </div>
                                )}
                                <div className="p-6">
                                    <h2 className="text-xl font-bold group-hover:text-primary transition-colors mb-2">{blog.title}</h2>
                                    <p className="text-sm text-gray-500">{new Date(blog.created_at).toLocaleDateString()}</p>
                                </div>
                            </Link>
                        ))}
                        {blogs.length === 0 && <p className="text-muted-foreground">No posts found.</p>}
                    </div>
                )}
            </div>
        </Layout>
    );
};

export default BlogList;
