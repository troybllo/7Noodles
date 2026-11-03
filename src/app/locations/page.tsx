import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { pageMetadata, restaurantJsonLd } from "@/lib/seo";
import { PageTransition } from "@/components/motion/page-transition";
import { Contact } from "@/components/sections/contact";

export const metadata: Metadata = pageMetadata({
  title: "Location & Hours: 4664 Yonge St, North York",
  description:
    "Find 7 Noodles 恰小面 at 4664 Yonge St, Unit 13, North York, near Yonge and Florence. Open daily 11 am to 10 pm. Directions and phone.",
  path: "/locations",
});

export default function LocationsPage() {
  return (
    <PageTransition id="locations">
      <main id="main" data-nav-theme="light" className="bg-paper pt-16">
        <JsonLd data={restaurantJsonLd()} />
        <Contact headingLevel={1} map />
      </main>
    </PageTransition>
  );
}
