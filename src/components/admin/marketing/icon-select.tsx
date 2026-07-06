"use client";

import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { MARKETING_ICON_OPTIONS } from "@/lib/marketing/icons";

interface IconSelectProps {
  value: string;
  onChange: (value: string) => void;
  label?: string;
}

export function IconSelect({ value, onChange, label = "Icon" }: IconSelectProps) {
  return (
    <div>
      <Label>{label}</Label>
      <Select value={value || "shield-check"} onValueChange={onChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select icon" />
        </SelectTrigger>
        <SelectContent>
          {MARKETING_ICON_OPTIONS.map((icon) => (
            <SelectItem key={icon} value={icon}>
              {icon}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}
