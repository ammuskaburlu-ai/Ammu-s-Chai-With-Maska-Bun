import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { createAdminClient } from "@/lib/supabase/admin";
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
  const { id } = await params;
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

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
