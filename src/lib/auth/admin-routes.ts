import { getSafeRedirect } from "@/lib/auth/safe-redirect";

export const ADMIN_PUBLIC_ROUTES = [
  "/admin/login",
  "/admin/forgot-password",
  "/admin/reset-password",
] as const;

export type AdminPublicRoute = (typeof ADMIN_PUBLIC_ROUTES)[number];

export function isAdminPublicRoute(pathname: string): boolean {
  return (ADMIN_PUBLIC_ROUTES as readonly string[]).includes(pathname);
}

export function isAdminProtectedRoute(pathname: string): boolean {
  if (pathname === "/admin") return true;
  if (!pathname.startsWith("/admin/")) return false;
  return !isAdminPublicRoute(pathname);
}

export function isAdminApiRoute(pathname: string): boolean {
  return pathname.startsWith("/api/admin/") || pathname.startsWith("/api/test/");
}

/** Only allow redirects within the protected admin panel. */
export function getSafeAdminRedirect(
  redirect: string | null | undefined,
  fallback = "/admin"
): string {
  const safe = getSafeRedirect(redirect, fallback);
  if (!isAdminProtectedRoute(safe)) {
    return fallback;
  }
  return safe;
}

/** Customer login must never redirect into /admin. */
export function getSafeCustomerRedirect(
  redirect: string | null | undefined,
  fallback = "/"
): string {
  const safe = getSafeRedirect(redirect, fallback);
  if (safe === "/admin" || safe.startsWith("/admin/")) {
    return fallback;
  }
  return safe;
}

export function getResetPasswordPath(next: string): string {
  return next === "/admin/reset-password" ? "/admin/reset-password" : "/reset-password";
}

export function getLoginPathForReset(next: string): string {
  return next === "/admin/reset-password" ? "/admin/login" : "/login";
}

export function getForgotPasswordPathForReset(next: string): string {
  return next === "/admin/reset-password" ? "/admin/forgot-password" : "/forgot-password";
}
