import { z } from "zod";

/**
 * The checkout form's fields. Checked in the browser for quick feedback and
 * again on the server, which is the check that counts.
 */
export const checkoutSchema = z.object({
  pickup: z.string({ error: "Choose a pickup time." }).min(1, "Choose a pickup time."),
  name: z.string().trim().min(1, "Tell us whose order it is.").max(80),
  phone: z
    .string()
    .trim()
    .max(30)
    .refine(
      (value) => value.replace(/\D/g, "").length >= 10,
      "Enter a phone number with area code, so we can reach you about the order.",
    ),
  email: z.email("Enter an email address, for your receipt."),
  note: z.string().trim().max(300, "Keep the note under 300 characters.").optional(),
});

export type CheckoutFields = z.infer<typeof checkoutSchema>;
export type CheckoutErrors = Partial<Record<keyof CheckoutFields, string>>;

/** What the checkout action hands back when it cannot send the diner on to pay. */
export type CheckoutState = {
  errors?: CheckoutErrors;
  /** A problem with the order as a whole, shown above the button. */
  message?: string;
  /** Online ordering is paused: show the call-it-in fallback. */
  paused?: boolean;
};

/** The first message for each field, as the form shows them. */
export function fieldErrors(error: z.ZodError): CheckoutErrors {
  const errors: CheckoutErrors = {};
  for (const issue of error.issues) {
    const key = issue.path[0] as keyof CheckoutFields;
    errors[key] ??= issue.message;
  }
  return errors;
}
