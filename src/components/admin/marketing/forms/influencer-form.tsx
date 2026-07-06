"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { influencerSchema } from "@/lib/marketing/schemas";

export type InfluencerFormValues = z.input<typeof influencerSchema>;

export function InfluencerFormFields({
  register,
}: {
  register: UseFormRegister<InfluencerFormValues>;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Name</Label>
          <Input {...register("name")} />
        </div>
        <div>
          <Label>Handle</Label>
          <Input placeholder="@handle" {...register("handle")} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Followers</Label>
          <Input placeholder="48K" {...register("followers")} />
        </div>
        <div>
          <Label>Sort Order</Label>
          <Input type="number" {...register("sort_order")} />
        </div>
      </div>
      <div>
        <Label>Quote</Label>
        <Textarea rows={3} {...register("quote")} />
      </div>
      <div>
        <Label>Photo URL</Label>
        <Input {...register("photo_url")} />
      </div>
      <div>
        <Label>Reel Thumbnail URL</Label>
        <Input {...register("reel_thumbnail_url")} />
      </div>
      <div>
        <Label>Reel URL</Label>
        <Input {...register("reel_url")} />
      </div>
    </>
  );
}

export const influencerFormDefaults: InfluencerFormValues = {
  name: "",
  handle: "",
  followers: "",
  quote: "",
  photo_url: "",
  reel_thumbnail_url: "",
  reel_url: "",
  sort_order: 0,
  is_active: true,
};
