import "server-only";
import { z } from "zod";

/**
 * Settings the ordering system needs, checked when first used rather than
 * when the site boots, so pages that never touch an order (the menu, the
 * story) build and render without them. SMS is optional: without the Twilio
 * keys the kitchen still gets the board and push notifications.
 */
/** An optional setting left blank in .env (`KEY=`) counts as not set. */
const optional = <T extends z.ZodType>(type: T) =>
  z.preprocess((value) => (value === "" ? undefined : value), type.optional());

const schema = z.object({
  DATABASE_URL: z.string().min(1),
  STRIPE_SECRET_KEY: optional(z.string().startsWith("sk_")),
  STRIPE_WEBHOOK_SECRET: optional(z.string().startsWith("whsec_")),
  KITCHEN_PIN: z.string().regex(/^\d{4,8}$/, "KITCHEN_PIN must be 4–8 digits"),
  KITCHEN_SECRET: z.string().min(32, "KITCHEN_SECRET must be at least 32 characters"),
  VAPID_PUBLIC_KEY: z.string().min(1),
  VAPID_PRIVATE_KEY: z.string().min(1),
  VAPID_SUBJECT: z.string().default("https://7noodles.com"),
  TWILIO_ACCOUNT_SID: optional(z.string()),
  TWILIO_AUTH_TOKEN: optional(z.string()),
  TWILIO_FROM: optional(z.string()),
  KITCHEN_SMS_TO: optional(z.string()),
});

let cached: z.infer<typeof schema> | undefined;

export function orderEnv() {
  if (!cached) {
    const result = schema.safeParse(process.env);
    if (!result.success) {
      const issues = result.error.issues
        .map((issue) => `  ${issue.path.join(".")}: ${issue.message}`)
        .join("\n");
      throw new Error(`Ordering is not configured:\n${issues}`);
    }
    cached = result.data;
  }
  return cached;
}

/** Stripe's keys, or a clear error naming what is missing. */
export function stripeEnv() {
  const { STRIPE_SECRET_KEY, STRIPE_WEBHOOK_SECRET } = orderEnv();
  if (!STRIPE_SECRET_KEY) throw new Error("STRIPE_SECRET_KEY is not set");
  return { secretKey: STRIPE_SECRET_KEY, webhookSecret: STRIPE_WEBHOOK_SECRET };
}
