import { createAdminClient } from "@/lib/supabase/admin";
import { formatDate } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { CustomerActions } from "./customer-actions";
import type { Profile } from "@/types/database";

export default async function AdminCustomersPage() {
  const supabase = createAdminClient();
  const { data: customers } = await supabase
    .from("profiles")
    .select("*")
    .eq("role", "customer")
    .order("created_at", { ascending: false });

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Customers</h1>
      <div className="rounded-xl border overflow-hidden overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4">Name</th>
              <th className="text-left p-4 hidden md:table-cell">Email</th>
              <th className="text-left p-4 hidden sm:table-cell">Phone</th>
              <th className="text-left p-4">Status</th>
              <th className="text-left p-4 hidden lg:table-cell">Joined</th>
              <th className="text-right p-4">Actions</th>
            </tr>
          </thead>
          <tbody>
            {((customers as Profile[]) || []).map((customer) => (
              <tr key={customer.id} className="border-t">
                <td className="p-4 font-medium">{customer.full_name || "—"}</td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">{customer.email}</td>
                <td className="p-4 hidden sm:table-cell">{customer.phone || "—"}</td>
                <td className="p-4">
                  <Badge variant={customer.is_blocked ? "destructive" : "success"}>
                    {customer.is_blocked ? "Blocked" : "Active"}
                  </Badge>
                </td>
                <td className="p-4 hidden lg:table-cell text-muted-foreground">
                  {formatDate(customer.created_at)}
                </td>
                <td className="p-4 text-right">
                  <CustomerActions customerId={customer.id} isBlocked={customer.is_blocked} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
