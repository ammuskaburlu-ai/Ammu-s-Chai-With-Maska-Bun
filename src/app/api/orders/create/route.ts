import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRazorpayInstance } from "@/lib/razorpay";
import { notifyOrderPlaced } from "@/lib/notifications";
import {
  computeOrderPricing,
  incrementCouponUsage,
  OrderValidationError,
} from "@/lib/orders/pricing";
import { enforceRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const orderSchema = z.object({
  customer_name: z.string().min(2),
  customer_phone: z.string().min(10),
  delivery_address: z.string().min(10),
  delivery_notes: z.string().optional(),
  payment_method: z.enum(["razorpay", "cod"]),
  items: z
    .array(
      z.object({
        product_id: z.string().uuid(),
        quantity: z.number().int().min(1).max(99),
      })
    )
    .min(1),
  coupon_code: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  const rateLimited = enforceRateLimit(request, "orders-create", 10, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const idempotencyKey =
      request.headers.get("Idempotency-Key")?.trim() ||
      request.headers.get("idempotency-key")?.trim() ||
      null;

    const admin = createAdminClient();

    if (idempotencyKey) {
      const { data: existingOrder } = await admin
        .from("orders")
        .select("id, order_number, razorpay_order_id, payment_method")
        .eq("idempotency_key", idempotencyKey)
        .maybeSingle();

      if (existingOrder) {
        return NextResponse.json({
          orderId: existingOrder.id,
          orderNumber: existingOrder.order_number,
          razorpayOrderId: existingOrder.razorpay_order_id,
          duplicate: true,
        });
      }
    }

    const body = await request.json();
    const data = orderSchema.parse(body);

    const { getSettings } = await import("@/lib/settings");
    const settings = await getSettings();
    if (!settings.isStoreOpen) {
      return NextResponse.json({ error: "Store is currently closed" }, { status: 400 });
    }

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_blocked")
        .eq("id", user.id)
        .single();

      if (profile?.is_blocked) {
        return NextResponse.json({ error: "Account blocked" }, { status: 403 });
      }
    }

    const pricing = await computeOrderPricing(data.items, {
      couponCode: data.coupon_code,
      userId: user?.id ?? null,
    });

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: user?.id || null,
        status: "order_received",
        payment_method: data.payment_method,
        payment_status: "pending",
        subtotal: pricing.subtotal,
        discount_amount: pricing.discount_amount,
        delivery_fee: pricing.delivery_fee,
        total: pricing.total,
        coupon_id: pricing.coupon_id,
        coupon_code: pricing.coupon_code,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        delivery_address: data.delivery_address,
        delivery_notes: data.delivery_notes ?? null,
        idempotency_key: idempotencyKey,
      })
      .select()
      .single();

    if (orderError || !order) {
      if (orderError?.code === "23505" && idempotencyKey) {
        const { data: raceOrder } = await admin
          .from("orders")
          .select("id, order_number, razorpay_order_id")
          .eq("idempotency_key", idempotencyKey)
          .single();

        if (raceOrder) {
          return NextResponse.json({
            orderId: raceOrder.id,
            orderNumber: raceOrder.order_number,
            razorpayOrderId: raceOrder.razorpay_order_id,
            duplicate: true,
          });
        }
      }
      console.error("Order insert failed:", orderError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    const orderItems = pricing.lineItems.map((item) => ({
      order_id: order.id,
      ...item,
    }));

    const { data: items, error: itemsError } = await admin
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) {
      await admin.from("orders").delete().eq("id", order.id);
      console.error("Order items insert failed:", itemsError);
      return NextResponse.json({ error: "Failed to create order" }, { status: 500 });
    }

    if (pricing.coupon_id) {
      try {
        await incrementCouponUsage(pricing.coupon_id);
      } catch (couponErr) {
        await admin.from("order_items").delete().eq("order_id", order.id);
        await admin.from("orders").delete().eq("id", order.id);
        const message =
          couponErr instanceof OrderValidationError
            ? couponErr.message
            : "Coupon could not be applied";
        return NextResponse.json({ error: message }, { status: 400 });
      }
    }



    let razorpayOrderId: string | null = null;

    if (data.payment_method === "razorpay") {
      const razorpay = getRazorpayInstance();
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(pricing.total * 100),
        currency: "INR",
        receipt: order.id,
      });
      razorpayOrderId = razorpayOrder.id;

      await admin
        .from("orders")
        .update({ razorpay_order_id: razorpayOrderId })
        .eq("id", order.id);

      await admin.from("payments").insert({
        order_id: order.id,
        razorpay_order_id: razorpayOrderId,
        amount: pricing.total,
        status: "pending",
      });
    }

    await notifyOrderPlaced(order, items || []);

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      razorpayOrderId,
      total: pricing.total,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    if (error instanceof OrderValidationError) {
      return NextResponse.json({ error: error.message }, { status: 400 });
    }
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
