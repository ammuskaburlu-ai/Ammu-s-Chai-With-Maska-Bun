import { getSettings } from "@/lib/settings";
import { Phone, Mail, MapPin, ExternalLink } from "lucide-react";
import type { Metadata } from "next";
import { APP_NAME } from "@/lib/constants";

export const metadata: Metadata = {
  title: "Contact Us",
  description: `Get in touch with ${APP_NAME} for orders, feedback, or inquiries.`,
};

export default async function ContactPage() {
  const settings = await getSettings();

  return (
    <div className="container mx-auto px-4 py-12 max-w-3xl">
      <h1 className="text-4xl font-bold mb-6">Contact Us</h1>
      <div className="space-y-6">
        {settings.businessPhone && (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
              <Phone className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="font-medium">Phone</p>
              <a href={`tel:${settings.businessPhone}`} className="text-muted-foreground hover:text-brand">
                {settings.businessPhone}
              </a>
            </div>
          </div>
        )}
        {settings.businessEmail && (
          <div className="flex items-center gap-4">
            <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand/10">
              <Mail className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="font-medium">Email</p>
              <a href={`mailto:${settings.businessEmail}`} className="text-muted-foreground hover:text-brand">
                {settings.businessEmail}
              </a>
            </div>
          </div>
        )}
        {settings.businessAddress && (
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand/10">
              <MapPin className="h-5 w-5 text-brand" />
            </div>
            <div>
              <p className="font-medium">Address</p>
              <p className="text-muted-foreground">{settings.businessAddress}</p>
              {settings.contact?.location_note && (
                <p className="text-sm text-muted-foreground mt-1">{settings.contact.location_note}</p>
              )}
              {settings.contact?.plus_code && (
                <p className="text-sm text-muted-foreground mt-1">{settings.contact.plus_code}</p>
              )}
              {settings.contact?.maps_url && (
                <a
                  href={settings.contact.maps_url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-sm text-brand hover:underline mt-2"
                >
                  View on Google Maps
                  <ExternalLink className="h-3.5 w-3.5" />
                </a>
              )}
            </div>
          </div>
        )}
        {settings.contact?.whatsapp && (
          <div className="rounded-xl border p-6 bg-brand/5">
            <p className="font-medium mb-2">WhatsApp Us</p>
            <a
              href={`https://wa.me/${settings.contact.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand hover:underline"
            >
              {settings.contact.whatsapp}
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
