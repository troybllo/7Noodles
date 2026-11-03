import { after, NextResponse, type NextRequest } from "next/server";
import { stripeEnv } from "@/lib/orders/env";
import { notifyKitchen } from "@/lib/orders/notify";
import { markExpired, markPaid } from "@/lib/orders/repo";
import { verifyStripeEvent } from "@/lib/orders/stripe-events";

/**
 * Stripe's word that a payment went through — the only way an order reaches
 * the kitchen. The signature is checked against the raw body before anything
 * is believed. Stripe retries deliveries, so the work is idempotent: an order
 * is marked paid, and the kitchen alerted, exactly once.
 */
export async function POST(request: NextRequest) {
  const { webhookSecret } = stripeEnv();
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event;
  try {
    event = verifyStripeEvent(
      await request.text(),
      request.headers.get("stripe-signature"),
      webhookSecret,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  if (
    event.type === "checkout.session.completed" &&
    event.data.object.payment_status === "paid"
  ) {
    const order = await markPaid(event.data.object.id);
    // Answer Stripe straight away; the alerts go out after the response.
    if (order) after(() => notifyKitchen(order));
  } else if (event.type === "checkout.session.expired") {
    await markExpired(event.data.object.id);
  }

  return NextResponse.json({ received: true });
}
