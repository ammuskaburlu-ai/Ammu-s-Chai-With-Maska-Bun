import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { getSafeRedirect } from "@/lib/auth/safe-redirect";
import {
  getLoginPathForReset,
  getResetPasswordPath,
} from "@/lib/auth/admin-routes";

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get("code");
  const next = getSafeRedirect(searchParams.get("next"), "/");
  const authError = searchParams.get("error");
  const errorCode = searchParams.get("error_code");
  const errorDescription = searchParams.get("error_description");

  const isResetFlow =
    next === "/reset-password" || next === "/admin/reset-password";

  if (authError) {
    const params = new URLSearchParams({ error: authError });
    if (errorCode) params.set("error_code", errorCode);
    if (errorDescription) params.set("error_description", errorDescription);

    const destination = isResetFlow ? getResetPasswordPath(next) : getLoginPathForReset(next);
    return NextResponse.redirect(`${origin}${destination}?${params.toString()}`);
  }

  if (code) {
    const supabase = await createClient();
    const { error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error) {
      return NextResponse.redirect(`${origin}${next}`);
    }

    const params = new URLSearchParams({
      error: "invalid_token",
      error_description: error.message,
    });
    const destination = isResetFlow
      ? getResetPasswordPath(next)
      : getLoginPathForReset(next);
    return NextResponse.redirect(`${origin}${destination}?${params.toString()}`);
  }

  return NextResponse.redirect(`${origin}/login?error=auth`);
}

export const dynamic = "force-dynamic";
