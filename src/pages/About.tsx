import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Target, Eye, Heart, Award, Users, Lightbulb, ArrowRight, Phone, MessageCircle } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cmsPagesService, AboutPageContent } from "@/services/cmsPages";

// Default content for fallback
const defaultContent: AboutPageContent = {
  hero: {
    heading: "About Dipak Furniture – Office Furniture Manufacturer Since 1998",
    subheading: "Crafting premium office and institutional furniture for Indian workspaces for over 25 years."
  },
  who_we_are: {
    heading: "Who We Are",
    paragraph1: "<strong>Dipak Furniture</strong> is a leading <strong>office furniture manufacturer in Ahmedabad</strong>, Gujarat, with over 25 years of experience in crafting premium quality furniture for offices, educational institutions, healthcare facilities, and government organizations across India. As a trusted <strong>office chair manufacturer</strong>, we specialize in ergonomic seating solutions designed for comfort during long working hours.",
    paragraph2: "Our state-of-the-art manufacturing facility combines traditional craftsmanship with modern technology to produce furniture that meets the highest standards of quality, durability, and comfort. Every piece that leaves our factory undergoes rigorous quality checks to ensure it meets our exacting standards. We are proud to be a <strong>wholesale office furniture supplier</strong> serving businesses of all sizes.",
    paragraph3: "We believe that great furniture can transform spaces and improve productivity. That's why we focus on ergonomic design, premium materials, and attention to detail in everything we create. Whether you need <strong>executive office chairs</strong>, <strong>mesh task chairs</strong>, <strong>steel almirahs</strong>, or <strong>school furniture</strong>, Dipak Furniture has you covered."
  },
  vision: {
    title: "Our Vision",
    description: "To be India's most trusted office furniture brand, known for transforming workspaces with ergonomic, sustainable, and beautifully designed furniture that enhances productivity and well-being."
  },
  mission: {
    title: "Our Mission",
    description: "To design and manufacture furniture that combines comfort, durability, and aesthetics while maintaining affordable pricing and exceptional customer service. We aim to support Indian businesses with products made for Indian workspaces."
  },
  core_values: [
    { title: "Integrity", description: "Honest dealings and transparent business practices in every interaction." },
    { title: "Quality", description: "Uncompromising standards in materials, craftsmanship, and finish." },
    { title: "Customer Focus", description: "Your satisfaction is our primary measure of success." },
    { title: "Innovation", description: "Continuously improving designs for better comfort and functionality." }
  ],
  manufacturing: {
    heading: "Manufacturing Excellence in Ahmedabad",
    description: "Our manufacturing facility in Ahmedabad is equipped with modern machinery and staffed by skilled craftsmen who bring decades of experience to every piece of furniture. We use premium-grade materials sourced from trusted suppliers, ensuring durability and longevity in all our products.",
    stats: [
      { value: "25+", label: "Years of Experience" },
      { value: "10,000+", label: "Satisfied Clients" },
      { value: "50,000+", label: "Products Delivered" }
    ]
  },
  cta: {
    heading: "Ready to Furnish Your Workspace?",
    subheading: "Contact us for personalized recommendations and competitive quotes on bulk orders."
  }
};

// Icons for core values
const valueIcons = [Heart, Award, Users, Lightbulb];

// Helper function to safely handle arrays that might be null/undefined
const safeArray = <T,>(arr: T[] | null | undefined): T[] => {
  return Array.isArray(arr) ? arr : [];
};

const About = () => {
  const { data: cmsContent, isLoading } = useQuery({
    queryKey: ['cms-page', 'about_page'],
    queryFn: () => cmsPagesService.getPageContent<AboutPageContent>('about_page')
  });

  // Merge CMS content with defaults (CMS overrides defaults where present)
  const content: AboutPageContent = {
    hero: { ...defaultContent.hero, ...cmsContent?.hero },
    who_we_are: { ...defaultContent.who_we_are, ...cmsContent?.who_we_are },
    vision: { ...defaultContent.vision, ...cmsContent?.vision },
    mission: { ...defaultContent.mission, ...cmsContent?.mission },
    core_values: safeArray(cmsContent?.core_values).length > 0 ? cmsContent!.core_values : defaultContent.core_values,
    manufacturing: {
      ...defaultContent.manufacturing,
      ...cmsContent?.manufacturing,
      stats: safeArray(cmsContent?.manufacturing?.stats).length > 0 ? cmsContent!.manufacturing.stats : defaultContent.manufacturing.stats
    },
    cta: { ...defaultContent.cta, ...cmsContent?.cta }
  };

  // Loading state
  if (isLoading) {
    return (
      <Layout>
        <div className="flex min-h-[60vh] items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <SEOHead
        title="About Dipak Furniture | Office Furniture Manufacturer Ahmedabad Since 1998"
        description="Learn about Dipak Furniture, a leading office furniture manufacturer in Ahmedabad, Gujarat with 25+ years of experience. We manufacture ergonomic office chairs, steel almirahs, school furniture &amp; institutional seating."
        keywords="about dipak furniture, office furniture manufacturer ahmedabad, furniture company ahmedabad, office chair manufacturer india, institutional furniture supplier"
      />

      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              {content.hero?.heading || ""}
            </h1>
            <p className="text-lg text-primary-foreground/80">
              {content.hero?.subheading || ""}
            </p>
          </div>
        </div>
      </section>

      {/* Who We Are */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl">
            <h2 className="mb-6 text-3xl font-bold text-foreground">{content.who_we_are?.heading || ""}</h2>
            <div className="space-y-4 text-muted-foreground">
              <p dangerouslySetInnerHTML={{ __html: content.who_we_are?.paragraph1 || "" }} />
              <p dangerouslySetInnerHTML={{ __html: content.who_we_are?.paragraph2 || "" }} />
              <p dangerouslySetInnerHTML={{ __html: content.who_we_are?.paragraph3 || "" }} />
            </div>

            {/* Internal Links */}
            <div className="mt-8 flex flex-wrap gap-3">
              <Link to="/products/executive-chairs" className="text-accent hover:underline">Executive Chairs</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/products/task-chairs" className="text-accent hover:underline">Task Chairs</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/products/almirahs" className="text-accent hover:underline">Steel Almirahs</Link>
              <span className="text-muted-foreground">•</span>
              <Link to="/products/school-furniture" className="text-accent hover:underline">School Furniture</Link>
            </div>
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-12 md:grid-cols-2">
            {/* Vision */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Eye className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">{content.vision?.title || ""}</h3>
              <p className="text-muted-foreground">
                {content.vision?.description || ""}
              </p>
            </div>

            {/* Mission */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Target className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">{content.mission?.title || ""}</h3>
              <p className="text-muted-foreground">
                {content.mission?.description || ""}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">Our Core Values</h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              The principles that guide every decision we make and every product
              we create.
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {safeArray(content.core_values).map((value, index) => {
              const IconComponent = valueIcons[index] || Heart;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 text-center"
                >
                  <div className="mx-auto mb-4 inline-flex h-14 w-14 items-center justify-center rounded-full bg-accent/10 text-accent">
                    <IconComponent className="h-7 w-7" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {value?.title || ""}
                  </h3>
                  <p className="text-sm text-muted-foreground">{value?.description || ""}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Manufacturing Excellence */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <h2 className="mb-6 text-3xl font-bold text-primary-foreground">
              {content.manufacturing?.heading || ""}
            </h2>
            <p className="mb-8 text-primary-foreground/80">
              {content.manufacturing?.description || ""}
            </p>
            <div className="grid gap-6 text-center sm:grid-cols-3">
              {safeArray(content.manufacturing?.stats).map((stat, index) => (
                <div key={index}>
                  <p className="text-4xl font-bold text-accent">{stat?.value || ""}</p>
                  <p className="text-primary-foreground/70">{stat?.label || ""}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-accent-foreground md:text-3xl">
            {content.cta?.heading || ""}
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-accent-foreground/80">
            {content.cta?.subheading || ""}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4">
            <Link
              to="/contact"
              className="inline-flex items-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground transition-colors hover:bg-primary/90"
            >
              Get a Quote
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="tel:+919824044585"
              className="inline-flex items-center gap-2 rounded-lg border border-accent-foreground/30 bg-transparent px-6 py-3 font-medium text-accent-foreground transition-colors hover:bg-accent-foreground/10"
            >
              <Phone className="h-4 w-4" />
              +91 98240 44585
            </a>
            <a
              href="https://wa.me/919824044585"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-lg bg-[#25D366] px-6 py-3 font-medium text-white transition-colors hover:bg-[#25D366]/90"
            >
              <MessageCircle className="h-4 w-4" />
              WhatsApp
            </a>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default About;
