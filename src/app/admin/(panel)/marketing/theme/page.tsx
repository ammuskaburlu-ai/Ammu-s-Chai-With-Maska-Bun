"use client";

import { useCallback } from "react";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { createClient } from "@/lib/supabase/client";
import { saveThemeSettings } from "@/lib/marketing/actions";
import { themeFormSchema } from "@/lib/marketing/schemas";
import { SettingsMarketingForm } from "@/components/admin/marketing/settings-marketing-form";

const defaults = { show_announcement_bar: false };

export default function MarketingThemePage() {
  const loadValues = useCallback(async () => {
    const supabase = createClient();
    const { data } = await supabase.from("settings").select("value").eq("key", "marketing_theme").maybeSingle();
    const val = data?.value;
    if (val && typeof val === "object") {
      return { ...defaults, ...(val as typeof defaults) };
    }
    if (typeof val === "string") {
      try {
        return { ...defaults, ...JSON.parse(val) };
      } catch {
        return defaults;
      }
    }
    return defaults;
  }, []);

  return (
    <SettingsMarketingForm
      title="Theme Settings"
      description="Storefront display toggles for marketing features."
      schema={themeFormSchema}
      defaultValues={defaults}
      loadValues={loadValues}
      onSave={saveThemeSettings}
      renderFields={(form) => (
        <div className="flex items-center gap-3">
          <Switch
            checked={Boolean(form.watch("show_announcement_bar"))}
            onCheckedChange={(checked) => form.setValue("show_announcement_bar", checked)}
          />
          <Label>Show announcement bar when an active announcement exists</Label>
        </div>
      )}
    />
  );
}
