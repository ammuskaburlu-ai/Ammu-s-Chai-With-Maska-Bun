import { getMarketingIcon } from "@/lib/marketing/icons";
import { PLACEHOLDER_TRUST_BADGES } from "@/lib/marketing/placeholder-data";
import type { MarketingTrustBadge } from "@/types/marketing-db";

interface TrustBarProps {
  items?: MarketingTrustBadge[];
}

export function TrustBar({ items }: TrustBarProps) {
  const trustItems = items && items.length > 0 ? items : PLACEHOLDER_TRUST_BADGES;

  return (
    <section className="border-y bg-card/50">
      <div className="container mx-auto px-4 py-8 md:py-10">
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
          {trustItems.map(({ id, icon_name, title, description }) => {
            const Icon = getMarketingIcon(icon_name);
            return (
              <div
                key={id}
                className="rounded-xl border bg-background p-4 md:p-5 text-center md:text-left hover:border-brand/40 transition-colors"
              >
                <div className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-brand/10 text-brand mb-3">
                  <Icon className="h-5 w-5" />
                </div>
                <h3 className="font-semibold text-sm md:text-base">{title}</h3>
                <p className="text-xs md:text-sm text-muted-foreground mt-1">{description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
