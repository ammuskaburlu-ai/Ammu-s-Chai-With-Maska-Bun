import { ShieldCheck, Star, Truck, Users, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

export function HeroTrustIndicators() {
  const items = [
    { icon: Star, label: "★★★★★ Loved in Nellore" },
    { icon: ShieldCheck, label: "Secure Payments" },
    { icon: Truck, label: "Fast Local Delivery" },
    { icon: Users, label: "Featured by Nellore Food Creators" },
  ];

  return (
    <div className="mt-8 space-y-5">
      <div className="flex flex-wrap gap-x-5 gap-y-3">
        {items.map(({ icon: Icon, label }) => (
          <div
            key={label}
            className="flex items-center gap-2 text-sm text-muted-foreground"
          >
            <Icon className="h-4 w-4 text-brand shrink-0" />
            <span>{label}</span>
          </div>
        ))}
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
