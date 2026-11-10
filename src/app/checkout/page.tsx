import type { Metadata } from "next";
import { SectionHeading } from "@/components/ui/section-heading";
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
        className="bg-paper text-brand min-h-[80dvh] px-6 pt-24 pb-24 md:px-10 md:pt-32"
      >
        <div className="mx-auto max-w-[1100px]">
          <SectionHeading as="h1" zh="结账">
            Checkout
          </SectionHeading>
          <p className="text-brand-deep mt-4">
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
