import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleReviewCard } from "@/components/marketing/google-review-card";
import { SectionHeader } from "@/components/marketing/section-header";
import {
  GOOGLE_REVIEWS_URL,
  PLACEHOLDER_GOOGLE_REVIEWS,
} from "@/lib/marketing/placeholder-data";
import type { GoogleReview } from "@/types/marketing";

interface GoogleReviewsSectionProps {
  reviews?: GoogleReview[];
  googleReviewsUrl?: string;
  title?: string;
  subtitle?: string;
}

export function GoogleReviewsSection({
  reviews,
  googleReviewsUrl = GOOGLE_REVIEWS_URL,
  title = "Google Reviews",
  subtitle = "What Nellore customers are saying on Google",
}: GoogleReviewsSectionProps) {
  const items = reviews && reviews.length > 0 ? reviews : PLACEHOLDER_GOOGLE_REVIEWS;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          title={title}
          subtitle={subtitle}
          action={
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link href={googleReviewsUrl} target="_blank" rel="noopener noreferrer">
                Read More Reviews
              </Link>
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {items.map((review) => (
            <GoogleReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
