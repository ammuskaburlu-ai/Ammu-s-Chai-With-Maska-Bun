import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { verifyPaymentSignature } from "@/lib/razorpay";
import { confirmOrderPayment } from "@/lib/orders/confirm-payment";
import { enforceRateLimit } from "@/lib/rate-limit";
import { z } from "zod";

const verifySchema = z.object({
  orderId: z.string().uuid(),
  razorpay_order_id: z.string(),
  razorpay_payment_id: z.string(),
  razorpay_signature: z.string(),
});

export async function POST(request: Request) {
  const rateLimited = enforceRateLimit(request, "razorpay-verify", 20, 60_000);
  if (rateLimited) return rateLimited;

  try {
    const body = await request.json();
    const data = verifySchema.parse(body);

    const supabase = await createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    const admin = createAdminClient();
    const { data: order, error: orderError } = await admin
      .from("orders")
      .select("*")
      .eq("id", data.orderId)
      .single();

    if (orderError || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    if (order.user_id) {
      if (!user || user.id !== order.user_id) {
        return NextResponse.json({ error: "Unauthorized" }, { status: 403 });
      }
    }

    if (order.razorpay_order_id !== data.razorpay_order_id) {
      return NextResponse.json({ error: "Payment order mismatch" }, { status: 400 });
    }

    if (order.payment_method !== "razorpay") {
      return NextResponse.json({ error: "Invalid payment method" }, { status: 400 });
    }

    const isValid = verifyPaymentSignature(
      data.razorpay_order_id,
      data.razorpay_payment_id,
      data.razorpay_signature
    );

    if (!isValid) {
      return NextResponse.json({ error: "Invalid payment signature" }, { status: 400 });
    }

    const result = await confirmOrderPayment({
      orderId: data.orderId,
      razorpayPaymentId: data.razorpay_payment_id,
      razorpaySignature: data.razorpay_signature,
    });

    return NextResponse.json({
      success: true,
      alreadyPaid: result.alreadyPaid,
    });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    console.error("Payment verification error:", error);
    return NextResponse.json({ error: "Verification failed" }, { status: 500 });
  }
}
