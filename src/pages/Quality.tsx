import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";
import {
  Shield,
  CheckCircle,
  Award,
  Truck,
  Clock,
  HeartHandshake,
  ArrowRight,
  Phone,
  MessageCircle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cmsPagesService, QualityPageContent } from "@/services/cmsPages";

// Default CMS content for fallback
const defaultContent: QualityPageContent = {
  hero: {
    heading: "Quality & Trust – Our Manufacturing Promise",
    subheading: "Our commitment to excellence is reflected in every office chair, table, and furniture piece we manufacture. Quality you can trust from Ahmedabad's leading furniture manufacturer."
  },
  quality_promise: {
    heading: "Our Quality Promise",
    description: "From raw materials to final delivery, quality is embedded in every step of our manufacturing process. That's why businesses trust us for their <strong>office furniture</strong> needs."
  },
  quality_points: [
    { title: "Rigorous Testing", description: "Every product undergoes extensive durability and safety testing before leaving our facility." },
    { title: "Quality Control", description: "Multi-stage quality checks ensure consistent standards across all products." },
    { title: "Premium Materials", description: "We source only high-grade materials from trusted suppliers with verified quality." },
    { title: "Safe Delivery", description: "Careful packaging and handling ensure your furniture arrives in perfect condition." },
    { title: "Long Lifespan", description: "Built to last for years with minimal maintenance, reducing replacement costs." },
    { title: "Warranty Support", description: "Comprehensive warranty coverage with responsive after-sales support." }
  ],
  trust_stats: [
    { value: "25+", label: "Years in Business" },
    { value: "10,000+", label: "Happy Clients" },
    { value: "98%", label: "Customer Satisfaction" },
    { value: "5 Years", label: "Warranty Coverage" }
  ],
  testimonials_heading: {
    heading: "What Our Clients Say",
    subheading: "Trusted by offices, schools, hospitals, and institutions across India."
  },
  testimonials: [
    { quote: "Dipak Furniture has been our furniture partner for 10 years. Their quality and service are unmatched in the industry.", author: "Rajesh Sharma", company: "ABC Corporation, Ahmedabad" },
    { quote: "We furnished our entire school with their products. The durability has been exceptional even with heavy student use.", author: "Dr. Meera Patel", company: "Sunshine School, Gandhinagar" },
    { quote: "Professional service from enquiry to delivery. The ergonomic chairs have significantly improved our team's comfort.", author: "Amit Desai", company: "TechStart Solutions, Bangalore" }
  ],
  cta: {
    heading: "Experience the Dipak Furniture Difference",
    subheading: "Join thousands of satisfied clients who trust us for their office furniture needs. Get in touch today for a free quote."
  }
};

// Icons for quality points (fixed mapping)
const qualityIcons = [Shield, CheckCircle, Award, Truck, Clock, HeartHandshake];

const Quality = () => {
  const { data: cmsContent } = useQuery({
    queryKey: ['cms-page', 'quality_page'],
    queryFn: () => cmsPagesService.getPageContent<QualityPageContent>('quality_page')
  });

  // Use CMS content or fallback to default
  const content = cmsContent || defaultContent;

  return (
    <Layout>
      <SEOHead
        title="Quality & Trust | Office Furniture Manufacturer Ahmedabad | Dipak Furniture"
        description="Dipak Furniture maintains strict quality standards in office furniture manufacturing. 25+ years of trusted quality, rigorous testing, premium materials, and 5-year warranty on all products."
        keywords="quality office furniture, trusted furniture manufacturer, office furniture warranty, durable office chairs, premium office furniture india"
      />

      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              {content.hero.heading}
            </h1>
            <p className="text-lg text-primary-foreground/80">
              {content.hero.subheading}
            </p>
          </div>
        </div>
      </section>

      {/* Quality Points */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              {content.quality_promise.heading}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground" dangerouslySetInnerHTML={{ __html: content.quality_promise.description }} />
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {content.quality_points.map((point, index) => {
              const IconComponent = qualityIcons[index] || Shield;
              return (
                <div
                  key={index}
                  className="rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
                >
                  <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent">
                    <IconComponent className="h-6 w-6" />
                  </div>
                  <h3 className="mb-2 text-lg font-semibold text-foreground">
                    {point.title}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {point.description}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Trust Indicators */}
      <section className="bg-secondary/50 py-16">
        <div className="container">
          <h2 className="mb-8 text-2xl font-bold text-foreground text-center">
            Trusted by Businesses Across India
          </h2>
          <div className="grid gap-8 text-center md:grid-cols-4">
            {content.trust_stats.map((stat, index) => (
              <div key={index}>
                <p className="text-4xl font-bold text-accent">{stat.value}</p>
                <p className="text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              {content.testimonials_heading.heading}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {content.testimonials_heading.subheading}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-3">
            {content.testimonials.map((testimonial, index) => (
              <div
                key={index}
                className="rounded-xl border border-border bg-card p-6"
              >
                <p className="mb-4 text-muted-foreground">
                  "{testimonial.quote}"
                </p>
                <div>
                  <p className="font-semibold text-foreground">
                    {testimonial.author}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {testimonial.company}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Browse Products */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h3 className="mb-6 text-xl font-semibold text-foreground text-center">
            Explore Our Quality Office Furniture
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products/executive-chairs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Executive Chairs
            </Link>
            <Link to="/products/task-chairs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Ergonomic Task Chairs
            </Link>
            <Link to="/products/almirahs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Steel Almirahs
            </Link>
            <Link to="/products/school-furniture" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              School Furniture
            </Link>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="bg-accent py-16">
        <div className="container text-center">
          <h2 className="mb-4 text-2xl font-bold text-accent-foreground md:text-3xl">
            {content.cta.heading}
          </h2>
          <p className="mx-auto mb-6 max-w-2xl text-accent-foreground/80">
            {content.cta.subheading}
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
              Call Now
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

export default Quality;
