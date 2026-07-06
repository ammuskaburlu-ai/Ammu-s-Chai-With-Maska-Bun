"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { businessFormSchema } from "@/lib/marketing/schemas";

export type BusinessFormValues = z.infer<typeof businessFormSchema>;

export function BusinessFormFields({
  register,
}: {
  register: UseFormRegister<BusinessFormValues>;
}) {
  return (
    <>
      <div>
        <Label>Business Name</Label>
        <Input {...register("business_name")} />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <Label>Phone</Label>
          <Input {...register("business_phone")} />
        </div>
        <div>
          <Label>Email</Label>
          <Input type="email" {...register("business_email")} />
        </div>
      </div>
      <div>
        <Label>Address</Label>
        <Textarea rows={3} {...register("business_address")} />
      </div>
      <div>
        <Label>About</Label>
        <Textarea rows={4} {...register("about")} />
      </div>
    </>
  );
}

export const businessFormDefaults: BusinessFormValues = {
  business_name: "",
  business_phone: "",
  business_email: "",
  business_address: "",
  about: "",
};
