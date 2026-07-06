import { InfluencerCard } from "@/components/marketing/influencer-card";
import { SectionHeader } from "@/components/marketing/section-header";
import { PLACEHOLDER_INFLUENCERS } from "@/lib/marketing/placeholder-data";
import type { Influencer } from "@/types/marketing";

interface FeaturedBySectionProps {
  influencers?: Influencer[];
  title?: string;
  subtitle?: string;
}

export function FeaturedBySection({
  influencers,
  title = "Featured By",
  subtitle = "Nellore food creators who love our chai and maska bun",
}: FeaturedBySectionProps) {
  const items = influencers && influencers.length > 0 ? influencers : PLACEHOLDER_INFLUENCERS;

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x snap-mandatory md:snap-none">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-max md:w-full">
            {items.map((influencer) => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
