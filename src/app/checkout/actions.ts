"use server";

import { headers } from "next/headers";
import { redirect } from "next/navigation";
import { CONTACT } from "@/content/contact";
import { clientEnv } from "@/env";
import { parseLines, priceLines, totals } from "@/lib/cart";
import { pickupSlots, slotInstant } from "@/lib/pickup";
import {
  checkoutSchema,
  fieldErrors,
  type CheckoutState,
} from "@/lib/orders/checkout-schema";
import { attachCheckoutSession, createOrder, isOrderingPaused } from "@/lib/orders/repo";
import { snapshot } from "@/lib/orders/snapshot";
import { stripe } from "@/lib/orders/stripe";
import { stripeLineItems } from "@/lib/orders/stripe-lines";

/** Stripe keeps a checkout page open at least 30 minutes; a minute's grace on top. */
const CHECKOUT_MINUTES = 31;

/**
 * Places an order and sends the diner to Stripe to pay.
 *
 * Nothing the browser says about money is trusted: only dish slugs, choices
 * and quantities are read from the cart, and every price is looked up again
 * from the menu. The pickup time must still be one we offer, and online
 * ordering must not be paused. The order is saved as `pending_payment`; it
 * reaches the kitchen only when Stripe confirms the payment (the webhook).
 */
export async function placeOrder(
  _: CheckoutState,
  form: FormData,
): Promise<CheckoutState> {
  const fields = checkoutSchema.safeParse({
    pickup: form.get("pickup") ?? "",
    name: form.get("name") ?? "",
    phone: form.get("phone") ?? "",
    email: form.get("email") ?? "",
    note: form.get("note") || undefined,
  });
  if (!fields.success) return { errors: fieldErrors(fields.error) };

  let cart: unknown = [];
  try {
    cart = JSON.parse(String(form.get("lines") ?? "[]"));
  } catch {
    // Treated as an empty order below.
  }
  const lines = parseLines(cart);
  const priced = priceLines(lines);
  if (priced.length === 0) return { message: "Your order is empty — add a dish first." };

  const { pickup } = fields.data;
  if (!pickupSlots(new Date(), CONTACT.hours).some((slot) => slot.value === pickup)) {
    return {
      errors: { pickup: "That pickup time has just passed. Please choose another." },
    };
  }

  if (await isOrderingPaused()) return { paused: true };

  const sum = totals(lines);
  const order = await createOrder({
    lines: snapshot(priced),
    subtotalCents: sum.subtotalCents,
    taxCents: sum.taxCents,
    totalCents: sum.totalCents,
    customerName: fields.data.name,
    customerPhone: fields.data.phone,
    customerEmail: fields.data.email,
    note: fields.data.note ?? null,
    pickupAt: slotInstant(pickup),
  });

  // Back to whichever address the diner is on (a preview deploy, or the site).
  const origin = (await headers()).get("origin") ?? clientEnv.NEXT_PUBLIC_SITE_URL;

  let url: string | null = null;
  try {
    const session = await stripe().checkout.sessions.create({
      mode: "payment",
      line_items: stripeLineItems(order.lines, order.taxCents),
      customer_email: order.customerEmail,
      metadata: { orderId: order.id, code: order.code },
      payment_intent_data: {
        description: `Order ${order.code}`,
        metadata: { orderId: order.id, code: order.code },
      },
      success_url: `${origin}/order/${order.id}`,
      cancel_url: `${origin}/checkout`,
      expires_at: Math.floor(Date.now() / 1000) + CHECKOUT_MINUTES * 60,
    });
    await attachCheckoutSession(order.id, session.id);
    url = session.url;
  } catch (error) {
    console.error("stripe checkout failed", error);
  }
  if (!url) {
    return {
      message: `We couldn't open the payment page. Please try again, or call ${CONTACT.phone.display} to order.`,
    };
  }
  redirect(url);
}
