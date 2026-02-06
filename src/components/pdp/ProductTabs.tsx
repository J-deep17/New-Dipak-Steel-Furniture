import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent } from "@/components/ui/card";
import {
  CheckCircle2,
  Ruler,
  Wrench,
  ShieldCheck,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface ProductTabsProps {
  product: any;
}

const ProductTabs = ({ product }: ProductTabsProps) => {
  // Parse specifications if it's an object, or use empty array
  const specifications = product.specifications
    ? Object.entries(product.specifications).map(([key, value]) => ({ label: key, value: String(value) }))
    : [];

  const warranty = product.warranty || { coverage: [], care: [] };

  return (
    <div className="mt-12">
      <Tabs defaultValue="features" className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-2 bg-muted/50 p-2 rounded-xl">
          <TabsTrigger value="features" className="flex-1 min-w-[120px]">
            Key Features
          </TabsTrigger>
          <TabsTrigger value="description" className="flex-1 min-w-[120px]">
            Description
          </TabsTrigger>
          <TabsTrigger value="specifications" className="flex-1 min-w-[120px]">
            Specifications
          </TabsTrigger>
          <TabsTrigger value="dimensions" className="flex-1 min-w-[120px]">
            Dimensions
          </TabsTrigger>
          <TabsTrigger value="warranty" className="flex-1 min-w-[120px]">
            Warranty
          </TabsTrigger>
        </TabsList>

        <TabsContent value="features" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <CheckCircle2 className="h-5 w-5 text-primary" />
                Key Features
              </h3>
              {product.features && product.features.length > 0 ? (
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
                  {product.features.map((feature: string, index: number) => (
                    <div
                      key={index}
                      className="flex items-start gap-3 p-4 bg-muted/50 rounded-lg"
                    >
                      <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                      <span>{feature}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No features listed.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="description" className="mt-6">
          <Card>
            <CardContent className="pt-6 prose prose-sm max-w-none">
              <h3 className="text-xl font-semibold mb-4">Product Description</h3>
              <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                {product.description || "No description available."}
              </p>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="specifications" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Wrench className="h-5 w-5 text-primary" />
                Specifications
              </h3>
              {specifications.length > 0 ? (
                <div className="grid gap-0.5">
                  {specifications.map((spec: any, index: number) => (
                    <div
                      key={index}
                      className={cn(
                        "grid grid-cols-2 gap-4 px-4 py-3",
                        index % 2 === 0 ? "bg-muted/50" : "bg-background"
                      )}
                    >
                      <span className="font-medium text-muted-foreground capitalize">
                        {spec.label}
                      </span>
                      <span>{spec.value}</span>
                    </div>
                  ))}
                </div>
              ) : (
                <p className="text-muted-foreground">No specifications available.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="dimensions" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <Ruler className="h-5 w-5 text-primary" />
                Dimensions
              </h3>
              <div className="prose prose-sm max-w-none">
                <p className="text-muted-foreground leading-relaxed whitespace-pre-wrap">
                  {product.dimensions || "Dimensions details coming soon."}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="warranty" className="mt-6">
          <Card>
            <CardContent className="pt-6">
              <h3 className="text-xl font-semibold mb-6 flex items-center gap-2">
                <ShieldCheck className="h-5 w-5 text-primary" />
                Warranty & Care Information
              </h3>
              <div className="grid md:grid-cols-2 gap-8">
                <div>
                  <h4 className="font-medium mb-4">Warranty Coverage</h4>
                  {warranty.coverage && warranty.coverage.length > 0 ? (
                    <ul className="space-y-3 text-muted-foreground">
                      {warranty.coverage.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <CheckCircle2 className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No warranty information.</p>
                  )}
                </div>
                <div>
                  <h4 className="font-medium mb-4">Care Instructions</h4>
                  {warranty.care && warranty.care.length > 0 ? (
                    <ul className="space-y-3 text-muted-foreground">
                      {warranty.care.map((item: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-3">
                          <Wrench className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-muted-foreground">No care instructions.</p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ProductTabs;
