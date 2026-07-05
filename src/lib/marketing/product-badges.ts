import type { Product } from "@/types/database";
import type { ProductHighlightBadge } from "@/types/marketing";

const BADGE_LABELS: Record<ProductHighlightBadge, string> = {
  "best-seller": "Best Seller",
  trending: "Trending",
  "customer-favourite": "Customer Favourite",
  "chefs-pick": "Chef's Pick",
  "influencer-favourite": "Influencer Favourite",
};

export function getProductBadgeLabel(badge: ProductHighlightBadge): string {
  return BADGE_LABELS[badge];
}

/** Derive a highlight badge from existing product flags (no schema changes). */
export function getProductHighlightBadge(
  product: Product,
  index: number
): ProductHighlightBadge | undefined {
  if (product.is_special) return "chefs-pick";
  if (product.is_popular && index === 0) return "best-seller";
  if (product.is_popular && index === 1) return "trending";
  if (product.is_featured) return "customer-favourite";
  if (product.is_popular && index === 2) return "influencer-favourite";
  return undefined;
}

export function buildProductBadgeMap(products: Product[]): Record<string, ProductHighlightBadge> {
  const map: Record<string, ProductHighlightBadge> = {};
  products.forEach((product, index) => {
    const badge = getProductHighlightBadge(product, index);
    if (badge) map[product.id] = badge;
  });
  return map;
}
