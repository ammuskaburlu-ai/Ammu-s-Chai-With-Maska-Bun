import { ProductCard } from "./product-card";
import type { Product } from "@/types/database";
import type { ProductHighlightBadge } from "@/types/marketing";

interface ProductGridProps {
  products: Product[];
  emptyMessage?: string;
  badgeMap?: Record<string, ProductHighlightBadge>;
}

export function ProductGrid({ products, emptyMessage = "No items found", badgeMap }: ProductGridProps) {
  if (products.length === 0) {
    return (
      <div className="text-center py-12 text-muted-foreground">{emptyMessage}</div>
    );
  }

  return (
    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 md:gap-6">
      {products.map((product) => (
        <ProductCard
          key={product.id}
          product={product}
          highlightBadge={badgeMap?.[product.id]}
        />
      ))}
    </div>
  );
}
