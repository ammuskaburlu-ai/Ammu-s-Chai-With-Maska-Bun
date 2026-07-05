"use client";

import Image from "next/image";
import Link from "next/link";
import { Star, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { formatCurrency } from "@/lib/utils";
import { useCartStore } from "@/store/cart";
import type { Product } from "@/types/database";
import type { ProductHighlightBadge } from "@/types/marketing";
import { getProductBadgeLabel } from "@/lib/marketing/product-badges";
import { toast } from "sonner";

interface ProductCardProps {
  product: Product;
  highlightBadge?: ProductHighlightBadge;
}

export function ProductCard({ product, highlightBadge }: ProductCardProps) {
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (!product.is_available) {
      toast.error("This item is currently unavailable");
      return;
    }
    addItem(product);
    toast.success(`${product.name} added to cart`);
  };

  return (
    <Link href={`/menu/${product.slug}`} className="group block">
      <div className="relative overflow-hidden rounded-xl border bg-card transition-shadow hover:shadow-lg">
        <div className="relative aspect-[4/3] bg-muted">
          {product.image_url ? (
            <Image
              src={product.image_url}
              alt={product.name}
              fill
              className="object-cover transition-transform group-hover:scale-105"
              sizes="(max-width: 768px) 50vw, 25vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-4xl">🍽️</div>
          )}
          {product.is_special && (
            <Badge variant="brand" className="absolute top-2 left-2">Special</Badge>
          )}
          {highlightBadge && (
            <Badge variant="secondary" className="absolute top-2 right-2 text-xs">
              {getProductBadgeLabel(highlightBadge)}
            </Badge>
          )}
          {!product.is_available && (
            <div className="absolute inset-0 flex items-center justify-center bg-black/50">
              <Badge variant="destructive">Unavailable</Badge>
            </div>
          )}
        </div>
        <div className="p-4">
          <h3 className="font-semibold line-clamp-1 group-hover:text-brand transition-colors">
            {product.name}
          </h3>
          {product.avg_rating > 0 && (
            <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span>{product.avg_rating.toFixed(1)}</span>
              <span>({product.review_count})</span>
            </div>
          )}
          <div className="flex items-center justify-between mt-3">
            <div className="flex items-baseline gap-2">
              <span className="font-bold text-brand">{formatCurrency(product.price)}</span>
              {product.compare_at_price && product.compare_at_price > product.price && (
                <span className="text-sm text-muted-foreground line-through">
                  {formatCurrency(product.compare_at_price)}
                </span>
              )}
            </div>
            <Button
              size="icon"
              variant="brand"
              className="h-8 w-8 rounded-full"
              onClick={handleAdd}
              disabled={!product.is_available}
            >
              <Plus className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </Link>
  );
}
