import { Play } from "lucide-react";
import { SectionHeader } from "@/components/marketing/section-header";
import { PLACEHOLDER_VIDEO_TESTIMONIALS } from "@/lib/marketing/placeholder-data";
import type { VideoTestimonial } from "@/types/marketing";

interface VideoTestimonialsSectionProps {
  videos?: VideoTestimonial[];
  title?: string;
  subtitle?: string;
}

export function VideoTestimonialsSection({
  videos,
  title = "Video Testimonials",
  subtitle = "Honest reviews from our customers — videos coming soon",
}: VideoTestimonialsSectionProps) {
  const items = videos && videos.length > 0 ? videos : PLACEHOLDER_VIDEO_TESTIMONIALS;

  return (
    <section id="video-testimonials" className="py-12 md:py-16 scroll-mt-20">
      <div className="container mx-auto px-4">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
          {items.map((video) => (
            <article
              key={video.id}
              className="rounded-xl border bg-card overflow-hidden"
              aria-label={`Video testimonial from ${video.customerName}`}
            >
              <div className="relative aspect-video bg-gradient-to-br from-brand/25 via-muted to-brand/10 flex items-center justify-center">
                {video.thumbnailUrl ? (
                  <img
                    src={video.thumbnailUrl}
                    alt=""
                    className="absolute inset-0 h-full w-full object-cover"
                  />
                ) : null}
                <div className="relative h-14 w-14 rounded-full bg-background/90 flex items-center justify-center shadow-md">
                  <Play className="h-6 w-6 text-brand fill-brand ml-0.5" aria-hidden />
                </div>
                {!video.videoUrl && (
                  <span className="absolute bottom-2 right-2 text-xs bg-background/90 text-muted-foreground px-2 py-0.5 rounded-full">
                    Coming soon
                  </span>
                )}
              </div>
              <div className="p-4">
                <h3 className="font-semibold">{video.customerName}</h3>
                {video.quote && (
                  <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                    &ldquo;{video.quote}&rdquo;
                  </p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
