import { redirect } from "next/navigation";
import Link from "next/link";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/product-grid";
import { Button } from "@/components/ui/button";
import type { Product, Favorite } from "@/types/database";

export default async function FavoritesPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) redirect("/login");

  const { data: favorites } = await supabase
    .from("favorites")
    .select("*, product:products(*, category:categories(*))")
    .eq("user_id", user.id);

  const products = ((favorites as (Favorite & { product: Product })[]) || [])
    .map((f) => f.product)
    .filter(Boolean);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-3xl font-bold">Favorites</h1>
        <Button variant="ghost" asChild>
          <Link href="/account">Back</Link>
        </Button>
      </div>
      <ProductGrid products={products} emptyMessage="No favorite items yet" />
    </div>
  );
}
