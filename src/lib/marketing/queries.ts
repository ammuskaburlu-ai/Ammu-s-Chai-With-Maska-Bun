import { cache } from "react";
import { createClient } from "@/lib/supabase/server";
import {
  GOOGLE_REVIEWS_URL,
  INSTAGRAM_HANDLE,
  INSTAGRAM_URL,
  PLACEHOLDER_ANNOUNCEMENTS,
  PLACEHOLDER_FAQS,
  PLACEHOLDER_GALLERY,
  PLACEHOLDER_GOOGLE_REVIEWS,
  PLACEHOLDER_HERO_TRUST_ITEMS,
  PLACEHOLDER_INFLUENCERS,
  PLACEHOLDER_STORIES,
  PLACEHOLDER_TRUST_BADGES,
  PLACEHOLDER_VIDEO_TESTIMONIALS,
  PLACEHOLDER_WHY_FEATURES,
} from "@/lib/marketing/placeholder-data";
import {
  mapGalleryItem,
  mapGoogleReview,
  mapInfluencer,
  mapStory,
  mapVideoTestimonial,
} from "@/lib/marketing/mappers";
import type {
  MarketingAnnouncement,
  MarketingContent,
  MarketingFaq,
  MarketingHeroTrustItem,
  MarketingHomepageSection,
  MarketingSeoPage,
  MarketingSocialLink,
  MarketingThemeSettings,
  MarketingTrustBadge,
  MarketingWhyFeature,
} from "@/types/marketing-db";

function emptyOr<T>(rows: T[] | null | undefined, fallback: T[]): T[] {
  if (rows && rows.length > 0) return rows;
  return fallback;
}

function parseTheme(value: unknown): MarketingThemeSettings {
  if (value && typeof value === "object" && !Array.isArray(value)) {
    return value as MarketingThemeSettings;
  }
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as MarketingThemeSettings;
    } catch {
      return {};
    }
  }
  return {};
}

async function safeQuery<T>(
  fetcher: () => Promise<{ data: T[] | null; error: unknown }>,
  fallback: T[]
): Promise<T[]> {
  try {
    const { data, error } = await fetcher();
    if (error) return fallback;
    return emptyOr(data, fallback);
  } catch {
    return fallback;
  }
}

export const getMarketingContent = cache(async (): Promise<MarketingContent> => {
  const supabase = await createClient();

  const [
    trustBadges,
    heroTrustItems,
    whyFeatures,
    influencers,
    googleReviews,
    galleryItems,
    videoTestimonials,
    stories,
    announcements,
    faqs,
    seoPages,
    homepageSections,
    socialLinks,
    themeRow,
  ] = await Promise.all([
    safeQuery(
      async () =>
        supabase
          .from("marketing_trust_badges")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      PLACEHOLDER_TRUST_BADGES
    ),
    safeQuery(
      async () =>
        supabase
          .from("marketing_hero_trust_items")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      PLACEHOLDER_HERO_TRUST_ITEMS
    ),
    safeQuery(
      async () =>
        supabase
          .from("marketing_why_features")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      PLACEHOLDER_WHY_FEATURES
    ),
    safeQuery(
      async () =>
        supabase
          .from("marketing_influencers")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      []
    ).then((rows) =>
      rows.length > 0 ? rows.map(mapInfluencer) : PLACEHOLDER_INFLUENCERS
    ),
    safeQuery(
      async () =>
        supabase
          .from("marketing_google_reviews")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      []
    ).then((rows) =>
      rows.length > 0 ? rows.map(mapGoogleReview) : PLACEHOLDER_GOOGLE_REVIEWS
    ),
    safeQuery(
      async () =>
        supabase
          .from("marketing_gallery_items")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      []
    ).then((rows) =>
      rows.length > 0 ? rows.map(mapGalleryItem) : PLACEHOLDER_GALLERY
    ),
    safeQuery(
      async () =>
        supabase
          .from("marketing_video_testimonials")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      []
    ).then((rows) =>
      rows.length > 0
        ? rows.map(mapVideoTestimonial)
        : PLACEHOLDER_VIDEO_TESTIMONIALS
    ),
    safeQuery(
      async () =>
        supabase
          .from("marketing_stories")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      []
    ).then((rows) => (rows.length > 0 ? rows.map(mapStory) : PLACEHOLDER_STORIES)),
    safeQuery(
      async () =>
        supabase
          .from("marketing_announcements")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      PLACEHOLDER_ANNOUNCEMENTS
    ),
    safeQuery(
      async () =>
        supabase.from("marketing_faqs").select("*").eq("is_active", true).order("sort_order"),
      PLACEHOLDER_FAQS
    ),
    safeQuery(
      async () =>
        supabase.from("marketing_seo_pages").select("*").eq("is_active", true),
      []
    ),
    safeQuery(
      async () =>
        supabase.from("marketing_homepage_sections").select("*").order("sort_order"),
      []
    ),
    safeQuery(
      async () =>
        supabase
          .from("marketing_social_links")
          .select("*")
          .eq("is_active", true)
          .order("sort_order"),
      []
    ),
    supabase.from("settings").select("value").eq("key", "marketing_theme").maybeSingle(),
  ]);

  const social = socialLinks as MarketingSocialLink[];
  const instagram = social.find((s) => s.platform === "instagram");
  const googleSocial = social.find((s) => s.platform === "google_reviews");

  return {
    trustBadges: trustBadges as MarketingTrustBadge[],
    heroTrustItems: heroTrustItems as MarketingHeroTrustItem[],
    whyFeatures: whyFeatures as MarketingWhyFeature[],
    influencers,
    googleReviews,
    galleryItems,
    videoTestimonials,
    stories,
    announcements: announcements as MarketingAnnouncement[],
    faqs: faqs as MarketingFaq[],
    seoPages: seoPages as MarketingSeoPage[],
    homepageSections: homepageSections as MarketingHomepageSection[],
    socialLinks: social,
    theme: parseTheme(themeRow.data?.value),
    googleReviewsUrl: googleSocial?.url || GOOGLE_REVIEWS_URL,
    instagramHandle: instagram?.handle || INSTAGRAM_HANDLE,
    instagramUrl: instagram?.url || INSTAGRAM_URL,
  };
});

export function getSeoForPage(
  content: MarketingContent,
  pageKey: string
): MarketingSeoPage | undefined {
  return content.seoPages.find((p) => p.page_key === pageKey);
}

export function isHomepageSectionEnabled(
  sections: MarketingHomepageSection[],
  sectionKey: string
): boolean {
  const row = sections.find((s) => s.section_key === sectionKey);
  if (!row) return true;
  return row.is_enabled;
}

export function getSectionTitles(
  sections: MarketingHomepageSection[],
  sectionKey: string,
  defaults: { title: string; subtitle?: string }
) {
  const row = sections.find((s) => s.section_key === sectionKey);
  return {
    title: row?.title_override || defaults.title,
    subtitle: row?.subtitle_override || defaults.subtitle,
  };
}
