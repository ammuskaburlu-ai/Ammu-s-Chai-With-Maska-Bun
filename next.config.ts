import type { NextConfig } from "next";
import withSerwistInit from "@serwist/next";

const isDev = process.env.NODE_ENV === "development";

/** CSP applied globally via Next.js headers (see headers() below). */
function buildContentSecurityPolicy(): string {
  const scriptSrc = [
    "'self'",
    "'unsafe-inline'", // Next.js App Router hydration + inline gtag bootstrap
    "https://checkout.razorpay.com", // checkout.js
    "https://cdn.razorpay.com", // risk-detection bundle loaded by checkout.js
    "https://www.googletagmanager.com", // gtag/js loader
    ...(isDev ? ["'unsafe-eval'"] : []), // Next.js dev tooling only
  ];

  return [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'none'",
    `script-src ${scriptSrc.join(" ")}`,
    "style-src 'self' 'unsafe-inline'", // Tailwind / component inline styles
    "img-src 'self' data: blob: https://*.supabase.co https://res.cloudinary.com https://www.google-analytics.com https://cdn.razorpay.com",
    "font-src 'self' data:", // next/font self-hosts Geist under /_next/static
    [
      "connect-src 'self'",
      "https://*.supabase.co", // Supabase REST/auth/storage
      "https://api.razorpay.com", // order + payment API
      "https://checkout.razorpay.com", // checkout modal telemetry
      "https://cdn.razorpay.com", // risk-detection bundle fetch
      "https://lumberjack.razorpay.com", // Razorpay client logging
      "https://www.google-analytics.com",
      "https://region1.google-analytics.com", // GA4 event collection
      "https://www.googletagmanager.com",
    ].join(" "),
    "frame-src 'self' https://checkout.razorpay.com https://api.razorpay.com",
    "worker-src 'self'", // Serwist service worker (/sw.js)
    "child-src 'self'", // legacy fallback aligned with worker-src
    "form-action 'self'",
    ...(isDev ? [] : ["upgrade-insecure-requests"]),
  ].join("; ");
}

const withSerwist = withSerwistInit({
  swSrc: "src/sw.ts",
  swDest: "public/sw.js",
  disable: process.env.NODE_ENV === "development",
});

const nextConfig: NextConfig = {
  images: {
    remotePatterns: [
      {
        protocol: "https",
        hostname: "*.supabase.co",
      },
      {
        protocol: "https",
        hostname: "res.cloudinary.com",
      },
    ],
  },
  headers: async () => [
    {
      source: "/admin/:path*",
      headers: [
        { key: "Cache-Control", value: "no-store, no-cache, must-revalidate, proxy-revalidate" },
        { key: "Pragma", value: "no-cache" },
        { key: "Expires", value: "0" },
      ],
    },
    {
      source: "/(.*)",
      headers: [
        { key: "X-Content-Type-Options", value: "nosniff" },
        { key: "X-Frame-Options", value: "DENY" },
        { key: "X-XSS-Protection", value: "1; mode=block" },
        { key: "Referrer-Policy", value: "strict-origin-when-cross-origin" },
        {
          key: "Content-Security-Policy",
          value: buildContentSecurityPolicy(),
        },
      ],
    },
  ],
};

export default withSerwist(nextConfig);
