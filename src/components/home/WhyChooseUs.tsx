import { Check, Shield, Truck, HeartHandshake, Leaf, Award, LucideIcon, Star, PenTool, Layout, Box } from "lucide-react";
import { FeatureData } from "@/services/cms";

const iconMap: Record<string, LucideIcon> = {
  "check": Check,
  "shield": Shield,
  "truck": Truck,
  "heart-handshake": HeartHandshake,
  "leaf": Leaf,
  "award": Award,
  "star": Star,
  "pen-tool": PenTool,
  "layout": Layout,
  "box": Box
};

interface WhyChooseUsProps {
  features?: FeatureData[];
}

const WhyChooseUs = ({ features }: WhyChooseUsProps) => {
  const displayFeatures = features && features.length > 0 ? features : [
    {
      id: 'default-1',
      icon: "check",
      title: "Ergonomic Design",
      description: "Every product is designed with human comfort in mind, supporting proper posture during long working hours."
    }, {
      id: 'default-2',
      icon: "shield",
      title: "Premium Quality",
      description: "Built with high-grade materials and rigorous quality checks to ensure durability and longevity."
    }, {
      id: 'default-3',
      icon: "truck",
      title: "Pan-India Delivery",
      description: "We deliver across India with careful handling and professional installation services."
    }
  ];

  return <section className="py-16 md:py-24">
    <div className="container">
      <div className="mb-12 text-center">
        <p className="mb-2 text-sm font-medium uppercase tracking-wider text-accent">WHY DIPAK STEEL FURNITURE</p>
        <h2 className="mb-4 text-3xl font-bold text-foreground md:text-4xl">
          The Smart Choice for Your Workspace
        </h2>
        <p className="mx-auto max-w-2xl text-muted-foreground">
          For over two decades, we've been crafting furniture that combines
          comfort, quality, and value for Indian businesses and homes.
        </p>
      </div>

      <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {displayFeatures.map((feature, index) => {
          const IconComponent = iconMap[feature.icon || 'check'] || Check;
          return (
            <div key={feature.id || index} className="group rounded-xl border border-border bg-card p-6 transition-all duration-300 hover:border-accent/50 hover:shadow-lg">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-lg bg-accent/10 text-accent transition-colors group-hover:bg-accent group-hover:text-accent-foreground">
                <IconComponent className="h-6 w-6" />
              </div>
              <h3 className="mb-2 text-lg font-semibold text-foreground">
                {feature.title}
              </h3>
              <p className="text-sm text-muted-foreground">
                {feature.description}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  </section>;
};
export default WhyChooseUs;