import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    minimumFractionDigits: 0,
    maximumFractionDigits: 2,
  }).format(amount);
}

export function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat("en-IN", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  }).format(new Date(date));
}

export function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^\w\s-]/g, "")
    .replace(/[\s_-]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function calculateDiscount(
  subtotal: number,
  coupon: { discount_type: string; discount_value: number; max_discount: number | null }
): number {
  if (coupon.discount_type === "percentage") {
    const discount = (subtotal * coupon.discount_value) / 100;
    return coupon.max_discount ? Math.min(discount, coupon.max_discount) : discount;
  }
  return Math.min(coupon.discount_value, subtotal);
}

export function calculateLoyaltyDiscount(points: number): number {
  return points / 10;
}

export function calculateLoyaltyEarned(total: number, rate: number): number {
  return Math.floor((total / 100) * rate);
}

export const ORDER_STATUS_LABELS: Record<string, string> = {
  order_received: "Order Received",
  payment_confirmed: "Payment Confirmed",
  accepted: "Accepted",
  preparing: "Preparing",
  ready: "Ready",
  out_for_delivery: "Out For Delivery",
  delivered: "Delivered",
  cancelled: "Cancelled",
};

export const ORDER_STATUS_STEPS = [
  "order_received",
  "payment_confirmed",
  "accepted",
  "preparing",
  "ready",
  "out_for_delivery",
  "delivered",
] as const;
