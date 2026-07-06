"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { gallerySchema } from "@/lib/marketing/schemas";

export type GalleryFormValues = z.input<typeof gallerySchema>;

export function GalleryFormFields({
  register,
}: {
  register: UseFormRegister<GalleryFormValues>;
}) {
  return (
    <>
      <div>
        <Label>Image URL</Label>
        <Input {...register("image_url")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Customer Name</Label>
          <Input {...register("customer_name")} />
        </div>
        <div>
          <Label>Instagram Handle</Label>
          <Input placeholder="@username" {...register("instagram_handle")} />
        </div>
      </div>
      <div>
        <Label>Caption</Label>
        <Textarea rows={2} {...register("caption")} />
      </div>
      <div>
        <Label>Sort Order</Label>
        <Input type="number" {...register("sort_order")} />
      </div>
    </>
  );
}

export const galleryFormDefaults: GalleryFormValues = {
  image_url: "",
  customer_name: "",
  instagram_handle: "",
  caption: "",
  sort_order: 0,
  is_active: true,
};
