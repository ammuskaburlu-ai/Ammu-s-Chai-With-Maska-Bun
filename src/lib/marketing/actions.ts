"use server";

import { requireAdmin } from "@/lib/auth/require-admin";
import { createAdminClient } from "@/lib/supabase/admin";
import { revalidateMarketingPaths } from "@/lib/marketing/revalidate";
import type { MarketingTable } from "@/lib/marketing/schemas";
import {
  announcementSchema,
  businessFormSchema,
  faqSchema,
  gallerySchema,
  heroFormSchema,
  heroTrustItemSchema,
  homepageSectionSchema,
  hoursFormSchema,
  influencerSchema,
  reviewSchema,
  seoFormSchema,
  socialFormSchema,
  storySchema,
  themeFormSchema,
  trustBadgeSchema,
  videoTestimonialSchema,
  whyFeatureSchema,
} from "@/lib/marketing/schemas";

type ActionResult<T = void> =
  | { ok: true; data?: T }
  | { ok: false; error: string };

async function assertAdmin() {
  await requireAdmin();
}

async function upsertSetting(key: string, value: unknown): Promise<ActionResult> {
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("settings")
    .upsert({ key, value }, { onConflict: "key" });
  if (error) return { ok: false, error: error.message };
  revalidateMarketingPaths();
  return { ok: true };
}

function nullIfEmpty(value?: string | null) {
  if (value === undefined || value === null || value.trim() === "") return null;
  return value.trim();
}

export async function saveBusinessInfo(
  input: unknown
): Promise<ActionResult> {
  const parsed = businessFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }
  const d = parsed.data;
  await assertAdmin();
  const admin = createAdminClient();
  const entries: { key: string; value: unknown }[] = [
    { key: "business_name", value: d.business_name },
    { key: "business_phone", value: d.business_phone || "" },
    { key: "business_email", value: d.business_email || "" },
    { key: "business_address", value: d.business_address || "" },
    { key: "about", value: d.about || "" },
  ];
  for (const entry of entries) {
    const { error } = await admin
      .from("settings")
      .upsert({ key: entry.key, value: entry.value }, { onConflict: "key" });
    if (error) return { ok: false, error: error.message };
  }
  revalidateMarketingPaths();
  return { ok: true };
}

export async function saveHeroBanner(input: unknown): Promise<ActionResult> {
  const parsed = heroFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }
  return upsertSetting("hero_banner", parsed.data);
}

export async function saveOpeningHours(input: unknown): Promise<ActionResult> {
  const parsed = hoursFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }
  return upsertSetting("opening_hours", parsed.data);
}

export async function saveSocialLinks(input: unknown): Promise<ActionResult> {
  const parsed = socialFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }
  const d = parsed.data;
  await assertAdmin();
  const admin = createAdminClient();

  const socialUpdates = [
    { platform: "instagram", url: d.instagram_url || "", handle: d.instagram_handle || null },
    { platform: "google_reviews", url: d.google_reviews_url || "", handle: null },
  ];
  for (const row of socialUpdates) {
    const { error } = await admin.from("marketing_social_links").upsert(
      { platform: row.platform, url: row.url, handle: row.handle, is_active: true },
      { onConflict: "platform" }
    );
    if (error) return { ok: false, error: error.message };
  }

  const contact = {
    whatsapp: d.whatsapp || "",
    maps_url: d.maps_url || undefined,
    location_note: d.location_note || undefined,
    plus_code: d.plus_code || undefined,
  };
  const { error: contactError } = await admin
    .from("settings")
    .upsert({ key: "contact", value: contact }, { onConflict: "key" });
  if (contactError) return { ok: false, error: contactError.message };

  revalidateMarketingPaths();
  return { ok: true };
}

export async function saveThemeSettings(input: unknown): Promise<ActionResult> {
  const parsed = themeFormSchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Invalid input" };
  }
  return upsertSetting("marketing_theme", parsed.data);
}

async function crudInsert(
  table: MarketingTable,
  schema: { safeParse: (v: unknown) => { success: boolean; data?: Record<string, unknown>; error?: { issues: { message: string }[] } } },
  input: unknown
): Promise<ActionResult<{ id: string }>> {
  const parsed = schema.safeParse(input);
  if (!parsed.success || !parsed.data) {
    return { ok: false, error: parsed.error?.issues[0]?.message || "Invalid input" };
  }
  await assertAdmin();
  const admin = createAdminClient();
  const { data, error } = await admin.from(table).insert(parsed.data).select("id").single();
  if (error) return { ok: false, error: error.message };
  revalidateMarketingPaths();
  return { ok: true, data: { id: data.id as string } };
}

async function crudUpdate(
  table: MarketingTable,
  id: string,
  schema: { safeParse: (v: unknown) => { success: boolean; data?: Record<string, unknown>; error?: { issues: { message: string }[] } } },
  input: unknown
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id" };
  const parsed = schema.safeParse(input);
  if (!parsed.success || !parsed.data) {
    return { ok: false, error: parsed.error?.issues[0]?.message || "Invalid input" };
  }
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).update(parsed.data).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateMarketingPaths();
  return { ok: true };
}

export async function deleteMarketingRow(
  table: MarketingTable,
  id: string
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id" };
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).delete().eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateMarketingPaths();
  return { ok: true };
}

export async function toggleMarketingActive(
  table: MarketingTable,
  id: string,
  isActive: boolean
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id" };
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin.from(table).update({ is_active: isActive }).eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateMarketingPaths();
  return { ok: true };
}

export async function toggleHomepageSection(
  id: string,
  isEnabled: boolean
): Promise<ActionResult> {
  if (!id) return { ok: false, error: "Missing id" };
  await assertAdmin();
  const admin = createAdminClient();
  const { error } = await admin
    .from("marketing_homepage_sections")
    .update({ is_enabled: isEnabled })
    .eq("id", id);
  if (error) return { ok: false, error: error.message };
  revalidateMarketingPaths();
  return { ok: true };
}

export async function createTrustBadge(input: unknown) {
  return crudInsert("marketing_trust_badges", trustBadgeSchema, input);
}
export async function updateTrustBadge(id: string, input: unknown) {
  return crudUpdate("marketing_trust_badges", id, trustBadgeSchema, input);
}

export async function createHeroTrustItem(input: unknown) {
  return crudInsert("marketing_hero_trust_items", heroTrustItemSchema, input);
}
export async function updateHeroTrustItem(id: string, input: unknown) {
  return crudUpdate("marketing_hero_trust_items", id, heroTrustItemSchema, input);
}

export async function createWhyFeature(input: unknown) {
  return crudInsert("marketing_why_features", whyFeatureSchema, input);
}
export async function updateWhyFeature(id: string, input: unknown) {
  return crudUpdate("marketing_why_features", id, whyFeatureSchema, input);
}

export async function createInfluencer(input: unknown) {
  return crudInsert("marketing_influencers", influencerSchema, {
    ...(typeof input === "object" && input ? input : {}),
    photo_url: nullIfEmpty((input as { photo_url?: string })?.photo_url),
    reel_thumbnail_url: nullIfEmpty((input as { reel_thumbnail_url?: string })?.reel_thumbnail_url),
    reel_url: nullIfEmpty((input as { reel_url?: string })?.reel_url),
  });
}
export async function updateInfluencer(id: string, input: unknown) {
  return crudUpdate("marketing_influencers", id, influencerSchema, {
    ...(typeof input === "object" && input ? input : {}),
    photo_url: nullIfEmpty((input as { photo_url?: string })?.photo_url),
    reel_thumbnail_url: nullIfEmpty((input as { reel_thumbnail_url?: string })?.reel_thumbnail_url),
    reel_url: nullIfEmpty((input as { reel_url?: string })?.reel_url),
  });
}

export async function createGoogleReview(input: unknown) {
  return crudInsert("marketing_google_reviews", reviewSchema, {
    ...(typeof input === "object" && input ? input : {}),
    photo_url: nullIfEmpty((input as { photo_url?: string })?.photo_url),
    google_review_id: nullIfEmpty((input as { google_review_id?: string })?.google_review_id),
  });
}
export async function updateGoogleReview(id: string, input: unknown) {
  return crudUpdate("marketing_google_reviews", id, reviewSchema, {
    ...(typeof input === "object" && input ? input : {}),
    photo_url: nullIfEmpty((input as { photo_url?: string })?.photo_url),
    google_review_id: nullIfEmpty((input as { google_review_id?: string })?.google_review_id),
  });
}

export async function createGalleryItem(input: unknown) {
  return crudInsert("marketing_gallery_items", gallerySchema, {
    ...(typeof input === "object" && input ? input : {}),
    image_url: nullIfEmpty((input as { image_url?: string })?.image_url),
  });
}
export async function updateGalleryItem(id: string, input: unknown) {
  return crudUpdate("marketing_gallery_items", id, gallerySchema, {
    ...(typeof input === "object" && input ? input : {}),
    image_url: nullIfEmpty((input as { image_url?: string })?.image_url),
  });
}

export async function createVideoTestimonial(input: unknown) {
  return crudInsert("marketing_video_testimonials", videoTestimonialSchema, {
    ...(typeof input === "object" && input ? input : {}),
    thumbnail_url: nullIfEmpty((input as { thumbnail_url?: string })?.thumbnail_url),
    video_url: nullIfEmpty((input as { video_url?: string })?.video_url),
  });
}
export async function updateVideoTestimonial(id: string, input: unknown) {
  return crudUpdate("marketing_video_testimonials", id, videoTestimonialSchema, {
    ...(typeof input === "object" && input ? input : {}),
    thumbnail_url: nullIfEmpty((input as { thumbnail_url?: string })?.thumbnail_url),
    video_url: nullIfEmpty((input as { video_url?: string })?.video_url),
  });
}

export async function createStory(input: unknown) {
  return crudInsert("marketing_stories", storySchema, {
    ...(typeof input === "object" && input ? input : {}),
    thumbnail_url: nullIfEmpty((input as { thumbnail_url?: string })?.thumbnail_url),
    story_url: nullIfEmpty((input as { story_url?: string })?.story_url),
  });
}
export async function updateStory(id: string, input: unknown) {
  return crudUpdate("marketing_stories", id, storySchema, {
    ...(typeof input === "object" && input ? input : {}),
    thumbnail_url: nullIfEmpty((input as { thumbnail_url?: string })?.thumbnail_url),
    story_url: nullIfEmpty((input as { story_url?: string })?.story_url),
  });
}

export async function createAnnouncement(input: unknown) {
  return crudInsert("marketing_announcements", announcementSchema, {
    ...(typeof input === "object" && input ? input : {}),
    link_url: nullIfEmpty((input as { link_url?: string })?.link_url),
  });
}
export async function updateAnnouncement(id: string, input: unknown) {
  return crudUpdate("marketing_announcements", id, announcementSchema, {
    ...(typeof input === "object" && input ? input : {}),
    link_url: nullIfEmpty((input as { link_url?: string })?.link_url),
  });
}

export async function createFaq(input: unknown) {
  return crudInsert("marketing_faqs", faqSchema, input);
}
export async function updateFaq(id: string, input: unknown) {
  return crudUpdate("marketing_faqs", id, faqSchema, input);
}

export async function createSeoPage(input: unknown) {
  return crudInsert("marketing_seo_pages", seoFormSchema, {
    ...(typeof input === "object" && input ? input : {}),
    og_image_url: nullIfEmpty((input as { og_image_url?: string })?.og_image_url),
  });
}
export async function updateSeoPage(id: string, input: unknown) {
  return crudUpdate("marketing_seo_pages", id, seoFormSchema, {
    ...(typeof input === "object" && input ? input : {}),
    og_image_url: nullIfEmpty((input as { og_image_url?: string })?.og_image_url),
  });
}

export async function updateHomepageSection(id: string, input: unknown) {
  return crudUpdate("marketing_homepage_sections", id, homepageSectionSchema, input);
}
