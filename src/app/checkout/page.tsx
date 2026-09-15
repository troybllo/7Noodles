import type { Metadata } from "next";
import { StampedText } from "@/components/hand/stamped-text";
import { PageTransition } from "@/components/motion/page-transition";
import { CheckoutForm } from "@/components/order/checkout-form";
import { CONTACT } from "@/content/contact";

export const metadata: Metadata = {
  title: "Checkout",
  description: "Choose a pickup time for your Seven Noodles order.",
  robots: { index: false },
};

export default function CheckoutPage() {
  return (
    <PageTransition id="checkout">
      <main
        id="main"
        data-nav-theme="light"
        className="paper-cream text-ink min-h-[80dvh] px-6 pt-32 pb-24 md:px-10"
      >
        <div className="mx-auto max-w-[1100px]">
          <h1 className="font-poster text-[clamp(2.5rem,6vw,4.5rem)] leading-none uppercase">
            <StampedText tone="text-ink" shadow="text-chili">
              Checkout
            </StampedText>
          </h1>
          <p className="font-hand mt-3 text-xl">
            Pickup only, at {CONTACT.address.street}, {CONTACT.address.locality}.
          </p>
          <div className="mt-10">
            <CheckoutForm />
          </div>
        </div>
      </main>
    </PageTransition>
  );
}
