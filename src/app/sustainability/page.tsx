import type { Metadata } from "next";
import { DrawOn } from "@/components/motion/draw-on";
import { NoodleLift } from "@/components/hand/noodle-lift";
import { LegalPage } from "@/components/legal/legal-page";

export const metadata: Metadata = {
  title: "Sustainability",
  description: "How Seven Noodles approaches sourcing, packaging and waste.",
};

export default function SustainabilityPage() {
  return (
    <LegalPage
      id="sustainability"
      title="Sustainability"
      zh="可持续"
      intro="How the kitchen sources, packs and cuts waste. We're writing it with the kitchen, and won't publish claims until they're ones we can stand behind."
      art={
        <DrawOn duration={2} className="mx-auto hidden w-44 md:block">
          <NoodleLift className="text-chili w-full [--noodle-ground:var(--color-cream-paper)]" />
        </DrawOn>
      }
      sections={[
        {
          id: "sourcing",
          title: "Sourcing",
          covers: "Where our noodles, meat, produce and spices come from.",
        },
        {
          id: "packaging",
          title: "Packaging",
          covers:
            "What pickup orders are packed in, and what can be recycled or composted.",
        },
        {
          id: "waste",
          title: "Food waste",
          covers: "How the kitchen plans and prepares to keep waste down.",
        },
      ]}
    />
  );
}
