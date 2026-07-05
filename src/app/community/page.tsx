import type { Metadata } from "next";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { FeaturedBySection } from "@/components/marketing/featured-by-section";
import { CustomerGallery } from "@/components/marketing/customer-gallery";
import { VideoTestimonialsSection } from "@/components/marketing/video-testimonials-section";
import { InstagramCta } from "@/components/marketing/instagram-cta";
import { SectionHeader } from "@/components/marketing/section-header";
import { APP_URL } from "@/lib/constants";
import {
  INSTAGRAM_URL,
  PLACEHOLDER_EVENTS,
  PLACEHOLDER_STORIES,
} from "@/lib/marketing/placeholder-data";

export const metadata: Metadata = {
  title: "Community",
  description:
    "Featured creators, customer stories, and events from Ammu's Chai With Maska Bun in Nellore.",
  alternates: { canonical: `${APP_URL}/community` },
  openGraph: {
    title: "Community | Ammu's Chai With Maska Bun",
    description: "Featured creators, customer stories, and events from Nellore's favourite chai spot.",
    url: `${APP_URL}/community`,
  },
};

export default function CommunityPage() {
  return (
    <div>
      <section className="py-12 md:py-16 bg-gradient-to-br from-brand/10 via-background to-brand/5">
        <div className="container mx-auto px-4 max-w-3xl">
          <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">Our Community</h1>
          <p className="text-muted-foreground text-lg">
            Creators, customers, and chai lovers across Nellore — all in one place.
          </p>
        </div>
      </section>

      <FeaturedBySection />

      <CustomerGallery />

      <section className="py-12 md:py-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <SectionHeader
            title="Instagram Stories"
            subtitle="Highlights from our daily chai moments"
            action={
              <Button variant="outline" size="sm" asChild>
                <Link href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer">
                  View on Instagram
                </Link>
              </Button>
            }
          />
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {PLACEHOLDER_STORIES.map((story) => (
              <Link
                key={story.id}
                href={story.url || INSTAGRAM_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-xl border bg-card aspect-[9/16] flex items-end p-4 bg-gradient-to-t from-black/60 to-brand/20 hover:shadow-md transition-shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                aria-label={`Instagram story: ${story.title}`}
              >
                <span className="text-white text-sm font-medium">{story.title}</span>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <VideoTestimonialsSection />

      <section className="py-12 md:py-16">
        <div className="container mx-auto px-4">
          <SectionHeader title="Upcoming Events" subtitle="Meet us in Nellore — more coming soon" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
            {PLACEHOLDER_EVENTS.map((event) => (
              <article key={event.id} className="rounded-xl border bg-card p-6">
                <p className="text-xs font-medium text-brand uppercase tracking-wide mb-2">
                  {event.status}
                </p>
                <h2 className="text-lg font-semibold">{event.title}</h2>
                <p className="text-sm text-muted-foreground mt-1">{event.date}</p>
                <p className="text-sm text-muted-foreground mt-3">{event.description}</p>
              </article>
            ))}
          </div>
        </div>
      </section>

      <InstagramCta />
    </div>
  );
}
