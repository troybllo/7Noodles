import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { CONTACT } from "@/content/contact";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description:
    "How Seven Noodles handles the information you share when you order or get in touch.",
};

/**
 * The legal text comes from the restaurant and its lawyer, not from us. Until
 * it does, the page says so plainly and gives a way to ask directly. It must be
 * in place before online ordering opens.
 */
export default function PrivacyPage() {
  return (
    <PageTransition id="privacy">
      <main
        id="main"
        data-nav-theme="light"
        className="paper-cream text-ink flex min-h-[70dvh] flex-col items-center justify-center px-6 pt-32 pb-20 text-center"
      >
        <h1 className="font-poster text-[clamp(2.25rem,6vw,4.5rem)] leading-none">
          Privacy Policy
        </h1>
        <p className="mt-6 max-w-[46ch] text-base leading-relaxed text-balance">
          We&rsquo;re preparing how we handle the information you share when you order or
          get in touch. It will be published here before online ordering opens. Until
          then, call us on{" "}
          <a
            href={CONTACT.phone.href}
            className="decoration-chili font-semibold underline decoration-2 underline-offset-4"
          >
            {CONTACT.phone.display}
          </a>{" "}
          with any question.
        </p>
      </main>
    </PageTransition>
  );
}
