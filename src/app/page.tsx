import { Hero } from "@/components/sections/hero";
import { Story } from "@/components/sections/story";
import { Showcase } from "@/components/sections/showcase";
import { Categories } from "@/components/sections/categories";
import { About } from "@/components/sections/about";
import { Reviews } from "@/components/sections/reviews";
import { Contact } from "@/components/sections/contact";
import { PageTransition } from "@/components/motion/page-transition";

export default function HomePage() {
  return (
    <PageTransition id="home">
      <main id="main">
        <Hero />
        <Story />
        {/* The showcase sticks while the categories scroll up over it. Both need
            to share one positioning context for that to work. */}
        <div className="relative">
          <Showcase />
          <Categories />
        </div>
        <About />
        <Reviews />
        <Contact />
      </main>
    </PageTransition>
  );
}
