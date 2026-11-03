import Image from "next/image";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { RevealFrame } from "@/components/motion/reveal-frame";
import { STORY } from "@/content/story";

/**
 * The red band, after the Bokman reference: one statement set large in white
 * on red, filling in as it scrolls through, then a row of three photographs
 * opening upward, the last of which bleeds off the edge.
 */
export function Story() {
  return (
    <section
      id="story"
      data-nav-theme="dark"
      className="bg-brand text-paper relative overflow-hidden pt-20 pb-28 md:pt-28 md:pb-40"
    >
      <div className="px-4 md:px-5">
        <ScrollRevealText
          as="blockquote"
          text={STORY.quote}
          className="max-w-[46ch] text-[clamp(1.75rem,3.1vw,3.25rem)] leading-[1.08] tracking-[-0.02em] text-balance"
        />
        <p className="mt-6 flex items-center gap-3 text-sm tracking-[0.14em] uppercase">
          <span lang="zh" className="font-cjk text-base font-black tracking-[0.2em]">
            {STORY.vertical}
          </span>
          Chongqing &amp; Sichuan · Yonge Street, North York
        </p>
      </div>

      <div className="mt-14 grid grid-cols-1 gap-4 md:mt-20 md:grid-cols-[1.5fr_1fr_1.4fr] md:gap-5">
        <RevealFrame className="aspect-[4/3]">
          <div className="relative h-full w-full">
            <Image
              src="/photos/dishes/wontons-in-red-chili-oil.webp"
              alt="Sichuan wontons in red chili oil with scallion"
              fill
              sizes="(min-width: 768px) 38vw, 100vw"
              className="object-cover"
            />
          </div>
        </RevealFrame>
        <RevealFrame delay={0.12} className="aspect-[4/3] md:aspect-auto">
          <div className="relative h-full w-full">
            <Image
              src="/photos/dishes/chicken-in-chili-oil.webp"
              alt="Sliced chicken in chili oil and roasted pepper sauce with scallion"
              fill
              sizes="(min-width: 768px) 30vw, 100vw"
              className="object-cover"
            />
          </div>
        </RevealFrame>
        <RevealFrame delay={0.24} className="aspect-[4/3] md:-mr-[6vw]">
          <div className="relative h-full w-full">
            <Image
              src="/photos/dishes/cumin-beef-noodles.webp"
              alt="Dry noodles with cumin beef, onions, green chilies and cilantro"
              fill
              sizes="(min-width: 768px) 40vw, 100vw"
              className="object-cover"
            />
          </div>
        </RevealFrame>
      </div>
    </section>
  );
}
