import { notFound } from "next/navigation";
import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderStatusActions } from "./order-status-actions";
import type { Order, OrderItem } from "@/types/database";

interface AdminOrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function AdminOrderPage({ params }: AdminOrderPageProps) {
  const { id } = await params;
  const supabase = createAdminClient();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const typedOrder = order as Order & { order_items: OrderItem[] };

  return (
    <div className="max-w-4xl">
      <div className="flex items-center justify-between mb-8">
        <div>
          <Button variant="ghost" asChild className="mb-2">
            <Link href="/admin/orders">← Back to Orders</Link>
          </Button>
          <h1 className="text-3xl font-bold">Order #{typedOrder.order_number}</h1>
          <p className="text-muted-foreground">{formatDate(typedOrder.created_at)}</p>
        </div>
        <Badge variant={typedOrder.status === "cancelled" ? "destructive" : "brand"} className="text-sm">
          {ORDER_STATUS_LABELS[typedOrder.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Customer</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {typedOrder.customer_name}</p>
            <p><span className="text-muted-foreground">Phone:</span> {typedOrder.customer_phone}</p>
            <p><span className="text-muted-foreground">Address:</span> {typedOrder.delivery_address}</p>
            {typedOrder.delivery_notes && (
              <p><span className="text-muted-foreground">Notes:</span> {typedOrder.delivery_notes}</p>
            )}
          </div>
        </div>
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Payment</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Method:</span> {typedOrder.payment_method}</p>
            <p><span className="text-muted-foreground">Status:</span> {typedOrder.payment_status}</p>
            <p><span className="text-muted-foreground">Total:</span> {formatCurrency(typedOrder.total)}</p>
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-6 mb-8">
        <h2 className="font-semibold mb-4">Items</h2>
        <div className="space-y-3">
          {typedOrder.order_items.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span>{item.product_name} x{item.quantity}</span>
              <span className="font-medium">{formatCurrency(item.total_price)}</span>
            </div>
          ))}
        </div>
      </div>

      <OrderStatusActions orderId={typedOrder.id} currentStatus={typedOrder.status} />
    </div>
  );
}
