import { createAdminClient } from "@/lib/supabase/admin";

interface TelegramMessage {
  chatId: string;
  text: string;
}

interface TelegramApiResponse {
  ok?: boolean;
  description?: string;
  result?: { message_id?: number };
}

export interface TelegramSendResult {
  success: boolean;
  error?: string;
  messageId?: number;
}

function logTelegramFailure(
  reason: string,
  details?: { statusCode?: number; body?: string; error?: unknown }
) {
  console.error("Telegram notification failed:", reason, {
    timestamp: new Date().toISOString(),
    statusCode: details?.statusCode,
    responseBody: details?.body,
    message: reason,
    stack: details?.error instanceof Error ? details.error.stack : undefined,
  });
}

function logTelegramSuccess() {
  console.log("Telegram notification sent successfully.", {
    timestamp: new Date().toISOString(),
  });
}

export async function sendTelegramMessage({
  chatId,
  text,
}: TelegramMessage): Promise<TelegramSendResult> {
  try {
    const token = process.env.TELEGRAM_BOT_TOKEN;
    if (!token) {
      logTelegramFailure("TELEGRAM_BOT_TOKEN not configured");
      return { success: false, error: "TELEGRAM_BOT_TOKEN not configured" };
    }
    if (!chatId) {
      logTelegramFailure("Telegram chat ID not provided");
      return { success: false, error: "Telegram chat ID not provided" };
    }

    const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        chat_id: chatId,
        text,
        parse_mode: "HTML",
      }),
    });

    if (!response.ok) {
      const body = await response.text().catch(() => undefined);
      const reason = `HTTP ${response.status} ${response.statusText}`;
      logTelegramFailure(reason, { statusCode: response.status, body });
      return { success: false, error: reason };
    }

    let payload: TelegramApiResponse;
    try {
      payload = (await response.json()) as TelegramApiResponse;
    } catch {
      const reason = "Invalid JSON response from Telegram API";
      logTelegramFailure(reason);
      return { success: false, error: reason };
    }

    if (!payload.ok) {
      const reason = payload.description || "Telegram API returned ok: false";
      logTelegramFailure(reason);
      return { success: false, error: reason };
    }

    logTelegramSuccess();
    return { success: true, messageId: payload.result?.message_id };
  } catch (error) {
    const reason = error instanceof Error ? error.message : "Unknown error";
    logTelegramFailure(reason, { error });
    return { success: false, error: reason };
  }
}

async function getTelegramChatIdFromSettings(): Promise<string | null> {
  try {
    const supabase = createAdminClient();
    const { data } = await supabase
      .from("settings")
      .select("value")
      .eq("key", "telegram_chat_id")
      .maybeSingle();

    if (data?.value == null) return null;

    const raw = data.value;
    if (typeof raw === "string") {
      const chatId = raw.replace(/^"|"$/g, "").replace(/"/g, "").trim();
      return chatId || null;
    }

    return String(raw).trim() || null;
  } catch {
    return null;
  }
}

const TEST_MESSAGE =
  "🧪 <b>Test notification</b>\n\nAmmu's Chai With Maska Bun — Telegram is configured and working.";

export async function testTelegramNotification(): Promise<TelegramSendResult> {
  const chatId = await getTelegramChatIdFromSettings();
  return sendTelegramMessage({
    chatId: chatId ?? "",
    text: TEST_MESSAGE,
  });
}

export function formatOrderTelegramMessage(
  orderNumber: string,
  customerName: string,
  phone: string,
  total: number,
  items: { name: string; quantity: number }[]
): string {
  const itemList = items.map((i) => `• ${i.name} x${i.quantity}`).join("\n");
  return `🍽 <b>New Order #${orderNumber}</b>\n\n👤 ${customerName}\n📞 ${phone}\n💰 ₹${total.toFixed(2)}\n\n${itemList}`;
}

export function formatStatusTelegramMessage(orderNumber: string, status: string): string {
  return `📦 Order <b>#${orderNumber}</b> → ${status}`;
}
