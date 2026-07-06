"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { announcementSchema } from "@/lib/marketing/schemas";

export type AnnouncementFormValues = z.input<typeof announcementSchema>;

export function AnnouncementFormFields({
  register,
}: {
  register: UseFormRegister<AnnouncementFormValues>;
}) {
  return (
    <>
      <div>
        <Label>Message</Label>
        <Textarea rows={2} {...register("message")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Link URL</Label>
          <Input {...register("link_url")} />
        </div>
        <div>
          <Label>Link Label</Label>
          <Input {...register("link_label")} />
        </div>
      </div>
      <div>
        <Label>Sort Order</Label>
        <Input type="number" {...register("sort_order")} />
      </div>
    </>
  );
}

export const announcementFormDefaults: AnnouncementFormValues = {
  message: "",
  link_url: "",
  link_label: "",
  sort_order: 0,
  is_active: false,
};
