import type { Metadata } from "next";
import { JsonLd } from "@/components/seo/json-ld";
import { Hero } from "@/components/sections/hero";
import { Story } from "@/components/sections/story";
import { Showcase } from "@/components/sections/showcase";
import { Chapters } from "@/components/sections/chapters";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { NextEvent } from "@/components/events/next-event";
import { Contact } from "@/components/sections/contact";
import { PageTransition } from "@/components/motion/page-transition";
import { pageMetadata, restaurantJsonLd } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  description:
    "Sichuan and Chongqing noodles, wontons and Leshan fried skewers at 7 Noodles 恰小面 on Yonge Street in North York, Toronto. Open daily. Order online for pickup.",
  path: "/",
});

/** Rebuilt hourly so the next-event strip moves on by itself. */
export const revalidate = 3600;

export default function HomePage() {
  return (
    <PageTransition id="home">
      <main id="main">
        <JsonLd data={restaurantJsonLd()} />
        <Hero />
        <Story />
        {/* The showcase sticks while the categories scroll up over it. Both need
            to share one positioning context for that to work. */}
        <div className="relative">
          <Showcase />
          <Chapters />
        </div>
        <About />
        <NextEvent />
        <Reviews />
        <Contact />
      </main>
    </PageTransition>
  );
}
