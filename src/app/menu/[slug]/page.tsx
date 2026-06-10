import { notFound } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { Star } from "lucide-react";
import { createClient } from "@/lib/supabase/server";
import { formatCurrency } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { ProductActions } from "./product-actions";
import type { Metadata } from "next";
import type { Product, Review } from "@/types/database";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export async function generateMetadata({ params }: ProductPageProps): Promise<Metadata> {
  const { slug } = await params;
  const supabase = await createClient();
  const { data: product } = await supabase
    .from("products")
    .select("name, description, image_url, price")
    .eq("slug", slug)
    .single();

  if (!product) return { title: "Product Not Found" };

  return {
    title: product.name,
    description: product.description || `Order ${product.name} online`,
    openGraph: {
      title: product.name,
      description: product.description || undefined,
      images: product.image_url ? [product.image_url] : [],
    },
  };
}

export default async function ProductPage({ params }: ProductPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const { data: product } = await supabase
    .from("products")
    .select("*, category:categories(*)")
    .eq("slug", slug)
    .single();

  if (!product) notFound();

  const { data: reviews } = await supabase
    .from("reviews")
    .select("*, profile:profiles(full_name, avatar_url)")
    .eq("product_id", product.id)
    .eq("is_visible", true)
    .order("created_at", { ascending: false });

  const { data: { user } } = await supabase.auth.getUser();
  let isFavorite = false;
  if (user) {
    const { data: fav } = await supabase
      .from("favorites")
      .select("id")
      .eq("user_id", user.id)
      .eq("product_id", product.id)
      .single();
    isFavorite = !!fav;
  }

  const typedProduct = product as Product;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="relative aspect-square rounded-xl overflow-hidden bg-muted">
          {typedProduct.image_url ? (
            <Image
              src={typedProduct.image_url}
              alt={typedProduct.name}
              fill
              className="object-cover"
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-8xl">🍽️</div>
          )}
        </div>

        <div>
          {typedProduct.category && (
            <Link
              href={`/menu?category=${typedProduct.category.slug}`}
              className="text-sm text-brand hover:underline"
            >
              {typedProduct.category.name}
            </Link>
          )}
          <h1 className="text-3xl font-bold mt-2">{typedProduct.name}</h1>

          {typedProduct.avg_rating > 0 && (
            <div className="flex items-center gap-2 mt-2">
              <div className="flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`h-4 w-4 ${i < Math.round(typedProduct.avg_rating) ? "fill-yellow-400 text-yellow-400" : "text-muted"}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {typedProduct.avg_rating.toFixed(1)} ({typedProduct.review_count} reviews)
              </span>
            </div>
          )}

          <div className="flex items-baseline gap-3 mt-4">
            <span className="text-3xl font-bold text-brand">
              {formatCurrency(typedProduct.price)}
            </span>
            {typedProduct.compare_at_price && typedProduct.compare_at_price > typedProduct.price && (
              <span className="text-lg text-muted-foreground line-through">
                {formatCurrency(typedProduct.compare_at_price)}
              </span>
            )}
          </div>

          {!typedProduct.is_available && (
            <Badge variant="destructive" className="mt-2">Currently Unavailable</Badge>
          )}

          {typedProduct.description && (
            <p className="mt-4 text-muted-foreground leading-relaxed">
              {typedProduct.description}
            </p>
          )}

          <ProductActions product={typedProduct} isFavorite={isFavorite} userId={user?.id} />
        </div>
      </div>

      {(reviews as Review[] || []).length > 0 && (
        <section className="mt-12">
          <h2 className="text-2xl font-bold mb-6">Reviews</h2>
          <div className="space-y-4">
            {(reviews as (Review & { profile?: { full_name: string | null } })[]).map((review) => (
              <div key={review.id} className="rounded-lg border p-4">
                <div className="flex items-center gap-2 mb-2">
                  <div className="flex">
                    {Array.from({ length: review.rating }).map((_, i) => (
                      <Star key={i} className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <span className="text-sm font-medium">
                    {review.profile?.full_name || "Customer"}
                  </span>
                </div>
                {review.comment && (
                  <p className="text-sm text-muted-foreground">{review.comment}</p>
                )}
              </div>
            ))}
          </div>
        </section>
      )}

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Product",
            name: typedProduct.name,
            description: typedProduct.description,
            image: typedProduct.image_url,
            offers: {
              "@type": "Offer",
              price: typedProduct.price,
              priceCurrency: "INR",
              availability: typedProduct.is_available
                ? "https://schema.org/InStock"
                : "https://schema.org/OutOfStock",
            },
            aggregateRating: typedProduct.review_count > 0 ? {
              "@type": "AggregateRating",
              ratingValue: typedProduct.avg_rating,
              reviewCount: typedProduct.review_count,
            } : undefined,
          }),
        }}
      />
    </div>
  );
}
