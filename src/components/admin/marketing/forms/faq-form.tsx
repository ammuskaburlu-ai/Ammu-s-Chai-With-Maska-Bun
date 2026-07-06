"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { faqSchema } from "@/lib/marketing/schemas";

export type FAQFormValues = z.input<typeof faqSchema>;

export function FAQFormFields({
  register,
}: {
  register: UseFormRegister<FAQFormValues>;
}) {
  return (
    <>
      <div>
        <Label>Question</Label>
        <Input {...register("question")} />
      </div>
      <div>
        <Label>Answer</Label>
        <Textarea rows={4} {...register("answer")} />
      </div>
      <div>
        <Label>Sort Order</Label>
        <Input type="number" {...register("sort_order")} />
      </div>
    </>
  );
}

export const faqFormDefaults: FAQFormValues = {
  question: "",
  answer: "",
  sort_order: 0,
  is_active: true,
};
