"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { socialFormSchema } from "@/lib/marketing/schemas";

export type SocialFormValues = z.infer<typeof socialFormSchema>;

export function SocialFormFields({
  register,
}: {
  register: UseFormRegister<SocialFormValues>;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Instagram URL</Label>
          <Input {...register("instagram_url")} />
        </div>
        <div>
          <Label>Instagram Handle</Label>
          <Input placeholder="ammuschai" {...register("instagram_handle")} />
        </div>
      </div>
      <div>
        <Label>Google Reviews URL</Label>
        <Input {...register("google_reviews_url")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>WhatsApp</Label>
          <Input {...register("whatsapp")} />
        </div>
        <div>
          <Label>Google Maps URL</Label>
          <Input {...register("maps_url")} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Location Note</Label>
          <Input {...register("location_note")} />
        </div>
        <div>
          <Label>Plus Code</Label>
          <Input {...register("plus_code")} />
        </div>
      </div>
    </>
  );
}

export const socialFormDefaults: SocialFormValues = {
  instagram_url: "",
  instagram_handle: "",
  google_reviews_url: "",
  whatsapp: "",
  maps_url: "",
  location_note: "",
  plus_code: "",
};
