import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { notifyOrderStatusChange } from "@/lib/notifications";
import { z } from "zod";

const schema = z.object({
  status: z.enum([
    "order_received", "payment_confirmed", "accepted", "preparing",
    "ready", "out_for_delivery", "delivered", "cancelled",
  ]),
  cancelled_reason: z.string().optional(),
});

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const { id } = await params;

  try {
    const body = await request.json();
    const { status, cancelled_reason } = schema.parse(body);

    const admin = createAdminClient();
    const updateData: Record<string, unknown> = { status };
    if (status === "cancelled" && cancelled_reason) {
      updateData.cancelled_reason = cancelled_reason;
    }

    const { data: order, error } = await admin
      .from("orders")
      .update(updateData)
      .eq("id", id)
      .select()
      .single();

    if (error || !order) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    await notifyOrderStatusChange(order, status);

    return NextResponse.json({ order });
  } catch (error) {
    if (error instanceof z.ZodError) {
      return NextResponse.json({ error: error.errors[0].message }, { status: 400 });
    }
    return NextResponse.json({ error: "Update failed" }, { status: 500 });
  }
}
