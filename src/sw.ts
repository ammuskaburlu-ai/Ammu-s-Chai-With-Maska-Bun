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

/** Third-party payment, auth, and analytics — never cache; always hit network. */
function isNetworkOnlyOrigin(hostname: string): boolean {
  return (
    hostname === "checkout.razorpay.com" ||
    hostname === "cdn.razorpay.com" ||
    hostname === "api.razorpay.com" ||
    hostname === "lumberjack.razorpay.com" ||
    hostname === "api.sardine.ai" ||
    hostname === "www.google-analytics.com" ||
    hostname === "region1.google-analytics.com" ||
    hostname === "www.googletagmanager.com" ||
    hostname.endsWith(".supabase.co")
  );
}

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

const serwist = new Serwist({
  precacheEntries: self.__SW_MANIFEST,
  skipWaiting: true,
  clientsClaim: true,
  navigationPreload: true,
  runtimeCaching: [
    {
      matcher: ({ url }) => isNetworkOnlyOrigin(url.hostname),
      handler: new NetworkOnly(),
    },
    {
      matcher: ({ request, url }) =>
        request.mode === "navigate" && isAuthSensitivePath(url.pathname),
      handler: new NetworkOnly(),
    },
    ...defaultCache,
  ],
});

serwist.addEventListeners();
