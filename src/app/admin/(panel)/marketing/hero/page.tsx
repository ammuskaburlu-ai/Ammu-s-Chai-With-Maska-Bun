"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveHeroBanner } from "@/lib/marketing/actions";
import { heroFormSchema } from "@/lib/marketing/schemas";
import { SettingsMarketingForm } from "@/components/admin/marketing/settings-marketing-form";
import { HeroFormFields, heroFormDefaults } from "@/components/admin/marketing/forms/hero-form";

export default function MarketingHeroPage() {
  const loadValues = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("settings").select("value").eq("key", "hero_banner").maybeSingle();
    const val = data?.value;
    if (val && typeof val === "object") {
      return { ...heroFormDefaults, ...(val as typeof heroFormDefaults) };
    }
    if (typeof val === "string") {
      try {
        return { ...heroFormDefaults, ...JSON.parse(val) };
      } catch {
        return heroFormDefaults;
      }
    }
    return heroFormDefaults;
  }, []);

  return (
    <SettingsMarketingForm
      title="Homepage Hero"
      description="Main hero headline and imagery on the homepage."
      schema={heroFormSchema}
      defaultValues={heroFormDefaults}
      loadValues={loadValues}
      onSave={saveHeroBanner}
      renderFields={(form) => <HeroFormFields register={form.register} />}
    />
  );
}
