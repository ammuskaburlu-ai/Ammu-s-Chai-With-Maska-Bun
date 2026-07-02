import { redirect } from "next/navigation";
import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { checkAdminAccess } from "@/lib/auth/admin-guard";

export async function requireAdmin() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  const access = await checkAdminAccess(supabase, user);

  if (!access.ok) {
    if (access.reason === "unauthenticated") {
      redirect("/login?redirect=/admin");
    }
    redirect("/?error=admin_forbidden");
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
