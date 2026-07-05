/** Future CMS / API models — placeholder data only for now. */

export type ProductHighlightBadge =
  | "best-seller"
  | "trending"
  | "customer-favourite"
  | "chefs-pick"
  | "influencer-favourite";

export interface Influencer {
  id: string;
  name: string;
  handle: string;
  followers: string;
  quote: string;
  photoUrl?: string;
  reelThumbnailUrl?: string;
  reelUrl?: string;
}

export interface GoogleReview {
  id: string;
  reviewer: string;
  date: string;
  rating: number;
  text: string;
  photoUrl?: string;
  /** Future: Google Places review ID */
  googleReviewId?: string;
}

export interface GalleryItem {
  id: string;
  imageUrl?: string;
  customerName?: string;
  instagramHandle?: string;
  caption?: string;
}

export interface VideoTestimonial {
  id: string;
  customerName: string;
  thumbnailUrl?: string;
  videoUrl?: string;
  quote?: string;
}

export interface CommunityStory {
  id: string;
  title: string;
  thumbnailUrl?: string;
  url?: string;
}

export interface CommunityEvent {
  id: string;
  title: string;
  date: string;
  description: string;
  status: "upcoming" | "past";
}
