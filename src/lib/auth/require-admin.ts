import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAccess } from "@/lib/auth/admin-guard";
import { getSafeAdminRedirect } from "@/lib/auth/admin-routes";

export async function requireAdmin(redirectTo?: string) {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const access = await checkAdminAccess(supabase, user);

  if (!access.ok) {
    if (access.reason === "unauthenticated") {
      const target = redirectTo
        ? `/admin/login?redirect=${encodeURIComponent(getSafeAdminRedirect(redirectTo))}`
        : "/admin/login";
      redirect(target);
    }
    redirect("/admin/login?error=forbidden");
  }

  return { user: access.user, profile: access.profile, supabase };
}

export async function requireAdminApi() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const access = await checkAdminAccess(supabase, user);

  if (!access.ok) {
    if (access.reason === "unauthenticated") {
      return {
        error: NextResponse.json({ error: "Unauthorized" }, { status: 401 }),
      };
    }
    return {
      error: NextResponse.json({ error: "Forbidden" }, { status: 403 }),
    };
  }

  return { user: access.user, profile: access.profile, supabase };
}
