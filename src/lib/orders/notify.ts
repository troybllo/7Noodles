import "server-only";
import webpush from "web-push";
import { formatCad } from "@/lib/money";
import { orderEnv } from "./env";
import { deletePushSubscription, listPushSubscriptions, type Order } from "./repo";
import { describeLine } from "./snapshot";

const pickupTime = (at: Date) =>
  new Intl.DateTimeFormat("en-CA", {
    timeZone: "America/Toronto",
    hour: "numeric",
    minute: "2-digit",
  }).format(at);

/** The order as one notification: who, when, what, how much. */
export function summarize(order: Order): { title: string; body: string } {
  return {
    title: `New order ${order.code} · pickup ${pickupTime(order.pickupAt)}`,
    body: `${order.customerName} · ${formatCad(order.totalCents)}\n${order.lines.map(describeLine).join("\n")}`,
  };
}

/** Every subscribed phone. Subscriptions the push service reports as gone are removed. */
async function push(order: Order): Promise<void> {
  const env = orderEnv();
  webpush.setVapidDetails(env.VAPID_SUBJECT, env.VAPID_PUBLIC_KEY, env.VAPID_PRIVATE_KEY);
  const payload = JSON.stringify({ ...summarize(order), url: "/kitchen", tag: order.id });
  const subscriptions = await listPushSubscriptions();
  await Promise.all(
    subscriptions.map(async (sub) => {
      try {
        await webpush.sendNotification(
          { endpoint: sub.endpoint, keys: { p256dh: sub.p256dh, auth: sub.auth } },
          payload,
          { urgency: "high", TTL: 60 * 30 },
        );
      } catch (error) {
        const status = (error as { statusCode?: number }).statusCode;
        if (status === 404 || status === 410) await deletePushSubscription(sub.endpoint);
        else console.error("push failed", status, error);
      }
    }),
  );
}

/** A text to the kitchen number, when Twilio is configured. Plain REST: no SDK needed. */
async function sms(order: Order): Promise<void> {
  const env = orderEnv();
  if (
    !env.TWILIO_ACCOUNT_SID ||
    !env.TWILIO_AUTH_TOKEN ||
    !env.TWILIO_FROM ||
    !env.KITCHEN_SMS_TO
  ) {
    return;
  }
  const { title, body } = summarize(order);
  const response = await fetch(
    `https://api.twilio.com/2010-04-01/Accounts/${env.TWILIO_ACCOUNT_SID}/Messages.json`,
    {
      method: "POST",
      headers: {
        Authorization: `Basic ${Buffer.from(`${env.TWILIO_ACCOUNT_SID}:${env.TWILIO_AUTH_TOKEN}`).toString("base64")}`,
        "Content-Type": "application/x-www-form-urlencoded",
      },
      body: new URLSearchParams({
        From: env.TWILIO_FROM,
        To: env.KITCHEN_SMS_TO,
        Body: `${title}\n${body}`.slice(0, 1500),
      }),
    },
  );
  if (!response.ok) console.error("sms failed", response.status, await response.text());
}

/**
 * Tells the kitchen about a newly paid order on every channel set up. A
 * failing channel never stops the others — the board polls the database
 * regardless, so an order is never lost even if every alert fails.
 */
export async function notifyKitchen(order: Order): Promise<void> {
  await Promise.allSettled([push(order), sms(order)]);
}
