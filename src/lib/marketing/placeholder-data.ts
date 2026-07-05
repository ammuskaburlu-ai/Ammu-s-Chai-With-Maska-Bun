import type {
  CommunityEvent,
  CommunityStory,
  GalleryItem,
  GoogleReview,
  Influencer,
  VideoTestimonial,
} from "@/types/marketing";

export const INSTAGRAM_HANDLE = "ammuschai";
export const INSTAGRAM_URL = "https://instagram.com/ammuschai";

export const PLACEHOLDER_INFLUENCERS: Influencer[] = [
  {
    id: "1",
    name: "Nellore Foodie",
    handle: "@nellorefoodie",
    followers: "48K",
    quote: "The maska bun here is unreal — must try in Nellore!",
    reelUrl: INSTAGRAM_URL,
  },
  {
    id: "2",
    name: "Andhra Bites",
    handle: "@andhrabites",
    followers: "32K",
    quote: "Best evening chai spot. Cozy vibes and quick delivery.",
    reelUrl: INSTAGRAM_URL,
  },
  {
    id: "3",
    name: "Street Eats AP",
    handle: "@streeteatsap",
    followers: "61K",
    quote: "Featured their combo — authentic taste every single time.",
    reelUrl: INSTAGRAM_URL,
  },
  {
    id: "4",
    name: "Food Creators Nellore",
    handle: "@fcnellore",
    followers: "27K",
    quote: "Local favourite for chai lovers across Nellore.",
    reelUrl: INSTAGRAM_URL,
  },
];

export const PLACEHOLDER_GOOGLE_REVIEWS: GoogleReview[] = [
  {
    id: "g1",
    reviewer: "Ravi Kumar",
    date: "2 weeks ago",
    rating: 5,
    text: "Amazing maska bun and perfectly brewed chai. Delivery was quick and packaging was neat. Will order again!",
  },
  {
    id: "g2",
    reviewer: "Priya Sharma",
    date: "1 month ago",
    rating: 5,
    text: "Our go-to place for evening snacks. Secure online payment and friendly service. Highly recommended in Nellore.",
  },
  {
    id: "g3",
    reviewer: "Arjun Reddy",
    date: "3 weeks ago",
    rating: 5,
    text: "Fresh food, great prices, and the bun maska is exactly how it should be — buttery and crisp.",
  },
];

export const PLACEHOLDER_GALLERY: GalleryItem[] = [
  { id: "gl1", customerName: "Anitha", instagramHandle: "@anitha.eats", caption: "Chai + maska bun perfection ☕" },
  { id: "gl2", customerName: "Kiran", instagramHandle: "@kiran.nlr", caption: "Friday evening sorted!" },
  { id: "gl3", customerName: "Meena", instagramHandle: "@meena.food", caption: "Family favourite order" },
  { id: "gl4", customerName: "Vikram", instagramHandle: "@vikram.bites", caption: "Quick delivery, hot food" },
  { id: "gl5", customerName: "Sneha", instagramHandle: "@sneha.ap", caption: "Love the combo deals" },
  { id: "gl6", customerName: "Rahul", instagramHandle: "@rahul.nellore", caption: "Best in town!" },
];

export const PLACEHOLDER_VIDEO_TESTIMONIALS: VideoTestimonial[] = [
  {
    id: "v1",
    customerName: "Divya",
    quote: "Honest review — this is our weekly chai fix!",
  },
  {
    id: "v2",
    customerName: "Harish",
    quote: "Tried the special combo. Worth every rupee.",
  },
  {
    id: "v3",
    customerName: "Lakshmi",
    quote: "Fast delivery and secure checkout. Loved it!",
  },
];

export const PLACEHOLDER_STORIES: CommunityStory[] = [
  { id: "s1", title: "Morning Chai Rush", url: INSTAGRAM_URL },
  { id: "s2", title: "Maska Bun Fresh Batch", url: INSTAGRAM_URL },
  { id: "s3", title: "Customer Shoutout", url: INSTAGRAM_URL },
  { id: "s4", title: "Behind the Counter", url: INSTAGRAM_URL },
];

export const PLACEHOLDER_EVENTS: CommunityEvent[] = [
  {
    id: "e1",
    title: "Nellore Food Fest Pop-up",
    date: "Coming Soon",
    description: "Meet us at the local food fest — live tastings and exclusive combos.",
    status: "upcoming",
  },
  {
    id: "e2",
    title: "Creator Collab Evening",
    date: "Coming Soon",
    description: "Join Nellore food creators for an exclusive tasting session.",
    status: "upcoming",
  },
];

/** Future: fetch from Google Places / Business Profile API */
export const GOOGLE_REVIEWS_URL =
  "https://www.google.com/maps/search/?api=1&query=Ammu's+Chai+With+Maska+Bun+Nellore";
