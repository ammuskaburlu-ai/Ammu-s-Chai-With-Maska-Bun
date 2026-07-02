import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { testTelegramNotification } from "@/lib/notifications/telegram";

export async function POST() {
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    return NextResponse.json({ success: false, error: "Unauthorized" }, { status: 401 });
  }

  const { data: profile } = await supabase
    .from("profiles")
    .select("role")
    .eq("id", user.id)
    .single();

  if (profile?.role !== "admin") {
    return NextResponse.json({ success: false, error: "Forbidden" }, { status: 403 });
  }

  const result = await testTelegramNotification();

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error ?? "Telegram test failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
