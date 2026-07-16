import { createAdminClient } from "@/lib/supabase/admin";
import { notifyPaymentReceived, notifyOrderStatusChange } from "@/lib/notifications";
import type { Order } from "@/types/database";

export interface ConfirmPaymentInput {
  orderId: string;
  razorpayPaymentId: string;
  razorpaySignature?: string | null;
  sendNotifications?: boolean;
}

export interface ConfirmPaymentResult {
  order: Order;
  alreadyPaid: boolean;
}

/**
 * Idempotent payment confirmation — safe to call from verify + webhook.
 */
export async function confirmOrderPayment(
  input: ConfirmPaymentInput
): Promise<ConfirmPaymentResult> {
  const admin = createAdminClient();
  const { orderId, razorpayPaymentId, razorpaySignature, sendNotifications = true } =
    input;

  const { data: existing } = await admin
    .from("orders")
    .select("*")
    .eq("id", orderId)
    .single();

  if (!existing) {
    throw new Error("Order not found");
  }

  if (existing.payment_status === "paid") {
    return { order: existing as Order, alreadyPaid: true };
  }

  const { data: order, error } = await admin
    .from("orders")
    .update({
      payment_status: "paid",
      status: "payment_confirmed",
      razorpay_payment_id: razorpayPaymentId,
    })
    .eq("id", orderId)
    .eq("payment_status", "pending")
    .select()
    .single();

  if (error || !order) {
    const { data: concurrent } = await admin
      .from("orders")
      .select("*")
      .eq("id", orderId)
      .single();

    if (concurrent?.payment_status === "paid") {
      return { order: concurrent as Order, alreadyPaid: true };
    }
    throw new Error("Failed to confirm payment");
  }

  await admin
    .from("payments")
    .update({
      razorpay_payment_id: razorpayPaymentId,
      razorpay_signature: razorpaySignature ?? null,
      status: "paid",
    })
    .eq("order_id", orderId)
    .eq("status", "pending");

  if (sendNotifications) {
    await notifyPaymentReceived(order as Order);
    await notifyOrderStatusChange(order as Order, "payment_confirmed");
  }

  return { order: order as Order, alreadyPaid: false };
}

export async function confirmOrderPaymentByRazorpayOrderId(
  razorpayOrderId: string,
  razorpayPaymentId: string,
  paymentMethod?: string,
  rawResponse?: Record<string, unknown>
): Promise<ConfirmPaymentResult | null> {
  const admin = createAdminClient();

  const { data: order } = await admin
    .from("orders")
    .select("*")
    .eq("razorpay_order_id", razorpayOrderId)
    .single();

  if (!order) return null;

  if (order.payment_status === "paid") {
    return { order: order as Order, alreadyPaid: true };
  }

  const result = await confirmOrderPayment({
    orderId: order.id,
    razorpayPaymentId,
    sendNotifications: true,
  });

  if (paymentMethod || rawResponse) {
    await admin
      .from("payments")
      .update({
        method: paymentMethod ?? null,
        raw_response: rawResponse ?? null,
      })
      .eq("order_id", order.id);
  }

  return result;
}
