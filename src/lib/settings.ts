import { createClient } from "@/lib/supabase/server";
import { DEFAULT_DELIVERY_FEE, DEFAULT_MIN_ORDER, LOYALTY_POINTS_PER_100 } from "@/lib/constants";

export async function getSettings() {
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
    deliveryFee: Number(settings.delivery_fee) || DEFAULT_DELIVERY_FEE,
    minOrderValue: Number(settings.min_order_value) || DEFAULT_MIN_ORDER,
    loyaltyPointsRate: Number(settings.loyalty_points_rate) || LOYALTY_POINTS_PER_100,
    heroBanner: settings.hero_banner as { title: string; subtitle: string; image: string } | undefined,
    openingHours: settings.opening_hours as Record<string, string> | undefined,
    about: (settings.about as string) || "",
    contact: settings.contact as {
      whatsapp: string;
      maps_url?: string;
      location_note?: string;
      plus_code?: string;
    } | undefined,
  };
}
