import Image from "next/image";
import { Seal } from "@/components/brand/seal";
import { PaintButton } from "@/components/ui/paint-button";
import { HERO, HERO_ARTWORK } from "@/content/hero";
import { HeroMotion } from "./hero-motion";

/**
 * The wordmark is split per character with the glyphs pushed apart by
 * `justify-between`. That is the tracking, and because it distributes whatever
 * space is left over, the word spans the full column at any width instead of
 * needing a letter-spacing value tuned per breakpoint.
 *
 * The whole mark is announced once; the individual glyphs are hidden, or it is
 * read out letter by letter.
 */
function Wordmark() {
  return (
    <h1 data-hero-word className="text-hero font-black" style={{ fontStretch: "125%" }}>
      <span className="sr-only">{HERO.latin}</span>
      <span aria-hidden="true" className="flex justify-between overflow-hidden">
        {[...HERO.latin.toUpperCase()].map((character, index) => (
          <span key={`${character}-${index}`} data-hero-letter className="inline-block">
            {character === " " ? " " : character}
          </span>
        ))}
      </span>
    </h1>
  );
}

export function Hero() {
  return (
    <HeroMotion>
      <section
        id="hero"
        data-nav-theme="light"
        className="bg-rice relative flex min-h-svh w-full flex-col justify-center overflow-hidden px-6 pt-32 pb-16 md:px-10"
      >
        <div className="@container mx-auto w-full max-w-[1700px]">
          <div className="flex items-start justify-between gap-8">
            <div className="overflow-hidden">
              <p
                data-hero-name
                lang="zh"
                className="font-brush text-ink text-[clamp(2.5rem,6cqw,5.5rem)] leading-none"
              >
                {HERO.name}
              </p>
            </div>
            <div data-hero-line className="shrink-0">
              <Seal character="七" />
            </div>
          </div>

          <div className="mt-6">
            <Wordmark />
          </div>

          <div className="mt-10 flex flex-col gap-10 lg:flex-row lg:items-end lg:justify-between">
            <div className="flex max-w-md flex-col gap-6">
              <p data-hero-line className="text-agar-text text-sm leading-relaxed">
                {HERO.lede}
              </p>
              <div data-hero-line className="flex flex-wrap items-center gap-6">
                {HERO.actions.map((action) => (
                  <PaintButton
                    key={action.href}
                    href={action.href}
                    primary={action.primary}
                  >
                    {action.label}
                  </PaintButton>
                ))}
              </div>
            </div>

            {/* The painting is a contained strip here, not the ground. */}
            <div
              data-hero-art
              className="relative aspect-[16/7] w-full overflow-hidden lg:max-w-2xl"
            >
              <Image
                src={HERO_ARTWORK.src}
                alt={HERO_ARTWORK.alt}
                fill
                priority
                sizes="(min-width: 1024px) 42rem, 100vw"
                className="object-cover"
              />
              <p className="text-rice/70 absolute right-3 bottom-2 text-[0.6rem] tracking-[0.16em]">
                {HERO_ARTWORK.credit}
              </p>
            </div>
          </div>
        </div>
      </section>
    </HeroMotion>
  );
}
