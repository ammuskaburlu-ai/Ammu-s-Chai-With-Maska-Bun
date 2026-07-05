import { ExternalLink, Instagram, Play } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import type { Influencer } from "@/types/marketing";

interface InfluencerCardProps {
  influencer: Influencer;
}

function AvatarPlaceholder({ name }: { name: string }) {
  const initial = name.charAt(0).toUpperCase();
  return (
    <div className="h-14 w-14 rounded-full bg-gradient-to-br from-brand/30 to-brand/10 flex items-center justify-center text-lg font-bold text-brand shrink-0">
      {initial}
    </div>
  );
}

export function InfluencerCard({ influencer }: InfluencerCardProps) {
  return (
    <article className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow min-w-[260px] md:min-w-0 snap-start shrink-0 md:shrink">
      <div className="relative aspect-video bg-gradient-to-br from-brand/20 via-muted to-brand/5 flex items-center justify-center">
        <Play className="h-10 w-10 text-brand/60" />
        <span className="absolute bottom-2 left-2 text-xs bg-black/50 text-white px-2 py-0.5 rounded-full">
          Reel preview
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div className="flex items-center gap-3">
          <AvatarPlaceholder name={influencer.name} />
          <div className="min-w-0">
            <p className="font-semibold truncate">{influencer.name}</p>
            <p className="text-sm text-brand flex items-center gap-1 truncate">
              <Instagram className="h-3.5 w-3.5 shrink-0" />
              {influencer.handle}
            </p>
            <p className="text-xs text-muted-foreground">{influencer.followers} followers</p>
          </div>
        </div>
        <p className="text-sm text-muted-foreground line-clamp-2">&ldquo;{influencer.quote}&rdquo;</p>
        {influencer.reelUrl && (
          <Button variant="outline" size="sm" className="w-full" asChild>
            <Link href={influencer.reelUrl} target="_blank" rel="noopener noreferrer">
              Watch Reel <ExternalLink className="ml-1 h-3.5 w-3.5" />
            </Link>
          </Button>
        )}
      </div>
    </article>
  );
}
