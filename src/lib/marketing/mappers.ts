import type {
  CommunityStory,
  GalleryItem,
  GoogleReview,
  Influencer,
  VideoTestimonial,
} from "@/types/marketing";

export function mapInfluencer(row: {
  id: string;
  name: string;
  handle: string;
  followers: string;
  quote: string;
  photo_url: string | null;
  reel_thumbnail_url: string | null;
  reel_url: string | null;
}): Influencer {
  return {
    id: row.id,
    name: row.name,
    handle: row.handle,
    followers: row.followers,
    quote: row.quote,
    photoUrl: row.photo_url ?? undefined,
    reelThumbnailUrl: row.reel_thumbnail_url ?? undefined,
    reelUrl: row.reel_url ?? undefined,
  };
}

export function mapGoogleReview(row: {
  id: string;
  reviewer: string;
  review_date: string;
  rating: number;
  review_text: string;
  photo_url: string | null;
  google_review_id: string | null;
}): GoogleReview {
  return {
    id: row.id,
    reviewer: row.reviewer,
    date: row.review_date,
    rating: row.rating,
    text: row.review_text,
    photoUrl: row.photo_url ?? undefined,
    googleReviewId: row.google_review_id ?? undefined,
  };
}

export function mapGalleryItem(row: {
  id: string;
  image_url: string | null;
  customer_name: string | null;
  instagram_handle: string | null;
  caption: string | null;
}): GalleryItem {
  return {
    id: row.id,
    imageUrl: row.image_url ?? undefined,
    customerName: row.customer_name ?? undefined,
    instagramHandle: row.instagram_handle ?? undefined,
    caption: row.caption ?? undefined,
  };
}

export function mapVideoTestimonial(row: {
  id: string;
  customer_name: string;
  quote: string | null;
  thumbnail_url: string | null;
  video_url: string | null;
}): VideoTestimonial {
  return {
    id: row.id,
    customerName: row.customer_name,
    quote: row.quote ?? undefined,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    videoUrl: row.video_url ?? undefined,
  };
}

export function mapStory(row: {
  id: string;
  title: string;
  thumbnail_url: string | null;
  story_url: string | null;
}): CommunityStory {
  return {
    id: row.id,
    title: row.title,
    thumbnailUrl: row.thumbnail_url ?? undefined,
    url: row.story_url ?? undefined,
  };
}
