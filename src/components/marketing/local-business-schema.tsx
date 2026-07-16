import { APP_NAME, APP_URL } from "@/lib/constants";

interface LocalBusinessSchemaProps {
  settings: {
    businessName: string;
    businessPhone: string;
    businessEmail: string;
    businessAddress: string;
    about?: string;
    contact?: { maps_url?: string; whatsapp?: string };
  };
}

export function LocalBusinessSchema({ settings }: LocalBusinessSchemaProps) {
  const schema = {
    "@context": "https://schema.org",
    "@type": "Restaurant",
    name: settings.businessName || APP_NAME,
    url: APP_URL,
    description: settings.about || "Order your favorite food online.",
    ...(settings.businessAddress ? { address: settings.businessAddress } : {}),
    ...(settings.businessPhone ? { telephone: settings.businessPhone } : {}),
    ...(settings.businessEmail ? { email: settings.businessEmail } : {}),
    ...(settings.contact?.maps_url ? { hasMap: settings.contact.maps_url } : {}),
    servesCuisine: ["Indian", "Snacks", "Beverages"],
    priceRange: "₹₹",
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}
