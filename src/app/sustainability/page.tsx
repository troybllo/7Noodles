import type { Metadata } from "next";
import Link from "next/link";
import { PageTransition } from "@/components/motion/page-transition";

export const metadata: Metadata = {
  title: "Sustainability",
  description: "How 7 Noodles approaches sourcing, packaging and waste.",
};

/**
 * A page the navigation promises before its content exists. It says so plainly
 * rather than filling the space with claims the restaurant has not made.
 */
export default function SustainabilityPage() {
  return (
    <PageTransition id="sustainability">
      <main
        id="main"
        data-nav-theme="red"
        className="paper-red text-cream flex min-h-[100dvh] flex-col items-center justify-center px-6 py-32 text-center"
      >
        <h1 className="font-poster text-parchment text-[clamp(2.5rem,7vw,5.5rem)] leading-none uppercase">
          Sustainability
        </h1>
        <p className="font-hand mt-6 max-w-[34ch] text-[clamp(1.2rem,2vw,1.6rem)] leading-snug text-balance">
          We&rsquo;re writing this page with the kitchen. It will set out how we source,
          pack and cut waste.
        </p>
        <Link
          href="/menu"
          className="font-nav text-cream mt-10 font-bold tracking-[0.06em] uppercase underline decoration-2 underline-offset-8"
        >
          See the menu
        </Link>
      </main>
    </PageTransition>
  );
}
