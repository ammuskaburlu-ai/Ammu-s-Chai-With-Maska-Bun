"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { reviewSchema } from "@/lib/marketing/schemas";

export type ReviewFormValues = z.input<typeof reviewSchema>;

export function ReviewFormFields({
  register,
}: {
  register: UseFormRegister<ReviewFormValues>;
}) {
  return (
    <>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Reviewer Name</Label>
          <Input {...register("reviewer")} />
        </div>
        <div>
          <Label>Date Label</Label>
          <Input placeholder="2 weeks ago" {...register("review_date")} />
        </div>
      </div>
      <div>
        <Label>Rating (1–5)</Label>
        <Input type="number" min={1} max={5} {...register("rating")} />
      </div>
      <div>
        <Label>Review Text</Label>
        <Textarea rows={4} {...register("review_text")} />
      </div>
      <div>
        <Label>Photo URL</Label>
        <Input {...register("photo_url")} />
      </div>
      <div>
        <Label>Google Review ID</Label>
        <Input {...register("google_review_id")} />
      </div>
      <div>
        <Label>Sort Order</Label>
        <Input type="number" {...register("sort_order")} />
      </div>
    </>
  );
}

export const reviewFormDefaults: ReviewFormValues = {
  reviewer: "",
  review_date: "",
  rating: 5,
  review_text: "",
  photo_url: "",
  google_review_id: "",
  sort_order: 0,
  is_active: true,
};
