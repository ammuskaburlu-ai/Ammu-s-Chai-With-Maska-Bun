import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { notifyPaymentReceived, notifyOrderStatusChange } from "@/lib/notifications";
import { z } from "zod";

const verifySchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const data = verifySchema.parse(body);

    const isValid = verifyPaymentSignature(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const admin = createAdminClient();

    const { data: order, error } = await admin
      .from("orders")
      .update({
        payment_status: "paid",
        status: "payment_confirmed",
        razorpay_payment_id: data.razorpay_payment_id,
      })
      .eq("id", data.orderId)
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await admin
      .from("payments")
      .update({
        razorpay_payment_id: data.razorpay_payment_id,
        razorpay_signature: data.razorpay_signature,
        status: "paid",
      })
      .eq("order_id", data.orderId);

    if (order.user_id && order.loyalty_points_earned > 0) {
      const { data: profile } = await admin
        .from("profiles")
        .select("loyalty_points")
        .eq("id", order.user_id)
        .single();

      if (profile) {
        await admin
          .from("profiles")
          .update({ loyalty_points: profile.loyalty_points + order.loyalty_points_earned })
          .eq("id", order.user_id);

        await admin.from("loyalty_points").insert({
          user_id: order.user_id,
          order_id: order.id,
          points: order.loyalty_points_earned,
          description: `Earned from order #${order.order_number}`,
        });
      }
    }

    await notifyPaymentReceived(order);
    await notifyOrderStatusChange(order, "payment_confirmed");

    return NextResponse.json({ success: true });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
