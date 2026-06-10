import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency, formatDate, ORDER_STATUS_LABELS } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type { Order } from "@/types/database";

export default async function AdminOrdersPage() {
  const supabase = createAdminClient();
  const { data: orders } = await supabase
    .from("orders")
    .select("*")
    .order("created_at", { ascending: false })
    .limit(50);

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Orders</h1>
      <div className="rounded-xl border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Order</th>
              <th className="text-left p-4 hidden md:table-cell">Customer</th>
              <th className="text-left p-4">Total</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4 hidden sm:table-cell">Payment</th>
              <th className="text-left p-4 hidden lg:table-cell">Date</th>
            </tr>
          </thead>
          <tbody>
            {((orders as Order[]) || []).map((order) => (
              <tr key={order.id} className="border-t hover:bg-muted/30">
                <td className="p-4">
                  <Link href={`/admin/orders/${order.id}`} className="font-medium text-brand hover:underline">
                    #{order.order_number}
                  </Link>
                </td>
                <td className="p-4 hidden md:table-cell">
                  <div>
                    <p>{order.customer_name}</p>
                    <p className="text-xs text-muted-foreground">{order.customer_phone}</p>
                  </div>
                </td>
                <td className="p-4 font-medium">{formatCurrency(order.total)}</td>
                <td className="p-4">
                  <Badge variant={order.status === "cancelled" ? "destructive" : "brand"}>
                    {ORDER_STATUS_LABELS[order.status]}
                  </Badge>
                </td>
                <td className="p-4 hidden sm:table-cell">
                  <Badge variant={order.payment_status === "paid" ? "success" : "warning"}>
                    {order.payment_status}
                  </Badge>
                </td>
                <td className="p-4 hidden lg:table-cell text-muted-foreground">
                  {formatDate(order.created_at)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
