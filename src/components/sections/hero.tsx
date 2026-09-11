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
      className="text-ink flex justify-center overflow-hidden text-[clamp(4.5rem,19cqw,17rem)] leading-[0.95]"
    >
      <span className="sr-only">{HERO.name}</span>
      {[...HERO.name].map((character, index) => (
        <span
          key={`${character}-${index}`}
          aria-hidden="true"
          /* The brush family is set on each glyph, not inherited from the
             parent — see the note on the removed :lang(zh) rule. */
          className="font-brush block"
        >
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
          className="bg-rice @container relative z-20 flex w-[92%] max-w-[1500px] items-stretch gap-6 p-8 shadow-2xl md:gap-10 md:p-12 lg:p-14"
        >
          {/* Left rail: mark at the top, supporting copy and actions beneath,
              as the reference sets it. */}
          <div className="flex w-40 shrink-0 flex-col justify-between gap-8 md:w-52">
            <div data-hero-line className="flex flex-col gap-3">
              <Seal character="七" />
              <span className="text-agar-text text-[0.6rem] leading-relaxed tracking-[0.26em] uppercase">
                {HERO.tagline}
              </span>
            </div>

            <div className="flex flex-col gap-5">
              <p data-hero-line className="text-agar-text text-xs leading-relaxed">
                {HERO.lede}
              </p>
              <div data-hero-line className="flex flex-col gap-2">
                {HERO.actions.map((action) => (
                  <Link
                    key={action.href}
                    href={action.href}
                    className={
                      action.primary
                        ? "bg-peach text-rice hover:bg-peach-deep px-4 py-2.5 text-center text-xs font-medium transition-colors duration-[--duration-fast]"
                        : "border-agar text-ink hover:bg-ink hover:text-rice border px-4 py-2.5 text-center text-xs font-medium transition-colors duration-[--duration-fast]"
                    }
                  >
                    {action.label}
                  </Link>
                ))}
              </div>
            </div>
          </div>

          {/* The name, carrying the card. */}
          <div className="flex min-w-0 flex-1 items-center justify-center">
            <Name />
          </div>

          {/* Right: the English lockup, then the vertical column on the edge. */}
          <div className="flex shrink-0 items-center gap-5 md:gap-8">
            <p
              data-hero-line
              className="text-ink hidden text-[0.65rem] font-semibold tracking-[0.5em] uppercase sm:block"
              style={{ writingMode: "vertical-rl" }}
            >
              {HERO.latin}
            </p>
            <p
              data-hero-vertical
              aria-hidden="true"
              lang="zh"
              className="text-bronze hidden text-sm tracking-[0.42em] sm:block"
              style={{ writingMode: "vertical-rl" }}
            >
              {HERO.vertical}
            </p>
          </div>
        </div>

        <p className="text-rice/45 absolute right-5 bottom-5 z-20 text-[0.6rem] tracking-[0.18em] md:right-10">
          {HERO_ARTWORK.credit}
        </p>
      </section>
    </HeroMotion>
  );
}
