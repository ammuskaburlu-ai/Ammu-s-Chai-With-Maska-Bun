"use client";

import { useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { useCartStore, useCartHydrated } from "@/store/cart";
import { formatCurrency } from "@/lib/utils";
import { toast } from "sonner";
import Script from "next/script";

const checkoutSchema = z.object({
  customer_name: z.string().min(2, "Name is required"),
  customer_phone: z.string().min(10, "Valid phone number required"),
  delivery_address: z.string().min(10, "Address is required"),
  delivery_notes: z.string().optional(),
  payment_method: z.enum(["razorpay", "cod"]),
});

type CheckoutForm = z.infer<typeof checkoutSchema>;

declare global {
  interface Window {
    Razorpay: new (options: Record<string, unknown>) => {
      open: () => void;
      on: (event: string, handler: () => void) => void;
    };
  }
}

function createIdempotencyKey() {
  if (typeof crypto !== "undefined" && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const hydrated = useCartHydrated();
  const { items, getSubtotal, clearCart } = useCartStore();
  const [loading, setLoading] = useState(false);
  const [loyaltyPoints, setLoyaltyPoints] = useState(0);
  const [useLoyalty, setUseLoyalty] = useState(false);
  const idempotencyKeyRef = useRef<string | null>(null);
  const submitLockRef = useRef(false);

  const couponCode = searchParams.get("coupon");
  const couponDiscount = Number(searchParams.get("discount") || 0);

  const subtotal = getSubtotal();
  const deliveryFee = 40;
  const loyaltyDiscount = useLoyalty ? Math.min(loyaltyPoints / 10, subtotal) : 0;
  const displayTotal = subtotal - couponDiscount - loyaltyDiscount + deliveryFee;

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: { payment_method: "razorpay" },
  });

  const paymentMethod = watch("payment_method");

  useEffect(() => {
    if (!hydrated) return;
    if (items.length === 0) {
      router.replace("/cart");
    }
  }, [hydrated, items.length, router]);

  useEffect(() => {
    // Fresh idempotency key each time user enters checkout with items
    idempotencyKeyRef.current = createIdempotencyKey();
    submitLockRef.current = false;
  }, [hydrated, items.length]);

  useEffect(() => {
    fetch("/api/user/loyalty")
      .then((r) => r.json())
      .then((d) => setLoyaltyPoints(d.points || 0))
      .catch(() => {});
  }, []);

  const completeOrder = (orderId: string) => {
    clearCart();
    idempotencyKeyRef.current = null;
    submitLockRef.current = false;
    router.push(`/orders/${orderId}`);
  };

  const onSubmit = async (data: CheckoutForm) => {
    if (!hydrated || items.length === 0) return;
    if (submitLockRef.current) return;
    if (subtotal < 99) {
      toast.error("Minimum order value is ₹99");
      return;
    }

    if (!idempotencyKeyRef.current) {
      idempotencyKeyRef.current = createIdempotencyKey();
    }

    submitLockRef.current = true;
    setLoading(true);

    try {
      const orderPayload = {
        ...data,
        items: items.map((i) => ({
          product_id: i.product.id,
          quantity: i.quantity,
        })),
        coupon_code: couponCode,
        loyalty_points_used: useLoyalty ? Math.floor(loyaltyDiscount * 10) : 0,
      };

      const res = await fetch("/api/orders/create", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Idempotency-Key": idempotencyKeyRef.current,
        },
        body: JSON.stringify(orderPayload),
      });

      const result = await res.json();
      if (!res.ok) {
        toast.error(result.error || "Failed to create order");
        submitLockRef.current = false;
        setLoading(false);
        return;
      }

      const orderTotal = Number(result.total ?? displayTotal);

      if (data.payment_method === "cod") {
        toast.success("Order placed successfully!");
        completeOrder(result.orderId);
        return;
      }

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: Math.round(orderTotal * 100),
        currency: "INR",
        name: "Ammu's Chai With Maska Bun",
        description: `Order #${result.orderNumber}`,
        order_id: result.razorpayOrderId,
        handler: async (response: {
          razorpay_payment_id: string;
          razorpay_order_id: string;
          razorpay_signature: string;
        }) => {
          const verifyRes = await fetch("/api/razorpay/verify", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              orderId: result.orderId,
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }),
          });
          if (verifyRes.ok) {
            toast.success("Payment successful!");
            completeOrder(result.orderId);
          } else {
            toast.error("Payment verification failed");
            submitLockRef.current = false;
            setLoading(false);
          }
        },
        modal: {
          ondismiss: () => {
            submitLockRef.current = false;
            setLoading(false);
          },
        },
        prefill: {
          name: data.customer_name,
          contact: data.customer_phone,
        },
        theme: { color: "#FF6B35" },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch {
      toast.error("Something went wrong");
      submitLockRef.current = false;
      setLoading(false);
    }
  };

  if (!hydrated) {
    return (
      <div className="container mx-auto px-4 py-16 text-center text-muted-foreground">
        Loading checkout...
      </div>
    );
  }

  return (
    <>
      <Script src="https://checkout.razorpay.com/v1/checkout.js" />
      <div className="container mx-auto px-4 py-8 max-w-2xl">
        <h1 className="text-3xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
          <div className="space-y-4">
            <div>
              <Label htmlFor="customer_name">Full Name</Label>
              <Input id="customer_name" {...register("customer_name")} />
              {errors.customer_name && (
                <p className="text-sm text-destructive mt-1">{errors.customer_name.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="customer_phone">Phone Number</Label>
              <Input id="customer_phone" type="tel" {...register("customer_phone")} />
              {errors.customer_phone && (
                <p className="text-sm text-destructive mt-1">{errors.customer_phone.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="delivery_address">Delivery Address</Label>
              <Textarea id="delivery_address" {...register("delivery_address")} rows={3} />
              {errors.delivery_address && (
                <p className="text-sm text-destructive mt-1">{errors.delivery_address.message}</p>
              )}
            </div>
            <div>
              <Label htmlFor="delivery_notes">Order Notes (optional)</Label>
              <Textarea id="delivery_notes" {...register("delivery_notes")} rows={2} />
            </div>
          </div>

          {loyaltyPoints > 0 && (
            <div className="rounded-lg border p-4">
              <label className="flex items-center gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={useLoyalty}
                  onChange={(e) => setUseLoyalty(e.target.checked)}
                  className="rounded"
                />
                <span className="text-sm">
                  Use {loyaltyPoints} loyalty points (₹{(loyaltyPoints / 10).toFixed(0)} off)
                </span>
              </label>
            </div>
          )}

          <div className="space-y-3">
            <Label>Payment Method</Label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex items-center gap-2 rounded-lg border p-4 cursor-pointer ${paymentMethod === "razorpay" ? "border-brand bg-brand/5" : ""}`}
              >
                <input type="radio" value="razorpay" {...register("payment_method")} />
                <span className="text-sm font-medium">Pay Online</span>
              </label>
              <label
                className={`flex items-center gap-2 rounded-lg border p-4 cursor-pointer ${paymentMethod === "cod" ? "border-brand bg-brand/5" : ""}`}
              >
                <input type="radio" value="cod" {...register("payment_method")} />
                <span className="text-sm font-medium">Cash on Delivery</span>
              </label>
            </div>
          </div>

          <div className="rounded-xl border p-6 space-y-2">
            {items.map((i) => (
              <div key={i.product.id} className="flex justify-between text-sm">
                <span>
                  {i.product.name} x{i.quantity}
                </span>
                <span>{formatCurrency(i.product.price * i.quantity)}</span>
              </div>
            ))}
            <Separator />
            <div className="flex justify-between text-sm">
              <span>Subtotal</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            {couponDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Coupon Discount</span>
                <span>-{formatCurrency(couponDiscount)}</span>
              </div>
            )}
            {loyaltyDiscount > 0 && (
              <div className="flex justify-between text-sm text-green-600">
                <span>Loyalty Points</span>
                <span>-{formatCurrency(loyaltyDiscount)}</span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span>Delivery</span>
              <span>{formatCurrency(deliveryFee)}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Total</span>
              <span className="text-brand">{formatCurrency(displayTotal)}</span>
            </div>
            <p className="text-xs text-muted-foreground">
              Final total is calculated securely on the server at checkout.
            </p>
          </div>

          <Button type="submit" variant="brand" size="lg" className="w-full" disabled={loading}>
            {loading
              ? "Processing..."
              : paymentMethod === "cod"
                ? "Place Order"
                : `Pay ${formatCurrency(displayTotal)}`}
          </Button>
        </form>
      </div>
    </>
  );
}
