import { z } from "zod";

const urlOptional = z
  .string()
  .url("Enter a valid URL")
  .optional()
  .or(z.literal(""));

export const businessFormSchema = z.object({
  business_name: z.string().min(2, "Business name is required"),
  business_phone: z.string().optional(),
  business_email: z.string().email("Invalid email").optional().or(z.literal("")),
  business_address: z.string().optional(),
  about: z.string().optional(),
});

export const heroFormSchema = z.object({
  title: z.string().min(2, "Title is required"),
  subtitle: z.string().optional(),
  image: urlOptional,
});

export const hoursFormSchema = z.object({
  monday: z.string().optional(),
  tuesday: z.string().optional(),
  wednesday: z.string().optional(),
  thursday: z.string().optional(),
  friday: z.string().optional(),
  saturday: z.string().optional(),
  sunday: z.string().optional(),
});

export const socialFormSchema = z.object({
  instagram_url: z.string().url().optional().or(z.literal("")),
  instagram_handle: z.string().optional(),
  google_reviews_url: z.string().url().optional().or(z.literal("")),
  whatsapp: z.string().optional(),
  maps_url: urlOptional,
  location_note: z.string().optional(),
  plus_code: z.string().optional(),
});

export const trustBadgeSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  icon_name: z.string().min(1),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const heroTrustItemSchema = z.object({
  label: z.string().min(2),
  icon_name: z.string().min(1),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const whyFeatureSchema = z.object({
  title: z.string().min(2),
  description: z.string().optional(),
  icon_name: z.string().min(1),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const influencerSchema = z.object({
  name: z.string().min(2),
  handle: z.string().min(2),
  followers: z.string().optional(),
  quote: z.string().optional(),
  photo_url: urlOptional,
  reel_thumbnail_url: urlOptional,
  reel_url: urlOptional,
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const reviewSchema = z.object({
  reviewer: z.string().min(2),
  review_date: z.string().optional(),
  rating: z.coerce.number().int().min(1).max(5),
  review_text: z.string().min(10),
  photo_url: urlOptional,
  google_review_id: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const gallerySchema = z.object({
  image_url: urlOptional,
  customer_name: z.string().optional(),
  instagram_handle: z.string().optional(),
  caption: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const videoTestimonialSchema = z.object({
  customer_name: z.string().min(2),
  quote: z.string().optional(),
  thumbnail_url: urlOptional,
  video_url: urlOptional,
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const storySchema = z.object({
  title: z.string().min(2),
  thumbnail_url: urlOptional,
  story_url: urlOptional,
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const announcementSchema = z.object({
  message: z.string().min(2),
  link_url: urlOptional,
  link_label: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(false),
});

export const faqSchema = z.object({
  question: z.string().min(5),
  answer: z.string().min(5),
  sort_order: z.coerce.number().int().default(0),
  is_active: z.boolean().default(true),
});

export const seoFormSchema = z.object({
  page_key: z.string().min(2),
  meta_title: z.string().optional(),
  meta_description: z.string().optional(),
  keywords: z.string().optional(),
  og_image_url: urlOptional,
  canonical_path: z.string().optional(),
  is_active: z.boolean().default(true),
});

export const homepageSectionSchema = z.object({
  section_key: z.string().min(2),
  title_override: z.string().optional(),
  subtitle_override: z.string().optional(),
  sort_order: z.coerce.number().int().default(0),
  is_enabled: z.boolean().default(true),
});

export const themeFormSchema = z.object({
  show_announcement_bar: z.boolean().default(false),
});

export type MarketingTable =
  | "marketing_trust_badges"
  | "marketing_hero_trust_items"
  | "marketing_why_features"
  | "marketing_influencers"
  | "marketing_google_reviews"
  | "marketing_gallery_items"
  | "marketing_video_testimonials"
  | "marketing_stories"
  | "marketing_announcements"
  | "marketing_faqs"
  | "marketing_seo_pages"
  | "marketing_homepage_sections"
  | "marketing_social_links";
