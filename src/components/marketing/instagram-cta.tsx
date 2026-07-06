import Link from "next/link";
import { Instagram } from "lucide-react";
import { Button } from "@/components/ui/button";
import { INSTAGRAM_HANDLE, INSTAGRAM_URL } from "@/lib/marketing/placeholder-data";

interface InstagramCtaProps {
  instagramHandle?: string;
  instagramUrl?: string;
}

export function InstagramCta({
  instagramHandle = INSTAGRAM_HANDLE,
  instagramUrl = INSTAGRAM_URL,
}: InstagramCtaProps) {
  return (
    <section className="py-16 md:py-20 bg-gradient-to-br from-brand/15 via-background to-brand/5">
      <div className="container mx-auto px-4 text-center max-w-2xl">
        <div className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-brand/10 text-brand mb-6">
          <Instagram className="h-7 w-7" />
        </div>
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight mb-4">
          Follow Us on Instagram
        </h2>
        <p className="text-muted-foreground mb-2">
          Daily chai moments, fresh batches, and community shoutouts.
        </p>
        <p className="text-brand font-medium mb-8">@{instagramHandle}</p>
        <div className="rounded-xl border border-dashed border-brand/30 bg-card/50 p-8 mb-8 text-sm text-muted-foreground">
          Instagram feed embed ready — connect your business profile when live.
        </div>
        <Button variant="brand" size="lg" asChild>
          <Link href={instagramUrl} target="_blank" rel="noopener noreferrer">
            Follow @{instagramHandle}
          </Link>
        </Button>
      </div>
    </section>
  );
}
