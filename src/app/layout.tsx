import type { Metadata, Viewport } from "next";
import { Geist } from "next/font/google";
import "./globals.css";
import { Providers } from "@/components/providers";
import { Header } from "@/components/layout/header";
import { Footer } from "@/components/layout/footer";
import { AnnouncementBar } from "@/components/marketing/announcement-bar";
import { createClient } from "@/lib/supabase/server";
import { getSettings } from "@/lib/settings";
import { getMarketingContent } from "@/lib/marketing/queries";
import { APP_NAME, APP_DESCRIPTION, APP_URL } from "@/lib/constants";
import Script from "next/script";

const geist = Geist({ subsets: ["latin"], variable: "--font-geist-sans" });

export async function generateMetadata(): Promise<Metadata> {
  const settings = await getSettings();
  const businessName = settings.businessName || APP_NAME;
  const description = settings.about || APP_DESCRIPTION;

  return {
    metadataBase: new URL(APP_URL),
    title: {
      default: `${businessName} - Order Food Online`,
      template: `%s | ${businessName}`,
    },
    description,
    keywords: ["food delivery", "online ordering", "snacks", "fast food", "tiffins"],
    authors: [{ name: businessName }],
    openGraph: {
      type: "website",
      locale: "en_IN",
      url: APP_URL,
      siteName: businessName,
      title: `${businessName} - Order Food Online`,
      description,
    },
    twitter: {
      card: "summary_large_image",
      title: businessName,
      description,
    },
    alternates: {
      canonical: APP_URL,
    },
    robots: {
      index: true,
      follow: true,
    },
    manifest: "/manifest.json",
    icons: {
      icon: [
        { url: "/favicon.ico", sizes: "48x48", type: "image/x-icon" },
        { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
        { url: "/icons/icon-512.png", sizes: "512x512", type: "image/png" },
      ],
      apple: [{ url: "/apple-touch-icon.png", sizes: "180x180", type: "image/png" }],
    },
    appleWebApp: {
      capable: true,
      statusBarStyle: "default",
      title: businessName,
    },
  };
}

export const viewport: Viewport = {
  themeColor: "#FF6B35",
  width: "device-width",
  initialScale: 1,
  maximumScale: 1,
};

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();
  let profile = null;
  if (user) {
    const { data } = await supabase
      .from("profiles")
      .select("email, full_name")
      .eq("id", user.id)
      .single();
    profile = data;
  }

  const settings = await getSettings();
  const marketing = await getMarketingContent();

  return (
    <html lang="en">
      <body className={`${geist.variable} font-sans min-h-screen flex flex-col`}>
        <a
          href="#main-content"
          className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:top-4 focus:left-4 focus:rounded-md focus:bg-background focus:px-4 focus:py-2 focus:shadow-md focus:ring-2 focus:ring-ring"
        >
          Skip to main content
        </a>
        {process.env.NEXT_PUBLIC_GA_ID && (
          <>
            <Script
              src={`https://www.googletagmanager.com/gtag/js?id=${process.env.NEXT_PUBLIC_GA_ID}`}
              strategy="afterInteractive"
            />
            <Script id="ga" strategy="afterInteractive">
              {`window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${process.env.NEXT_PUBLIC_GA_ID}');`}
            </Script>
          </>
        )}
        <Providers>
          <AnnouncementBar
            announcements={marketing.announcements}
            enabled={Boolean(marketing.theme.show_announcement_bar)}
          />
          <Header 
            user={profile} 
            businessName={settings.businessName}
            isStoreOpen={settings.isStoreOpen}
          />
          <main id="main-content" className="flex-1">{children}</main>
          <Footer
            businessName={settings.businessName}
            businessPhone={settings.businessPhone}
            businessEmail={settings.businessEmail}
            businessAddress={settings.businessAddress}
            openingHours={settings.openingHours}
            whatsapp={settings.contact?.whatsapp}
            mapsUrl={settings.contact?.maps_url}
            instagram={settings.contact?.instagram}
            youtube={settings.contact?.youtube}
            about={settings.about}
          />
        </Providers>
      </body>
    </html>
  );
}
