"use client";

import { useState } from "react";
import { Minus, Plus, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useCartStore } from "@/store/cart";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types/database";
import { toast } from "sonner";

interface ProductActionsProps {
  product: Product;
  isFavorite: boolean;
  userId?: string;
}

export function ProductActions({ product, isFavorite: initialFavorite, userId }: ProductActionsProps) {
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(initialFavorite);
  const [loading, setLoading] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAddToCart = () => {
    if (!product.is_available) {
      toast.error("This item is currently unavailable");
      return;
    }
    addItem(product, quantity);
    toast.success(`${quantity}x ${product.name} added to cart`);
  };

  const toggleFavorite = async () => {
    if (!userId) {
      toast.error("Please login to save favorites");
      return;
    }
    setLoading(true);
    const supabase = createClient();
    try {
      if (isFavorite) {
        await supabase
          .from("favorites")
          .delete()
          .eq("user_id", userId)
          .eq("product_id", product.id);
        setIsFavorite(false);
        toast.success("Removed from favorites");
      } else {
        await supabase.from("favorites").insert({
          user_id: userId,
          product_id: product.id,
        });
        setIsFavorite(true);
        toast.success("Added to favorites");
      }
    } catch {
      toast.error("Failed to update favorites");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center gap-4">
        <div className="flex items-center border rounded-lg">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
          >
            <Minus className="h-4 w-4" />
          </Button>
          <span className="w-12 text-center font-medium">{quantity}</span>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setQuantity(quantity + 1)}
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
        <Button
          variant="brand"
          size="lg"
          className="flex-1"
          onClick={handleAddToCart}
          disabled={!product.is_available}
        >
          Add to Cart
        </Button>
        <Button
          variant="outline"
          size="icon"
          onClick={toggleFavorite}
          disabled={loading}
        >
          <Heart className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : ""}`} />
        </Button>
      </div>
    </div>
  );
}
