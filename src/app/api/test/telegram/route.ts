import { NextResponse } from "next/server";
import { requireAdminApi } from "@/lib/auth/require-admin";
import { testTelegramNotification } from "@/lib/notifications/telegram";

export async function POST() {
  const auth = await requireAdminApi();
  if (auth.error) return auth.error;

  const result = await testTelegramNotification();

  if (!result.success) {
    return NextResponse.json(
      { success: false, error: result.error ?? "Telegram test failed" },
      { status: 502 }
    );
  }

  return NextResponse.json({ success: true });
}
