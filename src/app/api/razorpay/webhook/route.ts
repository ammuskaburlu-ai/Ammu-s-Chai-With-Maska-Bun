import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyWebhookSignature } from "@/lib/razorpay";
import { notifyPaymentReceived, notifyOrderStatusChange } from "@/lib/notifications";

export async function POST(request: Request) {
  try {
    const body = await request.text();
    const signature = request.headers.get("x-razorpay-signature");

    if (!signature || !verifyWebhookSignature(body, signature)) {
      return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
    }

    const event = JSON.parse(body);
    const admin = createAdminClient();

    if (event.event === "payment.captured") {
      const payment = event.payload.payment.entity;
      const razorpayOrderId = payment.order_id;

      const { data: order } = await admin
        .from("orders")
        .select("*")
        .eq("razorpay_order_id", razorpayOrderId)
        .single();

      if (order && order.payment_status !== "paid") {
        await admin
          .from("orders")
          .update({
            payment_status: "paid",
            status: "payment_confirmed",
            razorpay_payment_id: payment.id,
          })
          .eq("id", order.id);

        await admin
          .from("payments")
          .update({
            razorpay_payment_id: payment.id,
            status: "paid",
            method: payment.method,
            raw_response: payment,
          })
          .eq("order_id", order.id);

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
          }
        }

        await notifyPaymentReceived(order);
        await notifyOrderStatusChange(order, "payment_confirmed");
      }
    }

    if (event.event === "payment.failed") {
      const payment = event.payload.payment.entity;
      const { data: order } = await admin
        .from("orders")
        .select("id")
        .eq("razorpay_order_id", payment.order_id)
        .single();

      if (order) {
        await admin
          .from("orders")
          .update({ payment_status: "failed" })
          .eq("id", order.id);

        await admin
          .from("payments")
          .update({ status: "failed", raw_response: payment })
          .eq("order_id", order.id);
      }
    }

    if (event.event === "refund.created") {
      const refund = event.payload.refund.entity;
      const { data: payment } = await admin
        .from("payments")
        .select("order_id")
        .eq("razorpay_payment_id", refund.payment_id)
        .single();

      if (payment) {
        await admin
          .from("orders")
          .update({ payment_status: "refunded", status: "cancelled" })
          .eq("id", payment.order_id);
      }
    }

    return NextResponse.json({ received: true });
  } catch (error) {
    console.error("Webhook error:", error);
    return NextResponse.json({ error: "Webhook processing failed" }, { status: 500 });
  }
}
