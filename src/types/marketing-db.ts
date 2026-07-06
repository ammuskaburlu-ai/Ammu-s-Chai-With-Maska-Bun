import type {
  CommunityStory,
  GalleryItem,
  GoogleReview,
  Influencer,
  VideoTestimonial,
} from "@/types/marketing";

export interface MarketingTrustBadge {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
}

export interface MarketingHeroTrustItem {
  id: string;
  label: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
}

export interface MarketingWhyFeature {
  id: string;
  title: string;
  description: string;
  icon_name: string;
  sort_order: number;
  is_active: boolean;
}

export interface MarketingAnnouncement {
  id: string;
  message: string;
  link_url: string | null;
  link_label: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface MarketingFaq {
  id: string;
  question: string;
  answer: string;
  sort_order: number;
  is_active: boolean;
}

export interface MarketingSeoPage {
  id: string;
  page_key: string;
  meta_title: string | null;
  meta_description: string | null;
  keywords: string | null;
  og_image_url: string | null;
  canonical_path: string | null;
  is_active: boolean;
}

export interface MarketingHomepageSection {
  id: string;
  section_key: string;
  title_override: string | null;
  subtitle_override: string | null;
  sort_order: number;
  is_enabled: boolean;
}

export interface MarketingSocialLink {
  id: string;
  platform: string;
  url: string;
  handle: string | null;
  sort_order: number;
  is_active: boolean;
}

export interface MarketingThemeSettings {
  show_announcement_bar?: boolean;
}

export interface MarketingContent {
  trustBadges: MarketingTrustBadge[];
  heroTrustItems: MarketingHeroTrustItem[];
  whyFeatures: MarketingWhyFeature[];
  influencers: Influencer[];
  googleReviews: GoogleReview[];
  galleryItems: GalleryItem[];
  videoTestimonials: VideoTestimonial[];
  stories: CommunityStory[];
  announcements: MarketingAnnouncement[];
  faqs: MarketingFaq[];
  seoPages: MarketingSeoPage[];
  homepageSections: MarketingHomepageSection[];
  socialLinks: MarketingSocialLink[];
  theme: MarketingThemeSettings;
  googleReviewsUrl: string;
  instagramHandle: string;
  instagramUrl: string;
}

export type SortableMarketingRow = {
  id: string;
  sort_order: number;
  is_active: boolean;
};
