"use client";

import Image from "next/image";
import Link from "next/link";
import { Minus, Plus, Trash2, ShoppingBag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { useCartStore } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";
import { toast } from "sonner";
import { calculateOrderTotals } from "@/lib/orders/pricing-math";

export function CartClient({
  settings,
}: {
  settings: { deliveryFee: number; freeDeliveryThreshold: number; minOrderValue: number };
}) {
  const { items, updateQuantity, removeItem, getSubtotal } = useCartStore();
  const [couponCode, setCouponCode] = useState("");
  const [discount, setDiscount] = useState(0);
  const [appliedCoupon, setAppliedCoupon] = useState<string | null>(null);

  const subtotal = getSubtotal();
  const { deliveryFee, total } = calculateOrderTotals({
    subtotal,
    discountAmount: discount,
    settings,
  });

  const applyCoupon = async () => {
    if (!couponCode.trim()) return;
    try {
      const res = await fetch("/api/coupons/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: couponCode, subtotal }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error || "Invalid coupon");
        return;
      }
      setDiscount(data.discount);
      setAppliedCoupon(couponCode.toUpperCase());
      toast.success("Coupon applied!");
    } catch {
      toast.error("Failed to apply coupon");
    }
  };

  if (items.length === 0) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <ShoppingBag className="h-16 w-16 mx-auto text-muted-foreground mb-4" />
        <h1 className="text-2xl font-bold mb-2">Your cart is empty</h1>
        <p className="text-muted-foreground mb-6">Add some delicious items to get started</p>
        <Button variant="brand" asChild>
          <Link href="/menu">Browse Menu</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Your Cart</h1>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-4">
          {items.map(({ product, quantity }) => (
            <div key={product.id} className="flex gap-4 rounded-xl border p-4">
              <div className="relative h-20 w-20 shrink-0 rounded-lg overflow-hidden bg-muted">
                {product.image_url ? (
                  <Image src={product.image_url} alt={product.name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center text-2xl">🍽️</div>
                )}
              </div>
              <div className="flex-1 min-w-0">
                <Link href={`/menu/${product.slug}`} className="font-medium hover:text-brand">
                  {product.name}
                </Link>
                <p className="text-brand font-semibold mt-1">
                  {formatCurrency(product.price)}
                </p>
                <div className="flex items-center gap-2 mt-2">
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(product.id, quantity - 1)}
                    aria-label={`Decrease quantity of ${product.name}`}
                  >
                    <Minus className="h-3 w-3" />
                  </Button>
                  <span className="w-8 text-center" aria-live="polite">{quantity}</span>
                  <Button
                    variant="outline"
                    size="icon"
                    className="h-8 w-8"
                    onClick={() => updateQuantity(product.id, quantity + 1)}
                    aria-label={`Increase quantity of ${product.name}`}
                  >
                    <Plus className="h-3 w-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-destructive ml-auto"
                    onClick={() => removeItem(product.id)}
                    aria-label={`Remove ${product.name} from cart`}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              <div className="text-right font-semibold">
                {formatCurrency(product.price * quantity)}
              </div>
            </div>
          ))}
        </div>

        <div className="rounded-xl border p-6 h-fit sticky top-24">
          <h2 className="text-lg font-semibold mb-4">Order Summary</h2>
          <div className="flex gap-2 mb-4">
            <Input
              placeholder="Coupon code"
              value={couponCode}
              onChange={(e) => setCouponCode(e.target.value)}
              disabled={!!appliedCoupon}
            />
            <Button variant="outline" onClick={applyCoupon} disabled={!!appliedCoupon}>
              Apply
            </Button>
          </div>
          {appliedCoupon && (
            <p className="text-sm text-green-600 mb-4">
              Coupon {appliedCoupon} applied (-{formatCurrency(discount)})
            </p>
          )}
          <div className="space-y-2 text-sm">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {discount > 0 && (
              <div className="flex justify-between text-green-600">
                <span>Discount</span>
                <span>-{formatCurrency(discount)}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span>Delivery Fee</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <Separator />
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-brand">{formatCurrency(total)}</span>
            </div>
          </div>
          {subtotal < settings.minOrderValue ? (
            <div className="mt-6 text-center">
              <p className="text-sm text-destructive mb-2">
                Minimum order value is {formatCurrency(settings.minOrderValue)}
              </p>
              <Button variant="brand" className="w-full" size="lg" disabled>
                Proceed to Checkout
              </Button>
            </div>
          ) : (
            <Button variant="brand" className="w-full mt-6" size="lg" asChild>
              <Link
                href={`/checkout?${new URLSearchParams({
                  ...(appliedCoupon ? { coupon: appliedCoupon, discount: String(discount) } : {}),
                }).toString()}`}
              >
                Proceed to Checkout
              </Link>
            </Button>
          )}
        </div>
      </div>
    </div>
  );
}
