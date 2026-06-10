import type { MetadataRoute } from "next";
import { createAdminClient } from "@/lib/supabase/admin";
import { APP_URL } from "@/lib/constants";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: APP_URL, lastModified: new Date(), changeFrequency: "daily", priority: 1 },
    { url: `${APP_URL}/menu`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${APP_URL}/about`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
    { url: `${APP_URL}/contact`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.5 },
  ];

  if (!process.env.NEXT_PUBLIC_SUPABASE_URL || !process.env.SUPABASE_SERVICE_ROLE_KEY) {
    return staticPages;
  }

  let products: { slug: string; updated_at: string }[] = [];
  let categories: { slug: string; updated_at: string }[] = [];

  try {
    const supabase = createAdminClient();
    const [productsResult, categoriesResult] = await Promise.all([
      supabase.from("products").select("slug, updated_at").eq("is_available", true),
      supabase.from("categories").select("slug, updated_at").eq("is_active", true),
    ]);
    products = productsResult.data || [];
    categories = categoriesResult.data || [];
  } catch {
    return staticPages;
  }

  const categoryPages: MetadataRoute.Sitemap = categories.map((cat) => ({
    url: `${APP_URL}/menu?category=${cat.slug}`,
    lastModified: new Date(cat.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.8,
  }));

  const productPages: MetadataRoute.Sitemap = products.map((product) => ({
    url: `${APP_URL}/menu/${product.slug}`,
    lastModified: new Date(product.updated_at),
    changeFrequency: "weekly" as const,
    priority: 0.7,
  }));

  return [...staticPages, ...categoryPages, ...productPages];
}
