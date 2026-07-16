import type {
  CommunityEvent,
  CommunityStory,
  GalleryItem,
  GoogleReview,
  Influencer,
  VideoTestimonial,
} from "@/types/marketing";
import type {
  MarketingAnnouncement,
  MarketingFaq,
  MarketingHeroTrustItem,
  MarketingTrustBadge,
  MarketingWhyFeature,
} from "@/types/marketing-db";

export const PLACEHOLDER_TRUST_BADGES: MarketingTrustBadge[] = [
  { id: "tb1", title: "Freshly Brewed Daily", description: "Chai & snacks made fresh for every order", icon_name: "coffee", sort_order: 1, is_active: true },
  { id: "tb2", title: "Secure Payments", description: "Safe checkout with trusted payment partners", icon_name: "shield-check", sort_order: 2, is_active: true },
  { id: "tb3", title: "Fast Delivery", description: "Quick local delivery across Nellore", icon_name: "truck", sort_order: 3, is_active: true },
  { id: "tb4", title: "Loved Across Nellore", description: "A local favourite for chai & maska bun", icon_name: "heart", sort_order: 4, is_active: true },
];

export const PLACEHOLDER_HERO_TRUST_ITEMS: MarketingHeroTrustItem[] = [
  { id: "ht1", label: "★★★★★ Loved in Nellore", icon_name: "star", sort_order: 1, is_active: true },
  { id: "ht2", label: "Secure Payments", icon_name: "shield-check", sort_order: 2, is_active: true },
  { id: "ht3", label: "Fast Local Delivery", icon_name: "truck", sort_order: 3, is_active: true },
  { id: "ht4", label: "Featured by Nellore Food Creators", icon_name: "users", sort_order: 4, is_active: true },
];

export const PLACEHOLDER_WHY_FEATURES: MarketingWhyFeature[] = [
  { id: "wf1", title: "Fresh Ingredients", description: "Chai and snacks prepared fresh for every order", icon_name: "leaf", sort_order: 1, is_active: true },
  { id: "wf2", title: "Affordable", description: "Great value combos without compromising on taste", icon_name: "indian-rupee", sort_order: 2, is_active: true },
  { id: "wf3", title: "Authentic Taste", description: "Classic maska bun and chai the Nellore way", icon_name: "clock", sort_order: 3, is_active: true },
  { id: "wf4", title: "Quick Delivery", description: "Fast local delivery when you crave comfort food", icon_name: "truck", sort_order: 4, is_active: true },
  { id: "wf5", title: "Secure Checkout", description: "Safe online payments with trusted partners", icon_name: "shield-check", sort_order: 5, is_active: true },
];

export const PLACEHOLDER_ANNOUNCEMENTS: MarketingAnnouncement[] = [];

export const PLACEHOLDER_FAQS: MarketingFaq[] = [
  { id: "faq1", question: "Do you deliver across Nellore?", answer: "Yes — we deliver across Nellore with fast local delivery.", sort_order: 1, is_active: true },
  { id: "faq2", question: "What are your payment options?", answer: "We accept secure online payments via trusted partners at checkout.", sort_order: 2, is_active: true },
];

export const PLACEHOLDER_INFLUENCERS: Influencer[] = [
  {
    id: "1",
    name: "Nellore Foodie",
    handle: "@nellorefoodie",
    followers: "48K",
    quote: "The maska bun here is unreal — must try in Nellore!",
    reelUrl: "",
  },
  {
    id: "2",
    name: "Andhra Bites",
    handle: "@andhrabites",
    followers: "32K",
    quote: "Best evening chai spot. Cozy vibes and quick delivery.",
    reelUrl: "",
  },
  {
    id: "3",
    name: "Street Eats AP",
    handle: "@streeteatsap",
    followers: "61K",
    quote: "Featured their combo — authentic taste every single time.",
    reelUrl: "",
  },
  {
    id: "4",
    name: "Food Creators Nellore",
    handle: "@fcnellore",
    followers: "27K",
    quote: "Local favourite for chai lovers across Nellore.",
    reelUrl: "",
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
  { id: "s1", title: "Morning Chai Rush", url: "" },
  { id: "s2", title: "Maska Bun Fresh Batch", url: "" },
  { id: "s3", title: "Customer Shoutout", url: "" },
  { id: "s4", title: "Behind the Counter", url: "" },
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
