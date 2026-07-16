import { createAdminClient } from "@/lib/supabase/admin";
import {
  calculateDiscount,
} from "@/lib/utils";
import { getSettings } from "@/lib/settings";
import type { Coupon } from "@/types/database";

export class OrderValidationError extends Error {
  constructor(message: string) {
    super(message);
    this.name = "OrderValidationError";
  }
}

export interface OrderLineItemInput {
  product_id: string;
  quantity: number;
}

export interface ComputedLineItem {
  product_id: string;
  product_name: string;
  product_image: string | null;
  unit_price: number;
  quantity: number;
  total_price: number;
}

export interface OrderPricing {
  subtotal: number;
  discount_amount: number;
  delivery_fee: number;
  total: number;
  coupon_id: string | null;
  coupon_code: string | null;
  lineItems: ComputedLineItem[];
}
import { calculateOrderTotals } from "./pricing-math";

async function validateCoupon(
  admin: ReturnType<typeof createAdminClient>,
  code: string,
  subtotal: number
): Promise<Coupon> {
  const { data: coupon, error } = await admin
    .from("coupons")
    .select("*")
    .eq("code", code.toUpperCase())
    .eq("is_active", true)
    .single();

  if (error || !coupon) {
    throw new OrderValidationError("Invalid coupon code");
  }

  if (coupon.expires_at && new Date(coupon.expires_at) < new Date()) {
    throw new OrderValidationError("Coupon has expired");
  }

  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    throw new OrderValidationError("Coupon usage limit reached");
  }

  if (subtotal < Number(coupon.min_order_value)) {
    throw new OrderValidationError(
      `Minimum order value for this coupon is ₹${coupon.min_order_value}`
    );
  }

  return coupon as Coupon;
}

export async function computeOrderPricing(
  items: OrderLineItemInput[],
  options: {
    couponCode?: string | null;
    userId?: string | null;
  }
): Promise<OrderPricing> {
  if (!items.length) {
    throw new OrderValidationError("Cart is empty");
  }

  const admin = createAdminClient();
  const settings = await getSettings();
  const productIds = [...new Set(items.map((i) => i.product_id))];

  const { data: products, error: productsError } = await admin
    .from("products")
    .select("id, name, price, image_url, is_available")
    .in("id", productIds);

  if (productsError || !products?.length) {
    throw new OrderValidationError("Unable to load products");
  }

  const productMap = new Map(products.map((p) => [p.id, p]));
  const lineItems: ComputedLineItem[] = [];
  let subtotal = 0;

  for (const item of items) {
    if (item.quantity < 1) {
      throw new OrderValidationError("Invalid item quantity");
    }

    const product = productMap.get(item.product_id);
    if (!product) {
      throw new OrderValidationError("One or more products were not found");
    }
    if (!product.is_available) {
      throw new OrderValidationError(`${product.name} is currently unavailable`);
    }

    const unitPrice = Number(product.price);
    const totalPrice = unitPrice * item.quantity;
    subtotal += totalPrice;

    lineItems.push({
      product_id: product.id,
      product_name: product.name,
      product_image: product.image_url,
      unit_price: unitPrice,
      quantity: item.quantity,
      total_price: totalPrice,
    });
  }

  if (subtotal < settings.minOrderValue) {
    throw new OrderValidationError(
      `Minimum order value is ₹${settings.minOrderValue}`
    );
  }

  let discount_amount = 0;
  let coupon_id: string | null = null;
  let coupon_code: string | null = null;

  if (options.couponCode?.trim()) {
    const coupon = await validateCoupon(admin, options.couponCode, subtotal);
    discount_amount = calculateDiscount(subtotal, coupon);
    coupon_id = coupon.id;
    coupon_code = coupon.code;
  }

  const { deliveryFee: delivery_fee, total } = calculateOrderTotals({
    subtotal,
    discountAmount: discount_amount,
    settings,
  });
  return {
    subtotal,
    discount_amount,
    delivery_fee,
    total,
    coupon_id,
    coupon_code,
    lineItems,
  };
}

export async function incrementCouponUsage(couponId: string): Promise<void> {
  const admin = createAdminClient();
  const { data: coupon } = await admin
    .from("coupons")
    .select("used_count, usage_limit")
    .eq("id", couponId)
    .single();

  if (!coupon) return;

  if (coupon.usage_limit !== null && coupon.used_count >= coupon.usage_limit) {
    throw new OrderValidationError("Coupon usage limit reached");
  }

  await admin
    .from("coupons")
    .update({ used_count: coupon.used_count + 1 })
    .eq("id", couponId);
}
