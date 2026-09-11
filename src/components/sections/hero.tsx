import Image from "next/image";
import Link from "next/link";
import { Seal } from "@/components/brand/seal";
import { HERO, HERO_ARTWORK } from "@/content/hero";
import { HeroMotion } from "./hero-motion";

/**
 * The name is split per character so the entrance can stagger it. Each glyph
 * is hidden from assistive technology and the whole name announced once,
 * otherwise it is read out character by character.
 */
function Name() {
  return (
    <p
      data-hero-name
      lang="zh"
      className="font-brush text-ink flex overflow-hidden text-[clamp(3.5rem,11cqw,7.5rem)] leading-[1.05]"
    >
      <span className="sr-only">{HERO.name}</span>
      {[...HERO.name].map((character, index) => (
        <span key={`${character}-${index}`} aria-hidden="true" className="block">
          {character}
        </span>
      ))}
    </p>
  );
}

export function Hero() {
  return (
    <HeroMotion>
      <section
        id="hero"
        data-nav-theme="dark"
        className="relative isolate flex min-h-svh w-full items-center justify-center overflow-hidden px-5 py-24 md:px-10"
      >
        {/*
          The artwork sits at z-0 rather than a negative z-index. A transformed
          element establishes its own stacking context, and at a negative
          z-index that context paints beneath its parent's background — which
          is exactly how the painting vanished the moment the entrance tween
          applied a scale.

          Only the image is scaled. The gradients are siblings, so they stay
          pinned to the viewport edges instead of being zoomed along with it.
        */}
        <div className="absolute inset-0 z-0 overflow-hidden">
          <div data-hero-art className="absolute inset-0">
            <Image
              src={HERO_ARTWORK.src}
              alt={HERO_ARTWORK.alt}
              fill
              priority
              sizes="100vw"
              className="object-cover"
            />
          </div>
          {/*
            Gradients at the edges rather than a flat wash over everything.
            A uniform scrim heavy enough to carry the navigation crushes the
            painting into grey silk — the whole reason for using it is lost.
            These darken only where chrome sits: the bar at the top, the
            credit line at the bottom.
          */}
          <div className="from-ink/80 absolute inset-x-0 top-0 h-44 bg-gradient-to-b to-transparent" />
          <div className="from-ink/55 absolute inset-x-0 bottom-0 h-28 bg-gradient-to-t to-transparent" />
          <div className="bg-ink/12 absolute inset-0" />
        </div>

        <div
          data-hero-card
          className="bg-rice @container relative z-20 flex w-full max-w-4xl gap-6 p-8 shadow-2xl md:gap-10 md:p-12"
        >
          <div className="min-w-0 flex-1">
            <div data-hero-line className="flex items-center gap-3">
              <Seal character="七" />
              <span className="text-agar-text text-[0.65rem] tracking-[0.28em] uppercase">
                {HERO.tagline}
              </span>
            </div>

            <div className="mt-6">
              <Name />
            </div>

            <p
              data-hero-line
              className="text-ink mt-4 text-xs font-semibold tracking-[0.42em] uppercase"
            >
              {HERO.latin}
            </p>

            <p
              data-hero-line
              className="text-agar-text mt-6 max-w-sm text-sm leading-relaxed"
            >
              {HERO.lede}
            </p>

            <div data-hero-line className="mt-8 flex flex-wrap gap-3">
              {HERO.actions.map((action) => (
                <Link
                  key={action.href}
                  href={action.href}
                  className={
                    action.primary
                      ? "bg-peach text-rice hover:bg-peach-deep px-6 py-3 text-sm font-medium transition-colors duration-[--duration-fast]"
                      : "border-agar text-ink hover:bg-ink hover:text-rice border px-6 py-3 text-sm font-medium transition-colors duration-[--duration-fast]"
                  }
                >
                  {action.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Set vertically down the card's edge, as a printed menu would. */}
          <p
            data-hero-vertical
            aria-hidden="true"
            lang="zh"
            className="text-bronze hidden shrink-0 self-start text-sm tracking-[0.42em] sm:block"
            style={{ writingMode: "vertical-rl" }}
          >
            {HERO.vertical}
          </p>
        </div>

        <p className="text-rice/45 absolute right-5 bottom-5 z-20 text-[0.6rem] tracking-[0.18em] md:right-10">
          {HERO_ARTWORK.credit}
        </p>
      </section>
    </HeroMotion>
  );
}
