import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { OrderTracker } from "@/components/orders/order-tracker";
import { Separator } from "@/components/ui/separator";
import type { Order, OrderItem } from "@/types/database";

interface OrderPageProps {
  params: Promise<{ id: string }>;
}

export default async function OrderPage({ params }: OrderPageProps) {
  const { id } = await params;
  const supabase = await createClient();

  const { data: { user } } = await supabase.auth.getUser();
  if (!user) notFound();

  const { data: order } = await supabase
    .from("orders")
    .select("*, order_items(*)")
    .eq("id", id)
    .single();

  if (!order) notFound();

  const typedOrder = order as Order & { order_items: OrderItem[] };

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold">Order #{typedOrder.order_number}</h1>
          <p className="text-sm text-muted-foreground">{formatDate(typedOrder.created_at)}</p>
        </div>
        <Badge variant={typedOrder.status === "cancelled" ? "destructive" : "brand"}>
          {ORDER_STATUS_LABELS[typedOrder.status]}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Order Status</h2>
          <OrderTracker status={typedOrder.status} />
        </div>

        <div className="rounded-xl border p-6">
          <h2 className="font-semibold mb-4">Delivery Details</h2>
          <div className="space-y-2 text-sm">
            <p><span className="text-muted-foreground">Name:</span> {typedOrder.customer_name}</p>
            <p><span className="text-muted-foreground">Phone:</span> {typedOrder.customer_phone}</p>
            <p><span className="text-muted-foreground">Address:</span> {typedOrder.delivery_address}</p>
            {typedOrder.delivery_notes && (
              <p><span className="text-muted-foreground">Notes:</span> {typedOrder.delivery_notes}</p>
            )}
          </div>
        </div>
      </div>

      <div className="rounded-xl border p-6 mt-8">
        <h2 className="font-semibold mb-4">Order Items</h2>
        <div className="space-y-4">
          {typedOrder.order_items.map((item) => (
            <div key={item.id} className="flex gap-4">
              <div className="relative h-14 w-14 rounded-lg overflow-hidden bg-muted shrink-0">
                {item.product_image ? (
                  <Image src={item.product_image} alt={item.product_name} fill className="object-cover" />
                ) : (
                  <div className="flex h-full items-center justify-center">🍽️</div>
                )}
              </div>
              <div className="flex-1">
                <p className="font-medium">{item.product_name}</p>
                <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
              </div>
              <p className="font-medium">{formatCurrency(item.total_price)}</p>
            </div>
          ))}
        </div>
        <Separator className="my-4" />
        <div className="space-y-1 text-sm">
          <div className="flex justify-between">
            <span>Subtotal</span>
            <span>{formatCurrency(typedOrder.subtotal)}</span>
          </div>
          {typedOrder.discount_amount > 0 && (
            <div className="flex justify-between text-green-600">
              <span>Discount</span>
              <span>-{formatCurrency(typedOrder.discount_amount)}</span>
            </div>
          )}
          <div className="flex justify-between">
            <span>Delivery</span>
            <span>{formatCurrency(typedOrder.delivery_fee)}</span>
          </div>
          <div className="flex justify-between font-bold text-lg pt-2">
            <span>Total</span>
            <span className="text-brand">{formatCurrency(typedOrder.total)}</span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 mt-6">
        <Button variant="outline" asChild>
          <Link href="/account/orders">All Orders</Link>
        </Button>
        <Button variant="brand" asChild>
          <Link href="/menu">Order Again</Link>
        </Button>
      </div>
    </div>
  );
}
