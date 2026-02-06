// import { ColorVariant } from "@/services/products";

interface ColorVariant {
  color: string;
  image?: string;
  price?: number;
}

interface ColorSelectorProps {
  variants: ColorVariant[];
  selectedColor: string;
  onColorSelect: (color: string) => void;
}

const colorMap: Record<string, string> = {
  Brown: "bg-amber-800",
  White: "bg-white border-2 border-gray-300",
  Black: "bg-gray-900",
  Custom: "bg-gradient-to-r from-red-400 via-yellow-400 to-blue-400",
};

const ColorSelector = ({ variants, selectedColor, onColorSelect }: ColorSelectorProps) => {
  return (
    <div className="flex items-center gap-2 mb-3">
      <span className="text-xs text-muted-foreground">Color:</span>
      <div className="flex gap-1.5">
        {variants.map((variant) => (
          <button
            key={variant.color}
            onClick={(e) => {
              e.stopPropagation();
              onColorSelect(variant.color);
            }}
            className={`w-5 h-5 rounded-full transition-all ${colorMap[variant.color] || "bg-gray-400"} ${selectedColor === variant.color
                ? "ring-2 ring-accent ring-offset-2"
                : "hover:scale-110"
              }`}
            title={variant.color}
            aria-label={`Select ${variant.color} color`}
          />
        ))}
      </div>
    </div>
  );
};

export default ColorSelector;
