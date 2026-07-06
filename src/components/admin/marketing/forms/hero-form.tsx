"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { heroFormSchema } from "@/lib/marketing/schemas";

export type HeroFormValues = z.infer<typeof heroFormSchema>;

export function HeroFormFields({
  register,
}: {
  register: UseFormRegister<HeroFormValues>;
}) {
  return (
    <>
      <div>
        <Label>Hero Title</Label>
        <Input {...register("title")} />
      </div>
      <div>
        <Label>Hero Subtitle</Label>
        <Textarea rows={2} {...register("subtitle")} />
      </div>
      <div>
        <Label>Hero Image URL</Label>
        <Input placeholder="https://..." {...register("image")} />
        <p className="text-xs text-muted-foreground mt-1">
          Image upload coming later — paste a URL for now.
        </p>
      </div>
    </>
  );
}

export const heroFormDefaults: HeroFormValues = {
  title: "",
  subtitle: "",
  image: "",
};
