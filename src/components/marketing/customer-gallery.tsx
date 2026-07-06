import { Instagram } from "lucide-react";
import { SectionHeader } from "@/components/marketing/section-header";
import { PLACEHOLDER_GALLERY } from "@/lib/marketing/placeholder-data";
import type { GalleryItem } from "@/types/marketing";

interface CustomerGalleryProps {
  items?: GalleryItem[];
  title?: string;
  subtitle?: string;
}

export function CustomerGallery({
  items,
  title = "Customer Gallery",
  subtitle = "Real moments from our chai-loving community",
}: CustomerGalleryProps) {
  const galleryItems = items && items.length > 0 ? items : PLACEHOLDER_GALLERY;

  return (
    <section className="py-12 md:py-16 bg-muted/30">
      <div className="container mx-auto px-4">
        <SectionHeader title={title} subtitle={subtitle} />
        <div className="columns-2 md:columns-3 gap-4 space-y-4">
          {galleryItems.map((item, index) => (
            <article
              key={item.id}
              className="break-inside-avoid rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow"
            >
              {item.imageUrl ? (
                <img
                  src={item.imageUrl}
                  alt={item.caption || item.customerName || "Customer photo"}
                  className={`w-full object-cover ${
                    index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-square" : "aspect-[3/4]"
                  }`}
                />
              ) : (
                <div
                  className={`bg-gradient-to-br from-brand/20 via-muted to-brand/5 flex items-center justify-center text-3xl ${
                    index % 3 === 0 ? "aspect-[4/5]" : index % 3 === 1 ? "aspect-square" : "aspect-[3/4]"
                  }`}
                  aria-hidden
                >
                  ☕
                </div>
              )}
              <div className="p-3">
                {item.customerName && (
                  <p className="font-medium text-sm">{item.customerName}</p>
                )}
                {item.instagramHandle && (
                  <p className="text-xs text-brand flex items-center gap-1 mt-0.5">
                    <Instagram className="h-3 w-3" />
                    {item.instagramHandle}
                  </p>
                )}
                {item.caption && (
                  <p className="text-xs text-muted-foreground mt-2 line-clamp-2">{item.caption}</p>
                )}
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
