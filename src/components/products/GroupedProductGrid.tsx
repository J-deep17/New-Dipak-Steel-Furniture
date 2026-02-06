import { Product } from "@/services/products";
import ProductCard from "./ProductCard";

type BackHeight = "HB" | "MB" | "LB";

interface GroupedProductGridProps {
  products: Product[];
}

const backHeightLabels: Record<BackHeight | "MB_LB", string> = {
  HB: "High Back (HB) Chairs",
  MB: "Medium Back (MB) Chairs",
  LB: "Low Back (LB) Chairs",
  MB_LB: "Medium & Low Back Chairs",
  // ... other labels
};

// Only show HB separate, then combine MB and LB
const displayGroups: Array<{ key: "HB" | "MB_LB"; heights: BackHeight[] }> = [
  { key: "HB", heights: ["HB"] },
  { key: "MB_LB", heights: ["MB", "LB"] },
];

// Helper to check if a product is a mesh chair
const isMeshChair = (product: Product): boolean => {
  return product.title.toLowerCase().includes("mesh");
};

const GroupedProductGrid = ({ products }: GroupedProductGridProps) => {
  // Separate products with backHeight from those without
  const chairProducts = products.filter((p) => (p as any).backHeight);
  const otherProducts = products.filter((p) => !(p as any).backHeight);

  // Separate mesh chairs from non-mesh chairs
  const meshChairs = chairProducts.filter(isMeshChair);
  const nonMeshChairs = chairProducts.filter((p) => !isMeshChair(p));

  // Group non-mesh chair products by display groups (HB separate, MB+LB combined)
  const groupedProducts = displayGroups.reduce(
    (acc, group) => {
      acc[group.key] = nonMeshChairs.filter((p) =>
        (p as any).backHeight && group.heights.includes((p as any).backHeight)
      );
      return acc;
    },
    {} as Record<"HB" | "MB_LB", Product[]>
  );

  // Group mesh chairs by back height as well
  const groupedMeshProducts = displayGroups.reduce(
    (acc, group) => {
      acc[group.key] = meshChairs.filter((p) =>
        (p as any).backHeight && group.heights.includes((p as any).backHeight)
      );
      return acc;
    },
    {} as Record<"HB" | "MB_LB", Product[]>
  );

  if (products.length === 0) {
    return (
      <div className="py-12 text-center">
        <p className="text-muted-foreground">No products found in this category.</p>
      </div>
    );
  }

  // If no chair products, render regular grid
  if (chairProducts.length === 0) {
    return (
      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {products.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-12">
      {/* Regular (non-mesh) chairs grouped by back height */}
      {displayGroups.map((group) => {
        const heightProducts = groupedProducts[group.key];
        if (heightProducts.length === 0) return null;

        return (
          <div key={group.key}>
            <div className="mb-6 flex items-center gap-4">
              <h2 className="text-2xl font-bold text-foreground">
                {backHeightLabels[group.key]}
              </h2>
              <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
                {heightProducts.length} {heightProducts.length === 1 ? "product" : "products"}
              </span>
            </div>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {heightProducts.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))}
            </div>
          </div>
        );
      })}

      {/* Mesh Chairs Section */}
      {meshChairs.length > 0 && (
        <div>
          <div className="mb-6 flex items-center gap-4">
            <h2 className="text-2xl font-bold text-foreground">
              Ergonomic Mesh Chairs
            </h2>
            <span className="rounded-full bg-accent/10 px-3 py-1 text-sm font-medium text-accent">
              {meshChairs.length} {meshChairs.length === 1 ? "product" : "products"}
            </span>
          </div>

          {/* Show mesh chairs grouped by back height */}
          <div className="space-y-8">
            {displayGroups.map((group) => {
              const meshHeightProducts = groupedMeshProducts[group.key];
              if (meshHeightProducts.length === 0) return null;

              return (
                <div key={`mesh-${group.key}`}>
                  <h3 className="mb-4 text-lg font-semibold text-muted-foreground">
                    {backHeightLabels[group.key]}
                  </h3>
                  <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                    {meshHeightProducts.map((product) => (
                      <ProductCard key={product.id} product={product} />
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Render any products without backHeight at the end */}
      {otherProducts.length > 0 && (
        <div>
          <div className="mb-6">
            <h2 className="text-2xl font-bold text-foreground">Other Products</h2>
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {otherProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default GroupedProductGrid;
