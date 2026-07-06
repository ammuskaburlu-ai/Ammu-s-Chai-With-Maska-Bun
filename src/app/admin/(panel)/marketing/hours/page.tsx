"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveOpeningHours } from "@/lib/marketing/actions";
import { hoursFormSchema } from "@/lib/marketing/schemas";
import { SettingsMarketingForm } from "@/components/admin/marketing/settings-marketing-form";
import { HoursFormFields, hoursFormDefaults } from "@/components/admin/marketing/forms/hours-form";

export default function MarketingHoursPage() {
  const loadValues = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("settings").select("value").eq("key", "opening_hours").maybeSingle();
    const val = data?.value;
    if (val && typeof val === "object") {
      return { ...hoursFormDefaults, ...(val as typeof hoursFormDefaults) };
    }
    if (typeof val === "string") {
      try {
        return { ...hoursFormDefaults, ...JSON.parse(val) };
      } catch {
        return hoursFormDefaults;
      }
    }
    return hoursFormDefaults;
  }, []);

  return (
    <SettingsMarketingForm
      title="Business Hours"
      description="Weekly hours shown in the footer and local business schema."
      schema={hoursFormSchema}
      defaultValues={hoursFormDefaults}
      loadValues={loadValues}
      onSave={saveOpeningHours}
      renderFields={(form) => <HoursFormFields register={form.register} />}
    />
  );
}
