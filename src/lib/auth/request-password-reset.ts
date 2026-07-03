import {
  PASSWORD_RESET_NETWORK_MESSAGE,
} from "@/lib/auth/forgot-password-messages";

export type PasswordResetContext = "customer" | "admin";

export interface PasswordResetRequestResult {
  ok: boolean;
  message?: string;
}

export async function submitPasswordResetRequest(
  email: string,
  context: PasswordResetContext
): Promise<PasswordResetRequestResult> {
  try {
    const res = await fetch("/api/auth/forgot-password", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, context }),
    });

    const data = (await res.json()) as { ok?: boolean; message?: string };

    if (!res.ok || !data.ok) {
      return {
        ok: false,
        message: data.message ?? "Unable to send password reset email. Please try again.",
      };
    }

    return { ok: true };
  } catch {
    return { ok: false, message: PASSWORD_RESET_NETWORK_MESSAGE };
  }
}
