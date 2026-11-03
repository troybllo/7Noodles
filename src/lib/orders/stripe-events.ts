import Stripe from "stripe";

/**
 * Verifies a webhook delivery really came from Stripe and parses it. Throws on
 * a missing or forged signature, a replayed old delivery, or a body changed in
 * transit. No network call: the check is a local HMAC.
 */
export function verifyStripeEvent(
  rawBody: string,
  signature: string | null,
  secret: string,
) {
  if (!signature) throw new Error("Missing Stripe-Signature header");
  return Stripe.webhooks.constructEvent(rawBody, signature, secret);
}
