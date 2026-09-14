import type { Metadata } from "next";
import { PageTransition } from "@/components/motion/page-transition";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = {
  title: "Locations",
  description:
    "Find 7 Noodles at 4664 Yonge St Unit 13, North York. Opening hours, directions and how to reach us.",
};

export default function LocationsPage() {
  return (
    <PageTransition id="locations">
      <main id="main" className="bg-ink-deep pt-16">
        <Contact />
      </main>
    </PageTransition>
  );
}
