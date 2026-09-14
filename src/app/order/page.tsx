import type { Metadata } from "next";
import { StampedText } from "@/components/hand/stamped-text";
import { PageTransition } from "@/components/motion/page-transition";
import { PaperButton } from "@/components/ui/paper-button";
import { CONTACT } from "@/content/contact";

export const metadata: Metadata = {
  title: "Order for pickup",
  description:
    "Order 7 Noodles for pickup on Yonge Street in North York. Freshly pulled noodles, ready when you are.",
};

export default function OrderPage() {
  return (
    <PageTransition id="order">
      <main
        id="main"
        data-nav-theme="light"
        className="paper-cream text-ink flex min-h-[70dvh] flex-col items-center justify-center px-6 pt-32 pb-20 text-center"
      >
        <h1 className="font-poster text-[clamp(3rem,8vw,6rem)] leading-none uppercase">
          <StampedText tone="text-ink" shadow="text-chili">
            Order
          </StampedText>
        </h1>
        <p className="font-hand mt-6 max-w-[34ch] text-xl leading-snug text-balance">
          Online ordering for pickup is on its way. Until then, call us on{" "}
          <a
            href={CONTACT.phone.href}
            className="decoration-chili font-bold underline decoration-2 underline-offset-4"
          >
            {CONTACT.phone.display}
          </a>
          .
        </p>
        <div className="mt-8">
          <PaperButton href="/menu" tone="ink">
            See the menu
          </PaperButton>
        </div>
      </main>
    </PageTransition>
  );
}
