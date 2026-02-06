import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { ArrowRight, Phone, Loader2 } from "lucide-react";
import Layout from "@/components/layout/Layout";
import Hero from "@/components/home/Hero";
import CategoryTiles from "@/components/home/CategoryTiles";
import CustomerReviews from "@/components/home/CustomerReviews";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import FAQSection from "@/components/home/FAQSection";
import SEOHead from "@/components/seo/SEOHead";
import { cmsService } from "@/services/cms";

const Index = () => {
  // Fetch CMS data from database
  const { data: cmsData, isLoading } = useQuery({
    queryKey: ['homepage-cms-data'],
    queryFn: cmsService.getHomepageData
  });

  return (
    <Layout>
      <SEOHead
        title="Office Furniture Manufacturer in Ahmedabad – Dipak Furniture"
        description="Dipak Furniture is a leading office furniture manufacturer in Ahmedabad, Gujarat. Buy ergonomic office chairs, executive chairs, steel almirahs, school furniture & institutional seating at factory-direct prices. 25+ years of trusted quality."
        keywords="office furniture manufacturer ahmedabad, office chair manufacturer ahmedabad, office furniture shop ahmedabad, ergonomic office chairs india, steel almirah manufacturer, school furniture manufacturer, office furniture near me"
        canonicalUrl="https://dipaksteelfurniture.lovable.app"
      />

      {/* Hero Section - Dynamic from CMS */}
      <Hero />

      {/* Categories from DB */}
      <CategoryTiles />

      {/* About Section for SEO */}
      <section className="py-16 md:py-24 bg-secondary/30">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-foreground md:text-4xl text-center">
              {cmsData?.about?.title || "Leading Office Furniture Manufacturer in Ahmedabad"}
            </h2>
            <div className="space-y-4 text-muted-foreground text-center md:text-left">
              <p>
                {cmsData?.about?.description || (
                  <>
                    <strong>Dipak Furniture</strong> is a trusted <strong>office furniture manufacturer in Ahmedabad</strong>, Gujarat with over 25 years of experience in crafting premium quality furniture for offices, institutions, and commercial spaces across India. As a leading <strong>office chair manufacturer in Ahmedabad</strong>, we specialize in ergonomic seating solutions designed for comfort during long working hours.
                  </>
                )}
              </p>
            </div>
            <div className="mt-8 flex flex-wrap justify-center gap-4">
              <Link
                to={cmsData?.about?.button_link || "/products"}
                className="inline-flex items-center gap-2 rounded-lg bg-accent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent/90"
              >
                {cmsData?.about?.button_text || "Browse All Products"}
                <ArrowRight className="h-4 w-4" />
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center gap-2 rounded-lg border border-accent px-6 py-3 font-medium text-accent transition-colors hover:bg-accent hover:text-accent-foreground"
              >
                Learn About Us
              </Link>
            </div>
          </div>
        </div>
      </section>

      <WhyChooseUs features={cmsData?.features} />
      <CustomerReviews testimonials={cmsData?.testimonials} />
      <FAQSection faqs={cmsData?.faq} />

      {/* CTA Section - Dynamic from CMS */}
      <section className="bg-accent py-16 md:py-20">
        <div className="container text-center">
          <h2 className="mb-4 text-3xl font-bold text-accent-foreground md:text-4xl">
            {cmsData?.cta?.title || "Ready to Transform Your Workspace?"}
          </h2>
          <p className="mx-auto mb-8 max-w-2xl text-accent-foreground/80">
            {cmsData?.cta?.description || "Get in touch with our team for personalized recommendations and competitive quotes on bulk orders. As a leading office furniture manufacturer in Ahmedabad, we deliver quality furniture at factory-direct prices."}
          </p>
          <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
            <Button
              asChild
              size="lg"
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              <Link to={cmsData?.cta?.button_link || "/contact"}>
                {cmsData?.cta?.button_text || "Get a Free Quote"}
                <ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
            <Button
              asChild
              variant="outline"
              size="lg"
              className="border-accent-foreground/30 bg-transparent text-accent-foreground hover:bg-accent-foreground/10"
            >
              <a href="tel:+919824044585">
                <Phone className="mr-2 h-4 w-4" />
                Call Now: +91 98240 44585
              </a>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Index;
