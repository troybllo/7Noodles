import { Hero } from "@/components/sections/hero";
import { Story } from "@/components/sections/story";
import { Showcase } from "@/components/sections/showcase";

export default function HomePage() {
  return (
    <main id="main">
      <Hero />
      <Story />
      <Showcase />
    </main>
  );
}
