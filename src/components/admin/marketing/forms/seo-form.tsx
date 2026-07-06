"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { seoFormSchema } from "@/lib/marketing/schemas";

export type SEOFormValues = z.input<typeof seoFormSchema>;

export function SEOFormFields({
  register,
}: {
  register: UseFormRegister<SEOFormValues>;
}) {
  return (
    <>
      <div>
        <Label>Page Key</Label>
        <Input placeholder="home, menu, community" {...register("page_key")} />
      </div>
      <div>
        <Label>Meta Title</Label>
        <Input {...register("meta_title")} />
      </div>
      <div>
        <Label>Meta Description</Label>
        <Textarea rows={3} {...register("meta_description")} />
      </div>
      <div>
        <Label>Keywords</Label>
        <Input {...register("keywords")} />
      </div>
      <div>
        <Label>OG Image URL</Label>
        <Input {...register("og_image_url")} />
      </div>
      <div>
        <Label>Canonical Path</Label>
        <Input placeholder="/" {...register("canonical_path")} />
      </div>
    </>
  );
}

export const seoFormDefaults: SEOFormValues = {
  page_key: "",
  meta_title: "",
  meta_description: "",
  keywords: "",
  og_image_url: "",
  canonical_path: "",
  is_active: true,
};
