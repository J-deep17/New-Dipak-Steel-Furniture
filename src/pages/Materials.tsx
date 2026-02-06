import Layout from "@/components/layout/Layout";
import SEOHead from "@/components/seo/SEOHead";
import { Link } from "react-router-dom";
import { ArrowRight, Phone, MessageCircle } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { cmsPagesService, MaterialsPageContent } from "@/services/cmsPages";
import fabricUpholstery from "@/assets/materials/fabric-upholstery.jpg";
import meshBack from "@/assets/materials/mesh-back.jpg";
import leatherette from "@/assets/materials/leatherette.jpg";
import chromeBase from "@/assets/materials/chrome-base.jpg";
import powderCoated from "@/assets/materials/powder-coated.jpg";
import crcaSteel from "@/assets/materials/crca-steel.jpg";

// Static materials data (images and detailed info remain static)
const materials = [
  {
    name: "Fabric Upholstery",
    description:
      "High-quality, breathable fabric options that offer comfort and durability. Available in multiple colors to match your workspace aesthetics. Ideal for executive and task chairs.",
    features: ["Breathable", "Easy to clean", "Stain-resistant options", "Multiple colors"],
    image: fabricUpholstery,
    alt: "Breathable fabric upholstery for ergonomic office chairs - Dipak Furniture",
  },
  {
    name: "Mesh Back – Best for Long Hours",
    description:
      "Advanced mesh technology for superior ventilation and ergonomic support. Perfect for long working hours in warm climates. Our mesh office chairs feature this breathable material.",
    features: ["Maximum airflow", "Flexible support", "Durable weave", "Modern look"],
    image: meshBack,
    alt: "Mesh back material for ergonomic mesh office chairs - Best for long working hours",
  },
  {
    name: "Leatherette – Executive Finish",
    description:
      "Premium synthetic leather that offers the luxurious look of genuine leather with easier maintenance and greater durability. Used in our executive and director chair series.",
    features: ["Executive appearance", "Easy maintenance", "Durable surface", "Water-resistant"],
    image: leatherette,
    alt: "Premium leatherette upholstery for executive office chairs",
  },
  {
    name: "Chrome Base",
    description:
      "Polished chrome-plated steel bases that add a contemporary, premium look while providing sturdy support. Standard in our executive chair collection.",
    features: ["Modern aesthetic", "Corrosion-resistant", "High load capacity", "Easy to clean"],
    image: chromeBase,
    alt: "Chrome base for office chairs - Modern office furniture Ahmedabad",
  },
  {
    name: "Powder-Coated Finish",
    description:
      "Durable powder-coated finish that offers excellent protection against scratches, chips, and environmental wear. Used in our steel almirahs and institutional furniture.",
    features: ["Scratch-resistant", "Multiple colors", "Long-lasting", "Cost-effective"],
    image: powderCoated,
    alt: "Powder-coated finish for steel furniture and almirahs",
  },
  {
    name: "CRCA Steel – Steel Almirah Series",
    description:
      "Cold Rolled Close Annealed steel used in our almirahs and storage solutions, offering superior strength and rust resistance. The hallmark of our steel almirah series.",
    features: ["High strength", "Rust-resistant", "Precise finish", "Long lifespan"],
    image: crcaSteel,
    alt: "CRCA steel for steel almirahs and storage cabinets - Almirah manufacturer Ahmedabad",
  },
];

// Default CMS content for fallback
const defaultContent: MaterialsPageContent = {
  hero: {
    heading: "Premium Materials & Finishes for Office Furniture",
    subheading: "Quality materials and finishes that ensure durability, comfort, and style in every piece we create. From <strong>mesh back office chairs</strong> to <strong>CRCA steel almirahs</strong>."
  },
  materials_intro: {
    heading: "Materials We Use",
    description: "Every material is carefully selected for durability, comfort, and aesthetics. Learn what makes our office furniture stand out."
  },
  cta: {
    heading: "Custom Finishes Available",
    subheading: "Need a specific color or material for your project? We offer custom finishing options for bulk orders. Contact us to discuss your requirements."
  }
};

const Materials = () => {
  const { data: cmsContent } = useQuery({
    queryKey: ['cms-page', 'materials_page'],
    queryFn: () => cmsPagesService.getPageContent<MaterialsPageContent>('materials_page')
  });

  // Use CMS content or fallback to default
  const content = cmsContent || defaultContent;

  return (
    <Layout>
      <SEOHead
        title="Materials & Finishes | Office Furniture Quality | Dipak Furniture"
        description="Learn about premium materials used in Dipak Furniture products - mesh back, leatherette, CRCA steel, chrome base, and powder-coated finishes. Quality materials for durable office furniture."
        keywords="office furniture materials, mesh office chairs, leatherette chairs, CRCA steel almirah, chrome base chairs, powder coated furniture, durable office furniture"
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

      {/* Materials Grid */}
      <section className="py-16 md:py-24">
        <div className="container">
          <div className="mb-12 text-center">
            <h2 className="mb-4 text-3xl font-bold text-foreground">
              {content.materials_intro.heading}
            </h2>
            <p className="mx-auto max-w-2xl text-muted-foreground">
              {content.materials_intro.description}
            </p>
          </div>

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {materials.map((material, index) => (
              <div
                key={index}
                className="group overflow-hidden rounded-xl border border-border bg-card shadow-sm transition-all duration-300 hover:border-accent/30 hover:shadow-lg"
              >
                <div className="aspect-video overflow-hidden bg-secondary/50">
                  <img
                    src={material.image}
                    alt={material.alt}
                    className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>
                <div className="p-6">
                  <h3 className="mb-2 text-xl font-semibold text-foreground">
                    {material.name}
                  </h3>
                  <p className="mb-4 text-sm text-muted-foreground">
                    {material.description}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {material.features.map((feature, i) => (
                      <span
                        key={i}
                        className="rounded-full bg-accent/10 px-3 py-1 text-xs font-medium text-accent"
                      >
                        {feature}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Product Links */}
      <section className="py-12 bg-secondary/30">
        <div className="container">
          <h3 className="mb-6 text-xl font-semibold text-foreground text-center">
            Shop Furniture by Material
          </h3>
          <div className="flex flex-wrap justify-center gap-3">
            <Link to="/products/task-chairs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Mesh Office Chairs
            </Link>
            <Link to="/products/executive-chairs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Leatherette Executive Chairs
            </Link>
            <Link to="/products/almirahs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              CRCA Steel Almirahs
            </Link>
            <Link to="/products/visitor-chairs" className="rounded-full bg-card px-4 py-2 text-sm text-muted-foreground hover:bg-accent hover:text-accent-foreground transition-colors">
              Chrome Base Chairs
            </Link>
          </div>
        </div>
      </section>

      {/* Custom Options */}
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
              Request Custom Quote
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

export default Materials;
