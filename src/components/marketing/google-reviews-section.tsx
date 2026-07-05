import Link from "next/link";
import { Button } from "@/components/ui/button";
import { GoogleReviewCard } from "@/components/marketing/google-review-card";
import { SectionHeader } from "@/components/marketing/section-header";
import {
  GOOGLE_REVIEWS_URL,
  PLACEHOLDER_GOOGLE_REVIEWS,
} from "@/lib/marketing/placeholder-data";

export function GoogleReviewsSection() {
  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Google Reviews"
          subtitle="What Nellore customers are saying on Google"
          action={
            <Button variant="outline" size="sm" asChild className="shrink-0">
              <Link href={GOOGLE_REVIEWS_URL} target="_blank" rel="noopener noreferrer">
                Read More Reviews
              </Link>
            </Button>
          }
        />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 md:gap-6">
          {PLACEHOLDER_GOOGLE_REVIEWS.map((review) => (
            <GoogleReviewCard key={review.id} review={review} />
          ))}
        </div>
      </div>
    </section>
  );
}
