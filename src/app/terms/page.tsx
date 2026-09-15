import type { Metadata } from "next";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Terms & Conditions",
  description: "The terms for ordering from Seven Noodles.",
};

export default function TermsPage() {
  return (
    <LegalPage
      id="terms"
      title="Terms & Conditions"
      zh="条款"
      intro="The terms for ordering from us. They will be published here before online ordering opens."
      sections={[
        {
          id: "orders",
          title: "Placing an order",
          covers:
            "When an order is confirmed, and what happens if a dish is unavailable.",
        },
        {
          id: "pickup",
          title: "Pickup",
          covers:
            "Pickup times, how long an order is held, and orders that are not collected.",
        },
        {
          id: "prices",
          title: "Prices and payment",
          covers: "Prices, HST, and how and when payment is taken.",
        },
        {
          id: "changes",
          title: "Changes and refunds",
          covers: "Changing or cancelling an order, and how refunds are handled.",
        },
        {
          id: "allergies",
          title: "Allergies",
          covers:
            "What to tell us about allergies and dietary needs, and what our kitchen can and cannot guarantee.",
        },
      ]}
    />
  );
}
