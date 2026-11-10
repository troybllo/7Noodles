import Image from "next/image";
import { ScrollRevealText } from "@/components/motion/scroll-reveal-text";
import { RevealFrame } from "@/components/motion/reveal-frame";
import { PHOTOS } from "@/content/photos";
import { STORY } from "@/content/story";

/**
 * The red band: one statement that fills in as it scrolls through, then
 * three diners at the table, opening upward, the last bleeding off the edge.
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

      {/* Phones: a row to swipe through, the next photograph peeking in. */}
      <div className="mt-12 flex snap-x snap-mandatory scroll-px-4 [scrollbar-width:none] gap-3 overflow-x-auto overscroll-x-contain px-4 md:mt-20 md:grid md:grid-cols-[1.5fr_1fr_1.4fr] md:gap-5 md:overflow-visible md:px-0 [&::-webkit-scrollbar]:hidden">
        <RevealFrame className="aspect-[4/5] w-[78%] shrink-0 snap-start md:w-auto">
          <div className="relative h-full w-full">
            <Image
              src={PHOTOS.noodlePullBooth.src}
              alt={PHOTOS.noodlePullBooth.alt}
              fill
              sizes="(min-width: 768px) 38vw, 80vw"
              className="object-cover"
            />
          </div>
        </RevealFrame>
        <RevealFrame
          delay={0.12}
          className="aspect-[4/5] w-[78%] shrink-0 snap-start md:aspect-auto md:w-auto"
        >
          <div className="relative h-full w-full">
            <Image
              src={PHOTOS.noodlePullHigh.src}
              alt={PHOTOS.noodlePullHigh.alt}
              fill
              sizes="(min-width: 768px) 30vw, 80vw"
              className="object-cover"
            />
          </div>
        </RevealFrame>
        <RevealFrame
          delay={0.24}
          className="aspect-[4/5] w-[78%] shrink-0 snap-start md:-mr-[6vw] md:w-auto"
        >
          <div className="relative h-full w-full">
            <Image
              src={PHOTOS.dinerAtTheTable.src}
              alt={PHOTOS.dinerAtTheTable.alt}
              fill
              sizes="(min-width: 768px) 40vw, 80vw"
              className="object-cover"
            />
          </div>
        </RevealFrame>
      </div>
    </section>
  );
}
