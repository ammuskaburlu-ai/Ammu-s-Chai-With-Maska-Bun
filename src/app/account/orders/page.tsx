import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import type { Order } from "@/types/database";

export default async function OrdersPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false });

  return (
    <div className="container mx-auto px-4 py-8 max-w-3xl">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">My Orders</h1>
        <Button variant="ghost" asChild>
          <Link href="/account">Back</Link>
        </Button>
      </div>

      {(orders as Order[] || []).length === 0 ? (
        <div className="text-center py-12">
          <p className="text-muted-foreground mb-4">No orders yet</p>
          <Button variant="brand" asChild>
            <Link href="/menu">Start Ordering</Link>
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {(orders as Order[]).map((order) => (
            <Link
              key={order.id}
              href={`/orders/${order.id}`}
              className="block rounded-xl border p-4 hover:border-brand transition-colors"
            >
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-semibold">#{order.order_number}</p>
                  <p className="text-sm text-muted-foreground">{formatDate(order.created_at)}</p>
                </div>
                <div className="text-right">
                  <Badge variant={order.status === "cancelled" ? "destructive" : "brand"}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                  <p className="font-bold text-brand mt-1">{formatCurrency(order.total)}</p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}
