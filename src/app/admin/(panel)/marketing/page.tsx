import Link from "next/link";
import { Megaphone } from "lucide-react";
import { PreviewHomeLink } from "@/components/admin/marketing/preview-link";

const sections = [
  { href: "/admin/marketing/business", label: "Business Information", desc: "Name, contact, about" },
  { href: "/admin/marketing/hero", label: "Homepage Hero", desc: "Title, subtitle, image" },
  { href: "/admin/marketing/trust-badges", label: "Trust Badges", desc: "Trust bar cards" },
  { href: "/admin/marketing/hero-trust", label: "Hero Trust Items", desc: "Hero trust indicators" },
  { href: "/admin/marketing/hours", label: "Business Hours", desc: "Weekly opening hours" },
  { href: "/admin/marketing/social", label: "Social Links", desc: "Instagram, Google, WhatsApp" },
  { href: "/admin/marketing/influencers", label: "Influencers", desc: "Featured creators" },
  { href: "/admin/marketing/reviews", label: "Google Reviews", desc: "Review cards" },
  { href: "/admin/marketing/gallery", label: "Customer Gallery", desc: "UGC gallery items" },
  { href: "/admin/marketing/videos", label: "Video Testimonials", desc: "Video URLs only" },
  { href: "/admin/marketing/stories", label: "Stories", desc: "Instagram story highlights" },
  { href: "/admin/marketing/announcement", label: "Announcement Bar", desc: "Top site banner" },
  { href: "/admin/marketing/faq", label: "FAQ", desc: "Questions & answers" },
  { href: "/admin/marketing/why-features", label: "Why People Love Us", desc: "Feature cards" },
  { href: "/admin/marketing/sections", label: "Homepage Sections", desc: "Enable, sort, titles" },
  { href: "/admin/marketing/seo", label: "SEO", desc: "Per-page metadata" },
  { href: "/admin/marketing/theme", label: "Theme Settings", desc: "Storefront toggles" },
];

export default function MarketingOverviewPage() {
  return (
    <div>
      <div className="flex flex-wrap items-start justify-between gap-4 mb-8">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <Megaphone className="h-8 w-8 text-brand" />
            <h1 className="text-3xl font-bold">Marketing CMS</h1>
          </div>
          <p className="text-muted-foreground max-w-2xl">
            Edit all storefront marketing content without touching code. Changes revalidate the public site automatically.
          </p>
        </div>
        <PreviewHomeLink />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
        {sections.map((section) => (
          <Link
            key={section.href}
            href={section.href}
            className="rounded-xl border bg-card p-5 hover:border-brand/50 hover:shadow-sm transition-all"
          >
            <h2 className="font-semibold">{section.label}</h2>
            <p className="text-sm text-muted-foreground mt-1">{section.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
