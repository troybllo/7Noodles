import { after, NextResponse, type NextRequest } from "next/server";
import type Stripe from "stripe";
import { stripeEnv } from "@/lib/orders/env";
import { notifyKitchen } from "@/lib/orders/notify";
import { markPaid, markUnpaid, type PaidSession } from "@/lib/orders/repo";
import { verifyStripeEvent } from "@/lib/orders/stripe-events";

const sessionOf = (session: Stripe.Checkout.Session): PaidSession => ({
  sessionId: session.id,
  orderId: session.metadata?.orderId,
});

/**
 * Stripe's word that a payment went through: the only way an order reaches
 * the kitchen. The signature is checked against the raw body first. Deliveries
 * can repeat or arrive out of order, and the database updates only move an
 * order out of `pending_payment`, so each order is alerted once.
 */
export async function POST(request: NextRequest) {
  const { webhookSecret } = stripeEnv();
  if (!webhookSecret) {
    return NextResponse.json({ error: "Webhook secret not configured" }, { status: 500 });
  }

  let event: Stripe.Event;
  try {
    event = verifyStripeEvent(
      await request.text(),
      request.headers.get("stripe-signature"),
      webhookSecret,
    );
  } catch {
    return NextResponse.json({ error: "Invalid signature" }, { status: 400 });
  }

  switch (event.type) {
    case "checkout.session.completed":
    case "checkout.session.async_payment_succeeded": {
      if (event.data.object.payment_status !== "paid") break;
      const order = await markPaid(sessionOf(event.data.object));
      // Answer Stripe straight away; the alerts go out after the response.
      if (order) after(() => notifyKitchen(order));
      break;
    }
    case "checkout.session.expired":
    case "checkout.session.async_payment_failed":
      await markUnpaid(sessionOf(event.data.object));
      break;
  }

  return NextResponse.json({ received: true });
}
