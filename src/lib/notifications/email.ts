import { Resend } from "resend";

interface EmailParams {
  to: string;
  subject: string;
  html: string;
}

export async function sendEmail({ to, subject, html }: EmailParams) {
  if (!process.env.RESEND_API_KEY) {
    console.warn("RESEND_API_KEY not configured, skipping email");
    return null;
  }

  const resend = new Resend(process.env.RESEND_API_KEY);

  return resend.emails.send({
    from: process.env.EMAIL_FROM || "Ammu's Chai With Maska Bun <orders@yourdomain.com>",
    to,
    subject,
    html,
  });
}

export function orderStatusEmailHtml(
  customerName: string,
  orderNumber: string,
  status: string,
  total: number
): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B35;">Ammu's Chai With Maska Bun</h2>
      <p>Hi ${customerName},</p>
      <p>Your order <strong>#${orderNumber}</strong> status has been updated to <strong>${status}</strong>.</p>
      <p>Order Total: ₹${total.toFixed(2)}</p>
      <p>Thank you for ordering with us!</p>
    </div>
  `;
}

export function newOrderAdminEmailHtml(
  orderNumber: string,
  customerName: string,
  total: number,
  items: string
): string {
  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2 style="color: #FF6B35;">New Order Received</h2>
      <p><strong>Order:</strong> #${orderNumber}</p>
      <p><strong>Customer:</strong> ${customerName}</p>
      <p><strong>Total:</strong> ₹${total.toFixed(2)}</p>
      <p><strong>Items:</strong></p>
      <pre>${items}</pre>
    </div>
  `;
}
