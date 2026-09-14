import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";

export const metadata: Metadata = {
  title: "Contact",
  description:
    "Find 7 Noodles at 4664 Yonge St Unit 13, North York. Opening hours, directions and how to reach us.",
};

export default function ContactPage() {
  return (
    <PageTransition id="contact">
      <main id="main" data-nav-theme="light" className="px-6 py-32 md:px-10">
        <h1 className="text-display font-black">Contact</h1>
      </main>
    </PageTransition>
  );
}
