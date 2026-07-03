import { NextResponse } from "next/server";
import { z } from "zod";
import { createClient } from "@/lib/supabase/server";
import { APP_URL } from "@/lib/constants";
import { logPasswordResetError, logPasswordResetRateLimit } from "@/lib/auth/log-auth-error";
import {
  getPasswordResetUserMessage,
  PASSWORD_RESET_GENERIC_MESSAGE,
} from "@/lib/auth/forgot-password-messages";
import { enforceRateLimit } from "@/lib/rate-limit";

const bodySchema = z.object({
  email: z.string().email(),
  context: z.enum(["customer", "admin"]),
});

export async function POST(request: Request) {
  const rateLimited = enforceRateLimit(request, "auth-forgot-password", 10, 60_000);
  if (rateLimited) {
    logPasswordResetRateLimit("unknown", request.headers.get("x-forwarded-for") ?? "unknown");
    return NextResponse.json({
      ok: false,
      message:
        "Too many reset requests were made recently. Please wait a few minutes before requesting another password reset email.",
    });
  }

  try {
    const body = await request.json();
    const { email, context } = bodySchema.parse(body);

    const nextPath =
      context === "admin" ? "/admin/reset-password" : "/reset-password";
    const redirectTo = `${APP_URL}/auth/callback?next=${nextPath}`;

    const supabase = await createClient();
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo,
    });

    if (error) {
      logPasswordResetError(context, error);
      return NextResponse.json({
        ok: false,
        message: getPasswordResetUserMessage(error),
      });
    }

    return NextResponse.json({ ok: true });
  } catch (error) {
    logPasswordResetError("unknown", error);
    if (error instanceof z.ZodError) {
      return NextResponse.json(
        { ok: false, message: PASSWORD_RESET_GENERIC_MESSAGE },
        { status: 400 }
      );
    }
    return NextResponse.json({
      ok: false,
      message: PASSWORD_RESET_GENERIC_MESSAGE,
    });
  }
}
