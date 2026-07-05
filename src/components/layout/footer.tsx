import Link from "next/link";
import { Clock, Instagram, MapPin, MessageCircle, Phone } from "lucide-react";
import { APP_NAME } from "@/lib/constants";
import { INSTAGRAM_URL } from "@/lib/marketing/placeholder-data";

interface FooterProps {
  businessName?: string;
  businessPhone?: string;
  businessEmail?: string;
  businessAddress?: string;
  openingHours?: Record<string, string>;
  whatsapp?: string;
  mapsUrl?: string;
}

const DEFAULT_HOURS: Record<string, string> = {
  Mon: "7:00 AM – 10:00 PM",
  Tue: "7:00 AM – 10:00 PM",
  Wed: "7:00 AM – 10:00 PM",
  Thu: "7:00 AM – 10:00 PM",
  Fri: "7:00 AM – 10:00 PM",
  Sat: "7:00 AM – 10:00 PM",
  Sun: "7:00 AM – 10:00 PM",
};

export function Footer({
  businessName = APP_NAME,
  businessPhone,
  businessEmail,
  businessAddress,
  openingHours,
  whatsapp,
  mapsUrl,
}: FooterProps) {
  const hours = openingHours && Object.keys(openingHours).length > 0 ? openingHours : DEFAULT_HOURS;
  const whatsappLink = whatsapp
    ? `https://wa.me/${whatsapp.replace(/\D/g, "")}`
    : businessPhone
      ? `https://wa.me/${businessPhone.replace(/\D/g, "")}`
      : null;

  return (
    <footer className="border-t bg-muted/50">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8">
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg font-bold text-brand mb-4">{businessName}</h3>
            <p className="text-sm text-muted-foreground">
              Fresh chai, maska bun, and snacks delivered across Nellore.
            </p>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/menu" className="hover:text-brand">Menu</Link></li>
              <li><Link href="/community" className="hover:text-brand">Community</Link></li>
              <li><Link href="/about" className="hover:text-brand">About Us</Link></li>
              <li><Link href="/contact" className="hover:text-brand">Contact</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Account</h4>
            <ul className="space-y-2 text-sm text-muted-foreground">
              <li><Link href="/login" className="hover:text-brand">Login</Link></li>
              <li><Link href="/register" className="hover:text-brand">Register</Link></li>
              <li><Link href="/account/orders" className="hover:text-brand">My Orders</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4" /> Business Hours
            </h4>
            <ul className="space-y-1 text-sm text-muted-foreground">
              {Object.entries(hours).map(([day, time]) => (
                <li key={day} className="flex justify-between gap-2">
                  <span>{day}</span>
                  <span>{time}</span>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <h4 className="font-semibold mb-4">Contact</h4>
            <ul className="space-y-3 text-sm text-muted-foreground">
              {businessPhone && (
                <li>
                  <a href={`tel:${businessPhone}`} className="inline-flex items-center gap-2 hover:text-brand">
                    <Phone className="h-4 w-4 shrink-0" />
                    {businessPhone}
                  </a>
                </li>
              )}
              {businessEmail && <li>{businessEmail}</li>}
              {businessAddress && (
                <li className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 shrink-0 mt-0.5" />
                  <span>{businessAddress}</span>
                </li>
              )}
              {mapsUrl && (
                <li>
                  <a
                    href={mapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-brand"
                  >
                    <MapPin className="h-4 w-4 shrink-0" />
                    Google Maps
                  </a>
                </li>
              )}
              <li>
                <a
                  href={INSTAGRAM_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 hover:text-brand"
                >
                  <Instagram className="h-4 w-4 shrink-0" />
                  Instagram
                </a>
              </li>
              {whatsappLink && (
                <li>
                  <a
                    href={whatsappLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-2 hover:text-brand"
                  >
                    <MessageCircle className="h-4 w-4 shrink-0" />
                    WhatsApp
                  </a>
                </li>
              )}
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
          © {new Date().getFullYear()} {businessName}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}
