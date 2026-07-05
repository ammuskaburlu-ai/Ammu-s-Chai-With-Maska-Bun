import { InfluencerCard } from "@/components/marketing/influencer-card";
import { SectionHeader } from "@/components/marketing/section-header";
import { PLACEHOLDER_INFLUENCERS } from "@/lib/marketing/placeholder-data";

export function FeaturedBySection() {
  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader
          title="Featured By"
          subtitle="Nellore food creators who love our chai and maska bun"
        />
        <div className="overflow-x-auto md:overflow-visible pb-2 md:pb-0 snap-x snap-mandatory md:snap-none">
          <div className="flex md:grid md:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6 w-max md:w-full">
            {PLACEHOLDER_INFLUENCERS.map((influencer) => (
              <InfluencerCard key={influencer.id} influencer={influencer} />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
