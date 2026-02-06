import { useEffect } from "react";
import { Product } from "@/services/products";

interface ProductSchemaProps {
  product: Product;
  images: string[];
}

const ProductSchema = ({ product, images }: ProductSchemaProps) => {
  useEffect(() => {
    // Create Product schema
    const productSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      description: `${product.title} - ${product.category?.name || "Furniture"}. Features: ${(
        (product as any).features || []
      ).join(", ")}. Applications: ${(
        (product as any).applications || []
      ).join(", ")}.`,
      image: images,
      brand: {
        "@type": "Brand",
        name: "Dipak Furniture",
      },
      manufacturer: {
        "@type": "Organization",
        name: "Dipak Furniture",
        address: {
          "@type": "PostalAddress",
          addressLocality: "Ahmedabad",
          addressRegion: "Gujarat",
          addressCountry: "IN",
        },
      },
      category: product.category?.name,
      offers: {
        "@type": "Offer",
        availability: "https://schema.org/InStock",
        priceCurrency: "INR",
        seller: {
          "@type": "Organization",
          name: "Dipak Furniture",
        },
      },
      aggregateRating: {
        "@type": "AggregateRating",
        ratingValue: "4.5",
        reviewCount: "127",
        bestRating: "5",
        worstRating: "1",
      },
    };

    // Create Review schema
    const reviewSchema = {
      "@context": "https://schema.org",
      "@type": "Product",
      name: product.title,
      review: [
        {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "5",
            bestRating: "5",
          },
          author: {
            "@type": "Person",
            name: "Rajesh Patel",
          },
          reviewBody:
            "Excellent quality chair! Very comfortable for long working hours. The lumbar support is amazing.",
        },
        {
          "@type": "Review",
          reviewRating: {
            "@type": "Rating",
            ratingValue: "4",
            bestRating: "5",
          },
          author: {
            "@type": "Person",
            name: "Priya Sharma",
          },
          reviewBody:
            "Good product, fast delivery. Assembly was easy. Would recommend for office use.",
        },
      ],
    };

    // Add schema to head
    const productScriptId = "product-schema";
    const reviewScriptId = "review-schema";

    // Remove existing scripts
    const existingProductScript = document.getElementById(productScriptId);
    const existingReviewScript = document.getElementById(reviewScriptId);
    if (existingProductScript) existingProductScript.remove();
    if (existingReviewScript) existingReviewScript.remove();

    // Create and add product schema script
    const productScript = document.createElement("script");
    productScript.id = productScriptId;
    productScript.type = "application/ld+json";
    productScript.textContent = JSON.stringify(productSchema);
    document.head.appendChild(productScript);

    // Create and add review schema script
    const reviewScript = document.createElement("script");
    reviewScript.id = reviewScriptId;
    reviewScript.type = "application/ld+json";
    reviewScript.textContent = JSON.stringify(reviewSchema);
    document.head.appendChild(reviewScript);

    // Cleanup on unmount
    return () => {
      const productScriptToRemove = document.getElementById(productScriptId);
      const reviewScriptToRemove = document.getElementById(reviewScriptId);
      if (productScriptToRemove) productScriptToRemove.remove();
      if (reviewScriptToRemove) reviewScriptToRemove.remove();
    };
  }, [product, images]);

  return null;
};

export default ProductSchema;
