import Link from "next/link";
import { ArrowRight, Star } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ProductGrid } from "@/components/products/product-grid";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import type { Product, Category, Review } from "@/types/database";

export default async function HomePage() {
  const supabase = await createClient();
  const settings = await getSettings();

  const [
    { data: categories },
    { data: specialItems },
    { data: popularItems },
    { data: featuredItems },
    { data: coupons },
    { data: reviews },
  ] = await Promise.all([
    supabase.from("categories").select("*").eq("is_active", true).order("sort_order"),
    supabase.from("products").select("*, category:categories(*)").eq("is_special", true).eq("is_available", true).limit(4),
    supabase.from("products").select("*, category:categories(*)").eq("is_popular", true).eq("is_available", true).limit(8),
    supabase.from("products").select("*, category:categories(*)").eq("is_featured", true).eq("is_available", true).limit(8),
    supabase.from("coupons").select("*").eq("is_active", true).limit(3),
    supabase.from("reviews").select("*, profile:profiles(full_name)").eq("is_visible", true).order("created_at", { ascending: false }).limit(6),
  ]);

  const hero = settings.heroBanner || {
    title: "Order Your Favorite Food",
    subtitle: "Fresh, fast & delivered to your door",
    image: "/images/hero.jpg",
  };

  return (
    <div>
      <section className="relative bg-gradient-to-br from-brand/10 via-background to-brand/5 py-16 md:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl">
            <Badge variant="brand" className="mb-4">Fast Delivery</Badge>
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-4">
              {hero.title}
            </h1>
            <p className="text-lg text-muted-foreground mb-8">{hero.subtitle}</p>
            <div className="flex flex-wrap gap-4">
              <Button variant="brand" size="lg" asChild>
                <Link href="/menu">
                  Order Now <ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild>
                <Link href="/menu">View Menu</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section className="py-12 container mx-auto px-4">
        <h2 className="text-2xl font-bold mb-6">Categories</h2>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
          {(categories as Category[] || []).map((cat) => (
            <Link
              key={cat.id}
              href={`/menu?category=${cat.slug}`}
              className="flex flex-col items-center gap-2 p-4 rounded-xl border bg-card hover:border-brand hover:shadow-md transition-all"
            >
              <span className="text-3xl">
                {cat.slug === "snacks" ? "🥟" : cat.slug === "fast-food" ? "🍔" : cat.slug === "tiffins" ? "🍛" : cat.slug === "beverages" ? "🥤" : "⭐"}
              </span>
              <span className="font-medium text-sm text-center">{cat.name}</span>
            </Link>
          ))}
        </div>
      </section>

      {(specialItems as Product[] || []).length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Today&apos;s Special</h2>
              <Button variant="ghost" asChild>
                <Link href="/menu?filter=special">View All</Link>
              </Button>
            </div>
            <ProductGrid products={specialItems as Product[]} />
          </div>
        </section>
      )}

      <section className="py-12 container mx-auto px-4">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold">Popular Items</h2>
          <Button variant="ghost" asChild>
            <Link href="/menu?sort=popular">View All</Link>
          </Button>
        </div>
        <ProductGrid products={(popularItems as Product[]) || []} />
      </section>

      {(featuredItems as Product[] || []).length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-2xl font-bold">Recommended For You</h2>
            </div>
            <ProductGrid products={featuredItems as Product[]} />
          </div>
        </section>
      )}

      {(coupons || []).length > 0 && (
        <section className="py-12 container mx-auto px-4">
          <h2 className="text-2xl font-bold mb-6">Offers & Coupons</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {(coupons || []).map((coupon) => (
              <div key={coupon.id} className="rounded-xl border-2 border-dashed border-brand/50 p-6 bg-brand/5">
                <Badge variant="brand" className="mb-2">{coupon.code}</Badge>
                <p className="font-semibold">{coupon.description}</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Min order: ₹{coupon.min_order_value}
                </p>
              </div>
            ))}
          </div>
        </section>
      )}

      {(reviews as (Review & { profile?: { full_name: string | null } })[] || []).length > 0 && (
        <section className="py-12 bg-muted/30">
          <div className="container mx-auto px-4">
            <h2 className="text-2xl font-bold mb-6">What Our Customers Say</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {(reviews || []).map((review) => (
                <div key={review.id} className="rounded-xl border bg-card p-6">
                  <div className="flex gap-1 mb-2">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-sm text-muted-foreground mb-3">{review.comment}</p>
                  <p className="text-sm font-medium">
                    — {review.profile?.full_name || "Customer"}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
