import { Suspense } from "react";
import { createClient } from "@/lib/supabase/server";
import { ProductGrid } from "@/components/products/product-grid";
import { MenuFilters } from "./menu-filters";
import {
  buildProductSearchFilter,
  isValidSearchTerm,
} from "@/lib/menu-search";
import type { Product, Category } from "@/types/database";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Menu",
  description: "Browse our full menu of snacks, fast food, tiffins, beverages and special items.",
};

interface MenuPageProps {
  searchParams: Promise<{
    category?: string;
    search?: string;
    sort?: string;
    filter?: string;
  }>;
}

export default async function MenuPage({ searchParams }: MenuPageProps) {
  const params = await searchParams;
  const supabase = await createClient();

  const { data: categories } = await supabase
    .from("categories")
    .select("*")
    .eq("is_active", true)
    .order("sort_order");

  const categoryList = (categories as Category[]) || [];

  let query = supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("is_available", true);

  if (params.category) {
    const cat = categoryList.find((c) => c.slug === params.category);
    if (cat) query = query.eq("category_id", cat.id);
  }

  if (isValidSearchTerm(params.search)) {
    const searchFilter = buildProductSearchFilter(params.search, categoryList);
    query = query.or(searchFilter);
  }

  if (params.filter === "special") {
    query = query.eq("is_special", true);
  }

  if (params.sort === "popular") {
    query = query.eq("is_popular", true);
  } else if (params.sort === "price-low") {
    query = query.order("price", { ascending: true });
  } else if (params.sort === "price-high") {
    query = query.order("price", { ascending: false });
  } else if (params.sort === "rating") {
    query = query.order("avg_rating", { ascending: false });
  } else {
    query = query.order("sort_order");
  }

  const { data: products, error } = await query;

  if (error) {
    console.error("Menu search query error:", error.message);
  }

  const displaySearch = isValidSearchTerm(params.search) ? params.search : undefined;

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-2">Our Menu</h1>
      <p className="text-muted-foreground mb-8">
        {displaySearch
          ? `Results for "${displaySearch}"`
          : "Explore our delicious selection of food items"}
      </p>

      <Suspense fallback={null}>
        <MenuFilters
          categories={categoryList}
          currentCategory={params.category}
          currentSort={params.sort}
          currentSearch={displaySearch}
        />
      </Suspense>

      <div className="mt-8">
        <ProductGrid
          products={(products as Product[]) || []}
          emptyMessage={
            displaySearch
              ? `No items found for "${displaySearch}"`
              : "No items found"
          }
        />
      </div>
    </div>
  );
}
