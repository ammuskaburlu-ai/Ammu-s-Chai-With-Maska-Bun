import { createAdminClient } from "@/lib/supabase/admin";
import { sendEmail, orderStatusEmailHtml, newOrderAdminEmailHtml } from "./email";
import { sendTelegramMessage, formatOrderTelegramMessage, formatStatusTelegramMessage } from "./telegram";
import { ORDER_STATUS_LABELS } from "@/lib/utils";
import type { NotificationType, Order, OrderItem } from "@/types/database";

async function getSettings() {
  const supabase = createAdminClient();
  const { data } = await supabase.from("settings").select("key, value");
  const settings: Record<string, unknown> = {};
  data?.forEach((s) => {
    settings[s.key] = s.value;
  });
  return settings;
}

async function createNotification(
  userId: string | null,
  type: NotificationType,
  title: string,
  message: string,
  data?: Record<string, unknown>
) {
  const supabase = createAdminClient();
  await supabase.from("notifications").insert({
    user_id: userId,
    type,
    title,
    message,
    data: data || null,
  });
}

export async function notifyOrderPlaced(order: Order, items: OrderItem[]) {
  const settings = await getSettings();
  const adminEmail = settings.admin_email as string;
  const telegramChatId = settings.telegram_chat_id as string;

  if (order.user_id) {
    await createNotification(
      order.user_id,
      "order_placed",
      "Order Placed",
      `Your order #${order.order_number} has been placed successfully.`
    );
  }

  const itemList = items.map((i) => `${i.product_name} x${i.quantity}`).join(", ");

  if (order.user_id) {
    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", order.user_id)
      .single();

    if (profile?.email) {
      await sendEmail({
        to: profile.email,
        subject: `Order Placed - #${order.order_number}`,
        businessName: settings.businessName as string,
        html: orderStatusEmailHtml(
          settings.businessName as string,
          order.customer_name,
          order.order_number,
          "Order Received",
          order.total
        ),
      });
    }
  }

  if (typeof adminEmail === "string" && adminEmail) {
    await sendEmail({
      to: adminEmail.replace(/"/g, ""),
      subject: `New Order - #${order.order_number}`,
      businessName: settings.businessName as string,
      html: newOrderAdminEmailHtml(
        settings.businessName as string,
        order.order_number,
        order.customer_name,
        order.total,
        itemList
      ),
    });
  }

  if (typeof telegramChatId === "string" && telegramChatId) {
    await sendTelegramMessage({
      chatId: telegramChatId.replace(/"/g, ""),
      text: formatOrderTelegramMessage(
        order.order_number,
        order.customer_name,
        order.customer_phone,
        order.total,
        items.map((i) => ({ name: i.product_name, quantity: i.quantity }))
      ),
    });
  }
}

export async function notifyOrderStatusChange(order: Order, newStatus: string) {
  const settings = await getSettings();
  const telegramChatId = settings.telegram_chat_id as string;
  const statusLabel = ORDER_STATUS_LABELS[newStatus] || newStatus;

  const typeMap: Record<string, NotificationType> = {
    payment_confirmed: "payment_success",
    accepted: "order_accepted",
    preparing: "preparing",
    ready: "ready",
    out_for_delivery: "out_for_delivery",
    delivered: "delivered",
    cancelled: "cancelled",
  };

  if (order.user_id) {
    await createNotification(
      order.user_id,
      typeMap[newStatus] || "order_placed",
      `Order ${statusLabel}`,
      `Your order #${order.order_number} is now ${statusLabel.toLowerCase()}.`
    );

    const supabase = createAdminClient();
    const { data: profile } = await supabase
      .from("profiles")
      .select("email")
      .eq("id", order.user_id)
      .single();

    if (profile?.email) {
      await sendEmail({
        to: profile.email,
        subject: `Order Update - #${order.order_number}`,
        businessName: settings.businessName as string,
        html: orderStatusEmailHtml(
          settings.businessName as string,
          order.customer_name,
          order.order_number,
          statusLabel,
          order.total
        ),
      });
    }
  }

  if (typeof telegramChatId === "string" && telegramChatId) {
    await sendTelegramMessage({
      chatId: telegramChatId.replace(/"/g, ""),
      text: formatStatusTelegramMessage(order.order_number, statusLabel),
    });
  }
}

export async function notifyPaymentReceived(order: Order) {
  const settings = await getSettings();
  const adminEmail = settings.admin_email as string;
  const telegramChatId = settings.telegram_chat_id as string;

  if (typeof adminEmail === "string" && adminEmail) {
    await sendEmail({
      to: adminEmail.replace(/"/g, ""),
      subject: `Payment Received - #${order.order_number}`,
      businessName: settings.businessName as string,
      html: newOrderAdminEmailHtml(
        settings.businessName as string,
        order.order_number,
        order.customer_name,
        order.total,
        "Payment confirmed via Razorpay"
      ),
    });
  }

  if (typeof telegramChatId === "string" && telegramChatId) {
    await sendTelegramMessage({
      chatId: telegramChatId.replace(/"/g, ""),
      text: `💳 Payment received for order <b>#${order.order_number}</b> — ₹${order.total.toFixed(2)}`,
    });
  }
}
