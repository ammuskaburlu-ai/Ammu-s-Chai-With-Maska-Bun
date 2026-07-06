import { getMarketingIcon } from "@/lib/marketing/icons";
import { PLACEHOLDER_WHY_FEATURES } from "@/lib/marketing/placeholder-data";
import { SectionHeader } from "@/components/marketing/section-header";
import type { MarketingWhyFeature } from "@/types/marketing-db";

interface WhyPeopleLoveUsProps {
  features?: MarketingWhyFeature[];
  title?: string;
  subtitle?: string;
}

export function WhyPeopleLoveUs({
  features,
  title = "Why People Love Us",
  subtitle = "Everything that makes Ammu's a local favourite",
}: WhyPeopleLoveUsProps) {
  const items = features && features.length > 0 ? features : PLACEHOLDER_WHY_FEATURES;

  return (
    <section className="py-12 md:py-16">
      <div className="container mx-auto px-4">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4 md:gap-6">
          {items.map(({ id, icon_name, title: featureTitle, description }) => {
            const Icon = getMarketingIcon(icon_name);
            return (
              <article
                key={id}
                className="rounded-xl border bg-card p-5 text-center hover:border-brand/40 hover:shadow-sm transition-all"
              >
                <div className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-brand/10 text-brand mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">{featureTitle}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-2">{description}</p>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
