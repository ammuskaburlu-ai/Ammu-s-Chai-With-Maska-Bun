interface TelegramMessage {
  chatId: string;
  text: string;
}

export async function sendTelegramMessage({ chatId, text }: TelegramMessage) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token || !chatId) {
    console.warn("Telegram not configured, skipping notification");
    return null;
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

  return response.json();
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
