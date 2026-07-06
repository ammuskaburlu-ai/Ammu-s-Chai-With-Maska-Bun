import { Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { getMarketingIcon } from "@/lib/marketing/icons";
import { PLACEHOLDER_HERO_TRUST_ITEMS } from "@/lib/marketing/placeholder-data";
import type { MarketingHeroTrustItem } from "@/types/marketing-db";

interface HeroTrustIndicatorsProps {
  items?: MarketingHeroTrustItem[];
}

export function HeroTrustIndicators({ items }: HeroTrustIndicatorsProps) {
  const trustItems = items && items.length > 0 ? items : PLACEHOLDER_HERO_TRUST_ITEMS;

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {trustItems.map(({ id, icon_name, label }) => {
          const Icon = getMarketingIcon(icon_name);
          return (
            <div
              key={id}
              className="flex items-center gap-2 text-sm text-muted-foreground"
            >
              <Icon className="h-4 w-4 text-brand shrink-0" />
              <span>{label}</span>
            </div>
          );
        })}
      </div>
      <Button variant="ghost" size="sm" className="text-brand hover:text-brand px-0 h-auto" asChild>
        <Link href="#video-testimonials" className="inline-flex items-center gap-2">
          <Play className="h-4 w-4 fill-current" />
          Watch Reviews
        </Link>
      </Button>
    </div>
  );
}
