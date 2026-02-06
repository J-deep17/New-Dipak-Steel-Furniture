import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Leaf, Activity, Sparkles, Building2 } from "lucide-react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { cmsPagesService, PhilosophyPageContent } from "@/services/cmsPages";

// Default content for fallback
const defaultContent: PhilosophyPageContent = {
  hero: {
    heading: "Our Design Philosophy – Ergonomic Office Furniture",
    subheading: "Where sustainability meets ergonomics for smarter, healthier workspaces. Office furniture designed for <strong>long working hours</strong>."
  },
  eco_ergo: {
    description: "Our design philosophy combines eco-friendly materials with ergonomic engineering to create furniture that's good for you and good for the planet. The <strong>best ergonomic office chairs</strong> for Indian workplaces."
  },
  eco_design: {
    heading: "Eco-Conscious Design",
    points: [
      "Sustainable materials sourced from responsible suppliers",
      "Low-VOC finishes and environmentally safe adhesives",
      "Durable construction that reduces replacement frequency",
      "Recyclable components and minimal packaging waste"
    ]
  },
  ergo_design: {
    heading: "Ergonomic Excellence – Best Office Chairs for Long Hours",
    points: [
      "Scientifically designed for proper posture support",
      "Adjustable features to accommodate different body types",
      "Lumbar support and pressure distribution for all-day comfort",
      "Reduces fatigue and prevents work-related strain injuries"
    ]
  },
  indian_workspaces: {
    heading: "Designed for Indian Workspaces",
    paragraph1: "Indian offices face unique challenges – varied climate conditions, diverse body types, and the need for furniture that withstands heavy use while remaining budget-friendly.",
    paragraph2: "Our <strong>ergonomic office chairs</strong> are specifically engineered for these conditions. From the humidity-resistant finishes to the robust construction that handles high-traffic environments, every detail is considered for the Indian workplace.",
    paragraph3: "Whether it's a startup in Bangalore, a school in Bihar, or a corporate office in Mumbai – our furniture is built to perform in any Indian setting.",
    stats: [
      { value: "28+", label: "States Served" },
      { value: "All Climates", label: "Tested & Proven" },
      { value: "ISO", label: "Quality Standards" },
      { value: "5 Year", label: "Warranty Support" }
    ]
  }
};

const Philosophy = () => {
  const { data: cmsContent } = useQuery({
    queryKey: ['cms-page', 'philosophy_page'],
    queryFn: () => cmsPagesService.getPageContent<PhilosophyPageContent>('philosophy_page')
  });

  // Use CMS content or fallback to default
  const content = cmsContent || defaultContent;

  return (
    <Layout>
      <SEOHead
        title="Design Philosophy | Ergonomic Office Furniture | Dipak Furniture Ahmedabad"
        description="Learn about Dipak Furniture's design philosophy combining eco-friendly materials with ergonomic engineering. Office chairs designed for long working hours and Indian workspaces."
        keywords="ergonomic office furniture, eco-friendly furniture, sustainable office chairs, ergonomic design, office furniture for long hours, best ergonomic chairs india"
      />

      {/* Hero Section */}
      <section className="bg-primary py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-3xl text-center">
            <h1 className="mb-4 text-4xl font-bold text-primary-foreground md:text-5xl">
              {content.hero.heading}
            </h1>
            <p className="text-lg text-primary-foreground/80" dangerouslySetInnerHTML={{ __html: content.hero.subheading }} />
          </div>
        </div>
      </section>

      {/* ECO + ERGO = SMART COMFORT */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mx-auto max-w-4xl text-center">
            <div className="mb-8 flex flex-wrap items-center justify-center gap-4 text-3xl font-bold md:text-5xl">
              <span className="inline-flex items-center gap-2 rounded-xl bg-green-100 px-4 py-2 text-green-700">
                <Leaf className="h-8 w-8" />
                ECO
              </span>
              <span className="text-muted-foreground">+</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-blue-100 px-4 py-2 text-blue-700">
                <Activity className="h-8 w-8" />
                ERGO
              </span>
              <span className="text-muted-foreground">=</span>
              <span className="inline-flex items-center gap-2 rounded-xl bg-accent/20 px-4 py-2 text-accent">
                <Sparkles className="h-8 w-8" />
                SMART COMFORT
              </span>
            </div>
            <p className="text-lg text-muted-foreground" dangerouslySetInnerHTML={{ __html: content.eco_ergo.description }} />
          </div>
        </div>
      </section>

      {/* Pillars */}
      <section className="bg-secondary/50 py-16 md:py-24">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2">
            {/* ECO */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-green-100 text-green-600">
                <Leaf className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                {content.eco_design.heading}
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                {content.eco_design.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-green-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* ERGO */}
            <div className="rounded-xl border border-border bg-card p-8">
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-blue-100 text-blue-600">
                <Activity className="h-7 w-7" />
              </div>
              <h3 className="mb-4 text-2xl font-bold text-foreground">
                {content.ergo_design.heading}
              </h3>
              <ul className="space-y-3 text-muted-foreground">
                {content.ergo_design.points.map((point, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="mt-1.5 h-2 w-2 shrink-0 rounded-full bg-blue-500" />
                    <span>{point}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Built for Indian Workspaces */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="grid items-center gap-12 lg:grid-cols-2">
            <div>
              <div className="mb-4 inline-flex h-14 w-14 items-center justify-center rounded-lg bg-accent/10 text-accent">
                <Building2 className="h-7 w-7" />
              </div>
              <h2 className="mb-6 text-3xl font-bold text-foreground">
                {content.indian_workspaces.heading}
              </h2>
              <div className="space-y-4 text-muted-foreground">
                <p>{content.indian_workspaces.paragraph1}</p>
                <p dangerouslySetInnerHTML={{ __html: content.indian_workspaces.paragraph2 }} />
                <p>{content.indian_workspaces.paragraph3}</p>
              </div>

              {/* Internal Links */}
              <div className="mt-6 flex flex-wrap gap-3">
                <Link to="/products/executive-chairs" className="text-accent hover:underline">Executive Chairs →</Link>
                <Link to="/products/task-chairs" className="text-accent hover:underline">Mesh Chairs →</Link>
              </div>
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              {content.indian_workspaces.stats.map((stat, index) => (
                <div key={index} className="rounded-xl bg-secondary p-6 text-center">
                  <p className="text-3xl font-bold text-accent">{stat.value}</p>
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Philosophy;
