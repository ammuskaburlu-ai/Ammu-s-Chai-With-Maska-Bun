/**
 * Prevent open redirects — only allow same-origin relative paths.
 */
export function getSafeRedirect(redirect: string | null | undefined, fallback = "/"): string {
  if (!redirect) return fallback;
  if (!redirect.startsWith("/") || redirect.startsWith("//")) return fallback;
  if (redirect.includes("\\")) return fallback;
  return redirect;
}
