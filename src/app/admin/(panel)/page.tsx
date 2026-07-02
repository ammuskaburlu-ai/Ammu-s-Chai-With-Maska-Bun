import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  DollarSign,
  ShoppingBag,
  Clock,
  CheckCircle,
  Users,
  TrendingUp,
} from "lucide-react";

export default async function AdminDashboard() {
  const supabase = createAdminClient();
  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const [
    { data: allOrders },
    { data: todayOrders },
    { count: customerCount },
    { data: topProducts },
  ] = await Promise.all([
    supabase.from("orders").select("total, status, payment_status"),
    supabase.from("orders").select("total").gte("created_at", today.toISOString()),
    supabase.from("profiles").select("*", { count: "exact", head: true }).eq("role", "customer"),
    supabase
      .from("order_items")
      .select("product_name, quantity")
      .order("quantity", { ascending: false })
      .limit(5),
  ]);

  const orders = allOrders || [];
  const totalRevenue = orders
    .filter((o) => o.payment_status === "paid" || o.payment_status === "pending")
    .reduce((sum, o) => sum + Number(o.total), 0);
  const todayRevenue = (todayOrders || []).reduce((sum, o) => sum + Number(o.total), 0);
  const pendingOrders = orders.filter(
    (o) => !["delivered", "cancelled"].includes(o.status)
  ).length;
  const completedOrders = orders.filter((o) => o.status === "delivered").length;

  const productSales: Record<string, number> = {};
  (topProducts || []).forEach((item) => {
    productSales[item.product_name] = (productSales[item.product_name] || 0) + item.quantity;
  });
  const bestSelling = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  const stats = [
    { title: "Total Revenue", value: formatCurrency(totalRevenue), icon: DollarSign },
    { title: "Today's Revenue", value: formatCurrency(todayRevenue), icon: TrendingUp },
    { title: "Total Orders", value: orders.length.toString(), icon: ShoppingBag },
    { title: "Pending Orders", value: pendingOrders.toString(), icon: Clock },
    { title: "Completed", value: completedOrders.toString(), icon: CheckCircle },
    { title: "Customers", value: (customerCount || 0).toString(), icon: Users },
  ];

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Dashboard</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <CardTitle className="text-sm font-medium text-muted-foreground">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stat.value}</div>
            </CardContent>
          </Card>
        ))}
      </div>

      {bestSelling.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Best Selling Items</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {bestSelling.map(([name, qty], i) => (
                <div key={name} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <span className="flex h-8 w-8 items-center justify-center rounded-full bg-brand/10 text-sm font-bold text-brand">
                      {i + 1}
                    </span>
                    <span className="font-medium">{name}</span>
                  </div>
                  <span className="text-muted-foreground">{qty} sold</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
