"use client";

import { useCallback } from "react";
import { createClient } from "@/lib/supabase/client";
import { saveSocialLinks } from "@/lib/marketing/actions";
import { socialFormSchema } from "@/lib/marketing/schemas";
import { SettingsMarketingForm } from "@/components/admin/marketing/settings-marketing-form";
import {
  SocialFormFields,
  socialFormDefaults,
} from "@/components/admin/marketing/forms/social-form";

export default function MarketingSocialPage() {
  const loadValues = useCallback(async () => {
    const supabase = createClient();
    const [{ data: social }, { data: contactRow }] = await Promise.all([
      supabase.from("marketing_social_links").select("*"),
      supabase.from("settings").select("value").eq("key", "contact").maybeSingle(),
    ]);

    const instagram = social?.find((s) => s.platform === "instagram");
    const google = social?.find((s) => s.platform === "google_reviews");
    let contact: Record<string, string> = {};
    const contactVal = contactRow?.value;
    if (contactVal && typeof contactVal === "object") {
      contact = contactVal as Record<string, string>;
    } else if (typeof contactVal === "string") {
      try {
        contact = JSON.parse(contactVal);
      } catch {
        contact = {};
      }
    }

    return {
      ...socialFormDefaults,
      instagram_url: instagram?.url || "",
      instagram_handle: instagram?.handle || "",
      google_reviews_url: google?.url || "",
      whatsapp: contact.whatsapp || "",
      maps_url: contact.maps_url || "",
      location_note: contact.location_note || "",
      plus_code: contact.plus_code || "",
    };
  }, []);

  return (
    <SettingsMarketingForm
      title="Social Links"
      description="Instagram, Google Reviews, WhatsApp, and maps links for CTAs and footer."
      schema={socialFormSchema}
      defaultValues={socialFormDefaults}
      loadValues={loadValues}
      onSave={saveSocialLinks}
      renderFields={(form) => <SocialFormFields register={form.register} />}
    />
  );
}
