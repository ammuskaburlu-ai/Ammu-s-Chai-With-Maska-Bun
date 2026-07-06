"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveBusinessInfo } from "@/lib/marketing/actions";
import { businessFormSchema } from "@/lib/marketing/schemas";
import { SettingsMarketingForm } from "@/components/admin/marketing/settings-marketing-form";
import {
  BusinessFormFields,
  businessFormDefaults,
} from "@/components/admin/marketing/forms/business-form";

export default function MarketingBusinessPage() {
  const loadValues = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase
      .from("settings")
      .select("key, value")
      .in("key", ["business_name", "business_phone", "business_email", "business_address", "about"]);

    const map: Record<string, string> = {};
    data?.forEach((row) => {
      const val = row.value;
      map[row.key] =
        typeof val === "string" ? val.replace(/^"|"$/g, "") : String(val ?? "");
    });

    return {
      business_name: map.business_name || businessFormDefaults.business_name,
      business_phone: map.business_phone || "",
      business_email: map.business_email || "",
      business_address: map.business_address || "",
      about: map.about || "",
    };
  }, []);

  return (
    <SettingsMarketingForm
      title="Business Information"
      description="Core business details used across the site, footer, and schema markup."
      schema={businessFormSchema}
      defaultValues={businessFormDefaults}
      loadValues={loadValues}
      onSave={saveBusinessInfo}
      renderFields={(form) => <BusinessFormFields register={form.register} />}
    />
  );
}
