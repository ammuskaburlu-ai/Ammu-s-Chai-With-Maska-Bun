/// <reference lib="webworker" />
import { defaultCache } from "@serwist/next/worker";
import type { PrecacheEntry, SerwistGlobalConfig } from "serwist";
import { NetworkOnly, Serwist } from "serwist";

declare global {
  interface WorkerGlobalScope extends SerwistGlobalConfig {
    __SW_MANIFEST: (PrecacheEntry | string)[] | undefined;
  }
}

declare const self: ServiceWorkerGlobalScope;

/** Never cache authenticated or admin routes in the service worker. */
function isAuthSensitivePath(pathname: string): boolean {
  return (
    pathname.startsWith("/admin") ||
    pathname.startsWith("/account") ||
    pathname.startsWith("/orders") ||
    pathname.startsWith("/checkout") ||
    pathname.startsWith("/api") ||
    pathname === "/login" ||
    pathname === "/register" ||
    pathname === "/forgot-password" ||
    pathname === "/reset-password" ||
    pathname.startsWith("/auth")
  );
}

/** Third-party payment, auth, and analytics origins — never cache in SW. */
const NETWORK_ONLY_HOSTS = new Set([
  "checkout.razorpay.com",
  "cdn.razorpay.com",
  "api.razorpay.com",
  "lumberjack.razorpay.com",
  "api.sardine.ai",
  "www.google-analytics.com",
  "region1.google-analytics.com",
  "www.googletagmanager.com",
]);

function isNetworkOnlyOrigin(hostname: string): boolean {
  if (NETWORK_ONLY_HOSTS.has(hostname)) return true;
  return hostname.endsWith(".supabase.co");
}

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ request, url }) =>
        request.mode === "navigate" && isAuthSensitivePath(url.pathname),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ url }) => isNetworkOnlyOrigin(url.hostname),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
