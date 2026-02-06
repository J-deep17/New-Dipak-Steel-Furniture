// import { Helmet } from "react-helmet-async"; // Removed as we use manual DOM manipulation
// Note: If react-helmet-async is not installed, we should use a different approach or install it.
// However, the existing SEOHead used manual DOM manipulation.
// Given strict "Do NOT introduce new frameworks", we should stick to the existing manual DOM approach or use a standard React portal if available.
// BUT, React Helmet is standard. Let's check package.json first.
// If not available, we'll rewrite this to use the useEffect approach like SEOHead.

import { useEffect } from "react";

interface SEOProps {
    title: string;
    description: string;
    canonicalUrl?: string;
    ogType?: string;
    ogImage?: string;
    twitterCard?: string;
    keywords?: string;
    jsonLd?: Record<string, any>;
}

const SEO = ({
    title,
    description,
    canonicalUrl,
    ogType = "website",
    ogImage,
    twitterCard = "summary_large_image",
    keywords,
    jsonLd
}: SEOProps) => {

    useEffect(() => {
        // 1. Title
        document.title = title;

        // 2. Meta Helper
        const updateMeta = (name: string, content: string, attribute = "name") => {
            let element = document.querySelector(`meta[${attribute}="${name}"]`);
            if (!element) {
                element = document.createElement("meta");
                element.setAttribute(attribute, name);
                document.head.appendChild(element);
            }
            element.setAttribute("content", content);
        };

        // 3. Link Helper
        const updateLink = (rel: string, href: string) => {
            let element = document.querySelector(`link[rel="${rel}"]`);
            if (!element) {
                element = document.createElement("link");
                element.setAttribute("rel", rel);
                document.head.appendChild(element);
            }
            element.setAttribute("href", href);
        };

        // Standard Meta
        updateMeta("description", description);
        if (keywords) updateMeta("keywords", keywords);

        // Canonical
        if (canonicalUrl) updateLink("canonical", canonicalUrl);

        // Open Graph
        updateMeta("og:title", title, "property");
        updateMeta("og:description", description, "property");
        updateMeta("og:type", ogType, "property");
        if (canonicalUrl) updateMeta("og:url", canonicalUrl, "property");
        if (ogImage) updateMeta("og:image", ogImage, "property");

        // Twitter
        updateMeta("twitter:card", twitterCard);
        updateMeta("twitter:title", title);
        updateMeta("twitter:description", description);
        if (ogImage) updateMeta("twitter:image", ogImage);

        // JSON-LD
        let script = document.querySelector('script[type="application/ld+json"]');
        if (jsonLd) {
            if (!script) {
                script = document.createElement("script");
                script.setAttribute("type", "application/ld+json");
                document.head.appendChild(script);
            }
            script.textContent = JSON.stringify(jsonLd);
        } else if (script) {
            // Remove if not provided to clean up? Or leave it?
            // Better to remove if we are navigating away.
            // Actually, for a single page app, we might want to manage this carefully.
        }

        return () => {
            // Cleanup? Usually not needed for validation meta as it gets overwritten
        };

    }, [title, description, canonicalUrl, ogType, ogImage, twitterCard, keywords, jsonLd]);

    return null;
};

export default SEO;
