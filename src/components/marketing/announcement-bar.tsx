import Link from "next/link";
import type { MarketingAnnouncement } from "@/types/marketing-db";

interface AnnouncementBarProps {
  announcements: MarketingAnnouncement[];
  enabled: boolean;
}

export function AnnouncementBar({ announcements, enabled }: AnnouncementBarProps) {
  if (!enabled || announcements.length === 0) return null;

  const announcement = announcements[0];

  return (
    <div className="bg-brand text-brand-foreground text-center text-sm py-2 px-4">
      <span>{announcement.message}</span>
      {announcement.link_url && (
        <>
          {" "}
          <Link
            href={announcement.link_url}
            className="underline font-medium hover:opacity-90"
          >
            {announcement.link_label || "Learn more"}
          </Link>
        </>
      )}
    </div>
  );
}
