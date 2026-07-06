"use client";

import { MarketingCrudPage } from "@/components/admin/marketing/marketing-crud-page";
import { createAnnouncement, updateAnnouncement } from "@/lib/marketing/actions";
import { announcementSchema } from "@/lib/marketing/schemas";
import {
  AnnouncementFormFields,
  announcementFormDefaults,
} from "@/components/admin/marketing/forms/announcement-form";

export default function MarketingAnnouncementPage() {
  return (
    <MarketingCrudPage
      title="Announcement Bar"
      description="Top-of-site banner messages. Enable in Theme Settings to display."
      table="marketing_announcements"
      schema={announcementSchema}
      defaultValues={announcementFormDefaults}
      onCreate={createAnnouncement}
      onUpdate={updateAnnouncement}
      columns={[{ key: "message", label: "Message" }]}
      renderFields={(register) => <AnnouncementFormFields register={register} />}
    />
  );
}
