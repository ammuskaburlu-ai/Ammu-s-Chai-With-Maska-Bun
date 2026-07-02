import type { User } from "@supabase/supabase-js";
import type { SupabaseClient } from "@supabase/supabase-js";

interface AdminProfile {
  role: string;
  full_name: string | null;
  is_blocked: boolean;
}

export type AdminGuardResult =
  | { ok: true; user: User; profile: AdminProfile }
  | { ok: false; reason: "unauthenticated" | "forbidden" | "blocked" };

export async function checkAdminAccess(
  supabase: SupabaseClient,
  user: User | null
): Promise<AdminGuardResult> {
  if (!user) {
    return { ok: false, reason: "unauthenticated" };
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role, full_name, is_blocked")
    .eq("id", user.id)
    .single();

  if (!profile) {
    return { ok: false, reason: "forbidden" };
  }

  if (profile.is_blocked) {
    return { ok: false, reason: "blocked" };
  }

  if (profile.role !== "admin") {
    return { ok: false, reason: "forbidden" };
  }

  return { ok: true, user, profile };
}
