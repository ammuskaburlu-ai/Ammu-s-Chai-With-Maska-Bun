"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import type { UseFormRegister } from "react-hook-form";
import type { z } from "zod";
import { hoursFormSchema } from "@/lib/marketing/schemas";

export type HoursFormValues = z.infer<typeof hoursFormSchema>;

const DAYS: (keyof HoursFormValues)[] = [
  "monday",
  "tuesday",
  "wednesday",
  "thursday",
  "friday",
  "saturday",
  "sunday",
];

export function HoursFormFields({
  register,
}: {
  register: UseFormRegister<HoursFormValues>;
}) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {DAYS.map((day) => (
        <div key={day}>
          <Label className="capitalize">{day}</Label>
          <Input placeholder="9:00 AM – 10:00 PM" {...register(day)} />
        </div>
      ))}
    </div>
  );
}

export const hoursFormDefaults: HoursFormValues = {
  monday: "",
  tuesday: "",
  wednesday: "",
  thursday: "",
  friday: "",
  saturday: "",
  sunday: "",
};
