"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { cn } from "@/lib/utils";

const items = [
  { href: "/admin/marketing", label: "Overview", exact: true },
  { href: "/admin/marketing/business", label: "Business" },
  { href: "/admin/marketing/hero", label: "Hero" },
  { href: "/admin/marketing/trust-badges", label: "Trust Badges" },
  { href: "/admin/marketing/hero-trust", label: "Hero Trust" },
  { href: "/admin/marketing/hours", label: "Hours" },
  { href: "/admin/marketing/social", label: "Social" },
  { href: "/admin/marketing/influencers", label: "Influencers" },
  { href: "/admin/marketing/reviews", label: "Reviews" },
  { href: "/admin/marketing/gallery", label: "Gallery" },
  { href: "/admin/marketing/videos", label: "Videos" },
  { href: "/admin/marketing/stories", label: "Stories" },
  { href: "/admin/marketing/announcement", label: "Announcement" },
  { href: "/admin/marketing/faq", label: "FAQ" },
  { href: "/admin/marketing/why-features", label: "Why Us" },
  { href: "/admin/marketing/sections", label: "Sections" },
  { href: "/admin/marketing/seo", label: "SEO" },
  { href: "/admin/marketing/theme", label: "Theme" },
];

export function MarketingSubnav() {
  const pathname = usePathname();

  return (
    <div className="mb-8 -mx-1 overflow-x-auto pb-2">
      <div className="flex gap-1 min-w-max px-1">
        {items.map((item) => {
          const active = item.exact
            ? pathname === item.href
            : pathname.startsWith(item.href);
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs font-medium whitespace-nowrap transition-colors",
                active
                  ? "bg-brand text-brand-foreground"
                  : "bg-muted/50 text-muted-foreground hover:bg-accent hover:text-foreground"
              )}
            >
              {item.label}
            </Link>
          );
        })}
      </div>
    </div>
  );
}
