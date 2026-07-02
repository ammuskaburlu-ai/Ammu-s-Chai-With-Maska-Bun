import Link from "next/link";
import { createAdminClient } from "@/lib/supabase/admin";
import { formatCurrency } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Plus, Pencil } from "lucide-react";
import type { Product } from "@/types/database";

export default async function AdminProductsPage() {
  const supabase = createAdminClient();
  const { data: products } = await supabase
    .from("products")
    .select("*, category:categories(name)")
    .order("sort_order");

  return (
    <div>
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Products</h1>
        <Button variant="brand" asChild>
          <Link href="/admin/products/new">
            <Plus className="h-4 w-4 mr-2" />
            Add Product
          </Link>
        </Button>
      </div>

      <div className="rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-muted/50">
            <tr>
              <th className="text-left p-4 font-medium">Name</th>
              <th className="text-left p-4 font-medium hidden md:table-cell">Category</th>
              <th className="text-left p-4 font-medium">Price</th>
              <th className="text-left p-4 font-medium hidden sm:table-cell">Status</th>
              <th className="text-right p-4 font-medium">Actions</th>
            </tr>
          </thead>
          <tbody>
            {((products as (Product & { category?: { name: string } })[]) || []).map((product) => (
              <tr key={product.id} className="border-t">
                <td className="p-4">
                  <div>
                    <p className="font-medium">{product.name}</p>
                    <div className="flex gap-1 mt-1">
                      {product.is_featured && <Badge variant="secondary" className="text-xs">Featured</Badge>}
                      {product.is_special && <Badge variant="brand" className="text-xs">Special</Badge>}
                    </div>
                  </div>
                </td>
                <td className="p-4 hidden md:table-cell text-muted-foreground">
                  {product.category?.name}
                </td>
                <td className="p-4 font-medium">{formatCurrency(product.price)}</td>
                <td className="p-4 hidden sm:table-cell">
                  <Badge variant={product.is_available ? "success" : "destructive"}>
                    {product.is_available ? "Available" : "Unavailable"}
                  </Badge>
                </td>
                <td className="p-4 text-right">
                  <Button variant="ghost" size="icon" asChild>
                    <Link href={`/admin/products/${product.id}`}>
                      <Pencil className="h-4 w-4" />
                    </Link>
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
