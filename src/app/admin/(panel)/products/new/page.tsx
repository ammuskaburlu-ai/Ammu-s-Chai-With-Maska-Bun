import { createAdminClient } from "@/lib/supabase/admin";
import { ProductForm } from "../product-form";
import type { Category } from "@/types/database";

export default async function NewProductPage() {
  const supabase = createAdminClient();
  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .order("sort_order");

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Add Product</h1>
      <ProductForm categories={(categories as Category[]) || []} />
    </div>
  );
}
