import { cache } from "react";
import { createClient } from "@/lib/supabase/server";

export const getSettings = cache(async () => {
  const supabase = await createClient();
  const { data } = await supabase.from("settings").select("key, value");

  const settings: Record<string, unknown> = {};
  data?.forEach((s) => {
    if (typeof s.value === "string") {
      try {
        settings[s.key] = JSON.parse(s.value);
      } catch {
        settings[s.key] = s.value;
      }
    } else {
      settings[s.key] = s.value;
    }
  });

  return {
    businessName: (settings.business_name as string) || "Ammu's Chai With Maska Bun",
    businessPhone: (settings.business_phone as string) || "",
    businessEmail: (settings.business_email as string) || "",
    businessAddress: (settings.business_address as string) || "",
    isStoreOpen: settings.is_store_open !== false, // Default to true if undefined
    deliveryFee: Number(settings.delivery_fee) || 40,
    freeDeliveryThreshold: Number(settings.free_delivery_threshold) || 0,
    minOrderValue: Number(settings.min_order_value) || 99,
    heroBanner: settings.hero_banner as { title: string; subtitle: string; image: string } | undefined,
    openingHours: settings.opening_hours as Record<string, string> | undefined,
    about: (settings.about as string) || "",
    contact: {
      whatsapp: (settings.contact as Record<string, string>)?.whatsapp || "",
      maps_url: (settings.contact as Record<string, string>)?.maps_url || "",
      location_note: (settings.contact as Record<string, string>)?.location_note || "",
      plus_code: (settings.contact as Record<string, string>)?.plus_code || "",
      instagram: (settings.contact as Record<string, string>)?.instagram || "",
      youtube: (settings.contact as Record<string, string>)?.youtube || "",
    },
  };
});
