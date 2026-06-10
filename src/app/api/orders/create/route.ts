import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { getRazorpayInstance } from "@/lib/razorpay";
import { notifyOrderPlaced } from "@/lib/notifications";
import { calculateLoyaltyEarned } from "@/lib/utils";
import { getSettings } from "@/lib/settings";
import { z } from "zod";

const orderSchema = z.object({
  customer_name: z.string().min(2),
  customer_phone: z.string().min(10),
  delivery_address: z.string().min(10),
  delivery_notes: z.string().optional(),
  payment_method: z.enum(["razorpay", "cod"]),
  items: z.array(z.object({
    product_id: z.string().uuid(),
    product_name: z.string(),
    product_image: z.string().nullable(),
    unit_price: z.number(),
    quantity: z.number().min(1),
  })).min(1),
  subtotal: z.number(),
  discount_amount: z.number().default(0),
  delivery_fee: z.number(),
  loyalty_points_used: z.number().default(0),
  loyalty_discount: z.number().default(0),
  total: z.number(),
  coupon_code: z.string().nullable().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = orderSchema.parse(body);

    const supabase = await createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (user) {
      const { data: profile } = await supabase
        .from("profiles")
        .select("is_blocked, loyalty_points")
        .eq("id", user.id)
        .single();

      if (profile?.is_blocked) {
        return NextResponse.json({ error: "Account blocked" }, { status: 403 });
      }

      if (data.loyalty_points_used > (profile?.loyalty_points || 0)) {
        return NextResponse.json({ error: "Insufficient loyalty points" }, { status: 400 });
      }
    }

    const settings = await getSettings();
    if (data.subtotal < settings.minOrderValue) {
      return NextResponse.json(
        { error: `Minimum order value is ₹${settings.minOrderValue}` },
        { status: 400 }
      );
    }

    const admin = createAdminClient();
    let couponId: string | null = null;

    if (data.coupon_code) {
      const { data: coupon } = await admin
        .from("coupons")
        .select("*")
        .eq("code", data.coupon_code.toUpperCase())
        .eq("is_active", true)
        .single();

      if (coupon) {
        couponId = coupon.id;
        await admin
          .from("coupons")
          .update({ used_count: coupon.used_count + 1 })
          .eq("id", coupon.id);
      }
    }

    const loyaltyEarned = calculateLoyaltyEarned(data.total, settings.loyaltyPointsRate);

    const { data: order, error: orderError } = await admin
      .from("orders")
      .insert({
        user_id: user?.id || null,
        status: data.payment_method === "cod" ? "order_received" : "order_received",
        payment_method: data.payment_method,
        payment_status: data.payment_method === "cod" ? "pending" : "pending",
        subtotal: data.subtotal,
        discount_amount: data.discount_amount,
        delivery_fee: data.delivery_fee,
        loyalty_points_used: data.loyalty_points_used,
        loyalty_discount: data.loyalty_discount,
        total: data.total,
        coupon_id: couponId,
        coupon_code: data.coupon_code,
        customer_name: data.customer_name,
        customer_phone: data.customer_phone,
        delivery_address: data.delivery_address,
        delivery_notes: data.delivery_notes,
        loyalty_points_earned: loyaltyEarned,
      })
      .select()
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: orderError?.message || "Failed to create order" }, { status: 500 });
    }

    const orderItems = data.items.map((item) => ({
      order_id: order.id,
      product_id: item.product_id,
      product_name: item.product_name,
      product_image: item.product_image,
      unit_price: item.unit_price,
      quantity: item.quantity,
      total_price: item.unit_price * item.quantity,
    }));

    const { data: items, error: itemsError } = await admin
      .from("order_items")
      .insert(orderItems)
      .select();

    if (itemsError) {
      return NextResponse.json({ error: itemsError.message }, { status: 500 });
    }

    if (user && data.loyalty_points_used > 0) {
      const { data: currentProfile } = await admin
        .from("profiles")
        .select("loyalty_points")
        .eq("id", user.id)
        .single();

      if (currentProfile) {
        await admin
          .from("profiles")
          .update({ loyalty_points: currentProfile.loyalty_points - data.loyalty_points_used })
          .eq("id", user.id);
      }

      await admin.from("loyalty_points").insert({
        user_id: user.id,
        order_id: order.id,
        points: -data.loyalty_points_used,
        description: `Redeemed for order #${order.order_number}`,
      });
    }

    let razorpayOrderId: string | null = null;

    if (data.payment_method === "razorpay") {
      const razorpay = getRazorpayInstance();
      const razorpayOrder = await razorpay.orders.create({
        amount: Math.round(data.total * 100),
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
        amount: data.total,
        status: "pending",
      });
    }

    await notifyOrderPlaced(order, items || []);

    return NextResponse.json({
      orderId: order.id,
      orderNumber: order.order_number,
      razorpayOrderId,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Order creation error:", error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
